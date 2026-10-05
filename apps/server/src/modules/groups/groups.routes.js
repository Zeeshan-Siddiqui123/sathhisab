import { Router } from "express";
import * as groupsController from "./groups.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireGroupMember } from "../../middleware/requireGroupMember.js";
import { requireGroupOwner } from "../../middleware/requireGroupOwner.js";
import { validate } from "../../middleware/validate.js";
import { createGroupSchema, updateGroupSchema } from "./groups.schema.js";
import { groupInvitationsRouter } from "../invitations/invitations.routes.js";

const router = Router();

router.get("/", requireAuth, groupsController.getGroups);
router.post("/", requireAuth, validate({ body: createGroupSchema }), groupsController.createGroup);

router.get("/:groupId", requireAuth, requireGroupMember, groupsController.getGroup);
router.patch("/:groupId", requireAuth, requireGroupMember, requireGroupOwner, validate({ body: updateGroupSchema }), groupsController.updateGroup);

router.delete("/:groupId/members/:userId", requireAuth, requireGroupMember, requireGroupOwner, groupsController.removeMember);
router.post("/:groupId/leave", requireAuth, requireGroupMember, groupsController.leaveGroup);

// Mount group invitations sub-router
router.use("/:groupId/invitations", groupInvitationsRouter);

export default router;
