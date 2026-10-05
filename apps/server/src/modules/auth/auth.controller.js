import { asyncHandler } from "../../lib/asyncHandler.js";
import * as authService from "./auth.service.js";
import { setSessionCookie, clearSessionCookie } from "../../middleware/auth.js";

export const signup = asyncHandler(async (req, res) => {
  const { user, session } = await authService.signup(req.body);
  setSessionCookie(res, session.id);
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req, res) => {
  const { user, session } = await authService.login(req.body);
  setSessionCookie(res, session.id);
  res.json({ user });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.sessionId);
  clearSessionCookie(res);
  res.json({ success: true });
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  res.json({ user });
});
