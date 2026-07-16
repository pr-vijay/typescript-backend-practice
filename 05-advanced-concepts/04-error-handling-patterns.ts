/**
 * MODULE 5: Advanced Backend Concepts
 * FILE 4: Error Handling Patterns
 * 
 * ==========================================
 * WHY DO WE NEED CUSTOM ERROR CLASSES?
 * ==========================================
 * In a basic Node.js app, we just throw `new Error("something went wrong")`.
 * But in a production API, this is NOT enough because:
 *   1. We need HTTP status codes (400 vs 404 vs 500).
 *   2. We need to distinguish between "user mistakes" (bad input) and 
 *      "our mistakes" (database crashed). These are called:
 *      - Operational Errors: Expected failures (invalid email, item not found).
 *      - Programmer Errors: Bugs in our code (undefined variable, bad query).
 *   3. Our centralized error handler needs to know HOW to respond to each error.
 * 
 * The solution: Create a hierarchy of custom error classes that carry metadata 
 * (status code, error type) and can be caught and handled uniformly.
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: Hospital Triage System
 * ==========================================
 * In a hospital ER, patients aren't all treated the same.
 * A nurse (error handler) triages each patient (error) based on severity:
 *   - Minor (400 Bad Request): "You filled the form wrong, please try again."
 *   - Moderate (404 Not Found): "The doctor you asked for doesn't work here."
 *   - Severe (500 Internal Error): "The MRI machine broke down — this is OUR problem."
 * 
 * Custom error classes are like triage tags — they carry severity information
 * so the handler knows exactly how to respond.
 */

// ============================================================================
// 1. BASE ERROR CLASS (AppError)
// ============================================================================
// All our custom errors extend this base class.
// It adds: statusCode, isOperational flag, and proper prototype chain setup.

class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // IMPORTANT: Fix the prototype chain.
    // Without this, `instanceof AppError` won't work correctly in TypeScript.
    // This is a known TS issue when extending built-in classes like Error.
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture the stack trace, excluding the constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }
}

// ============================================================================
// 2. SPECIFIC ERROR CLASSES (The Hierarchy)
// ============================================================================

// 400 — Client sent invalid data (bad email, missing fields, etc.)
class ValidationError extends AppError {
  public readonly errors: string[];

  constructor(errors: string[]) {
    super(`Validation failed: ${errors.join(", ")}`, 400);
    this.errors = errors;
  }
}

// 401 — Client is NOT authenticated (no token, expired token)
class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401);
  }
}

// 403 — Client IS authenticated but lacks permission
class ForbiddenError extends AppError {
  constructor(message: string = "You do not have permission to perform this action") {
    super(message, 403);
  }
}

// 404 — Resource not found
class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string | number) {
    const msg = identifier 
      ? `${resource} with identifier '${identifier}' was not found`
      : `${resource} not found`;
    super(msg, 404);
  }
}

// 409 — Conflict (duplicate email, unique constraint violation)
class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

// 500 — Internal server error (database crash, unexpected bug)
// isOperational = false because this is likely a programmer error.
class InternalError extends AppError {
  constructor(message: string = "An unexpected internal error occurred") {
    super(message, 500, false);
  }
}

// ============================================================================
// 3. USAGE EXAMPLES
// ============================================================================

async function findUserById(id: number): Promise<{ id: number; name: string }> {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  
  const user = users.find(u => u.id === id);
  
  if (!user) {
    // Instead of: throw new Error("User not found");
    // We throw a typed error with status code:
    throw new NotFoundError("User", id);
  }

  return user;
}

async function registerUser(email: string, password: string): Promise<void> {
  // Validation
  const errors: string[] = [];
  if (!email.includes("@")) errors.push("Invalid email format");
  if (password.length < 8) errors.push("Password must be at least 8 characters");
  
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  // Check duplicates
  if (email === "taken@example.com") {
    throw new ConflictError(`Email '${email}' is already registered`);
  }

  console.log(`✅ User ${email} registered successfully!`);
}

// ============================================================================
// 4. CENTRALIZED ERROR HANDLER (Express-style)
// ============================================================================
// In Express, this would be an error-handling middleware:
// app.use((err, req, res, next) => { ... })
// Here we demonstrate the handler logic:

