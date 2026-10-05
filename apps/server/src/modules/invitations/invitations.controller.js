import { asyncHandler } from "../../lib/asyncHandler.js";
import * as invitationsService from "./invitations.service.js";

export const createInvitation = asyncHandler(async (req, res) => {
  const { expiresInDays } = req.body || {};
  const invitation = await invitationsService.createInvitation(req.params.groupId, req.user.id, expiresInDays);
  res.status(201).json({ invitation });
});

export const getInvitations = asyncHandler(async (req, res) => {
  const invitations = await invitationsService.getGroupInvitations(req.params.groupId);
  res.json({ invitations });
});

export const revokeInvitation = asyncHandler(async (req, res) => {
  const result = await invitationsService.revokeInvitation(req.params.groupId, req.params.id);
  res.json(result);
});

export const previewInvitation = asyncHandler(async (req, res) => {
  const preview = await invitationsService.previewInvitation(req.params.token);
  res.json(preview);
});

export const acceptInvitation = asyncHandler(async (req, res) => {
  const result = await invitationsService.acceptInvitation(req.params.token, req.user.id);
  res.json(result);
});
