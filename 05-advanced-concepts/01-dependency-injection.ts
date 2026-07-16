/**
 * MODULE 5: Advanced Backend Concepts
 * FILE 1: Dependency Injection (DI) and Clean Architecture
 * 
 * ==========================================
 * WHAT IS DEPENDENCY INJECTION?
 * ==========================================
 * In complex backends, classes rely on other classes to function. For example, 
 * a `UserService` depends on a `DatabaseConnection` to fetch users, and an `EmailService` 
 * to send registration emails.
 * 
 * If a class creates its own dependencies inside its constructor:
 *   - constructor() { this.db = new PostgresDatabase(); }
 * It is "tightly coupled". You cannot test `UserService` without connecting to a real Postgres db!
 * 
 * **Dependency Injection (DI)** is a pattern where we pass ("inject") the dependencies 
 * into the class from the outside (typically as constructor arguments), rather than 
 * letting the class create them itself.
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: The Uber Passenger
 * ==========================================
 * Think of yourself as a passenger (the class) wanting to get to the airport.
 *   - Tightly Coupled: You build your own car from raw metal, put fuel in, and drive. 
 *     If the car breaks down, you're stuck (cannot swap it easily).
 *   - Dependency Injection: You request an Uber. A driver with a car arrives. 
 *     You jump in. You don't care if it's a Tesla or a Honda, as long as it behaves like a car. 
 *     When testing, you can inject a "mock flight simulator car" instead of a real one!
 */

export {};

// ============================================================================
// 1. CODING BY INTERFACE (The Contract)
// ============================================================================
// By defining an interface (contract) for our database, our service can work 
// with *any* class that fulfills this interface (MySQL, MongoDB, or an In-Memory Array).

interface IDatabase {
  saveUser(email: string): Promise<void>;
  userExists(email: string): Promise<boolean>;
}

// ============================================================================
// 2. DEPENDENCY IMPLEMENTATIONS
// ============================================================================

// Implementation A: Real Production Postgres Database
class PostgresDatabase implements IDatabase {
  public async saveUser(email: string): Promise<void> {
    console.log(`[SQL Database]: INSERT INTO Users (email) VALUES ('${email}')`);
    // Real network query logic here...
  }

  public async userExists(email: string): Promise<boolean> {
    console.log(`[SQL Database]: SELECT EXISTS(SELECT 1 FROM Users WHERE email = '${email}')`);
    return false;
  }
}

// Implementation B: Mock Database for Unit Testing (No real database connection needed!)
class MockDatabase implements IDatabase {
  private users: string[] = [];

  public async saveUser(email: string): Promise<void> {
    this.users.push(email);
  }

  public async userExists(email: string): Promise<boolean> {
    return this.users.includes(email);
  }
}

// ============================================================================
// 3. THE SERVICE (Accepts Dependency via Constructor)
// ============================================================================

class UserService {
  // We type the dependency using the Interface IDatabase, NOT a concrete class!
  private database: IDatabase;

  // We INJECT the database instance here:
  constructor(database: IDatabase) {
    this.database = database;
  }

  public async registerNewUser(email: string): Promise<string> {
    const exists = await this.database.userExists(email);
    if (exists) {
      throw new Error("Email already registered!");
    }

    await this.database.saveUser(email);
    return `Successfully registered: ${email}`;
  }
}

// ============================================================================
// PRODUCTION INJECTION VS TESTING INJECTION DEMO
// ============================================================================

// In Production (app.ts):
const prodDatabase = new PostgresDatabase();
const prodUserService = new UserService(prodDatabase);

// In Unit Tests (user.test.ts):
const testDatabase = new MockDatabase();
const testUserService = new UserService(testDatabase);

// ============================================================================
// 4. PRACTICE EXERCISE: Notification Sender Decoupling
// ============================================================================
// Create a decoupled Notification Manager system.

// Step 1: Define an interface called 'IMessageSender'.
// It must declare a single method signature:
//   send(recipient: string, content: string): Promise<boolean>;
interface IMessageSender {
  // TODO: Add definition
}

