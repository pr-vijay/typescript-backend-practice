/**
 * MODULE 2: Node.js Fundamentals
 * FILE 2: Asynchronous Programming Patterns
 * 
 * ==========================================
 * WHAT IS ASYNCHRONOUS PROGRAMMING IN NODE?
 * ==========================================
 * Unlike databases or multithreaded systems that launch separate threads for tasks,
 * Node.js is single-threaded. It uses an "Event Loop" to delegate long-running tasks 
 * (like reading files, querying databases, or calling external APIs) to the system kernel.
 * 
 * Because Node.js doesn't stop to wait for operations to finish, we must write code
 * that handles values arriving *in the future*.
 * 
 * There are three main patterns for async code:
 *   1. Callbacks (Old school, nesting leads to "Callback Hell")
 *   2. Promises (Cleaner, supports chaining with `.then().catch()`)
 *   3. Async/Await (Modern, looks like synchronous code, easiest to read)
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: Fast Food Order Buzzer
 * ==========================================
 * Think of ordering food at a counter:
 *   - Synchronous: You order, and stand at the register blockading the line until the chef cooks.
 *     Nobody else can order (Server freezes).
 *   - Asynchronous (Buzzer): You order, and are handed a buzzer. The line moves. You go sit down, 
 *     check messages, talk to friends. When the buzzer goes off, you retrieve the food.
 *     The buzzer is a **Promise** that resolves when the food is ready.
 */

// A mock database delay function using standard SetTimeout wrapped in a Promise.
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// 1. TYPING PROMISES IN TYPESCRIPT
// ============================================================================

interface DatabaseRecord {
  id: number;
  data: string;
}

// A function returning a Promise must declare what type of data the Promise resolves to:
// syntax: Promise<Type>
async function fetchUserRecord(userId: number): Promise<DatabaseRecord> {
  await delay(100); // Simulate network latency
  
  if (userId <= 0) {
    throw new Error("Invalid User ID"); // Rejects the promise
  }

  return { id: userId, data: "User account information" }; // Resolves the promise
}

// ============================================================================
// 2. PARALLEL VS SEQUENTIAL EXECUTION
// ============================================================================

async function runSequentialVsParallelDemo() {
  console.log("\n--- Starting Execution Demos ---");
  
  // A. Sequential: A awaits first, then B starts. Total time = Time(A) + Time(B)
  const startTimeSeq = Date.now();
  const u1 = await fetchUserRecord(1);
  const u2 = await fetchUserRecord(2);
  console.log(`[Sequential] Completed in ${Date.now() - startTimeSeq}ms`);

  // B. Parallel: Both requests start at the same time. Total time = max(Time(A), Time(B))
  const startTimePar = Date.now();
  // Promise.all takes an array of promises and resolves when ALL of them are finished.
  const [userA, userB] = await Promise.all([
    fetchUserRecord(1),
    fetchUserRecord(2)
  ]);
  console.log(`[Parallel] Completed in ${Date.now() - startTimePar}ms`);
}

runSequentialVsParallelDemo();

// ============================================================================
// 3. SAFE TRY-CATCH ERROR HANDLING IN TYPESCRIPT
// ============================================================================
// In TypeScript, errors inside `catch(error)` are default typed as 'unknown' or 'any'.
// This is because *anything* can be thrown in JavaScript. We must safely check the type.

async function safeFetchDemo() {
  try {
    await fetchUserRecord(-5); // This will fail!
  } catch (error: unknown) {
    // We check if error is an instance of the native Error class:
    if (error instanceof Error) {
      console.log(`[Error Handled Safely]: ${error.message}`);
    } else {
      console.log("An unexpected error type occurred.");
    }
  }
}

safeFetchDemo();

// ============================================================================
// 4. PRACTICE EXERCISE: Parallel API Aggregator
// ============================================================================
// Write an API aggregator that fetches a user's details, orders, and review scores
// simultaneously (in parallel), then constructs a report profile.

interface UserDetails { id: number; username: string; }
interface UserOrder { orderId: string; amount: number; }
interface ReviewScore { score: number; count: number; }

// Dummy API endpoints:
async function fetchDetails(userId: number): Promise<UserDetails> {
  await delay(80);
  return { id: userId, username: `user_${userId}` };
}

async function fetchOrders(userId: number): Promise<UserOrder[]> {
  await delay(120);
  return [
    { orderId: "TX-101", amount: 250 },
    { orderId: "TX-102", amount: 450 }
  ];
}

