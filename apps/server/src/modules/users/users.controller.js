import { asyncHandler } from "../../lib/asyncHandler.js";
import * as usersService from "./users.service.js";
import { uploadAvatarToCloudinary } from "./cloudinary.service.js";

export const updateMe = asyncHandler(async (req, res) => {
  const user = await usersService.updateProfile(req.user.id, req.body);
  res.json({ user });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  const avatarUrl = await uploadAvatarToCloudinary(req.body.image);
  const user = await usersService.updateProfile(req.user.id, { avatarUrl });
  res.json({ user, avatarUrl });
});

