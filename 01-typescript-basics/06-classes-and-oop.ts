/**
 * MODULE 1: TypeScript Basics
 * FILE 6: Classes and Object-Oriented Programming (OOP)
 * 
 * ==========================================
 * WHAT ARE CLASSES IN TYPESCRIPT?
 * ==========================================
 * A class is a blueprint for creating objects. If an interface says "what shape an object has",
 * a class says "what shape it has AND how it behaves" (methods with actual logic).
 * 
 * TypeScript adds powerful features on top of JavaScript classes:
 *   - Access Modifiers: public, private, protected
 *   - Abstract Classes: Classes that cannot be instantiated directly
 *   - Implements: A class can promise to satisfy an interface's shape
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: Cookie Cutters
 * ==========================================
 * A class is like a cookie cutter. The cutter itself is the blueprint.
 * Each cookie you stamp out is an "instance" of that class.
 * Every cookie has the same shape, but different decorations (different property values).
 * 
 * An abstract class is like a generic "vehicle blueprint" — you can't build a 
 * "vehicle" directly. You must choose a specific type: Car, Truck, or Motorcycle.
 * The blueprint defines shared behaviors (start engine, stop), but each specific 
 * vehicle implements the details differently.
 */

export {};

// ============================================================================
// 1. ACCESS MODIFIERS EXPLAINED
// ============================================================================

class BankAccount {
  // PUBLIC: Accessible from anywhere (default if you don't specify).
  public accountHolder: string;

  // PRIVATE: Accessible ONLY inside this class. Not even subclasses can access it.
  // Use for sensitive internal state that should never be exposed.
  private balance: number;

  // PROTECTED: Accessible inside this class AND its subclasses (children),
  // but NOT from outside code. Use for shared internal state in inheritance.
  protected accountType: string;

  constructor(holder: string, initialBalance: number, type: string) {
    this.accountHolder = holder;
    this.balance = initialBalance;
    this.accountType = type;
  }

  // Public method: Anyone can call this.
  public getBalance(): number {
    return this.balance;
  }

  // Public method with internal logic modifying the private balance.
  public deposit(amount: number): void {
    if (amount <= 0) throw new Error("Deposit amount must be positive");
    this.balance += amount;
    console.log(`💰 Deposited $${amount}. New balance: $${this.balance}`);
  }

  public withdraw(amount: number): void {
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
    console.log(`💸 Withdrew $${amount}. New balance: $${this.balance}`);
  }
}

const account = new BankAccount("Alice", 1000, "savings");
account.deposit(500);
console.log(`Balance: $${account.getBalance()}`);
// account.balance; // ❌ ERROR: 'balance' is private and only accessible within class 'BankAccount'.

// ============================================================================
// 2. INHERITANCE (extends) AND METHOD OVERRIDING
// ============================================================================

class SavingsAccount extends BankAccount {
  private interestRate: number;

  constructor(holder: string, initialBalance: number, rate: number) {
    // 'super' calls the parent class constructor. This is REQUIRED.
    super(holder, initialBalance, "savings");
    this.interestRate = rate;
  }

  // New method specific to SavingsAccount
  public applyInterest(): void {
    const interest = this.getBalance() * this.interestRate;
    this.deposit(interest);
    // this.accountType is accessible here because it's 'protected'!
    console.log(`[${this.accountType}] Applied ${this.interestRate * 100}% interest.`);
  }
}

const savings = new SavingsAccount("Bob", 5000, 0.05);
savings.applyInterest();

// ============================================================================
// 3. ABSTRACT CLASSES
// ============================================================================
// An abstract class CANNOT be instantiated directly (no new AbstractClass()).
// It serves as a base class that defines a "contract" for its children.
// Abstract methods have NO body — children MUST implement them.

abstract class NotificationChannel {
  // Concrete method (has a body): All children get this for free.
  protected formatMessage(title: string, body: string): string {
    return `[${title.toUpperCase()}]: ${body}`;
  }

  // Abstract method (no body): Each child MUST implement this differently.
  abstract send(recipient: string, title: string, body: string): Promise<boolean>;
}

class EmailChannel extends NotificationChannel {
  async send(recipient: string, title: string, body: string): Promise<boolean> {
    const formatted = this.formatMessage(title, body);
    console.log(`📧 Email to ${recipient}: ${formatted}`);
    return true;
  }
}

class SlackChannel extends NotificationChannel {
  async send(recipient: string, title: string, body: string): Promise<boolean> {
    const formatted = this.formatMessage(title, body);
    console.log(`💬 Slack to #${recipient}: ${formatted}`);
    return true;
  }
}

