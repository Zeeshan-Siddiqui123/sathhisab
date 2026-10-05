import { one, query, newId, transaction, logActivity } from "../../lib/db.js";
import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from "../../lib/errors.js";

const selectSettlement = `SELECT s.*, f.name AS from_name, f.avatar_url AS from_avatar_url, t.name AS to_name, t.avatar_url AS to_avatar_url
  FROM settlements s JOIN users f ON f.id = s.from_user_id JOIN users t ON t.id = s.to_user_id`;

function formatSettlement(s) {
  return { id: s.id, groupId: s.groupId, fromUserId: s.fromUserId, toUserId: s.toUserId, fromUser: { id: s.fromUserId, name: s.fromName, avatarUrl: s.fromAvatarUrl }, toUser: { id: s.toUserId, name: s.toName, avatarUrl: s.toAvatarUrl }, amount: s.amount, status: s.status, note: s.note, createdAt: s.createdAt, respondedAt: s.respondedAt };
}

export async function createSettlement(groupId, fromUserId, { toUserId, amount, note, idempotencyKey }) {
  if (fromUserId === toUserId) throw new BadRequestError("Sender and receiver must be different members");
  return transaction(async connection => {
    await one("SELECT id FROM `groups` WHERE id = ? FOR UPDATE", [groupId], connection);
    if (idempotencyKey) {
      const existing = await one(`${selectSettlement} WHERE s.group_id = ? AND s.from_user_id = ? AND s.idempotency_key = ?`, [groupId, fromUserId, idempotencyKey], connection);
      if (existing) return formatSettlement(existing);
    }
    const members = await query("SELECT user_id FROM group_members WHERE group_id = ? AND left_at IS NULL", [groupId], connection);
    if (!members.some(m => m.userId === fromUserId)) throw new ForbiddenError("You are not an active member of this group");
    if (!members.some(m => m.userId === toUserId)) throw new BadRequestError("Recipient is not an active member of this group");
    const id = newId();
    await query("INSERT INTO settlements (id, group_id, from_user_id, to_user_id, amount, note, idempotency_key) VALUES (?, ?, ?, ?, ?, ?, ?)", [id, groupId, fromUserId, toUserId, amount, note?.trim() || null, idempotencyKey || null], connection);
    await logActivity(connection, { groupId, actorId: fromUserId, action: "SETTLEMENT_CREATED", entityType: "SETTLEMENT", entityId: id, meta: { toUserId, amount } });
    return formatSettlement(await one(`${selectSettlement} WHERE s.id = ?`, [id], connection));
  });
}

export async function listSettlements(groupId, { status, userId } = {}) {
  const clauses = ["s.group_id = ?"];
  const values = [groupId];
  if (status) { clauses.push("s.status = ?"); values.push(status); }
  if (userId) { clauses.push("(s.from_user_id = ? OR s.to_user_id = ?)"); values.push(userId, userId); }
  return (await query(`${selectSettlement} WHERE ${clauses.join(" AND ")} ORDER BY s.created_at DESC`, values)).map(formatSettlement);
}

async function transition(groupId, settlementId, actorId, status) {
  return transaction(async connection => {
    await one("SELECT id FROM `groups` WHERE id = ? FOR UPDATE", [groupId], connection);
    const settlement = await one("SELECT * FROM settlements WHERE id = ? AND group_id = ? FOR UPDATE", [settlementId, groupId], connection);
    if (!settlement) throw new NotFoundError("Settlement not found");
    const cancelling = status === "CANCELLED";
    if ((cancelling ? settlement.fromUserId : settlement.toUserId) !== actorId) {
      throw new ForbiddenError(cancelling ? "Only the payment sender can cancel a settlement" : "Only the payment receiver can confirm or reject a settlement");
    }
    if (settlement.status !== "PENDING") throw new ConflictError(`Settlement is already ${settlement.status.toLowerCase()}`);
    await query("UPDATE settlements SET status = ?, responded_at = UTC_TIMESTAMP(3) WHERE id = ?", [status, settlementId], connection);
    await logActivity(connection, { groupId, actorId, action: `SETTLEMENT_${status}`, entityType: "SETTLEMENT", entityId: settlementId, meta: status === "CONFIRMED" ? { amount: settlement.amount } : null });
    return formatSettlement(await one(`${selectSettlement} WHERE s.id = ?`, [settlementId], connection));
  });
}

export const confirmSettlement = (groupId, settlementId, actorId) => transition(groupId, settlementId, actorId, "CONFIRMED");
export const rejectSettlement = (groupId, settlementId, actorId) => transition(groupId, settlementId, actorId, "REJECTED");
export const cancelSettlement = (groupId, settlementId, actorId) => transition(groupId, settlementId, actorId, "CANCELLED");
