/**
 * MODULE 3: Express Framework
 * FILE: src/middlewares/errorHandler.ts
 * 
 * ==========================================
 * CENTRALIZED ERROR HANDLING IN EXPRESS
 * ==========================================
 * Instead of writing `try-catch` blocks that manually return `res.status(500).json(...)` 
 * inside every single endpoint, production backends use a centralized Error Handler Middleware.
 * 
 * If a route controller encounters an error, it passes it down the chain by calling `next(error)`.
 * Express bypasses all normal middleware and jumps straight to the Error Handler.
 * 
 * Note: An error-handling middleware MUST accept 4 arguments: (err, req, res, next).
 * If you omit the 'next' parameter, Express will NOT recognize it as an error handler!
 */

import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(`[Error Handler Caught Exception]:`, err);

  // 1. Handle validation errors (e.g., from Zod)
  if (err.name === "ZodError" || err.issues) {
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      details: err.errors || err.issues,
    });
    return;
  }

  // 2. Handle known application operational errors
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message: message,
    // Avoid returning stack traces to clients in production! Only do it in development mode.
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
