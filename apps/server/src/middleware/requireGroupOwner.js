import { ForbiddenError } from "../lib/errors.js";

/**
 * Middleware ensuring current user is an OWNER of the group
 * Must be preceded by requireGroupMember
 */
export function requireGroupOwner(req, _res, next) {
  if (!req.groupMember || req.groupMember.role !== "OWNER") {
    return next(new ForbiddenError("Group owner permission required"));
  }
  next();
}
