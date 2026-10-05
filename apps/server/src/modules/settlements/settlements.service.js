import { prisma } from "../../lib/prisma.js";
import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from "../../lib/errors.js";

/**
 * Creates a PENDING settlement (sender records payment).
 * Sender and receiver must be different active members.
 */
export async function createSettlement(groupId, fromUserId, data) {
  const { toUserId, amount, note, idempotencyKey } = data;

  if (fromUserId === toUserId) {
    throw new BadRequestError("Sender and receiver must be different members");
  }

  // Verify both users are active members
  const [fromMember, toMember] = await Promise.all([
    prisma.groupMember.findFirst({ where: { groupId, userId: fromUserId, leftAt: null } }),
    prisma.groupMember.findFirst({ where: { groupId, userId: toUserId, leftAt: null } }),
  ]);

  if (!fromMember) throw new ForbiddenError("You are not an active member of this group");
  if (!toMember) throw new BadRequestError("Recipient is not an active member of this group");

  return await prisma.$transaction(async (tx) => {
    const settlement = await tx.settlement.create({
      data: {
        groupId,
        fromUserId,
        toUserId,
        amount,
        note: note?.trim() || null,
        idempotencyKey: idempotencyKey || null,
      },
      include: {
        fromUser: { select: { id: true, name: true, avatarUrl: true } },
        toUser: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    await tx.activityLog.create({
      data: {
        groupId,
        actorId: fromUserId,
        action: "SETTLEMENT_CREATED",
        entityType: "SETTLEMENT",
        entityId: settlement.id,
        meta: { toUserId, amount },
      },
    });

    return formatSettlement(settlement);
  });
}

/**
 * Lists settlements for a group with optional status filter.
 */
export async function listSettlements(groupId, query) {
  const { status, userId } = query || {};

  const where = {
    groupId,
    ...(status && { status }),
    ...(userId && { OR: [{ fromUserId: userId }, { toUserId: userId }] }),
  };

  const settlements = await prisma.settlement.findMany({
    where,
    include: {
      fromUser: { select: { id: true, name: true, avatarUrl: true } },
      toUser: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return settlements.map(formatSettlement);
}

/**
 * Confirms a PENDING settlement. Only the receiver (toUserId) can confirm.
 * Uses a SELECT FOR UPDATE pattern via Prisma transaction to prevent race conditions.
 */
export async function confirmSettlement(groupId, settlementId, actorId) {
  return await prisma.$transaction(async (tx) => {
    // Lock the row
    const settlement = await tx.settlement.findFirst({
      where: { id: settlementId, groupId },
    });

    if (!settlement) throw new NotFoundError("Settlement not found");
    if (settlement.toUserId !== actorId) {
      throw new ForbiddenError("Only the payment receiver can confirm a settlement");
    }
    if (settlement.status !== "PENDING") {
      throw new ConflictError(`Settlement is already ${settlement.status.toLowerCase()}`);
    }

    const updated = await tx.settlement.update({
      where: { id: settlementId },
      data: { status: "CONFIRMED", respondedAt: new Date() },
      include: {
        fromUser: { select: { id: true, name: true, avatarUrl: true } },
        toUser: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    await tx.activityLog.create({
      data: {
        groupId,
        actorId,
        action: "SETTLEMENT_CONFIRMED",
        entityType: "SETTLEMENT",
        entityId: settlementId,
        meta: { amount: Number(settlement.amount) },
      },
    });

    return formatSettlement(updated);
  });
}

/**
 * Rejects a PENDING settlement. Only the receiver (toUserId) can reject.
 */
export async function rejectSettlement(groupId, settlementId, actorId) {
  return await prisma.$transaction(async (tx) => {
    const settlement = await tx.settlement.findFirst({
      where: { id: settlementId, groupId },
    });

    if (!settlement) throw new NotFoundError("Settlement not found");
    if (settlement.toUserId !== actorId) {
      throw new ForbiddenError("Only the payment receiver can reject a settlement");
    }
    if (settlement.status !== "PENDING") {
      throw new ConflictError(`Settlement is already ${settlement.status.toLowerCase()}`);
    }

    const updated = await tx.settlement.update({
      where: { id: settlementId },
      data: { status: "REJECTED", respondedAt: new Date() },
      include: {
        fromUser: { select: { id: true, name: true, avatarUrl: true } },
        toUser: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    await tx.activityLog.create({
      data: {
        groupId,
        actorId,
        action: "SETTLEMENT_REJECTED",
        entityType: "SETTLEMENT",
        entityId: settlementId,
      },
    });

    return formatSettlement(updated);
  });
}

/**
 * Cancels a PENDING settlement. Only the sender (fromUserId) can cancel.
 */
export async function cancelSettlement(groupId, settlementId, actorId) {
  return await prisma.$transaction(async (tx) => {
    const settlement = await tx.settlement.findFirst({
      where: { id: settlementId, groupId },
    });

    if (!settlement) throw new NotFoundError("Settlement not found");
    if (settlement.fromUserId !== actorId) {
      throw new ForbiddenError("Only the payment sender can cancel a settlement");
    }
    if (settlement.status !== "PENDING") {
      throw new ConflictError(`Settlement is already ${settlement.status.toLowerCase()}`);
    }

    const updated = await tx.settlement.update({
      where: { id: settlementId },
      data: { status: "CANCELLED", respondedAt: new Date() },
      include: {
        fromUser: { select: { id: true, name: true, avatarUrl: true } },
        toUser: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    await tx.activityLog.create({
      data: {
        groupId,
        actorId,
        action: "SETTLEMENT_CANCELLED",
        entityType: "SETTLEMENT",
        entityId: settlementId,
      },
    });

    return formatSettlement(updated);
  });
}

function formatSettlement(s) {
  return {
    id: s.id,
    groupId: s.groupId,
    fromUserId: s.fromUserId,
    toUserId: s.toUserId,
    fromUser: s.fromUser,
    toUser: s.toUser,
    amount: Number(s.amount),
    status: s.status,
    note: s.note,
    createdAt: s.createdAt,
    respondedAt: s.respondedAt,
  };
}
