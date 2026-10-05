import { one, query, newId, transaction, logActivity } from "../../lib/db.js";
import { NotFoundError, ForbiddenError, ConflictError } from "../../lib/errors.js";
import { loadBalances } from "../balances/balances.service.js";

async function members(groupId, connection) {
  return query("SELECT u.id, u.name, u.email, u.avatar_url, m.role, m.joined_at FROM group_members m JOIN users u ON u.id = m.user_id WHERE m.group_id = ? AND m.left_at IS NULL ORDER BY m.joined_at, m.id", [groupId], connection);
}

export async function getUserGroups(userId) {
  const groups = await query("SELECT g.*, m.role AS my_role FROM `groups` g JOIN group_members m ON m.group_id = g.id WHERE m.user_id = ? AND m.left_at IS NULL ORDER BY m.joined_at DESC", [userId]);
  return Promise.all(groups.map(async group => {
    const active = await members(group.id);
    const balances = await loadBalances(group.id);
    return { id: group.id, name: group.name, type: group.type, currency: group.currency, createdBy: group.createdBy, createdAt: group.createdAt, myRole: group.myRole, myBalance: balances.get(userId) || 0, memberCount: active.length, members: active.map(m => ({ id: m.id, name: m.name, avatarUrl: m.avatarUrl, role: m.role })) };
  }));
}

export async function createGroup(userId, { name, type = "FLAT" }) {
  return transaction(async connection => {
    const id = newId();
    await query("INSERT INTO `groups` (id, name, type, currency, created_by) VALUES (?, ?, ?, 'PKR', ?)", [id, name.trim(), type, userId], connection);
    await query("INSERT INTO group_members (id, group_id, user_id, role) VALUES (?, ?, ?, 'OWNER')", [newId(), id, userId], connection);
    await logActivity(connection, { groupId: id, actorId: userId, action: "GROUP_CREATED", entityType: "GROUP", entityId: id, meta: { name: name.trim(), type } });
    return one("SELECT * FROM `groups` WHERE id = ?", [id], connection);
  });
}

export async function getGroupDetails(groupId, userId) {
  const group = await one("SELECT * FROM `groups` WHERE id = ?", [groupId]);
  if (!group) throw new NotFoundError("Group not found");
  const active = await members(groupId);
  const membership = active.find(m => m.id === userId);
  if (!membership) throw new ForbiddenError("You are not an active member of this group");
  const balances = await loadBalances(groupId);
  return { id: group.id, name: group.name, type: group.type, currency: group.currency, createdBy: group.createdBy, createdAt: group.createdAt, myRole: membership.role, myBalance: balances.get(userId) || 0, members: active };
}

export async function updateGroup(groupId, actorId, { name, type }) {
  return transaction(async connection => {
    const columns = ["updated_at = UTC_TIMESTAMP(3)"];
    const values = [];
    const meta = {};
    if (name !== undefined) { columns.push("name = ?"); values.push(name.trim()); meta.name = name.trim(); }
    if (type !== undefined) { columns.push("type = ?"); values.push(type); meta.type = type; }
    await query(`UPDATE \`groups\` SET ${columns.join(", ")} WHERE id = ?`, [...values, groupId], connection);
    await logActivity(connection, { groupId, actorId, action: "GROUP_UPDATED", entityType: "GROUP", entityId: groupId, meta });
    return one("SELECT * FROM `groups` WHERE id = ?", [groupId], connection);
  });
}

async function depart(groupId, actorId, targetId, leaving) {
  return transaction(async connection => {
    // Group writes use the same lock before checking balances or membership.
    await one("SELECT id FROM `groups` WHERE id = ? FOR UPDATE", [groupId], connection);
    const active = await query("SELECT * FROM group_members WHERE group_id = ? AND left_at IS NULL ORDER BY joined_at, id FOR UPDATE", [groupId], connection);
    const membership = active.find(m => m.userId === targetId);
    if (!membership) throw new NotFoundError("Member not found in group");
    if (((await loadBalances(groupId, connection)).get(targetId) || 0) !== 0) {
      throw new ConflictError(leaving ? "Cannot leave group with unsettled balance" : "Cannot remove member with unsettled balance");
    }
    if (leaving && membership.role === "OWNER" && active.length > 1 && !active.some(m => m.userId !== targetId && m.role === "OWNER")) {
      await query("UPDATE group_members SET role = 'OWNER' WHERE id = ?", [active.find(m => m.userId !== targetId).id], connection);
    }
    await query("UPDATE group_members SET left_at = UTC_TIMESTAMP(3) WHERE id = ?", [membership.id], connection);
    await logActivity(connection, { groupId, actorId, action: leaving ? "MEMBER_LEFT" : "MEMBER_REMOVED", entityType: "MEMBER", entityId: targetId });
    return { success: true };
  });
}

export const removeMember = (groupId, actorId, targetUserId) => depart(groupId, actorId, targetUserId, false);
export const leaveGroup = (groupId, userId) => depart(groupId, userId, userId, true);
