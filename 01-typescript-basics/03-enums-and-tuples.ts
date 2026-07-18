/**
 * MODULE 1: TypeScript Basics
 * FILE 3: Enums and Tuples
 * 
 * ==========================================
 * WHAT ARE ENUMS AND TUPLES?
 * ==========================================
 * 1. Enums (Enumerations): Allow us to define a set of named constants. 
 *    Instead of using magic strings or numbers ("admin", "user", 1, 2) that are prone to typos, 
 *    Enums provide auto-completed options that keep our code safe and descriptive.
 * 
 * 2. Tuples: A tuple is an Array with a FIXED length and FIXED types at specific indexes.
 *    For example, [number, string] means index 0 is always a number, and index 1 is always a string.
 * 
 * ==========================================
 * REAL-LIFE ANALOGY:
 * ==========================================
 * - Enum: A restaurant menu. You can only order "Pizza", "Pasta", or "Salad". 
 *   You cannot order "Spaceship" because it is not on the menu.
 * - Tuple: A latitude and longitude coordinate pair. 
 *   It must always contain exactly two numbers in that order: [latitude, longitude].
 */

import { log } from "console";

export {};

// ============================================================================
// 1. ENUMS EXPLAINED
// ============================================================================

// --- Numeric Enum ---
// By default, enums start numbering from 0:
enum UserRoleNumeric {
  Admin,  // 0
  Editor, // 1
  User,   // 2
}
let role: UserRoleNumeric = UserRoleNumeric.Admin; // Evaluates to 0 at runtime.

// --- String Enum (Recommended for Web APIs) ---
// Assigning explicit string values makes debugging and database storage much cleaner!
enum HttpMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
}

const reqMethod: HttpMethod = HttpMethod.Post; // Evaluates to "POST"
console.log(`Sending a ${reqMethod} request...`);

// ============================================================================
// 2. TUPLES EXPLAINED
// ============================================================================

// Standard array (can contain any number of strings):
let dynamicNamesList: string[] = ["Alice", "Bob"];

// Tuple (MUST contain exactly one string and one number in that order):
let userSession: [string, number] = ["alice_session_token", 3600];

// userSession = [3600, "token"]; // ❌ ERROR: Type 'number' is not assignable to type 'string' at index 0.
// userSession = ["token"];       // ❌ ERROR: Source has 1 element(s) but target requires 2.

// ============================================================================
// 3. PRACTICE EXERCISE: Log Processor System
// ============================================================================
// Complete the implementation below using Enums and Tuples.

// Step 1: Define an Enum called 'LogLevel' with the following string values:
//   - Info should equal "INFO"
//   - Warning should equal "WARNING"
//   - Error should equal "ERROR"
enum LogLevel {
  // TODO: Practice writing these yourself!
  Info = "INFO",
  Warning = "WARNING",
  Error = "ERROR",
}

// Step 2: Define a Tuple type called 'LogEntry'.
// A LogEntry must contain exactly:
//   - index 0: A timestamp as a Date object.
//   - index 1: The log level (using our LogLevel enum).
//   - index 2: The log message as a string.
type LogEntry = [Date: Date, Loglevel: LogLevel, message: string]; // TODO: Replace 'any' with the tuple definition: [Date, LogLevel, string]

/**
 * Step 3: Write a function that processes an array of log entries.
 * It should count how many error logs are in the array and return that number.
 */
function countErrorLogs(logs: LogEntry[]): number {
  // TODO: Implement the counting logic
  let count: number = 0;
  for (const log of logs) {
    if (log[1] === LogLevel.Error) {
      count++;
    }
  }

  return count;
}


// ============================================================================
// 4. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run using: npx ts-node 01-typescript-basics/03-enums-and-tuples.ts

console.log("\n=== Checking your solutions... ===");

try {
  // Verify Enum existence and values
  const hasInfo = LogLevel.Info === "INFO";
  const hasWarning = LogLevel.Warning === "WARNING";
  const hasError = LogLevel.Error === "ERROR";

  if (!hasInfo || !hasWarning || !hasError) {
    console.log("❌ LogLevel: Enum values are incorrect or incomplete.");
  } else {
    console.log("✅ LogLevel: Enum created correctly!");
  }

  // Create mock logs to test the parser
  const logsList: LogEntry[] = [
    [new Date(), LogLevel.Info, "Server started successfully"],
    [new Date(), LogLevel.Warning, "Disk space running low (82%)"],
    [new Date(), LogLevel.Error, "Database connection failed!"],
    [new Date(), LogLevel.Info, "Retrying connection..."],
    [new Date(), LogLevel.Error, "Database failed on retry! Max limit reached."],
  ];

  const errorCount = countErrorLogs(logsList);

  if (errorCount === 2) {
    console.log("✅ countErrorLogs: Passed!");
    if (hasInfo && hasWarning && hasError) {
      console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 1, File 3!");
    }
  } else {
    console.log(`❌ countErrorLogs: Failed. Expected 2 errors, but got ${errorCount}`);
  }

} catch (err) {
  console.log("❌ An error occurred during validation. Check your tuple index referencing.", err);
}


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What is the difference between a numeric enum and a string enum?
// A:  Numeric enums auto-increment (Admin=0, Editor=1, User=2) and support 
//     reverse mapping (UserRole[0] === "Admin"). String enums require explicit
//     values and do NOT support reverse mapping. String enums are preferred
//     for API responses because they are human-readable in JSON.
//
// Q2: What is "const enum"? When would you use it?
// A:  'const enum' is fully inlined at compile time — the enum object is NOT
//     emitted into JavaScript. Instead, the literal values are placed directly
//     in the code. Use it for performance when you don't need reverse mapping.
//     Example: const enum Direction { Up = "UP" }
//
// Q3: What is the difference between a Tuple and an Array?
// A:  An Array (string[]) has unlimited length and all elements are the same type.
//     A Tuple ([string, number]) has a FIXED length with specific types at each index.
//     Tuples are useful for returning multiple values from a function (like useState).
//
// Q4: Can you push() to a tuple in TypeScript? Will it error?
// A:  Surprisingly, YES — TypeScript allows .push() on tuples at runtime because
//     tuples are regular arrays under the hood. This is a known TypeScript weakness.
//     The type system enforces the shape at declaration but not for mutations.
//
// Q5: When should you use an enum vs. a union type?
// A:  Union types ("admin" | "editor") are lighter — they don't generate runtime code.
//     Enums generate a JavaScript object at runtime, which adds bundle size.
//     Prefer union types for simple string sets. Use enums when you need:
//     - Reverse mapping (numeric enums)
//     - Iterating over all values (Object.values(MyEnum))
//     - Centralized constants referenced across many files
