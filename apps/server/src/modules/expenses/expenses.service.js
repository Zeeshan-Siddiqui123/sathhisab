import { prisma } from "../../lib/prisma.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../lib/errors.js";
import { splitEqual, validateCustomSplit } from "../balances/balance.engine.js";

/**
 * Creates an expense with shares in a single transaction.
 * Validates: payer is active member, all participants are active members,
 * split sums to amount, amount > 0.
 *
 * @param {string} groupId
 * @param {string} actorId - logged-in user
 * @param {object} data
 */
export async function createExpense(groupId, actorId, data) {
  const {
    title,
    amount,
    paidBy,
    category = "OTHER",
    splitMethod,
    expenseDate,
    participants,
    shares: customShares,
    note,
    idempotencyKey,
  } = data;

  // Load active members once
  const activeMembers = await prisma.groupMember.findMany({
    where: { groupId, leftAt: null },
    select: { userId: true },
  });
  const activeMemberIds = new Set(activeMembers.map((m) => m.userId));

  // Validate payer
  if (!activeMemberIds.has(paidBy)) {
    throw new BadRequestError("Payer is not an active member of this group");
  }

  // Validate all participants
  for (const uid of participants) {
    if (!activeMemberIds.has(uid)) {
      throw new BadRequestError(`Participant ${uid} is not an active member of this group`);
    }
  }

  // Build shares array
  let sharesData;
  if (splitMethod === "EQUAL") {
    sharesData = splitEqual(amount, participants);
  } else {
    // CUSTOM
    if (!customShares || customShares.length === 0) {
      throw new BadRequestError("Custom split requires share amounts for each participant");
    }
    validateCustomSplit(amount, customShares);
    sharesData = customShares;
  }

  return await prisma.$transaction(async (tx) => {
    const expense = await tx.expense.create({
      data: {
        groupId,
        title: title.trim(),
        amount,
        paidBy,
        category,
        splitMethod,
        expenseDate: new Date(expenseDate),
        note: note?.trim() || null,
        createdBy: actorId,
        idempotencyKey: idempotencyKey || null,
        shares: {
          create: sharesData.map((s) => ({
            userId: s.userId,
            shareAmount: s.amount,
          })),
        },
      },
      include: { shares: true },
    });

    await tx.activityLog.create({
      data: {
        groupId,
        actorId,
        action: "EXPENSE_CREATED",
        entityType: "EXPENSE",
        entityId: expense.id,
        meta: { title: expense.title, amount, paidBy, splitMethod },
      },
    });

    return formatExpense(expense);
  });
}

/**
 * Lists expenses for a group with pagination and optional filters.
 */
