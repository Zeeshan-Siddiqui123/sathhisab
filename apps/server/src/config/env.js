import dotenv from "dotenv";
import { z } from "zod";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)), quiet: true });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  COOKIE_SECRET: z.string().min(16, "COOKIE_SECRET must be at least 16 characters"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
