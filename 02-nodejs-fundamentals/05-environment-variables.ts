/**
 * MODULE 2: Node.js Fundamentals
 * FILE 5: Environment Variables and Configuration Management
 * 
 * ==========================================
 * WHAT ARE ENVIRONMENT VARIABLES?
 * ==========================================
 * Environment variables are key-value pairs stored OUTSIDE your source code.
 * They are used to configure your application without hardcoding sensitive values.
 * 
 * Why do we need them?
 *   1. SECURITY: Database passwords, API keys, and JWT secrets should NEVER be 
 *      committed to source control (git). If they are, anyone with repo access 
 *      can steal them.
 *   2. FLEXIBILITY: The same codebase runs in different "environments":
 *      - Development (your laptop): connects to local database
 *      - Staging (test server): connects to test database
 *      - Production (live server): connects to real database
 *      Environment variables let you switch configurations without changing code.
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: Secret Recipes in a Vault
 * ==========================================
 * Think of a restaurant chain. The secret sauce recipe is stored in a vault.
 * Each restaurant location (environment) has access to the vault, but the recipe 
 * is never printed on the menu (source code). If someone steals the menu, 
 * they still can't reproduce the sauce.
 * 
 * The vault = .env file (or cloud secrets manager)
 * The menu = your source code (pushed to GitHub)
 * The recipe = DATABASE_URL, API_KEY, JWT_SECRET
 */

export {};

// ============================================================================
// 1. ACCESSING ENVIRONMENT VARIABLES IN NODE.JS
// ============================================================================

// In Node.js, ALL environment variables are accessible via `process.env`.
// Every value in process.env is a STRING (or undefined if not set).
// You must manually convert to numbers, booleans, etc.

const nodeEnv: string = process.env.NODE_ENV || "development";
const port: number = parseInt(process.env.PORT || "3000", 10);

console.log(`Running in ${nodeEnv} mode on port ${port}`);

// ============================================================================
// 2. THE .ENV FILE PATTERN (Using dotenv)
// ============================================================================
// By convention, you create a file called `.env` in your project root:
//
// .env file contents:
//   DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
//   JWT_SECRET=my_super_secret_key
//   PORT=3000
//   NODE_ENV=development
//   ENABLE_LOGGING=true
//
// The `dotenv` package reads this file and injects the variables into process.env.
// Usage (at the very top of your entry file):
//   import "dotenv/config";
//   OR
//   import * as dotenv from "dotenv";
//   dotenv.config();
//
// ⚠️ CRITICAL RULE: ALWAYS add .env to your .gitignore file!
//    Create a `.env.example` file (with dummy values) to show team members 
//    which variables are needed.

// ============================================================================
// 3. TYPE-SAFE CONFIG LOADER (The Professional Pattern)
// ============================================================================
// In production backends, you create a centralized config module that:
//   1. Reads all environment variables in ONE place.
//   2. Validates that required variables exist (fail-fast).
//   3. Converts strings to proper types (number, boolean).
//   4. Exports a fully-typed config object used everywhere.

interface AppConfig {
  nodeEnv: "development" | "staging" | "production";
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  enableLogging: boolean;
}

/**
 * Reads a required environment variable.
 * If it's missing, throws an error immediately (fail-fast).
 * This prevents the server from starting with broken configuration.
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`❌ FATAL: Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Reads an optional environment variable with a default fallback.
 */
function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Loads and validates the full application configuration.
 * Call this ONCE at application startup.
 */
function loadConfig(): AppConfig {
  return {
    nodeEnv: optionalEnv("NODE_ENV", "development") as AppConfig["nodeEnv"],
    port: parseInt(optionalEnv("PORT", "3000"), 10),
    databaseUrl: optionalEnv("DATABASE_URL", "postgresql://localhost:5432/dev"),
    jwtSecret: optionalEnv("JWT_SECRET", "dev-secret-change-in-production"),
    enableLogging: optionalEnv("ENABLE_LOGGING", "true") === "true",
  };
}

// Usage throughout your application:
const config = loadConfig();
console.log(`[Config] Environment: ${config.nodeEnv}`);
console.log(`[Config] Port: ${config.port}`);
console.log(`[Config] Logging: ${config.enableLogging}`);

// Now everywhere in your code, use `config.port` instead of `process.env.PORT`.
// This gives you autocomplete, type safety, and a single source of truth.

// ============================================================================
// 4. PRACTICE EXERCISE: Config Validator
// ============================================================================

