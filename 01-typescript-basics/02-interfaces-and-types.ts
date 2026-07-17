/**
 * MODULE 1: TypeScript Basics
 * FILE 2: Interfaces and Type Aliases
 * 
 * ==========================================
 * WHAT ARE INTERFACES AND TYPE ALIASES?
 * ==========================================
 * When building APIs, we handle complex data structures (like Users, Orders, and Products).
 * Instead of writing inline objects everywhere, we define custom "shapes" or blueprints.
 * 
 * We have two primary ways to create custom blueprints:
 *   1. Interface: Mainly used to describe the shape of an Object.
 *   2. Type Alias: Can describe objects, but is also used for union types, custom primitives, etc.
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: A Job Contract
 * ==========================================
 * Think of an Interface as a job description. 
 * If a job description says: "You must know how to type, and you must speak English."
 * Anyone who applies for the job MUST satisfy those two rules.
 * 
 * In TS, if a function says: "I require a parameter that satisfies the User interface,"
 * the object you pass MUST contain the matching fields. This is called "Structural Typing".
 */

export { };

// ============================================================================
// 1. INTERFACES (Object blueprints)
// ============================================================================

interface User {
  id: number;
  username: string;
  email: string;
  // Optional property (notice the '?'): This property is allowed to be missing or undefined!
  phoneNumber?: string;
  // Readonly property: Once set, it CANNOT be modified.
  readonly registeredAt: Date;
}

// Creating a variable that matches the User interface:
const newUser: User = {
  id: 101,
  username: "john_doe",
  email: "john@example.com",
  // phoneNumber is omitted here, which is perfectly fine because it's optional!
  registeredAt: new Date(),
};

// newUser.registeredAt = new Date(); // ❌ ERROR: Cannot assign to 'registeredAt' because it is a read-only property.

// ============================================================================
// 2. TYPE ALIASES (Flexible Aliases)
// ============================================================================

// Type Aliases can describe objects just like Interfaces:
type Coordinates = {
  latitude: number;
  longitude: number;
};

// BUT, Types can also do special things that Interfaces cannot.
// Union Types (A value can be A OR B OR C):
type DatabaseStatus = "connected" | "disconnected" | "connecting" | "error";

let currentStatus: DatabaseStatus = "connected";
// currentStatus = "offline"; // ❌ ERROR: Type '"offline"' is not assignable to type 'DatabaseStatus'.

// Typing functions:
type CalculateTax = (amount: number, rate: number) => number;
const salesTaxCalculator: CalculateTax = (amount, rate) => amount * rate;

// ============================================================================
// INTERFACE VS TYPE: WHICH ONE SHOULD YOU USE?
// ============================================================================
// - Use INTERFACE for general object definitions and when you plan to extend them (using 'extends').
// - Use TYPE for complex combinations, like unions, intersections, or primitives.
// In modern TS, they perform similarly, but Interfaces are generally preferred for public APIs.

// ============================================================================
// 2.5 INTERFACE INHERITANCE (extends) & INTERSECTION TYPES (&)
// ============================================================================

// --- Interface Extends ---
// An interface can inherit all properties from another interface using 'extends'.
// Think of it like: "An Employee has everything a Person has, PLUS extra fields."
interface Person {
  name: string;
  age: number;
}

interface EmployeeExtended extends Person {
  employeeId: string;
  department: string;
}
// EmployeeExtended now has: name, age, employeeId, department.

// --- Intersection Types (&) ---
// Types can be combined using '&'. The result has ALL properties from BOTH types.
type HasTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type AuditedEmployee = EmployeeExtended & HasTimestamps;
// AuditedEmployee has: name, age, employeeId, department, createdAt, updatedAt.

// ============================================================================
// 3. PRACTICE EXERCISE: Order Processing System
// ============================================================================
// Complete the interfaces and functions below.

// Step 1: Define a 'Product' interface.
// It should have:
//   - id (number)
//   - name (string)
//   - price (number)
//   - discountCode (string, optional)
interface Product {
  id: number;
  name: string;
  price: number;
  discountCode?: string;
  // TODO: Add fields here
}

// Step 2: Define a union type 'PaymentStatus' that can ONLY be:
//   - "pending"
//   - "completed"
//   - "failed"
type PaymentStatus = "pending" | "completed" | "failed"; // TODO: Replace 'any' with a union of the three strings

