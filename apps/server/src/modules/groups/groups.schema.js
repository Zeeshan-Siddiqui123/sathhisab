import { z } from "zod";

export const groupTypeEnum = z.enum(["FLAT", "HOSTEL", "FAMILY", "TRIP", "OTHER"]);

export const createGroupSchema = z.object({
  name: z.string().trim().min(1, "Group name is required").max(100, "Group name must not exceed 100 characters"),
  type: groupTypeEnum.default("FLAT"),
});

export const updateGroupSchema = z.object({
  name: z.string().trim().min(1, "Group name cannot be empty").max(100, "Group name must not exceed 100 characters").optional(),
  type: groupTypeEnum.optional(),
});
