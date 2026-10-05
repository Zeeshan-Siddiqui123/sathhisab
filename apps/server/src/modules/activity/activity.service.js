import { query, one } from "../../lib/db.js";

export async function getActivity(groupId, { page = 1, limit = 30, action } = {}) {
  page = Math.max(1, Number(page) || 1);
  limit = Math.min(100, Math.max(1, Number(limit) || 30));
  const where = "a.group_id = ?" + (action ? " AND a.action = ?" : "");
  const values = action ? [groupId, action] : [groupId];
  const { total } = await one(`SELECT COUNT(*) AS total FROM activity_logs a WHERE ${where}`, values);
  const logs = await query(`SELECT a.*, u.name AS actor_name, u.avatar_url AS actor_avatar_url FROM activity_logs a JOIN users u ON u.id = a.actor_id WHERE ${where} ORDER BY a.created_at DESC, a.id DESC LIMIT ? OFFSET ?`, [...values, String(limit), String((page - 1) * limit)]);
  return { data: logs.map(log => ({ id: log.id, action: log.action, entityType: log.entityType, entityId: log.entityId, meta: log.meta, actor: { id: log.actorId, name: log.actorName, avatarUrl: log.actorAvatarUrl }, createdAt: log.createdAt })), meta: { total, page, limit } };
}