async function fetchReviewScores(userId: number): Promise<ReviewScore> {
  await delay(50);
  return { score: 4.8, count: 24 };
}

// The target profile report:
interface UserProfileReport {
  userId: number;
  username: string;
  totalOrdersAmount: number;
  averageReviewScore: number;
}

/**
 * Task: Implement aggregateUserProfile.
 * 1. Fetch user details, orders, and review scores IN PARALLEL using Promise.all.
 * 2. Calculate totalOrdersAmount (sum up the amounts of all orders in the list).
 * 3. Construct and return the UserProfileReport.
 * 4. Handle errors: If any API fails, catch the error safely and return a rejected Promise with message "Failed to aggregate profile".
 */
async function aggregateUserProfile(userId: number): Promise<UserProfileReport> {
  try {
    const [details, orders, reviewScores] = await Promise.all([
      fetchDetails(userId),
      fetchOrders(userId),
      fetchReviewScores(userId)
    ]);

    const totalOrdersAmount = orders.reduce((sum, order) => sum + order.amount, 0);

    return {
      userId: details.id,
      username: details.username,
      totalOrdersAmount,
      averageReviewScore: reviewScores.score
    };
  } catch (err) {
    throw new Error("Failed to aggregate profile");
  }
}


// ============================================================================
// 5. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run using: npx ts-node 02-nodejs-fundamentals/02-async-patterns.ts

console.log("\n=== Checking your solutions... ===");

setTimeout(async () => {
  try {
    const report = await aggregateUserProfile(99);

    let reportPass = false;
    if (report && report.userId === 99 && report.username === "user_99" && report.totalOrdersAmount === 700 && report.averageReviewScore === 4.8) {
      console.log("✅ aggregateUserProfile: Success! Report matches calculations.");
      reportPass = true;
    } else {
      console.log(`❌ aggregateUserProfile: Failed. Resulting object: ${JSON.stringify(report)}`);
    }

    // Test error branch
    let errorPass = false;
    // Overwrite fetchDetails temporarily to throw error
    const originalFetch = fetchDetails;
    (fetchDetails as any) = async () => { throw new Error("Database timeout!"); };

    try {
      await aggregateUserProfile(10);
    } catch (e: any) {
      if (e.message === "Failed to aggregate profile") {
        console.log("✅ aggregateUserProfile Error Handling: Passed!");
        errorPass = true;
      }
    } finally {
      // Restore original function
      (fetchDetails as any) = originalFetch;
    }

    if (reportPass && errorPass) {
      console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 2, File 2!");
    }

  } catch (err) {
    console.log("❌ An error occurred during validation.", err);
  }
}, 500);


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What is the Node.js Event Loop? Explain it simply.
// A:  Node.js is single-threaded. The event loop is a mechanism that takes 
//     pending I/O operations (file reads, network calls) and delegates them 
//     to the OS kernel. When the kernel finishes, it pushes a callback onto a 
//     queue. The event loop picks callbacks off the queue and executes them.
//     This lets Node handle thousands of concurrent connections without threads.
//
// Q2: What is the difference between Promise.all and Promise.allSettled?
// A:  Promise.all: Resolves when ALL promises succeed. If ANY one rejects,
//     the entire call rejects immediately (fail-fast behavior).
//     Promise.allSettled: Waits for ALL promises to finish (both resolved AND 
//     rejected). Returns an array of { status, value/reason } objects.
//     Use allSettled when you need results from ALL calls regardless of failures.
//
// Q3: What is Promise.race? Give a real-world use case.
// A:  Promise.race resolves/rejects as soon as the FIRST promise settles.
//     Real use: Implementing request timeouts:
//     Promise.race([fetchData(), delay(5000).then(() => { throw new Error("Timeout") })])
//
// Q4: Why should you type errors as 'unknown' in catch blocks?
// A:  In JavaScript, ANYTHING can be thrown (strings, numbers, objects, not just Error).
//     TypeScript defaults catch errors to 'unknown' in strict mode.
//     You must narrow with 'instanceof Error' before accessing .message or .stack.
//
// Q5: What is "callback hell" and how does async/await solve it?
// A:  Callback hell is deeply nested callbacks that form a pyramid shape,
//     making code unreadable. async/await flattens this into sequential-looking 
//     code while still being non-blocking under the hood.
//
// Q6: What happens if you forget to 'await' a Promise?
// A:  The function continues executing without waiting for the result.
//     The variable holds a Promise object instead of the resolved value.
//     Errors inside the promise become "unhandled promise rejections."
