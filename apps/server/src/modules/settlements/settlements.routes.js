import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireGroupMember } from "../../middleware/requireGroupMember.js";
import { validate } from "../../middleware/validate.js";
import { idempotency } from "../../middleware/idempotency.js";
import { createSettlementSchema } from "./settlements.schema.js";
import * as ctrl from "./settlements.controller.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(requireGroupMember);

router.get("/", ctrl.listSettlements);
router.post("/", idempotency, validate(createSettlementSchema, "body"), ctrl.createSettlement);
router.post("/:settlementId/confirm", ctrl.confirmSettlement);
router.post("/:settlementId/reject", ctrl.rejectSettlement);
router.post("/:settlementId/cancel", ctrl.cancelSettlement);

export default router;
