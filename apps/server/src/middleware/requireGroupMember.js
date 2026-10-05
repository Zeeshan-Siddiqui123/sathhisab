import { prisma } from "../lib/prisma.js";
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

    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundError("Group not found");
    }

    const membership = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: req.user.id,
        leftAt: null,
      },
    });

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
