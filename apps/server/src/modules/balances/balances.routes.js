import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireGroupMember } from "../../middleware/requireGroupMember.js";
import * as ctrl from "./balances.controller.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(requireGroupMember);

router.get("/", ctrl.getGroupBalances);
router.get("/stats", ctrl.getGroupStats);

export default router;
