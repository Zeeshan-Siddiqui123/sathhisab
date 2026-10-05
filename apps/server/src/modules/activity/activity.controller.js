import { asyncHandler } from "../../lib/asyncHandler.js";
import { getActivity } from "./activity.service.js";

export const listActivity = asyncHandler(async (req, res) => {
  const result = await getActivity(req.params.groupId, req.query);
  res.json(result);
});
