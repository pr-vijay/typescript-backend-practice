/**
 * MODULE 3: Express Framework
 * FILE: src/middlewares/loggingMiddleware.ts
 * 
 * ==========================================
 * WHAT IS AN EXPRESS MIDDLEWARE?
 * ==========================================
 * In Express, requests travel down a pipeline of functions.
 * A middleware is a function that sits in this pipeline, intercepts the request, 
 * performs action, and then decides to either:
 *   1. Send a response immediately, stopping the pipeline.
 *   2. Call `next()`, which passes the request to the next middleware in line.
 * 
 * Middleware signature: `(req: Request, res: Response, next: NextFunction) => void`
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: Assembly Line
 * ==========================================
 * Imagine a conveyor belt building a car. 
 * Each station (middleware) does one thing:
 *   - Station 1 cleans the metal sheet.
 *   - Station 2 paints it blue.
 *   - Station 3 attaches wheels.
 * If Station 2 sees the sheet is broken, it pulls it off the line and stops the process (rejection).
 */

import { Request, Response, NextFunction } from "express";

export function loggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  
  // Capture when the response finishes sending to log the execution time
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(`[HTTP Logger] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
  });

  // CRITICAL: If you forget to call next(), the server will hang forever!
  next();
}