// Step 3: Define an 'Order' interface.
// It should have:
//   - orderId (string)
//   - items (an array of Product objects. Hint: Product[])
//   - status (PaymentStatus)
interface Order {
  // TODO: Add fields here
  orderID: string;
  items: Product[];
  status: PaymentStatus

}

/**
 * Step 4: Write a function that calculates the total amount of an Order.
 * If a Product has a 'discountCode' equal to "SAVE10", subtract 10% off the price of THAT product.
 * Otherwise, use the standard product price.
 */
function calculateOrderTotal(order: Order): number {

  // TODO: Implement the calculation logic.
  let total = 0;
  for (let i = 0; i < order.items.length; i++) {
    if (order.items[i].discountCode === 'SAVE10') {
      total += order.items[i].price * 0.9
    }
    else {
      total += order.items[i].price
    }
  }
  return total;
}


// ============================================================================
// 4. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run using: npx ts-node 01-typescript-basics/02-interfaces-and-types.ts

console.log("\n=== Checking your solutions... ===");

try {
  const p1: Product = { id: 1, name: "Database Course", price: 100 };
  const p2: Product = { id: 2, name: "TypeScript Ebook", price: 50, discountCode: "SAVE10" };
  const p3: Product = { id: 3, name: "DevOps BootCamp", price: 200, discountCode: "WELCOME" };

  const testOrder: Order = {
    orderId: "ORD-9992",
    items: [p1, p2, p3],
    status: "completed"
  };

  const total = calculateOrderTotal(testOrder);
  // Calculation:
  // p1: 100
  // p2: 50 - 10% = 45 (SAVE10 discount applied)
  // p3: 200 (discountCode is WELCOME, not SAVE10, so no discount)
  // Expected Total: 100 + 45 + 200 = 345

  if (total === 345) {
    console.log("✅ calculateOrderTotal: Passed!");
    console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 1, File 2!");
  } else {
    console.log(`❌ calculateOrderTotal: Failed. Expected total 345, but got ${total}`);
  }

} catch (err) {
  console.log("❌ An error occurred during validation. Ensure your interfaces match the specifications.", err);
}


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What is the difference between 'interface' and 'type' in TypeScript?
// A:  Both can describe object shapes. Key differences:
//     - Interfaces support 'extends' (inheritance) and declaration merging
//       (defining the same interface twice auto-merges them).
//     - Types support unions (A | B), intersections (A & B), and primitive aliases.
//     Rule of thumb: Use 'interface' for objects/classes, 'type' for everything else.
//
// Q2: What is "structural typing" (a.k.a. "duck typing")?
// A:  TypeScript doesn't care about the NAME of a type — only its SHAPE.
//     If an object has all the required properties of an interface, it satisfies
//     that interface, even if it was never explicitly declared to implement it.
//     "If it walks like a duck and quacks like a duck, it's a duck."
//
// Q3: What is declaration merging? Give an example.
// A:  If you declare the same interface name twice, TS merges them:
//       interface Config { host: string; }
//       interface Config { port: number; }
//     Result: Config has both 'host' and 'port'. This does NOT work with 'type'.
//
// Q4: What is an intersection type? How is it different from extends?
// A:  Intersection (&) combines multiple types into one: type C = A & B;
//     C has all properties of both A and B. 'extends' achieves similar results
//     for interfaces but with inheritance semantics. Intersections work with
//     type aliases, extends works with interfaces.
//
// Q5: What is the 'readonly' modifier? Where would you use it?
// A:  'readonly' prevents a property from being reassigned after initialization.
//     Use it for IDs, creation timestamps, or configuration values that should
//     never change once set. Example: readonly id: string;
//
// Q6: What happens if you add extra properties to an object literal?
// A:  TypeScript performs "excess property checking" on object literals.
//     If you assign { name: "A", typo: 1 } to a variable typed as { name: string },
//     TS errors on 'typo'. But if you assign via a variable, the check is bypassed.
//
// Q7: What is a "discriminated union"? (Preview — covered in detail in File 07)
// A:  A union type where each member has a common literal property (the "discriminant"):
//       type Shape = { kind: "circle"; radius: number } | { kind: "square"; side: number };
//     The 'kind' field lets TypeScript narrow the type in switch/if statements.
