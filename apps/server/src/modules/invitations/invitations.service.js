import crypto from "node:crypto";
import { one, query, newId, transaction, logActivity } from "../../lib/db.js";
import { NotFoundError } from "../../lib/errors.js";

const hashToken = token => crypto.createHash("sha256").update(token).digest("hex");
function validate(invitation) {
  if (!invitation || invitation.revokedAt || invitation.expiresAt <= new Date()) throw new NotFoundError("Invitation link is invalid, expired, or has been revoked");
}

export async function createInvitation(groupId, createdBy, expiresInDays = 7) {
  const token = crypto.randomBytes(32).toString("hex");
  const id = newId();
  const expiresAt = new Date(Date.now() + expiresInDays * 86400000);
  await query("INSERT INTO invitations (id, group_id, token_hash, created_by, expires_at) VALUES (?, ?, ?, ?, ?)", [id, groupId, hashToken(token), createdBy, expiresAt]);
  return { ...await one("SELECT id, group_id, expires_at, created_at FROM invitations WHERE id = ?", [id]), token };
}

export async function getGroupInvitations(groupId) {
  const rows = await query("SELECT i.id, i.expires_at, i.created_at, u.id AS creator_id, u.name AS creator_name FROM invitations i JOIN users u ON u.id = i.created_by WHERE i.group_id = ? AND i.revoked_at IS NULL AND i.expires_at > ? ORDER BY i.created_at DESC", [groupId, new Date()]);
  return rows.map(i => ({ id: i.id, expiresAt: i.expiresAt, createdAt: i.createdAt, creator: { id: i.creatorId, name: i.creatorName } }));
}

export async function revokeInvitation(groupId, invitationId) {
  const result = await query("UPDATE invitations SET revoked_at = UTC_TIMESTAMP(3) WHERE id = ? AND group_id = ?", [invitationId, groupId]);
  if (!result.affectedRows) throw new NotFoundError("Invitation not found");
  return { success: true };
}

export async function previewInvitation(token) {
  const invitation = await one("SELECT * FROM invitations WHERE token_hash = ?", [hashToken(token)]);
  validate(invitation);
  return { group: await one("SELECT id, name, type FROM `groups` WHERE id = ?", [invitation.groupId]), inviter: await one("SELECT id, name FROM users WHERE id = ?", [invitation.createdBy]), expiresAt: invitation.expiresAt };
}

export async function acceptInvitation(token, userId) {
  return transaction(async connection => {
    const invitation = await one("SELECT * FROM invitations WHERE token_hash = ? FOR UPDATE", [hashToken(token)], connection);
    validate(invitation);
    const groupId = invitation.groupId;
    const group = await one("SELECT * FROM `groups` WHERE id = ? FOR UPDATE", [groupId], connection);
    const existing = await one("SELECT * FROM group_members WHERE group_id = ? AND user_id = ? FOR UPDATE", [groupId, userId], connection);
    if (existing && existing.leftAt === null) return { group, alreadyMember: true };
    const id = existing?.id || newId();
    if (existing) {
      await query("UPDATE group_members SET left_at = NULL, role = 'MEMBER', joined_at = UTC_TIMESTAMP(3) WHERE id = ?", [id], connection);
    } else {
      await query("INSERT INTO group_members (id, group_id, user_id, role) VALUES (?, ?, ?, 'MEMBER')", [id, groupId, userId], connection);
    }
    await logActivity(connection, { groupId, actorId: userId, action: "MEMBER_JOINED", entityType: "MEMBER", entityId: userId });
    return { group, membership: await one("SELECT * FROM group_members WHERE id = ?", [id], connection), alreadyMember: false };
  });
}
