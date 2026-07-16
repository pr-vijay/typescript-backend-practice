/**
 * MODULE 3: Express Framework
 * FILE: src/validation/userSchema.ts
 * 
 * ==========================================
 * WHAT IS RUNTIME VALIDATION AND ZOD?
 * ==========================================
 * TypeScript performs type checking *at compile time*. 
 * Once compile time is finished and your code is running as raw JavaScript on the server, 
 * TS types disappear (this is called "Type Erasure").
 * 
 * If a malicious user sends a POST request with: `{ age: "not-a-number", email: "invalid-email" }`,
 * raw JavaScript will process it and crash or corrupt the database!
 * 
 * We use **Zod** (a schema validation library) to validate incoming API request bodies 
 * *at runtime* (while the app is running).
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: Airport Security Gate
 * ==========================================
 * Think of TypeScript types as passport design rules (it must have a photo, name, and expiration).
 * Think of Zod as the physical airport security guard checking the passport when a traveler arrives.
 * The guard checks that the photo is actually there, the expiration date is in the future, 
 * and the traveler matches the ID. If they fail, they are rejected before entering the airport (routing).
 */

import { z } from "zod";

// Define the runtime validation schema for creating a user.
// This validates that the request body matches these rules exactly.
export const createUserSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username cannot exceed 20 characters"),
  
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  
  age: z
    .number({ required_error: "Age is required" })
    .int("Age must be an integer")
    .min(18, "You must be at least 18 years old")
    .max(120, "Age exceeds realistic human limit"),

  // Optional field with defaults
  role: z
    .enum(["admin", "editor", "user"])
    .default("user")
});

// ============================================================================
// TYPING THE INFERRED TYPE FROM SCHEMA
// ============================================================================
// Instead of writing a separate TypeScript interface for this object, Zod can 
// automatically infer the TypeScript type directly from the schema! 
// This prevents having to update both interfaces and schemas when code changes.

export type CreateUserDto = z.infer<typeof createUserSchema>;

// Example of the inferred type output:
// interface CreateUserDto {
//   username: string;
//   email: string;
//   age: number;
//   role?: "admin" | "editor" | "user";
// }
