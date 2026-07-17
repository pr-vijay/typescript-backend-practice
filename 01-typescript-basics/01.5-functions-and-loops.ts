/**
 * MODULE 1: TypeScript Basics
 * FILE 1.5: Functions and Loops
 * 
 * ==========================================
 * FUNCTIONS IN TYPESCRIPT
 * ==========================================
 * TypeScript makes JavaScript functions much safer by letting you define:
 *   - The types of the parameters (inputs).
 *   - The type of the return value (output).
 * 
 * Syntax:
 * function functionName(param1: type1, param2: type2): returnType {
 *   return value;
 * }
 * 
 * You can also define optional parameters using '?', default parameter values,
 * and rest parameters using the spread operator '...'.
 * 
 * ==========================================
 * ARROW FUNCTIONS
 * ==========================================
 * Arrow functions (introduced in ES6) are highly popular in JavaScript and TypeScript.
 * They offer a shorter syntax and preserve the lexical scope of `this` (they don't bind their own `this`).
 * 
 * In TypeScript, they are typed by adding parameter and return types:
 *   const myFunction = (param: type): returnType => { ... }
 * 
 * Implicit Return: If the function body consists of a single expression, you can omit
 * the curly braces and the `return` keyword. TypeScript still infers/checks the return type:
 *   const double = (n: number): number => n * 2;
 * 
 * Function Type Aliases: You can define the structure of a function separately as a type:
 *   type CallbackType = (success: boolean) => void;
 *   const handleCompletion: CallbackType = (success) => { ... };
 * 
 * ==========================================
 * LOOPS IN TYPESCRIPT
 * ==========================================
 * Loops (for, while, for...of, for...in) behave exactly as they do in JavaScript.
 * However, TypeScript provides auto-inference for elements during iteration.
 * For example, if you iterate over a `string[]` array using `for...of`, TypeScript
 * knows that the iterated element is a `string`.
 */

export { };

// ============================================================================
// 1. FUNCTIONS EXAMPLES
// ============================================================================

// Optional parameter (isAdmin) and default parameter (greeting)
function greetUser(name: string, isAdmin?: boolean, greeting: string = "Hello"): string {
  const role = isAdmin ? " (Admin)" : "";
  return `${greeting}, ${name}${role}!`;
}

// Arrow function with standard syntax and type annotations
const multiply = (a: number, b: number): number => {
  return a * b;
};

// Arrow function with implicit return (no curly braces, no 'return' keyword)
const double = (n: number): number => n * 2;

// Function Type Signature / Alias
type MathOperation = (x: number, y: number) => number;

// Implementing the function signature
const subtract: MathOperation = (x, y) => x - y; // Types for x and y are inferred from MathOperation!

// Rest parameters
function sumNumbers(...nums: number[]): number {
  return nums.reduce((sum, n) => sum + n, 0);
}

// ============================================================================
// 2. LOOPS EXAMPLES
// ============================================================================

const languages: string[] = ["TypeScript", "JavaScript", "Python"];

// for...of loop (Best for arrays)
for (const lang of languages) {
  // TS automatically infers that 'lang' is a string
  console.log(`I love coding in ${lang.toUpperCase()}`);
}

// ============================================================================
// 3. PRACTICE EXERCISES
// ============================================================================

/**
 * Exercise 1: Calculate Factorial
 * Create a function `calculateFactorial` that takes a number and calculates its factorial.
 * Use a standard loop (like a `for` or `while` loop) to perform the calculation.
 * 
 * Example: calculateFactorial(5) should return 120 (5 * 4 * 3 * 2 * 1)
 * Expected types:
 *   - Input: number
 *   - Output: number
 */
function calculateFactorial(n: number): number {
  let facto: number = 1;
  for (let i = 1; i <= n; i++) {
    facto = facto * i;
  }
  return facto;
}

/**
 * Exercise 2: Find Longest Word
 * Create a function `findLongestWord` that takes an array of strings and returns the longest string.
 * Use a `for...of` loop to iterate through the array.
 * If the array is empty, return an empty string "".
 * 
 * Example: findLongestWord(["cat", "elephant", "dog"]) should return "elephant"
 * Expected types:
 *   - Input: string[]
 *   - Output: string
 */
function findLongestWord(words: string[]): string {
  // TODO: Implement the logic to find the longest word using a loop.
  let maxlen: string = "";
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > maxlen.length) {
      maxlen = words[i];
    }
  }
  return maxlen;
}


// ============================================================================
// 4. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// Run this file in your terminal using: npx ts-node 01-typescript-basics/01.5-functions-and-loops.ts

console.log("\n=== Checking your solutions... ===");

try {
  // Test Exercise 1: Factorial
  const fact0 = calculateFactorial(0);
  const fact5 = calculateFactorial(5);
  const fact6 = calculateFactorial(6);

  let factPass = false;
  if (fact0 === 1 && fact5 === 120 && fact6 === 720) {
    console.log("✅ calculateFactorial: Passed!");
    factPass = true;
  } else {
    console.log(`❌ calculateFactorial: Failed. Expected calculate(0)=1, got ${fact0}; calculate(5)=120, got ${fact5}`);
  }

  // Test Exercise 2: Longest Word
  const longest1 = findLongestWord(["apple", "banana", "watermelon", "pear"]);
  const longest2 = findLongestWord(["a", "bc", "def"]);
  const longestEmpty = findLongestWord([]);

  let longestPass = false;
  if (longest1 === "watermelon" && longest2 === "def" && longestEmpty === "") {
    console.log("✅ findLongestWord: Passed!");
    longestPass = true;
  } else {
    console.log(`❌ findLongestWord: Failed. Expected "watermelon", got "${longest1}"; Expected "", got "${longestEmpty}"`);
  }

  if (factPass && longestPass) {
    console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 1, File 1.5!");
  } else {
    console.log("\n💡 Keep trying! Modify the methods above and run the file again.");
  }

} catch (err) {
  console.log("❌ An error occurred during validation:", err);
}
