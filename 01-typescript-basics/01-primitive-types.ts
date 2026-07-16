/**
 * MODULE 1: TypeScript Basics
 * FILE 1: Primitive Types
 * 
 * ==========================================
 * WHAT IS TYPESCRIPT AND WHY DO WE NEED IT?
 * ==========================================
 * In standard JavaScript, variables can hold any value (numbers, strings, objects).
 * This flexibility is nice, but it leads to classic bugs:
 *   - You think a variable is a number, but it's actually a string: "5" + 5 = "55" instead of 10.
 *   - You spell a property wrong: user.emial instead of user.email. It fails silently at runtime!
 * 
 * TypeScript (TS) is a "strongly-typed wrapper" around JavaScript (JS). It forces you to define
 * the "types" of your variables beforehand. If you do something wrong, it highlights it immediately
 * in your editor BEFORE you even run the code.
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: Electrical Outlets
 * ==========================================
 * Think of types as electrical outlets. A 3-prong plug (Type B) will only fit into a 3-prong socket.
 * If you try to force a different plug shape, it won't fit.
 * Similarly, if a function expects a "number" (socket), TS won't let you pass a "string" (wrong plug).
 */

export {};

// ============================================================================
// 1. PRIMITIVE TYPES EXPLAINED
// ============================================================================

// --- String (Text) ---
// Syntax: let variableName: type = value;
let developerName: string = "Alice"; 
// developerName = 42; // ❌ UNCOMMENTING THIS WILL CAUSE AN ERROR! TS knows developerName must be a string.

// --- Number (All numbers: integers, decimals, negatives) ---
let serverPort: number = 8080;
let averageResponseTime: number = 24.5;

// --- Boolean (True or False) ---
let isServerOnline: boolean = true;

// --- Any (The Escape Hatch) ---
// 'any' tells TypeScript to turn off all type checks for this variable.
// ⚠️ WARNING: Avoid using 'any' in production! It defeats the purpose of TypeScript.
let mysteryBox: any = "Started as a string";
mysteryBox = 42;          // Allowed
mysteryBox = { key: 1 };  // Allowed

// --- Unknown (The Safe 'Any') ---
// 'unknown' also allows any value, but TS will NOT let you use it until you prove what it is
// via type-checking (called "narrowing"). This is much safer than 'any'.
let secureMysteryBox: unknown = "I might be a string";
// let lengthOfText: number = secureMysteryBox.length; // ❌ ERROR: TS doesn't know it has a '.length' yet.

if (typeof secureMysteryBox === "string") {
  // Inside this block, TS is smart. It knows secureMysteryBox is definitely a string!
  let lengthOfText: number = secureMysteryBox.length; // ✅ ALLOWED!
  console.log(`Character count: ${lengthOfText}`);
}

// --- Void (Nothingness) ---
// 'void' is used to specify that a function does not return any value.
function logConnectionStatus(message: string): void {
  console.log(`[STATUS]: ${message}`);
  // No return statement here!
}

// --- Null & Undefined ---
// In TypeScript with strictNullChecks enabled (our tsconfig has this ON),
// null and undefined are their own distinct types.
// 'null' means: "I know this value intentionally has no value" (explicit absence).
// 'undefined' means: "This value hasn't been assigned yet" (implicit absence).
let userAvatar: string | null = null; // User hasn't uploaded a photo yet.
let uninitializedVar: string | undefined; // Declared but never assigned a value.

// --- Never ---
// 'never' represents values that NEVER occur. Two key use cases:
// 1. A function that throws an error (it never successfully returns).
// 2. Exhaustive checks in switch/if-else chains (the "impossible" branch).
function throwCriticalError(message: string): never {
  throw new Error(`FATAL: ${message}`);
  // No code after this line can ever execute, so the return type is 'never'.
}

// --- Bigint (Large Numbers) & Symbol (Unique Identifiers) ---
// bigint: For numbers larger than Number.MAX_SAFE_INTEGER (9007199254740991).
// Used in financial calculations, cryptography, or database IDs.
// const hugeNumber: bigint = 9007199254740991n; // The 'n' suffix makes it a bigint.

// symbol: Creates a globally unique identifier. Used as object property keys.
// const uniqueKey: symbol = Symbol("myKey");

// ============================================================================
// 2. PRACTICE EXERCISE: Build a Temperature Converter Utility
// ============================================================================
// Fill out the functions below and assign appropriate types to variables.

/**
 * Prompt: 
 * We are building a Weather Monitor service.
 * Complete the function below to convert Fahrenheit to Celsius.
 * 
 * Formula: (Fahrenheit - 32) * 5/9
 */
