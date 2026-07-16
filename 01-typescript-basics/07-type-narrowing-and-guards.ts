/**
 * MODULE 1: TypeScript Basics
 * FILE 7: Type Narrowing, Type Guards, Discriminated Unions & as const
 * 
 * ==========================================
 * WHAT IS TYPE NARROWING?
 * ==========================================
 * TypeScript starts with a broad type (e.g., string | number) and narrows it 
 * to a more specific type inside conditional blocks. This is called "narrowing."
 * 
 * For example, if you have a variable typed as `string | number`, TypeScript 
 * doesn't know which one it is. But inside `if (typeof x === "string")`, 
 * TS knows x is definitely a string — the type has been "narrowed."
 * 
 * This is one of the MOST frequently asked topics in TypeScript interviews.
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: Airport Security ID Check
 * ==========================================
 * At airport security, you show your ID. The guard needs to handle different 
 * ID types: passport, driver's license, military ID. Each has different fields.
 * The guard checks "which type of ID is this?" before reading the specific fields.
 * That's exactly what type narrowing does in code.
 */

export {};

// ============================================================================
// 1. BUILT-IN NARROWING TECHNIQUES
// ============================================================================

// --- typeof narrowing (for primitives) ---
function formatValue(input: string | number): string {
  if (typeof input === "string") {
    // TS knows: input is 'string' here
    return input.toUpperCase(); // .toUpperCase() is safe to call!
  } else {
    // TS knows: input is 'number' here
    return input.toFixed(2); // .toFixed() is safe to call!
  }
}

console.log(formatValue("hello"));  // "HELLO"
console.log(formatValue(3.14159)); // "3.14"

// --- instanceof narrowing (for class instances) ---
class ApiError {
  constructor(public statusCode: number, public message: string) {}
}

class NetworkError {
  constructor(public url: string, public timeout: number) {}
}

function handleError(error: ApiError | NetworkError): string {
  if (error instanceof ApiError) {
    // TS knows: error is ApiError here
    return `API Error ${error.statusCode}: ${error.message}`;
  } else {
    // TS knows: error is NetworkError here
    return `Network timeout after ${error.timeout}ms calling ${error.url}`;
  }
}

// --- "in" operator narrowing (for object properties) ---
interface AdminUser { role: "admin"; permissions: string[]; }
interface RegularUser { role: "user"; subscription: string; }

function getUserInfo(user: AdminUser | RegularUser): string {
  if ("permissions" in user) {
    // TS knows: user is AdminUser (only AdminUser has 'permissions')
    return `Admin with ${user.permissions.length} permissions`;
  } else {
    // TS knows: user is RegularUser
    return `User on ${user.subscription} plan`;
  }
}

// ============================================================================
// 2. DISCRIMINATED UNIONS (The Pro Pattern)
// ============================================================================
// A discriminated union is a union where each member has a common literal property
// (the "discriminant" or "tag") that uniquely identifies which member it is.
// This is THE most important pattern for modeling complex data in TypeScript backends.

interface CircleShape {
  kind: "circle";   // <-- The discriminant (literal type "circle")
  radius: number;
}

interface RectangleShape {
  kind: "rectangle"; // <-- The discriminant (literal type "rectangle")
  width: number;
  height: number;
}

interface TriangleShape {
  kind: "triangle";  // <-- The discriminant (literal type "triangle")
  base: number;
  height: number;
}

type Shape = CircleShape | RectangleShape | TriangleShape;

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // TS knows: shape is CircleShape here
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      // TS knows: shape is RectangleShape here
      return shape.width * shape.height;
    case "triangle":
      // TS knows: shape is TriangleShape here
      return 0.5 * shape.base * shape.height;
    default:
      // EXHAUSTIVE CHECK: If we add a new shape to the union but forget to 
      // handle it here, this line will cause a compile-time error!
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}

console.log(`Circle area: ${calculateArea({ kind: "circle", radius: 5 })}`);
console.log(`Rectangle area: ${calculateArea({ kind: "rectangle", width: 4, height: 6 })}`);

// ============================================================================
// 3. CUSTOM TYPE GUARD FUNCTIONS
// ============================================================================
// A type guard is a function that returns a "type predicate": `value is Type`.
// After calling it, TypeScript narrows the type in the true branch.

interface SuccessResponse {
  status: "success";
  data: any;
}

