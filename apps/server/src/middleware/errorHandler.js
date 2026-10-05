import { AppError } from "../lib/errors.js";
import { ZodError } from "zod";

export function errorHandler(err, req, res, _next) {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input data",
        details,
      },
    });
  }

  // Handle custom AppErrors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details || [],
      },
    });
  }

  // Unexpected errors
  console.error("Unhandled Error:", err);
  const isProd = process.env.NODE_ENV === "production";
  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: isProd ? "Internal server error" : err.message || "Internal server error",
      details: [],
    },
  });
}