/**
 * Task 1: Write a function that validates a configuration object.
 * It should check:
 *   - port must be between 1024 and 65535 (valid user ports)
 *   - databaseUrl must start with "postgresql://" or "mysql://"
 *   - jwtSecret must be at least 16 characters long
 * 
 * Return an array of error messages. If config is valid, return empty array [].
 */
function validateConfig(cfg: AppConfig): string[] {
  const errors: string[] = [];
  // TODO: Check port range (1024-65535). If invalid, push error message.
  // TODO: Check databaseUrl prefix. If invalid, push error message.
  // TODO: Check jwtSecret length. If too short, push error message.
  return errors;
}

/**
 * Task 2: Write a function that creates a `.env.example` content string.
 * Given a list of env variable names, generate a template like:
 *   DATABASE_URL=
 *   JWT_SECRET=
 *   PORT=
 * 
 * This helps new developers know which variables to set up.
 */
function generateEnvExample(variableNames: string[]): string {
  // TODO: Join all variable names with "=\n" to create the template.
  return "";
}


// ============================================================================
// 5. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run using: npx ts-node 02-nodejs-fundamentals/05-environment-variables.ts

console.log("\n=== Checking your solutions... ===");

try {
  // Test validateConfig
  const goodConfig: AppConfig = {
    nodeEnv: "production",
    port: 3000,
    databaseUrl: "postgresql://localhost:5432/mydb",
    jwtSecret: "a_very_secure_secret_key_123",
    enableLogging: true
  };

  const badConfig: AppConfig = {
    nodeEnv: "development",
    port: 80,
    databaseUrl: "sqlite:///local.db",
    jwtSecret: "short",
    enableLogging: false
  };

  const goodErrors = validateConfig(goodConfig);
  const badErrors = validateConfig(badConfig);

  let validatePass = false;
  if (goodErrors.length === 0 && badErrors.length >= 3) {
    console.log("✅ validateConfig: Correctly validates config!");
    validatePass = true;
  } else {
    console.log(`❌ validateConfig: Expected 0 good errors and 3+ bad errors.`);
    console.log(`   Good errors: ${JSON.stringify(goodErrors)}`);
    console.log(`   Bad errors: ${JSON.stringify(badErrors)}`);
  }

  // Test generateEnvExample
  const envTemplate = generateEnvExample(["DATABASE_URL", "JWT_SECRET", "PORT"]);
  
  let envExamplePass = false;
  if (envTemplate.includes("DATABASE_URL=") && envTemplate.includes("JWT_SECRET=") && envTemplate.includes("PORT=")) {
    console.log("✅ generateEnvExample: Generates correct template!");
    envExamplePass = true;
  } else {
    console.log(`❌ generateEnvExample: Failed. Got: "${envTemplate}"`);
  }

  if (validatePass && envExamplePass) {
    console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 2, File 5!");
    console.log("You have completed ALL Node.js Fundamentals! Move to Module 03.");
  }

} catch (err) {
  console.log("❌ Validation error:", err);
}


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: Where should you store sensitive configuration values?
// A:  In environment variables, NOT in source code. Options:
//     - .env file (development, added to .gitignore)
//     - Cloud secret managers: AWS Secrets Manager, GCP Secret Manager, Azure Key Vault
//     - Container orchestration: Kubernetes Secrets, Docker Secrets
//     NEVER commit API keys, passwords, or tokens to git.
//
// Q2: What is the difference between .env and .env.example?
// A:  .env contains real secret values and is in .gitignore (never committed).
//     .env.example contains placeholder/dummy values and IS committed to git.
//     It serves as documentation showing which variables are needed.
//
// Q3: Why is everything in process.env a string?
// A:  Environment variables are an OS-level concept — the OS stores all env vars 
//     as strings. Node.js reads them as-is. You must manually parse:
//     parseInt() for numbers, === "true" for booleans.
//
// Q4: What is "fail-fast" configuration? Why is it important?
// A:  Fail-fast means checking ALL required config at application startup.
//     If a critical variable is missing, the app crashes immediately with a clear
//     error message. Without fail-fast, you'd discover the missing variable hours
//     later when a specific code path is executed — much harder to debug.
//
// Q5: What is the 12-Factor App methodology regarding config?
// A:  Factor III (Config): Store config in environment variables.
//     Config should be strictly separated from code. The same codebase should
//     deploy to any environment without code changes. Only env vars change.
