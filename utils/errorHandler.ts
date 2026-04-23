import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { errorResponse, validationErrorResponse } from "./response";
import { logger } from "@/utils/logger";

export function handleError(error: unknown): NextResponse {
  // Zod v4 validation errors — issues (not errors)
  if (error instanceof ZodError) {
    const errors = error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return validationErrorResponse(errors);
  }

  // Mongoose validation errors
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return validationErrorResponse(errors);
  }

  // Mongoose duplicate key (code 11000)
  if (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "11000"
  ) {
    return errorResponse("A record with that value already exists", 409);
  }

  // Mongoose CastError (invalid ObjectId)
  if (error instanceof mongoose.Error.CastError) {
    return errorResponse(`Invalid value for field: ${error.path}`, 400);
  }

  // JWT errors
  if (error instanceof Error && error.name === "JsonWebTokenError") {
    return errorResponse("Invalid token", 401);
  }
  if (error instanceof Error && error.name === "TokenExpiredError") {
    return errorResponse("Token has expired", 401);
  }

  // Generic error
  if (error instanceof Error) {
    logger.error("Unhandled error:", error.message);
    return errorResponse(
      process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
      500
    );
  }

  logger.error("Unknown error:", String(error));
  return errorResponse("Internal server error", 500);
}
