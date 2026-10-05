import { asyncHandler } from "../../lib/asyncHandler.js";
import * as svc from "./expenses.service.js";

export const listExpenses = asyncHandler(async (req, res) => {
  const result = await svc.listExpenses(req.params.groupId, req.query);
  res.json(result);
});

export const createExpense = asyncHandler(async (req, res) => {
  const expense = await svc.createExpense(req.params.groupId, req.session.userId, {
    ...req.body,
    idempotencyKey: req.headers["idempotency-key"] || null,
  });
  res.status(201).json(expense);
});

export const getExpense = asyncHandler(async (req, res) => {
  const expense = await svc.getExpense(req.params.groupId, req.params.expenseId);
  res.json(expense);
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await svc.updateExpense(
    req.params.groupId,
    req.params.expenseId,
    req.session.userId,
    req.groupMember.role,
    req.body
  );
  res.json(expense);
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const result = await svc.deleteExpense(
    req.params.groupId,
    req.params.expenseId,
    req.session.userId,
    req.groupMember.role
  );
  res.json(result);
});
