import { asyncHandler } from "../../lib/asyncHandler.js";
import * as usersService from "./users.service.js";

export const updateMe = asyncHandler(async (req, res) => {
  const user = await usersService.updateProfile(req.user.id, req.body);
  res.json({ user });
});