// Step 2: Implement a 'SmsSender' class that implements 'IMessageSender'.
// Its send method should print: `[SMS] Sending text to ${recipient}: ${content}`
// and resolve to 'true'.
class SmsSender implements IMessageSender {
  // TODO: Implement
}

// Step 3: Implement an 'EmailSender' class that implements 'IMessageSender'.
// Its send method should print: `[EMAIL] Sending mail to ${recipient}: ${content}`
// and resolve to 'true'.
class EmailSender implements IMessageSender {
  // TODO: Implement
}

// Step 4: Complete the 'AlertDispatcher' class which accepts IMessageSender 
// via Dependency Injection (constructor).
class AlertDispatcher {
  private sender: any; // TODO: Replace 'any' with message sender type

  constructor(sender: any) { // TODO: Replace 'any'
    // TODO: Assign injected sender to property
  }

  /**
   * Dispatches an emergency system alert message to the technical ops team contact.
   */
  public async dispatchSystemAlert(recipient: string, systemError: string): Promise<boolean> {
    const alertMessage = `CRITICAL SYSTEM ERROR DETECTED: ${systemError}`;
    // TODO: Call sender.send with recipient and alertMessage, and return its boolean promise.
    return false;
  }
}


// ============================================================================
// 5. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run using: npx ts-node 05-advanced-concepts/01-dependency-injection.ts

console.log("\n=== Checking your Dependency Injection solutions... ===");

async function testDI() {
  try {
    const sms = new SmsSender();
    const email = new EmailSender();

    const smsDispatcher = new AlertDispatcher(sms);
    const emailDispatcher = new AlertDispatcher(email);

    console.log("--- Executing Decoupled SMS Alerts ---");
    const smsResult = await smsDispatcher.dispatchSystemAlert("+15550199", "CPU usage exceeding 98%");
    
    console.log("--- Executing Decoupled Email Alerts ---");
    const emailResult = await emailDispatcher.dispatchSystemAlert("ops@company.com", "Database connection pool exhausted");

    let diPass = false;
    if (smsResult === true && emailResult === true) {
      console.log("✅ AlertDispatcher successfully decoupled using Dependency Injection!");
      diPass = true;
    } else {
      console.log("❌ AlertDispatcher: Failed. Decoupled send did not return true.");
    }

    if (diPass) {
      console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 5, File 1!");
    }

  } catch (err) {
    console.log("❌ Validation Error: Check your interface declarations and constructors.", err);
  }
}

testDI();


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What is Dependency Injection? Explain it to a junior developer.
// A:  Instead of a class creating its own dependencies internally (new Database()),
//     the dependencies are passed IN from the outside (usually via the constructor).
//     This makes the class flexible — you can swap a real database for a mock
//     during testing, or switch from PostgreSQL to MongoDB without rewriting logic.
//
// Q2: What are the benefits of coding to an interface instead of a concrete class?
// A:  - Testability: Mock implementations for unit tests.
//     - Flexibility: Swap implementations without modifying consumers.
//     - Decoupling: Classes don't know or care about implementation details.
//     - Maintainability: Changes to one implementation don't cascade.
//
// Q3: What is the difference between Dependency Injection and Dependency Inversion?
// A:  DI (Injection) is the TECHNIQUE of passing dependencies.
//     DIP (Inversion Principle) is the DESIGN PRINCIPLE: "High-level modules
//     should not depend on low-level modules. Both should depend on abstractions."
//     DI is how you achieve DIP.
//
// Q4: What are the three types of Dependency Injection?
// A:  1. Constructor Injection (most common): Dependencies passed via constructor.
//     2. Setter Injection: Dependencies set via setter methods after construction.
//     3. Interface Injection: The dependency provides an injector method.
//     In TypeScript/Node.js, constructor injection is the industry standard.
//
// Q5: What is an "IoC Container" (Inversion of Control Container)?
// A:  A framework that automatically creates and injects dependencies.
//     Examples in Node.js: InversifyJS, tsyringe, NestJS's built-in DI container.
//     Instead of manually writing "new UserService(new Database())", the container
//     resolves the entire dependency graph automatically.