// const channel = new NotificationChannel(); // ❌ ERROR: Cannot create an instance of an abstract class.
const emailNotifier = new EmailChannel();
emailNotifier.send("admin@company.com", "Alert", "Server CPU at 95%");

// ============================================================================
// 4. IMPLEMENTS (Interface Compliance)
// ============================================================================
// A class can "implement" an interface, which guarantees it has all required properties.

interface Serializable {
  toJSON(): string;
}

class AppConfig implements Serializable {
  constructor(
    public host: string,
    public port: number,
    public debug: boolean
  ) {}

  // MUST implement toJSON() because we 'implement Serializable'.
  toJSON(): string {
    return JSON.stringify({ host: this.host, port: this.port, debug: this.debug });
  }
}

// ============================================================================
// 5. PRACTICE EXERCISE: Vehicle Fleet Management System
// ============================================================================

// Step 1: Create an abstract class 'Vehicle' with:
//   - protected property 'brand' (string)
//   - protected property 'year' (number)
//   - A concrete method 'getAge()' that returns current year minus this.year
//   - An abstract method 'calculateMaintenanceCost()' that returns a number
abstract class Vehicle {
  // TODO: Add properties and constructor
  // TODO: Implement getAge()
  // TODO: Declare abstract calculateMaintenanceCost()

  getAge(): number {
    return 0; // TODO: Replace with actual calculation
  }

  abstract calculateMaintenanceCost(): number;
}

// Step 2: Create a class 'Car' extending Vehicle.
//   - Has an additional private property 'mileage' (number)
//   - Implements calculateMaintenanceCost():
//     Formula: mileage * 0.05 + (getAge() * 100)
class Car extends Vehicle {
  // TODO: Implement

  calculateMaintenanceCost(): number {
    return 0; // TODO: Replace with formula
  }
}

// Step 3: Create a class 'Truck' extending Vehicle.
//   - Has an additional private property 'cargoCapacityTons' (number)
//   - Implements calculateMaintenanceCost():
//     Formula: cargoCapacityTons * 200 + (getAge() * 150)
class Truck extends Vehicle {
  // TODO: Implement

  calculateMaintenanceCost(): number {
    return 0; // TODO: Replace with formula
  }
}


// ============================================================================
// 6. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run using: npx ts-node 01-typescript-basics/06-classes-and-oop.ts

console.log("\n=== Checking your solutions... ===");

try {
  // We can't test abstract construction — that's compile-time safety.
  // We test the concrete implementations:

  const testCar = new Car();
  const testTruck = new Truck();

  const carCost = testCar.calculateMaintenanceCost();
  const truckCost = testTruck.calculateMaintenanceCost();

  if (carCost > 0 && truckCost > 0) {
    console.log(`✅ Car maintenance cost: $${carCost}`);
    console.log(`✅ Truck maintenance cost: $${truckCost}`);
    console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 1, File 6!");
  } else {
    console.log(`❌ Maintenance costs should be positive. Car: $${carCost}, Truck: $${truckCost}`);
  }

} catch (err) {
  console.log("❌ An error occurred. Make sure your classes have proper constructors.", err);
}


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What is the difference between 'interface' and 'abstract class'?
// A:  An interface only defines a SHAPE (no implementation, no runtime code).
//     An abstract class can have BOTH abstract methods (no body) AND concrete 
//     methods (with implementation). A class can implement multiple interfaces
//     but can only extend ONE abstract class (single inheritance).
//
// Q2: What are access modifiers? Name all three.
// A:  public: Accessible everywhere (default).
//     private: Accessible only inside the declaring class.
//     protected: Accessible inside the class and its subclasses.
//
// Q3: What does the 'super' keyword do?
// A:  In a constructor, super() calls the parent class's constructor.
//     In methods, super.methodName() calls the parent's method.
//     You MUST call super() before using 'this' in a child constructor.
//
// Q4: What is the "shorthand constructor parameter" syntax?
// A:  Instead of declaring properties and assigning in the constructor body,
//     you can add access modifiers directly in the constructor parameters:
//     constructor(public name: string, private age: number) {}
//     This declares, initializes, and assigns in one line.
//
// Q5: Can TypeScript classes have static methods? When would you use them?
// A:  Yes. Static methods belong to the class itself, not instances.
//     Use them for utility functions: UserService.hashPassword("pass").
//     They can't access 'this' (instance properties).
//
// Q6: What is the difference between 'implements' and 'extends'?
// A:  'extends' creates an inheritance chain (child gets parent's code).
//     'implements' makes a class promise it satisfies an interface's shape.
//     A class can extend ONE class but implement MULTIPLE interfaces.