interface ErrorResponse {
  status: "error";
  error: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

// Custom type guard function:
function isSuccessResponse(response: ApiResponse): response is SuccessResponse {
  return response.status === "success";
}

function processApiResponse(response: ApiResponse): void {
  if (isSuccessResponse(response)) {
    // TS knows: response is SuccessResponse here!
    console.log(`✅ Success! Data: ${JSON.stringify(response.data)}`);
  } else {
    // TS knows: response is ErrorResponse here!
    console.log(`❌ Error: ${response.error}`);
  }
}

processApiResponse({ status: "success", data: { id: 1 } });
processApiResponse({ status: "error", error: "Not found" });

// ============================================================================
// 4. AS CONST (Immutable Literal Types)
// ============================================================================
// 'as const' makes an entire object/array deeply readonly AND infers the narrowest
// possible literal types instead of broad types.

// Without 'as const':
const configBroad = { env: "production", port: 3000 };
// Type: { env: string; port: number }  <-- Broad types, env could be any string.

// With 'as const':
const configNarrow = { env: "production", port: 3000 } as const;
// Type: { readonly env: "production"; readonly port: 3000 }  <-- Exact literal types!

// This is extremely useful for defining constant configurations, API routes, or event names.
const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"] as const;
type HttpMethod = typeof HTTP_METHODS[number]; // "GET" | "POST" | "PUT" | "DELETE"

// ============================================================================
// 5. PRACTICE EXERCISE: Payment Processing System
// ============================================================================
// Build a payment processor using discriminated unions and type guards.

// Step 1: Define three payment method interfaces with a 'type' discriminant:
//   - CreditCardPayment: type "credit_card", cardNumber (string), cvv (string)
//   - BankTransferPayment: type "bank_transfer", bankCode (string), accountNumber (string)
//   - CryptoPayment: type "crypto", walletAddress (string), network (string)

// TODO: Define the three interfaces below
interface CreditCardPayment {
  type: "credit_card";
  // TODO: Add remaining fields
}

interface BankTransferPayment {
  type: "bank_transfer";
  // TODO: Add remaining fields
}

interface CryptoPayment {
  type: "crypto";
  // TODO: Add remaining fields
}

type PaymentMethod = CreditCardPayment | BankTransferPayment | CryptoPayment;

// Step 2: Write a function that processes a payment.
// Use a switch statement on the 'type' discriminant.
// Return a string describing the payment action:
//   - "credit_card" → "Charging credit card ending in [last 4 digits of cardNumber]"
//   - "bank_transfer" → "Initiating bank transfer to account [accountNumber]"
//   - "crypto" → "Sending crypto to [walletAddress] on [network]"
function processPayment(payment: PaymentMethod): string {
  // TODO: Implement using a switch statement on payment.type
  return "";
}

// Step 3: Write a custom type guard function 'isCreditCard'
// that checks if a PaymentMethod is a CreditCardPayment.
function isCreditCard(payment: PaymentMethod): payment is CreditCardPayment {
  // TODO: Implement the type guard
  return false;
}


// ============================================================================
// 6. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run using: npx ts-node 01-typescript-basics/07-type-narrowing-and-guards.ts

console.log("\n=== Checking your solutions... ===");

try {
  const ccPayment: PaymentMethod = {
    type: "credit_card",
    cardNumber: "4111222233334444",
    cvv: "123"
  } as any;

  const btPayment: PaymentMethod = {
    type: "bank_transfer",
    bankCode: "SWIFT123",
    accountNumber: "9876543210"
  } as any;

  const cryptoPayment: PaymentMethod = {
    type: "crypto",
    walletAddress: "0xABC123DEF456",
    network: "Ethereum"
  } as any;

  const r1 = processPayment(ccPayment);
  const r2 = processPayment(btPayment);
  const r3 = processPayment(cryptoPayment);

  let processPass = false;
  if (r1.includes("4444") && r2.includes("9876543210") && r3.includes("Ethereum")) {
    console.log("✅ processPayment: All payment types handled correctly!");
    processPass = true;
  } else {
    console.log(`❌ processPayment: Failed. Results: "${r1}", "${r2}", "${r3}"`);
  }

  let guardPass = false;
  if (isCreditCard(ccPayment) === true && isCreditCard(btPayment) === false) {
    console.log("✅ isCreditCard type guard: Passed!");
    guardPass = true;
  } else {
    console.log("❌ isCreditCard type guard: Failed.");
  }

  if (processPass && guardPass) {
    console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 1, File 7!");
    console.log("You have completed ALL TypeScript Basics! Move to Module 02.");
  }

} catch (err) {
  console.log("❌ An error occurred. Make sure all interfaces have the required fields.", err);
}


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What is type narrowing? Name 3 ways to narrow types.
// A:  Narrowing is TypeScript refining a broad type to a specific one in a code branch.
//     Three ways: (1) typeof for primitives, (2) instanceof for class instances,
//     (3) "in" operator to check property existence, (4) discriminated unions (switch on tag).
//
// Q2: What is a discriminated union? Why is it useful?
// A:  A union where each member has a shared literal property (the "tag" or "discriminant").
//     TS can narrow the type based on the tag in switch/if blocks. Useful for:
//     API responses (success/error), payment types, event handling, state machines.
//
// Q3: What is a type predicate (custom type guard)?
// A:  A function return type like "value is SomeType". When the function returns true,
//     TS narrows the variable to SomeType in the calling scope.
//     Syntax: function isFish(pet: Fish | Bird): pet is Fish { ... }
//
// Q4: What does 'as const' do? When would you use it?
// A:  'as const' makes all properties readonly and infers the narrowest literal types.
//     Use it for: configuration objects, constant arrays, enum-like patterns,
//     and when you need literal types for discriminated unions or template literals.
//
// Q5: What is an exhaustive check with 'never'?
// A:  In the default case of a switch on a discriminated union, assign the value
//     to a variable of type 'never'. If all cases are covered, this compiles.
//     If you add a new member to the union and forget to handle it, TS errors.
//     This catches bugs at compile time when the union grows.
//
// Q6: "What will this output?" — typeof [] returns what?
// A:  "object". Arrays are objects in JavaScript. To check for arrays, use
//     Array.isArray(value) instead of typeof.
