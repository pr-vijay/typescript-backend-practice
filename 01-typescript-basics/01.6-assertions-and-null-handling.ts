/**
 * MODULE 1: TypeScript Basics
 * FILE 1.6: Type Assertions and Null Handling
 * 
 * ==========================================
 * TYPE ASSERTIONS (as Keyword)
 * ==========================================
 * Sometimes, you know the type of a value better than TypeScript does.
 * For example, if you parse a JSON string or receive data from an external API,
 * TypeScript will type it as `any` or `unknown`.
 * 
 * You can tell TypeScript: "Trust me, I know this is a User object" using `as`:
 *   const user = rawData as User;
 * 
 * ⚠️ WARNING: Type assertions are a compile-time instruction.
 * They do NOT perform runtime checks or conversions. If you assert an object
 * is a User, but it's actually empty, it will compile successfully but crash at runtime!
 * 
 * Double Casting: If you need to force-assert incompatible types, cast to `unknown` first:
 *   const count = (idString as unknown) as number;
 * 
 * ==========================================
 * OPTIONAL CHAINING (?. Operator)
 * ==========================================
 * JavaScript/TypeScript can crash with a TypeError if you try to read a property
 * of `null` or `undefined` (e.g. `user.profile.address` if `profile` is undefined).
 * 
 * Optional chaining (`?.`) short-circuits and returns `undefined` instead of throwing an error:
 *   const city = user?.profile?.address?.city; // If any part is null/undefined, city becomes undefined.
 * 
 * ==========================================
 * NULLISH COALESCING (?? Operator)
 * ==========================================
 * In JS, the logical OR operator (`||`) is often used for defaults:
 *   const port = config.port || 8080;
 * 
 * However, `||` falls back for ALL falsy values (like `0`, `""`, `false`).
 * If a user wants to set a port to `0`, `||` will incorrectly override it to `8080`.
 * 
 * The nullish coalescing operator (`??`) ONLY falls back when the left side is `null` or `undefined`:
 *   const port = config.port ?? 8080; // Correctly allows 0 or "" to be used!
 */

export {};

// ============================================================================
// 1. EXAMPLES
// ============================================================================

interface UserProfile {
  id: number;
  contact?: {
    email: string;
    phone?: string;
  };
}

// Optional Chaining & Nullish Coalescing example
function getPhoneNumber(user: UserProfile | null): string {
  // If user is null, or contact is undefined, or phone is undefined, return "No phone provided"
  return user?.contact?.phone ?? "No phone provided";
}

// Type Assertion example
const rawJsonResponse = '{"id": 102, "contact": {"email": "test@test.com"}}';
const parsedData: unknown = JSON.parse(rawJsonResponse);

// Since parsedData is 'unknown', we assert it to UserProfile so we can access its fields
const user = parsedData as UserProfile;
console.log(`User email: ${user.contact?.email}`); // Safe because of assertion and optional chaining!


// ============================================================================
// 2. PRACTICE EXERCISES
// ============================================================================

interface DatabaseConfig {
  host: string;
  port: number;
  credentials?: {
    username?: string;
    password?: string;
  };
}

/**
 * Exercise 1: Safe Connection String Builder
 * Complete the function below to generate a connection string.
 * Use Optional Chaining (`?.`) and Nullish Coalescing (`??`) to satisfy these requirements:
 *   - Use the username if available in credentials, otherwise default to "guest".
 *   - Use the port, but if it's missing (null or undefined), default to 5432.
 *   - The output format should be: "postgresql://{username}@{host}:{port}"
 */
function buildConnectionString(config: Partial<DatabaseConfig> | null | undefined): string {
  const username = config?.credentials?.username ?? "guest";
  const host = config?.host;
  const port = config?.port ?? 5432;
  return `postgresql://${username}@${host}:${port}`;
}

/**
 * Exercise 2: Cast Mock API Payload
 * We have a mock API fetch function that returns a value typed as `unknown`.
 * 1. Safely assert/cast the payload as `DatabaseConfig`.
 * 2. If the host is missing on the asserted object, throw an Error("Missing host").
 * 3. Return the casted DatabaseConfig.
 */
function parseConfigPayload(payload: unknown): DatabaseConfig {
  const config = payload as DatabaseConfig;
  if (!config?.host) {
    throw new Error("Missing host");
  }
  return config;
}


// ============================================================================
// 3. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// Run this file in your terminal using: npx ts-node 01-typescript-basics/01.6-assertions-and-null-handling.ts

console.log("\n=== Checking your solutions... ===");

try {
  // Test Exercise 1: Connection String
  const conn1 = buildConnectionString({
    host: "localhost",
    port: 5432,
    credentials: { username: "admin" }
  });
  const conn2 = buildConnectionString({
    host: "db.sarvm.ai",
    // port is missing, credentials is empty/missing password
    credentials: {}
  });
  const conn3 = buildConnectionString(null);

  let connPass = false;
  if (
    conn1 === "postgresql://admin@localhost:5432" &&
    conn2 === "postgresql://guest@db.sarvm.ai:5432" &&
    conn3 === "postgresql://guest@undefined:5432"
  ) {
    console.log("✅ buildConnectionString: Passed!");
    connPass = true;
  } else {
    console.log(`❌ buildConnectionString: Failed.`);
    console.log(`   Expected 1: "postgresql://admin@localhost:5432", got: "${conn1}"`);
    console.log(`   Expected 2: "postgresql://guest@db.sarvm.ai:5432", got: "${conn2}"`);
    console.log(`   Expected 3: "postgresql://guest@undefined:5432", got: "${conn3}"`);
  }

  // Test Exercise 2: Cast API Payload
  let castPass = false;
  try {
    const validPayload = { host: "aws.db", port: 3306 };
    const parsed = parseConfigPayload(validPayload);
    
    if (parsed.host === "aws.db" && parsed.port === 3306) {
      // Test invalid payload
      try {
        parseConfigPayload({ port: 3306 }); // Missing host
        console.log("❌ parseConfigPayload: Failed. Expected host validation error.");
      } catch (err: any) {
        if (err.message === "Missing host") {
          console.log("✅ parseConfigPayload: Passed!");
          castPass = true;
        } else {
          console.log(`❌ parseConfigPayload: Failed. Got unexpected error message: "${err.message}"`);
        }
      }
    }
  } catch (err) {
    console.log("❌ parseConfigPayload: Failed to run with error:", err);
  }

  if (connPass && castPass) {
    console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 1, File 1.6!");
  } else {
    console.log("\n💡 Keep trying! Modify the methods above and run the file again.");
  }

} catch (err) {
  console.log("❌ An error occurred during validation:", err);
}
