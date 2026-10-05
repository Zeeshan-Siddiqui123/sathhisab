import { asyncHandler } from "../../lib/asyncHandler.js";
import * as svc from "./balances.service.js";

export const getGroupBalances = asyncHandler(async (req, res) => {
  const result = await svc.getGroupBalances(req.params.groupId, req.user.id);
  res.json(result);
});

export const getGroupStats = asyncHandler(async (req, res) => {
  const result = await svc.getGroupStats(req.params.groupId, req.query);
  res.json(result);
});
