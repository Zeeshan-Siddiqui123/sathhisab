import { asyncHandler } from "../../lib/asyncHandler.js";
import * as svc from "./settlements.service.js";

export const listSettlements = asyncHandler(async (req, res) => {
  const result = await svc.listSettlements(req.params.groupId, req.query);
  res.json(result);
});

export const createSettlement = asyncHandler(async (req, res) => {
  const settlement = await svc.createSettlement(
    req.params.groupId,
    req.user.id,
    {
      ...req.body,
      idempotencyKey: req.headers["idempotency-key"] || null,
    }
  );
  res.status(201).json(settlement);
});

export const confirmSettlement = asyncHandler(async (req, res) => {
  const result = await svc.confirmSettlement(
    req.params.groupId,
    req.params.settlementId,
    req.user.id
  );
  res.json(result);
});

export const rejectSettlement = asyncHandler(async (req, res) => {
  const result = await svc.rejectSettlement(
    req.params.groupId,
    req.params.settlementId,
    req.user.id
  );
  res.json(result);
});

export const cancelSettlement = asyncHandler(async (req, res) => {
  const result = await svc.cancelSettlement(
    req.params.groupId,
    req.params.settlementId,
    req.user.id
  );
  res.json(result);
});
