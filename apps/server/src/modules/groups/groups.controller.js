import { asyncHandler } from "../../lib/asyncHandler.js";
import * as groupsService from "./groups.service.js";

export const getGroups = asyncHandler(async (req, res) => {
  const groups = await groupsService.getUserGroups(req.user.id);
  res.json({ groups });
});

export const createGroup = asyncHandler(async (req, res) => {
  const group = await groupsService.createGroup(req.user.id, req.body);
  res.status(201).json({ group });
});

export const getGroup = asyncHandler(async (req, res) => {
  const group = await groupsService.getGroupDetails(req.params.groupId, req.user.id);
  res.json({ group });
});

export const updateGroup = asyncHandler(async (req, res) => {
  const group = await groupsService.updateGroup(req.params.groupId, req.user.id, req.body);
  res.json({ group });
});

export const removeMember = asyncHandler(async (req, res) => {
  const result = await groupsService.removeMember(req.params.groupId, req.user.id, req.params.userId);
  res.json(result);
});

export const leaveGroup = asyncHandler(async (req, res) => {
  const result = await groupsService.leaveGroup(req.params.groupId, req.user.id);
  res.json(result);
});
