/**
 * MODULE 2: Node.js Fundamentals
 * FILE 1: File System (fs) and Path Modules
 * 
 * ==========================================
 * WHAT IS FS AND PATH IN NODE.JS?
 * ==========================================
 * A backend server is constantly communicating with the host computer's storage.
 * Whether saving uploaded user avatars, reading database config files, or writing log files,
 * you will use the built-in Node.js standard libraries:
 *   - 'fs' (File System): To read, write, create, and delete files.
 *   - 'path': To build safe file-paths that work on any Operating System (Windows, Mac, Linux).
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: The Office Filing Cabinet
 * ==========================================
 * Think of your server storage as a physical filing cabinet.
 *   - The 'path' module is like a map directing you to the exact drawer: "Floor 2 -> Cabinet 3 -> Folder A".
 *     On Windows, folders are separated by backslashes (\), while Mac/Linux use forward slashes (/).
 *     The 'path' module automatically handles this slash difference for you.
 *   - The 'fs' module is the action of physically opening, reading, or writing into a folder.
 *     We always prefer "asynchronous" operations, which is like asking an assistant to fetch a folder 
 *     for you so you can keep working on other tasks, instead of walking over and waiting there yourself (synchronous).
 */

import * as fs from "fs/promises";
import * as path from "path";

// ============================================================================
// 1. FILE PATHS RESOLUTION EXPLAINED
// ============================================================================

// __dirname: A special global variable containing the absolute path of the directory
// where the current file is located.
console.log(`Current directory path: ${__dirname}`);

// path.join(): Safe way to create file paths. Never hardcode "folder/file.txt"!
// This joins the parts using the correct slashes for the current OS.
const targetFilePath = path.join(__dirname, "sample.txt");
console.log(`Target file path created: ${targetFilePath}`);

// ============================================================================
// 2. ASYNC FILE READ/WRITE EXPLAINED
// ============================================================================

async function demonstrateFileOperations() {
  try {
    // --- Writing a File ---
    // fs.writeFile(filePath, content, options)
    // If the file doesn't exist, it creates it. If it does, it overwrites it.
    await fs.writeFile(targetFilePath, "Hello from TypeScript Backend Practice!", "utf-8");
    console.log("📝 File written successfully.");

    // --- Reading a File ---
    // Crucial: You must specify encoding (like 'utf-8'). 
    // If you don't, fs returns a raw binary "Buffer" (looks like <Buffer 48 65 6c 6c 6f...>)
    const fileContent: string = await fs.readFile(targetFilePath, "utf-8");
    console.log(`📖 File read complete. Content: "${fileContent}"`);

    // --- Checking if file exists ---
    // The standard check in modern Node is to catch the error of 'stat' or 'access'
    try {
      await fs.access(targetFilePath);
      console.log("🔍 File verified: It exists.");
    } catch {
      console.log("🔍 File verified: It does NOT exist.");
    }

    // --- Cleaning up (Deleting the file) ---
    await fs.unlink(targetFilePath);
    console.log("🗑️ File deleted successfully.");

  } catch (error) {
    console.error("❌ An filesystem error occurred:", error);
  }
}

// Execute demo
demonstrateFileOperations();

// ============================================================================
// 3. PRACTICE EXERCISE: App Logs Manager
// ============================================================================
// Build a simple logging class that writes timestamps and messages to a text file.

class LoggerService {
  private logFilePath: string;

  constructor(fileName: string) {
    // TODO: Resolve the file path inside the current directory (__dirname) using the given fileName.
    this.logFilePath = path.join(__dirname, fileName); 
  }

  /**
   * Write a log message to the log file.
   * Format: "[TIMESTAMP] - MESSAGE" (e.g., "[2026-07-16T21:00:00.000Z] - Server started")
   * Tip: Remember to append a newline (\n) at the end of each log so logs don't merge!
   * Hint: Use fs.appendFile(filePath, data, options) to append to the file rather than overwriting it.
   */
  public async log(message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] - ${message}\n`;
    // TODO: Append logLine to this.logFilePath.
    await fs.appendFile(this.logFilePath, logLine, "utf-8");
  }

  /**
   * Read all logs from the log file and return them as a single string.
   * If the log file does not exist yet, return an empty string "".
   */
  public async readLogs(): Promise<string> {
    // TODO: Check if file exists. If it doesn't, return "".
    // If it does exist, read the file and return its string content.
    try {
      return await fs.readFile(this.logFilePath, "utf-8");
    } catch (err) {
      return "";
    }
  }

  /**
   * Delete the log file.
   */
  public async clearLogs(): Promise<void> {
    // TODO: Delete the file. Handle cases where the file might not exist by wrapping it in a try-catch.
    try {
      await fs.unlink(this.logFilePath);
    } catch (err) {
      // Ignore error if file doesn't exist
    }
  }
}

// ============================================================================
// 4. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run using: npx ts-node 02-nodejs-fundamentals/01-file-system.ts

console.log("\n=== Checking your solutions... ===");

// We wrap validator in a setTimeout to let the asynchronous demonstration run first.
setTimeout(async () => {
  try {
    const testLogger = new LoggerService("test_app_run.log");

    // Clean any residual logs
    await testLogger.clearLogs();

    // Write logs
    await testLogger.log("User logged in");
    await testLogger.log("Payment processed");

    const content = await testLogger.readLogs();

    let logsSavedPass = false;
    if (content.includes("User logged in") && content.includes("Payment processed") && content.split("\n").length >= 2) {
      console.log("✅ LoggerService - Append & Read Logs: Passed!");
      logsSavedPass = true;
    } else {
      console.log(`❌ LoggerService - Append & Read Logs: Failed. Content was: "${content}"`);
    }

    // Clean up
    await testLogger.clearLogs();
    const finalContent = await testLogger.readLogs();

    let deleteLogsPass = false;
    if (finalContent === "") {
      console.log("✅ LoggerService - Clear Logs: Passed!");
      deleteLogsPass = true;
    } else {
      console.log("❌ LoggerService - Clear Logs: Failed.");
    }

    if (logsSavedPass && deleteLogsPass) {
      console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 2, File 1!");
    }

  } catch (err) {
    console.log("❌ An error occurred during validation. Check filesystem async handling.", err);
  }
}, 500);


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What is the difference between fs.readFile and fs.readFileSync?
// A:  readFileSync BLOCKS the entire Node.js event loop until the file is read.
//     readFile (async) delegates the I/O to the OS kernel and continues processing
//     other requests. In a server, ALWAYS use async to avoid blocking all users.
//
// Q2: Why should you use path.join() instead of string concatenation?
// A:  Windows uses backslashes (C:\folder\file), Mac/Linux use forward slashes
//     (/folder/file). path.join() automatically uses the correct separator for
//     the current OS, preventing cross-platform path bugs.
//
// Q3: What is __dirname? How is it different from process.cwd()?
// A:  __dirname is the directory of the CURRENT FILE (where the .ts/.js lives).
//     process.cwd() is the directory from which the NODE PROCESS was started.
//     They can be different! If you run "node src/app.js" from the project root,
//     __dirname = "/project/src" but process.cwd() = "/project".
//
// Q4: What is the difference between fs.writeFile and fs.appendFile?
// A:  writeFile OVERWRITES the entire file content. appendFile ADDS to the end.
//     Use writeFile for creating/replacing files, appendFile for logs.
//
// Q5: How do you safely check if a file exists in modern Node.js?
// A:  Use fs.access() wrapped in try-catch. The old fs.exists() is deprecated.
//     Alternative: fs.stat() which also returns file size and timestamps.
