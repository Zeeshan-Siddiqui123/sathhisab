import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireGroupMember } from "../../middleware/requireGroupMember.js";
import { listActivity } from "./activity.controller.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(requireGroupMember);

router.get("/", listActivity);

export default router;
