import { Router } from "express";
import * as invitationsController from "./invitations.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireGroupMember } from "../../middleware/requireGroupMember.js";
import { requireGroupOwner } from "../../middleware/requireGroupOwner.js";
import { validate } from "../../middleware/validate.js";
import { createInvitationSchema } from "./invitations.schema.js";

// Router mounted at /api/v1/invitations
export const publicInvitationsRouter = Router();
publicInvitationsRouter.get("/:token", invitationsController.previewInvitation);
publicInvitationsRouter.post("/:token/accept", requireAuth, invitationsController.acceptInvitation);

// Router mounted at /api/v1/groups/:groupId/invitations
export const groupInvitationsRouter = Router({ mergeParams: true });
groupInvitationsRouter.post(
  "/",
  requireAuth,
  requireGroupMember,
  requireGroupOwner,
  validate({ body: createInvitationSchema }),
  invitationsController.createInvitation
);
groupInvitationsRouter.get(
  "/",
  requireAuth,
  requireGroupMember,
  requireGroupOwner,
  invitationsController.getInvitations
);
groupInvitationsRouter.delete(
  "/:id",
  requireAuth,
  requireGroupMember,
  requireGroupOwner,
  invitationsController.revokeInvitation
);
