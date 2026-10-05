import { z } from "zod";

export const createSettlementSchema = z.object({
  toUserId: z.string().uuid("toUserId must be a valid UUID"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .int("Amount must be an integer in paisa")
    .positive("Amount must be positive"),
  note: z.string().max(300).optional(),
});
