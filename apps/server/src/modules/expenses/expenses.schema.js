import { z } from "zod";

export const createExpenseSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .int("Amount must be an integer in paisa")
    .positive("Amount must be positive"),
  paidBy: z.string().uuid("paidBy must be a valid UUID"),
  category: z
    .enum([
      "GROCERY",
      "RENT",
      "UTILITIES",
      "INTERNET",
      "FOOD",
      "TRANSPORT",
      "HOUSEHOLD",
      "ENTERTAINMENT",
      "OTHER",
    ])
    .default("OTHER"),
  splitMethod: z.enum(["EQUAL", "CUSTOM"]),
  expenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expenseDate must be YYYY-MM-DD"),
  participants: z.array(z.string().uuid()).min(1, "At least one participant is required"),
  // For CUSTOM split: shares must be provided
  shares: z
    .array(
      z.object({
        userId: z.string().uuid(),
        amount: z
          .number()
          .int("Share amount must be an integer in paisa")
          .nonnegative("Share amount must be non-negative"),
      })
    )
    .optional(),
  note: z.string().max(500).optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const listExpensesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z
    .enum([
      "GROCERY",
      "RENT",
      "UTILITIES",
      "INTERNET",
      "FOOD",
      "TRANSPORT",
      "HOUSEHOLD",
      "ENTERTAINMENT",
      "OTHER",
    ])
    .optional(),
  paidBy: z.string().uuid().optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
