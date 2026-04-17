import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { config } from "../config";

/**
 * Global Express error-handling middleware.
 *
 * Placed last in the middleware chain (4-argument signature).
 * Handles:
 *  - Operational AppErrors   → structured JSON response with correct HTTP status
 *  - Mongoose ValidationErrors → mapped to 400
 *  - Unexpected errors        → 500 with minimal detail (stack hidden in prod)
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // ── Operational errors ──────────────────────────────────────────────────────
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        name: err.name,
        message: err.message,
      },
    });
    return;
  }

  // ── Mongoose CastError (invalid ObjectId) ───────────────────────────────────
  if (err.name === "CastError") {
    res.status(400).json({
      success: false,
      error: { name: "BadRequestError", message: "Invalid ID format" },
    });
    return;
  }

  // ── Mongoose ValidationError ────────────────────────────────────────────────
  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      error: { name: "ValidationError", message: err.message },
    });
    return;
  }

  // ── MongoDB duplicate key (E11000) ──────────────────────────────────────────
  if ((err as NodeJS.ErrnoException).code === "11000") {
    res.status(409).json({
      success: false,
      error: { name: "ConflictError", message: "Duplicate key — resource already exists" },
    });
    return;
  }

  // ── Unknown / programmer error ───────────────────────────────────────────────
  console.error("[UnhandledError]", err);

  res.status(500).json({
    success: false,
    error: {
      name: "InternalServerError",
      message: "An unexpected error occurred",
      ...(config.env !== "production" && { stack: err.stack }),
    },
  });
}
