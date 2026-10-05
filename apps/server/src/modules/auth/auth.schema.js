import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must not exceed 100 characters"),
  email: z.string().trim().email("Invalid email address").max(191, "Email must not exceed 191 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must not exceed 100 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
