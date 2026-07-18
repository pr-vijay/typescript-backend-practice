/**
 * MODULE 2: Node.js Fundamentals
 * FILE 3: EventEmitters and Streams
 * 
 * ==========================================
 * WHAT ARE EVENTEMITTERS AND STREAMS?
 * ==========================================
 * 1. EventEmitters: Node.js is an event-driven platform. 
 *    Many core objects (like HTTP servers) inherit from `EventEmitter`. 
 *    They broadcast named "signals" (events), and other parts of the code listen for them.
 * 
 * 2. Streams: In vanilla Node.js, if you read a 1GB file into memory using `fs.readFile`,
 *    your server has to load all 1GB of data into RAM. If 10 users do this at the same time,
 *    your server crashes due to Out-Of-Memory!
 *    Streams solve this by processing data in small, manageable pieces called **chunks** (e.g., 64KB).
 * 
 * ==========================================
 * REAL-LIFE ANALOGY:
 * ==========================================
 * - EventEmitter: A radio station. The host broadcasts (emits) music. 
 *   Listeners who are tuned in (listening) can dance, sing, or record the music.
 * - Streams: A water pipe vs. a bucket of water.
 *   - Reading a file fully (fs.readFile) is carrying the whole bucket. It can get too heavy to hold.
 *   - Streaming is opening a water pipe. The water flows continuously in tiny drops, 
 *     meaning you never have to support the weight of the entire volume at once.
 */

import { EventEmitter } from "events";
import * as fs from "fs";
import * as path from "path";

// ============================================================================
// 1. EVENT EMITTER EXPLAINED
// ============================================================================

// Creating a custom order manager that emits notifications
class OrderProcessor extends EventEmitter {
  public placeOrder(orderId: string, amount: number) {
    console.log(`[OrderProcessor]: Placing order ${orderId} of $${amount}...`);
    
    // Perform processing...
    
    // Broadcast the "orderCompleted" event, passing order details
    this.emit("orderCompleted", orderId, amount);
  }
}

const processor = new OrderProcessor();

// Listen to the event:
processor.on("orderCompleted", (id: string, total: number) => {
  console.log(`[Notification Service]: Confirmation email sent for order ${id} ($${total})`);
});

// Run execution:
processor.placeOrder("ORD-001", 120);

// ============================================================================
// 2. STREAMS EXPLAINED
// ============================================================================

async function streamDemo() {
  const sourceFile = path.join(__dirname, "large_source.txt");
  
  // Write a temp file first for the demo
  fs.writeFileSync(sourceFile, "chunk1_data_aaaaaa_chunk2_data_bbbbbb_chunk3_data_cccccc");

  // Create a Read Stream. It reads the file in chunks.
  // highWaterMark is the max chunk size (we set it to 15 bytes to force chunk separation)
  const readStream = fs.createReadStream(sourceFile, { encoding: "utf-8", highWaterMark: 15 });

  console.log("\n--- Starting Stream Read ---");
  readStream.on("data", (chunk) => {
    console.log(`[Stream Chunker]: Received packet: "${chunk}"`);
  });

  readStream.on("end", () => {
    console.log("🏁 Stream completely read.");
    // Cleanup
    fs.unlinkSync(sourceFile);
  });
}

streamDemo();

// ============================================================================
// 3. PRACTICE EXERCISE: Analytics Event Tracker
// ============================================================================
// Build a system that tracks user actions (like 'click', 'purchase', 'logout').
// We will create an 'AnalyticsTracker' that emits events, and multiple services
// that listen to those events.

class AnalyticsTracker extends EventEmitter {
  /**
   * Triggers an action event.
   * eventName: string (e.g. 'click', 'purchase')
   * metadata: object containing extra details
   */
  public trackEvent(eventName: string, metadata: Record<string, any>): void {
    // TODO: Emit the event using this.emit, passing metadata as the event argument.
    this.emit(eventName, metadata);
  }
}

// ============================================================================
// 4. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run using: npx ts-node 02-nodejs-fundamentals/03-events-and-streams.ts

console.log("\n=== Checking your solutions... ===");

setTimeout(() => {
  try {
    const analytics = new AnalyticsTracker();

    let clickHandled = false;
    let purchaseHandled = false;

    // Listener 1: Click events
    analytics.on("click", (data) => {
      if (data && data.buttonId === "checkout_btn") {
        clickHandled = true;
      }
    });

    // Listener 2: Purchase events
    analytics.on("purchase", (data) => {
      if (data && data.amount === 99.99) {
        purchaseHandled = true;
      }
    });

    // Trigger events
    analytics.trackEvent("click", { buttonId: "checkout_btn", page: "cart" });
    analytics.trackEvent("purchase", { amount: 99.99, currency: "USD" });

    if (clickHandled && purchaseHandled) {
      console.log("✅ AnalyticsTracker events triggered and handled correctly!");
      console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 2, File 3!");
    } else {
      console.log("❌ AnalyticsTracker: Events were not properly emitted or handled.");
    }

  } catch (err) {
    console.log("❌ An error occurred during validation.", err);
  }
}, 600);


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What is the Observer pattern and how does EventEmitter implement it?
// A:  The Observer pattern has a "subject" that maintains a list of "observers"
//     and notifies them when state changes. EventEmitter is Node's implementation:
//     emitter.on("event", callback) registers an observer, emitter.emit("event") 
//     notifies all registered observers. Used in HTTP servers, streams, sockets.
//
// Q2: What is the difference between .on() and .once()?
// A:  .on() registers a listener that fires EVERY time the event is emitted.
//     .once() registers a listener that fires only the FIRST time, then auto-removes.
//     Use .once() for one-time setup events like "server ready" or "db connected".
//
// Q3: What are Node.js Streams? Name the four types.
// A:  Streams process data in chunks instead of loading everything into memory.
//     Four types: Readable (reading data), Writable (writing data),
//     Duplex (both read and write, like TCP sockets), Transform (modify data 
//     as it passes through, like compression).
//
// Q4: When would you use Streams instead of fs.readFile?
// A:  When processing large files (logs, CSVs, video uploads). fs.readFile loads
//     the ENTIRE file into RAM. A 2GB file = 2GB RAM usage per request.
//     Streams process chunks (e.g., 64KB at a time), keeping memory constant.
//
// Q5: What does the 'highWaterMark' option control?
// A:  It sets the maximum chunk size (in bytes) that a stream will buffer before
//     pausing reads. Default is 16KB for object streams and 16KB for Buffer streams.
//     Lower values = less memory, but more frequent chunk events.
