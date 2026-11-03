import type {Response} from "express";
import {ZodError} from "zod";
import {AppError} from "./AppError";

export const errorHandler = (
  error: unknown,
  res: Response
): void => {
  // Validation errors
  if (error instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten().fieldErrors,
    });
    return;
  }

  // Custom application errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
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
      res.status(409).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    if (code === "auth/invalid-email") {
      res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
      return;
    }

    if (code === "auth/weak-password") {
      res.status(422).json({
        success: false,
        message: "Password is too weak",
      });
      return;
    }
  }

  // Internal server error
  console.error("Unexpected error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
