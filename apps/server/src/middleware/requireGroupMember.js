import { one } from "../lib/db.js";
import { NotFoundError, ForbiddenError } from "../lib/errors.js";

/**
 * Middleware ensuring current user is an active member of the specified group
 */
export async function requireGroupMember(req, _res, next) {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      throw new NotFoundError("Group ID is required");
    }

    const group = await one("SELECT * FROM `groups` WHERE id = ?", [groupId]);

    if (!group) {
      throw new NotFoundError("Group not found");
    }

    const membership = await one("SELECT * FROM group_members WHERE group_id = ? AND user_id = ? AND left_at IS NULL", [groupId, req.user.id]);

    if (!membership) {
      throw new ForbiddenError("You are not an active member of this group");
    }

    req.group = group;
    req.groupMember = membership;
    next();
  } catch (err) {
    next(err);
  }
}
