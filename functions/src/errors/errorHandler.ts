import type {Response} from "express";
import {ZodError} from "zod";
import {AppError} from "./AppError";

export const errorHandler = (
  error: unknown,
  res: Response
): void => {
  // Validation errors
  if (error instanceof ZodError) {
    res.errorResponse(422, "Validation failed", error.flatten().fieldErrors);
    return;
  }

  // Custom application errors
  if (error instanceof AppError) {
    res.errorResponse(error.statusCode, error.message);
    return;
  }

  // Firebase Authentication errors
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const code = String(error.code);

    if (code === "auth/email-already-exists") {
      res.errorResponse(409, "Email already registered");
      return;
    }

    if (code === "auth/invalid-email") {
      res.errorResponse(400, "Invalid email address");
      return;
    }

    if (code === "auth/weak-password") {
      res.errorResponse(422, "Password is too weak");
      return;
    }
  }

  // Internal server error
  console.error("Unexpected error:", error);

  res.errorResponse(500, "Internal server error");
};
