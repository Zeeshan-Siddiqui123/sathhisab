import { z } from "zod";

export const createInvitationSchema = z.object({
  expiresInDays: z.coerce.number().int().min(1).max(30).default(7),
});
