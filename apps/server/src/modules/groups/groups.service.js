import { prisma } from "../../lib/prisma.js";
import { NotFoundError, ForbiddenError, ConflictError } from "../../lib/errors.js";
import { computeBalances } from "../balances/balance.engine.js";

/**
 * Calculates net balance for a specific user in a group
 */
async function calculateUserBalance(groupId, userId) {
  const [expenses, shares, settlements] = await Promise.all([
    prisma.expense.findMany({
      where: { groupId, deletedAt: null },
      select: { id: true, paidBy: true, amount: true },
    }),
    prisma.expenseShare.findMany({
      where: { expense: { groupId, deletedAt: null } },
      select: { expenseId: true, userId: true, shareAmount: true },
    }),
    prisma.settlement.findMany({
      where: { groupId, status: "CONFIRMED" },
      select: { fromUserId: true, toUserId: true, amount: true, status: true },
    }),
  ]);

  const balances = computeBalances({
    expenses: expenses.map((e) => ({ id: e.id, paidBy: e.paidBy, amount: Number(e.amount) })),
    shares: shares.map((s) => ({ expenseId: s.expenseId, userId: s.userId, amount: Number(s.shareAmount) })),
    settlements: settlements.map((s) => ({
      from: s.fromUserId,
      to: s.toUserId,
      amount: Number(s.amount),
      status: s.status,
    })),
  });

  return balances.get(userId) || 0;
}

/**
 * Gets all groups for a user with their net balance in each
 */
export async function getUserGroups(userId) {
  const memberships = await prisma.groupMember.findMany({
    where: {
      userId,
      leftAt: null,
    },
    include: {
      group: {
        include: {
          members: {
            where: { leftAt: null },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  const result = await Promise.all(
    memberships.map(async (m) => {
      const g = m.group;
      const myBalance = await calculateUserBalance(g.id, userId);

      return {
        id: g.id,
        name: g.name,
        type: g.type,
        currency: g.currency,
        createdBy: g.createdBy,
        createdAt: g.createdAt,
        myRole: m.role,
        myBalance,
        memberCount: g.members.length,
        members: g.members.map((mem) => ({
          id: mem.user.id,
          name: mem.user.name,
          avatarUrl: mem.user.avatarUrl,
          role: mem.role,
        })),
      };
    })
  );

  return result;
}

/**
 * Creates a new group and assigns the creator as OWNER
 */
export async function createGroup(userId, { name, type = "FLAT" }) {
  return await prisma.$transaction(async (tx) => {
    const group = await tx.group.create({
      data: {
        name: name.trim(),
        type,
        currency: "PKR",
        createdBy: userId,
      },
    });

    await tx.groupMember.create({
      data: {
        groupId: group.id,
        userId,
        role: "OWNER",
      },
    });

    await tx.activityLog.create({
      data: {
        groupId: group.id,
        actorId: userId,
        action: "GROUP_CREATED",
        entityType: "GROUP",
        entityId: group.id,
        meta: { name: group.name, type: group.type },
      },
    });

    return group;
  });
}

/**
 * Gets details of a group including all active members and current user's balance
 */
export async function getGroupDetails(groupId, userId) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        where: { leftAt: null },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!group) {
    throw new NotFoundError("Group not found");
  }

  const membership = group.members.find((m) => m.userId === userId);
  if (!membership) {
    throw new ForbiddenError("You are not an active member of this group");
  }

  const myBalance = await calculateUserBalance(groupId, userId);

  return {
    id: group.id,
    name: group.name,
    type: group.type,
    currency: group.currency,
    createdBy: group.createdBy,
    createdAt: group.createdAt,
    myRole: membership.role,
    myBalance,
    members: group.members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      avatarUrl: m.user.avatarUrl,
      role: m.role,
      joinedAt: m.joinedAt,
    })),
  };
}

/**
 * Updates group information (owner only)
 */
export async function updateGroup(groupId, actorId, { name, type }) {
  const data = {};
  if (name !== undefined) data.name = name.trim();
  if (type !== undefined) data.type = type;

  return await prisma.$transaction(async (tx) => {
    const group = await tx.group.update({
      where: { id: groupId },
      data,
    });

    await tx.activityLog.create({
      data: {
        groupId,
        actorId,
        action: "GROUP_UPDATED",
        entityType: "GROUP",
        entityId: groupId,
        meta: data,
      },
    });

    return group;
  });
}

/**
 * Removes a member from the group (owner only). Blocked if balance is non-zero.
 */
export async function removeMember(groupId, actorId, targetUserId) {
  const targetMembership = await prisma.groupMember.findFirst({
    where: { groupId, userId: targetUserId, leftAt: null },
  });

  if (!targetMembership) {
    throw new NotFoundError("Member not found in group");
  }

  const balance = await calculateUserBalance(groupId, targetUserId);
  if (balance !== 0) {
    throw new ConflictError("Cannot remove member with unsettled balance");
  }

  await prisma.$transaction(async (tx) => {
    await tx.groupMember.update({
      where: { id: targetMembership.id },
      data: { leftAt: new Date() },
    });

    await tx.activityLog.create({
      data: {
        groupId,
        actorId,
        action: "MEMBER_REMOVED",
        entityType: "MEMBER",
        entityId: targetUserId,
      },
    });
  });

  return { success: true };
}

/**
 * Allows user to leave group. Blocked if balance is non-zero.
 */
export async function leaveGroup(groupId, userId) {
  const membership = await prisma.groupMember.findFirst({
    where: { groupId, userId, leftAt: null },
  });

  if (!membership) {
    throw new NotFoundError("You are not an active member of this group");
  }

  const balance = await calculateUserBalance(groupId, userId);
  if (balance !== 0) {
    throw new ConflictError("Cannot leave group with unsettled balance");
  }

  // If user is owner and other members exist, ensure at least one other member can be owner
  const activeMembers = await prisma.groupMember.findMany({
    where: { groupId, leftAt: null },
  });

  if (membership.role === "OWNER" && activeMembers.length > 1) {
    const otherOwners = activeMembers.filter((m) => m.userId !== userId && m.role === "OWNER");
    if (otherOwners.length === 0) {
      // Promote oldest member to owner
      const oldestMember = activeMembers.find((m) => m.userId !== userId);
      if (oldestMember) {
        await prisma.groupMember.update({
          where: { id: oldestMember.id },
          data: { role: "OWNER" },
        });
      }
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.groupMember.update({
      where: { id: membership.id },
      data: { leftAt: new Date() },
    });

    await tx.activityLog.create({
      data: {
        groupId,
        actorId: userId,
        action: "MEMBER_LEFT",
        entityType: "MEMBER",
        entityId: userId,
      },
    });
  });

  return { success: true };
}