function convertFahrenheitToCelsius(fahrenheit: number): number {
  // TODO: Implement the conversion logic and return a number.
  // Replace the return statement below with your formula.
  return (fahrenheit - 32) * 5 / 9; 
}

/**
 * Prompt:
 * Create a function that formats the weather status message.
 * It should accept:
 *   - city (string)
 *   - temperatureCelsius (number)
 *   - isRaining (boolean)
 * 
 * It should return a string like:
 * "The weather in New York is 22°C. Bring an umbrella!" (if isRaining is true)
 * "The weather in London is 18°C. Enjoy the sun!" (if isRaining is false)
 */
function formatWeatherReport(city: string, temperatureCelsius: number, isRaining: boolean): string {
  if (isRaining) {
    return `The weather in ${city} is ${temperatureCelsius}°C. Bring an umbrella!`;
  } else {
    return `The weather in ${city} is ${temperatureCelsius}°C. Enjoy the sun!`;
  }
}


// ============================================================================
// 3. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run this file in your terminal using: npx ts-node 01-typescript-basics/01-primitive-types.ts
// Use this to check if your solutions are correct.

console.log("\n=== Checking your solutions... ===");

try {
  // Test conversion
  const c1 = convertFahrenheitToCelsius(32);
  const c2 = convertFahrenheitToCelsius(68);
  const c3 = convertFahrenheitToCelsius(104);

  let conversionPass = false;
  if (c1 === 0 && c2 === 20 && c3 === 40) {
    console.log("✅ convertFahrenheitToCelsius: Passed!");
    conversionPass = true;
  } else {
    console.log(`❌ convertFahrenheitToCelsius: Failed. Expected convert(32)=0, got ${c1}; convert(68)=20, got ${c2}`);
  }

  // Test message formatter
  const m1 = formatWeatherReport("Paris", 15, true);
  const m2 = formatWeatherReport("Tokyo", 25, false);

  let formatPass = false;
  if (m1.includes("Paris") && m1.includes("Bring an umbrella") && m2.includes("Tokyo") && m2.includes("Enjoy the sun")) {
    console.log("✅ formatWeatherReport: Passed!");
    formatPass = true;
  } else {
    console.log("❌ formatWeatherReport: Failed. Check your logic and messages.");
  }

  if (conversionPass && formatPass) {
    console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 1, File 1!");
  } else {
    console.log("\n💡 Keep trying! Modify the methods above and run the file again.");
  }

} catch (err) {
  console.log("❌ An error occurred during validation:", err);
}


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What is the difference between 'any' and 'unknown'?
// A:  'any' completely disables type checking — you can call any method on it.
//     'unknown' is the type-safe counterpart: it accepts any value BUT forces
//     you to narrow the type (using typeof, instanceof, etc.) before using it.
//     In interviews, always say: "I prefer 'unknown' over 'any' because it 
//     preserves type safety."
//
// Q2: What is the difference between 'null' and 'undefined'?
// A:  'undefined' means a variable has been declared but not yet assigned a value.
//     'null' is an intentional assignment meaning "no value." In practice:
//     - Function parameters default to 'undefined' if not provided.
//     - Database queries return 'null' when no record is found.
//
// Q3: When would you use the 'never' type?
// A:  Two cases: (1) Functions that always throw errors (they never return).
//     (2) Exhaustive switch/if-else checks where the remaining branch is 
//     impossible — assigning the value to 'never' catches missed cases at compile time.
//
// Q4: What is the output of: console.log(typeof null)?
// A:  "object". This is a famous JavaScript bug from the original implementation.
//     Even though null is NOT an object, typeof null returns "object".
//     This is why we use === null explicitly, never typeof for null checks.
//
// Q5: What does 'void' mean? Is it the same as 'undefined'?
// A:  'void' means a function does not return a meaningful value.
//     Technically, a void function returns 'undefined' at runtime, but the TS 
//     type system treats 'void' and 'undefined' differently: you should NOT 
//     use the return value of a void function.
//
// Q6: "What will this output?" — let x: string = "5"; console.log(x + 10);
// A:  "510" (string concatenation, not numeric addition). TypeScript would have 
//     caught this if x were typed as 'number'.
//
// Q7: Can you assign 'null' to a variable typed as 'string' in strict mode?
// A:  No. With strictNullChecks enabled, 'null' is NOT assignable to 'string'.
//     You must explicitly allow it: 'string | null'.
//
// Q8: What is the difference between 'let' and 'const' in TypeScript type inference?
// A:  'let x = "hello"' infers type 'string' (mutable, can be reassigned).
//     'const x = "hello"' infers the literal type '"hello"' (immutable).
//     This is called "literal narrowing" and is important for discriminated unions.
