import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireGroupMember } from "../../middleware/requireGroupMember.js";
import { validate } from "../../middleware/validate.js";
import { idempotency } from "../../middleware/idempotency.js";
import {
  createExpenseSchema,
  updateExpenseSchema,
  listExpensesSchema,
} from "./expenses.schema.js";
import * as ctrl from "./expenses.controller.js";

const router = Router({ mergeParams: true });

// All expense routes require auth + group membership
router.use(requireAuth);
router.use(requireGroupMember);

router.get("/", validate(listExpensesSchema, "query"), ctrl.listExpenses);
router.post(
  "/",
  idempotency,
  validate(createExpenseSchema, "body"),
  ctrl.createExpense
);
router.get("/:expenseId", ctrl.getExpense);
router.patch("/:expenseId", validate(updateExpenseSchema, "body"), ctrl.updateExpense);
router.delete("/:expenseId", ctrl.deleteExpense);

export default router;