function handleError(error: unknown): { statusCode: number; body: object } {
  // Check if it's one of OUR custom errors:
  if (error instanceof AppError) {
    const response: any = {
      status: "error",
      message: error.message,
      statusCode: error.statusCode,
    };

    // Add validation details if it's a ValidationError
    if (error instanceof ValidationError) {
      response.errors = error.errors;
    }

    // Log programmer errors (non-operational) as CRITICAL:
    if (!error.isOperational) {
      console.error("🚨 CRITICAL NON-OPERATIONAL ERROR:", error);
    }

    return { statusCode: error.statusCode, body: response };
  }

  // If it's NOT our custom error, treat it as an unexpected internal error:
  console.error("🚨 UNKNOWN ERROR:", error);
  return {
    statusCode: 500,
    body: { status: "error", message: "Something went wrong", statusCode: 500 }
  };
}

// Demo:
console.log("--- Error Handling Demo ---");
try {
  throw new NotFoundError("Product", 999);
} catch (err) {
  const response = handleError(err);
  console.log(`Response [${response.statusCode}]:`, response.body);
}

// ============================================================================
// 5. PRACTICE EXERCISE: Build Custom Error Classes
// ============================================================================

// Step 1: Create a 'RateLimitError' class extending AppError.
//   - HTTP status code: 429
//   - Constructor takes: retryAfterSeconds (number)
//   - Message should be: "Too many requests. Retry after {retryAfterSeconds} seconds."
//   - Store retryAfterSeconds as a public property
class RateLimitError extends AppError {
  // TODO: Implement
  constructor() {
    super("TODO", 429);
  }
}

// Step 2: Write an error handler function specific to this exercise.
// Given an AppError, return an object with: { statusCode, message, isOperational }
function formatErrorResponse(error: AppError): { statusCode: number; message: string; isOperational: boolean } {
  // TODO: Extract properties from the error and return them.
  return { statusCode: 0, message: "", isOperational: true };
}


// ============================================================================
// 6. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run using: npx ts-node 05-advanced-concepts/04-error-handling-patterns.ts

console.log("\n=== Checking your solutions... ===");

try {
  // Test RateLimitError
  let rateLimitPass = false;
  try {
    const rle = new RateLimitError();
    if (
      rle instanceof AppError &&
      rle.statusCode === 429 &&
      rle.message.includes("Retry after") &&
      rle.isOperational === true
    ) {
      console.log("✅ RateLimitError: Class structure correct!");
      rateLimitPass = true;
    } else {
      console.log(`❌ RateLimitError: Check statusCode (${rle.statusCode}), message, and isOperational.`);
    }
  } catch (e) {
    console.log("❌ RateLimitError: Construction failed.", e);
  }

  // Test formatErrorResponse
  const testError = new NotFoundError("Order", "ORD-123");
  const formatted = formatErrorResponse(testError);

  let formatPass = false;
  if (formatted.statusCode === 404 && formatted.message.includes("ORD-123") && formatted.isOperational === true) {
    console.log("✅ formatErrorResponse: Passed!");
    formatPass = true;
  } else {
    console.log(`❌ formatErrorResponse: Failed. Got: ${JSON.stringify(formatted)}`);
  }

  if (rateLimitPass && formatPass) {
    console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 5, File 4!");
    console.log("You have completed ALL Advanced Concepts!");
  }

} catch (err) {
  console.log("❌ Validation error:", err);
}


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What is the difference between operational and programmer errors?
// A:  Operational: Expected failures from external factors (bad user input, network
//     timeout, file not found). The system is still healthy.
//     Programmer: Bugs in your code (TypeError, undefined access, bad SQL query).
//     The system may be in an invalid state. Handle them differently:
//     operational → send error response; programmer → log + restart process.
//
// Q2: Why extend the Error class instead of throwing plain objects?
// A:  Extending Error gives you: (1) proper stack trace for debugging,
//     (2) instanceof checks for type narrowing in catch blocks,
//     (3) consistent error structure across your application.
//
// Q3: Why do we need Object.setPrototypeOf() when extending Error?
// A:  TypeScript compiles class extends to ES5-compatible code that breaks the
//     prototype chain for built-in classes. Object.setPrototypeOf() fixes this
//     so that `instanceof` works correctly with custom error classes.
//
// Q4: How should a production Express app handle errors?
// A:  1. Throw specific AppError subclasses from controllers/services.
//     2. Use a centralized error-handling middleware (app.use(errorHandler)).
//     3. Operational errors → send error response with status code.
//     4. Programmer errors → log to monitoring (Sentry/Datadog) + return 500.
//     5. Unhandled rejections → process.on("unhandledRejection", handler).
//
// Q5: What is the purpose of HTTP status code 409 (Conflict)?
// A:  It indicates the request conflicts with the current state of the server.
//     Most common use: trying to create a resource that already exists
//     (duplicate email, duplicate username). Return 409 with details.