export async function listExpenses(groupId, query) {
  const { page = 1, limit = 20, category, paidBy, from, to, search } = query;
  const skip = (page - 1) * limit;

  const where = {
    groupId,
    deletedAt: null,
    ...(search && { title: { contains: search } }),
    ...(category && { category }),
    ...(paidBy && { paidBy }),
    ...(from || to
      ? {
          expenseDate: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) }),
          },
        }
      : {}),
  };

  const [total, expenses] = await Promise.all([
    prisma.expense.count({ where }),
    prisma.expense.findMany({
      where,
      include: {
        shares: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        payer: { select: { id: true, name: true, avatarUrl: true } },
        creator: { select: { id: true, name: true } },
      },
      orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
  ]);

  return {
    data: expenses.map(formatExpense),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Gets a single expense by ID (must belong to groupId).
 */
export async function getExpense(groupId, expenseId) {
  const expense = await prisma.expense.findFirst({
    where: { id: expenseId, groupId, deletedAt: null },
    include: {
      shares: {
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
      payer: { select: { id: true, name: true, avatarUrl: true } },
      creator: { select: { id: true, name: true } },
    },
  });

  if (!expense) {
    throw new NotFoundError("Expense not found");
  }

  return formatExpense(expense);
}

/**
 * Updates an expense (creator or group owner only).
 * Rebuilds shares if split-related fields change.
 */
export async function updateExpense(groupId, expenseId, actorId, actorRole, data) {
  const existing = await prisma.expense.findFirst({
    where: { id: expenseId, groupId, deletedAt: null },
    include: { shares: true },
  });

  if (!existing) {
    throw new NotFoundError("Expense not found");
  }

  // Only creator or owner can edit
  if (existing.createdBy !== actorId && actorRole !== "OWNER") {
    throw new ForbiddenError("Only the expense creator or a group owner can edit this expense");
  }

  const {
    title,
    amount,
    paidBy,
    category,
    splitMethod,
    expenseDate,
    participants,
    shares: customShares,
    note,
  } = data;

  // Resolve effective values
  const effectiveAmount = amount ?? Number(existing.amount);
  const effectiveSplitMethod = splitMethod ?? existing.splitMethod;
  const effectivePaidBy = paidBy ?? existing.paidBy;
  const effectiveParticipants = participants ?? existing.shares.map((s) => s.userId);

  // Validate payer/participants if provided
  if (paidBy || participants) {
    const activeMembers = await prisma.groupMember.findMany({
      where: { groupId, leftAt: null },
      select: { userId: true },
    });
    const activeMemberIds = new Set(activeMembers.map((m) => m.userId));

    if (paidBy && !activeMemberIds.has(effectivePaidBy)) {
      throw new BadRequestError("Payer is not an active member of this group");
    }
    if (participants) {
      for (const uid of effectiveParticipants) {
        if (!activeMemberIds.has(uid)) {
          throw new BadRequestError(`Participant ${uid} is not an active member of this group`);
        }
      }
    }
  }

  let sharesData;
  if (effectiveSplitMethod === "EQUAL") {
    sharesData = splitEqual(effectiveAmount, effectiveParticipants);
  } else {
    const rawShares = customShares ?? existing.shares.map((s) => ({ userId: s.userId, amount: Number(s.shareAmount) }));
    validateCustomSplit(effectiveAmount, rawShares);
    sharesData = rawShares;
  }

  const before = {
    title: existing.title,
    amount: Number(existing.amount),
    paidBy: existing.paidBy,
    category: existing.category,
    splitMethod: existing.splitMethod,
  };

  const after = {
    title: title ?? existing.title,
    amount: effectiveAmount,
    paidBy: effectivePaidBy,
    category: category ?? existing.category,
    splitMethod: effectiveSplitMethod,
  };

  return await prisma.$transaction(async (tx) => {
    // Delete old shares then recreate
    await tx.expenseShare.deleteMany({ where: { expenseId } });

    const updated = await tx.expense.update({
      where: { id: expenseId },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(amount !== undefined && { amount }),
        ...(paidBy !== undefined && { paidBy }),
        ...(category !== undefined && { category }),
        ...(splitMethod !== undefined && { splitMethod: effectiveSplitMethod }),
        ...(expenseDate !== undefined && { expenseDate: new Date(expenseDate) }),
        ...(note !== undefined && { note: note?.trim() || null }),
        shares: {
          create: sharesData.map((s) => ({
            userId: s.userId,
            shareAmount: s.amount,
          })),
        },
      },
      include: {
        shares: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        payer: { select: { id: true, name: true, avatarUrl: true } },
        creator: { select: { id: true, name: true } },
      },
    });

    await tx.activityLog.create({
      data: {
        groupId,
        actorId,
        action: "EXPENSE_UPDATED",
        entityType: "EXPENSE",
        entityId: expenseId,
        meta: { before, after },
      },
    });

    return formatExpense(updated);
  });
}

/**
 * Soft-deletes an expense (creator or group owner only).
 */
export async function deleteExpense(groupId, expenseId, actorId, actorRole) {
  const existing = await prisma.expense.findFirst({
    where: { id: expenseId, groupId, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError("Expense not found");
  }

  if (existing.createdBy !== actorId && actorRole !== "OWNER") {
    throw new ForbiddenError("Only the expense creator or a group owner can delete this expense");
  }

  await prisma.$transaction(async (tx) => {
    await tx.expense.update({
      where: { id: expenseId },
      data: { deletedAt: new Date() },
    });

    await tx.activityLog.create({
      data: {
        groupId,
        actorId,
        action: "EXPENSE_DELETED",
        entityType: "EXPENSE",
        entityId: expenseId,
        meta: { title: existing.title, amount: Number(existing.amount) },
      },
    });
  });

  return { success: true };
}

/**
 * Serializes an expense Prisma object to a plain response shape.
 * Converts BigInt amounts to numbers.
 * @param {object} expense
 */
function formatExpense(expense) {
  return {
    id: expense.id,
    groupId: expense.groupId,
    title: expense.title,
    amount: Number(expense.amount),
    paidBy: expense.paidBy,
    payer: expense.payer,
    category: expense.category,
    splitMethod: expense.splitMethod,
    expenseDate: expense.expenseDate,
    note: expense.note,
    receiptUrl: expense.receiptUrl,
    createdBy: expense.createdBy,
    creator: expense.creator,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
    shares: (expense.shares || []).map((s) => ({
      id: s.id,
      userId: s.userId,
      shareAmount: Number(s.shareAmount),
      user: s.user,
    })),
  };
}
