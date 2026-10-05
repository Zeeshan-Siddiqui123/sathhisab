import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").max(100, "Name must not exceed 100 characters").optional(),
  avatarUrl: z.string().url("Invalid avatar URL").max(500).nullable().optional(),
});
