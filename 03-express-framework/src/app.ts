/**
 * MODULE 3: Express Framework
 * FILE: src/app.ts
 * 
 * ==========================================
 * ENTRY POINT OF THE APPLICATION
 * ==========================================
 * This is the file that boots up the server. It:
 *   1. Instantiates the Express application.
 *   2. Registers core built-in middlewares (like JSON body parsers).
 *   3. Registers custom middlewares (like Logging).
 *   4. Binds API routing prefixes.
 *   5. Registers error handling middleware (must be registered LAST).
 *   6. Binds to a port and starts listening for HTTP traffic.
 */

import express, { Application } from "express";
import apiRoutes from "./routes";
import { loggingMiddleware } from "./middlewares/loggingMiddleware";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// REGISTRATION OF MIDDLEWARES (In execution order)
// ============================================================================

// 1. Built-in JSON body parser. 
// Allows us to read req.body inside POST/PUT request handlers.
app.use(express.json());

// 2. Custom request logging middleware
app.use(loggingMiddleware);

// 3. Mount all modular routes under the "/api" prefix
app.use("/api", apiRoutes);

// 4. Centralized Error Handler Middleware.
// ⚠️ IMPORTANT: This MUST be registered AFTER all routes and other middlewares!
// If it is placed before routes, it won't catch any errors thrown inside them.
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server successfully booted and running at http://localhost:${PORT}`);
  console.log(`Try accessing: GET http://localhost:${PORT}/api/users`);
});

export default app;
