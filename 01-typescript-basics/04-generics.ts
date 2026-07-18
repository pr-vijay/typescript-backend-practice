/**
 * MODULE 1: TypeScript Basics
 * FILE 4: Generics
 * 
 * ==========================================
 * WHAT ARE GENERICS?
 * ==========================================
 * Generics allow us to write reusable, type-safe functions, classes, or interfaces 
 * that work with different types, without resorting to using the unsafe 'any' type.
 * 
 * Instead of writing one function for numbers and another for strings:
 *   - function identityNumber(val: number): number
 *   - function identityString(val: string): string
 * 
 * We use a type parameter (typically `<T>` which stands for "Type") that acts as a placeholder.
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: A Shipping Box
 * ==========================================
 * Think of a cardboard shipping box. The box itself is a generic container.
 * You can put books in it, or electronics, or clothes. 
 * But once you label the box "Electronics Box" (T = Electronics), anyone opening
 * it knows it contains electronics and treats it accordingly.
 */

export {};

// ============================================================================
// 1. GENERIC FUNCTIONS EXPLAINED
// ============================================================================

// The <T> declares this is a generic function. 
// It accepts a value of type T, and returns a value of type T.
function getFirstItem<T>(arr: T[]): T {
  return arr[0];
}

// When calling the function, we can specify the type explicitly:
const firstNumber = getFirstItem<number>([10, 20, 30]); // firstNumber is of type: number
const firstString = getFirstItem<string>(["hello", "world"]); // firstString is of type: string

// TypeScript is also smart enough to "infer" (guess) the type automatically:
const autoNumber = getFirstItem([100, 200]); // TS automatically knows T = number!

// ============================================================================
// 2. GENERIC INTERFACES (API Envelopes)
// ============================================================================
// In backend dev, API response envelopes are the classic use case for generics.
// The structure is always the same, but the 'data' payload changes.

interface ApiResponse<DataPayload> {
  status: "success" | "error";
  message: string;
  data: DataPayload; // The type is defined when the interface is used.
}

interface UserProfile {
  id: number;
  name: string;
}

// Now we can reuse ApiResponse for users, products, etc.
const userResponse: ApiResponse<UserProfile> = {
  status: "success",
  message: "User profile retrieved",
  data: { id: 45, name: "Charlie" },
};

// ============================================================================
// 2.5 GENERIC CONSTRAINTS (extends keyword)
// ============================================================================
// Sometimes we want a generic to accept only types that have specific properties.
// We use 'extends' to constrain what T can be.

interface HasId {
  id: number;
}

// T must be an object that has at least an 'id' property (number).
function findById<T extends HasId>(items: T[], targetId: number): T | undefined {
  return items.find(item => item.id === targetId);
}

// This works: UserProfile has 'id'
const foundUser = findById([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }], 2);
// findById(["a", "b"], 1); // ❌ ERROR: 'string' does not satisfy constraint 'HasId'.

// ============================================================================
// 3. PRACTICE EXERCISE: Local Data Repository Cache
// ============================================================================
// In backend engineering, we often build memory caches to save database trips.
// Let's build a Generic Cache class that stores key-value pairs of any object.

class DataCache<T> {
  // A private object map where keys are strings, and values are of type T.
  private cache: Record<string, T> = {};

  /**
   * Save an item in the cache.
   * Key: string
   * Value: T
   */
  public set(key: string, value: T): void {
    // TODO: Store value in the cache object under the given key.
    this.cache[key] = value;
  }

  /**
   * Retrieve an item from the cache.
   * It should return the value of type T, or undefined if the key is not found.
   */
  public get(key: string): T | undefined {
    // TODO: Retrieve and return the value for key.
    return this.cache[key];
  }

  /**
   * Delete an item from the cache.
   */
  public delete(key: string): void {
    // TODO: Remove the item from cache.
    delete this.cache[key];
  }
}

// ============================================================================
// 4. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run using: npx ts-node 01-typescript-basics/04-generics.ts

console.log("\n=== Checking your solutions... ===");

try {
  interface Book {
    title: string;
    author: string;
  }

  // Create a Cache explicitly for Books
  const bookCache = new DataCache<Book>();

  bookCache.set("b1", { title: "Clean Code", author: "Robert Martin" });
  bookCache.set("b2", { title: "Design Patterns", author: "Gang of Four" });

  const book1 = bookCache.get("b1");
  const book2 = bookCache.get("b2");

  let setGetPass = false;
  if (book1 && book1.title === "Clean Code" && book2 && book2.author === "Gang of Four") {
    console.log("✅ DataCache - Get & Set: Passed!");
    setGetPass = true;
  } else {
    console.log("❌ DataCache - Get & Set: Failed. Check your get() or set() implementation.");
  }

  // Test Delete
  bookCache.delete("b1");
  const deletedBook = bookCache.get("b1");

  let deletePass = false;
  if (deletedBook === undefined) {
    console.log("✅ DataCache - Delete: Passed!");
    deletePass = true;
  } else {
    console.log("❌ DataCache - Delete: Failed. The item was not deleted.");
  }

  if (setGetPass && deletePass) {
    console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 1, File 4!");
  }

} catch (err) {
  console.log("❌ An error occurred during validation.", err);
}


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What are Generics and why are they useful?
// A:  Generics let you write functions, classes, or interfaces that work with 
//     multiple types while preserving type safety. Without generics, you'd either
//     write duplicate functions for each type or use 'any' (losing type safety).
//
// Q2: What does <T extends SomeType> mean?
// A:  It constrains the generic — T can only be a type that has at least the 
//     properties of SomeType. This prevents passing incompatible types while
//     still being flexible for any type that satisfies the constraint.
//
// Q3: What is the difference between <T> and <T extends object>?
// A:  <T> accepts ANY type including primitives (string, number, boolean).
//     <T extends object> restricts T to only object types (no primitives).
//
// Q4: Can you have multiple generic type parameters?
// A:  Yes! Example: function pair<K, V>(key: K, value: V): [K, V]
//     Common naming conventions: T (Type), K (Key), V (Value), E (Element).
//
// Q5: What is the "generic identity function" pattern?
// A:  function identity<T>(arg: T): T { return arg; }
//     It returns exactly what it receives. This is the simplest generic example
//     and is frequently asked in interviews to test if you understand generics.
//
// Q6: How are generics different from union types?
// A:  Union types (string | number) allow multiple types but lose specificity.
//     Generics PRESERVE the specific type passed in. If you call identity<string>("hi"),
//     the return type is specifically 'string', not 'string | number'.
