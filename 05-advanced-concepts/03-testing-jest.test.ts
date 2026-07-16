/**
 * MODULE 5: Advanced Backend Concepts
 * FILE 3: Unit Testing Boilerplate with Jest (Test Suite)
 * 
 * ==========================================
 * HOW TO STRUCTURE JEST TESTS
 * ==========================================
 * Jest files are written using three primary global functions:
 *   1. describe(): Groups related test cases together (e.g. "PaymentService Tests").
 *   2. test() or it(): Defines a single test case.
 *   3. expect(): Asserts that a value matches expectations.
 * 
 * ==========================================
 * MOCKING EXTERNAL GATEWAYS
 * ==========================================
 * We don't want our unit tests to call the real Stripe API, as that would charge
 * real credit cards and fail without an internet connection.
 * Instead, we create a "Mock" implementation of the gateway interface.
 */

import { PaymentService, IPaymentGateway } from "./03-testing-jest";

describe("PaymentService Unit Tests", () => {
  let mockGateway: IPaymentGateway;
  let service: PaymentService;

  // beforeEach runs a setup function before EVERY single test case.
  // This ensures each test starts with fresh, isolated data.
  beforeEach(() => {
    // We create a mock gateway object where chargeCard is a mock function
    mockGateway = {
      chargeCard: jest.fn()
    };
    
    // Inject the mock gateway into our service (Dependency Injection in action!)
    service = new PaymentService(mockGateway);
  });

  // Test Case 1: Testing happy path (payment success)
  test("should complete checkout successfully when gateway approves transaction", async () => {
    // 1. Arrange (Setup the mock return value)
    const mockChargeFn = mockGateway.chargeCard as jest.Mock;
    mockChargeFn.mockResolvedValue({ success: true, transactionId: "TX-7788" });

    // 2. Act (Execute target function)
    const result = await service.checkoutOrder(150, "tok_visa");

    // 3. Assert (Check expectations)
    expect(result).toBe("Checkout successful! Transaction ID: TX-7788");
    // Verify that the gateway mock function was called exactly once, with the right arguments!
    expect(mockGateway.chargeCard).toHaveBeenCalledTimes(1);
    expect(mockGateway.chargeCard).toHaveBeenCalledWith(150, "tok_visa");
  });

  // Test Case 2: Validation boundary tests
  test("should throw an error if checkout amount is 0 or negative", async () => {
    // Asserting async exceptions: We expect the promise to reject
    await expect(service.checkoutOrder(0, "tok_visa")).rejects.toThrow("Invalid order amount");
    await expect(service.checkoutOrder(-50, "tok_visa")).rejects.toThrow("Invalid order amount");

    // Verify the gateway was NEVER called because validation failed first
    expect(mockGateway.chargeCard).not.toHaveBeenCalled();
  });

  // ============================================================================
  // PRACTICE EXERCISE: Test Card Declines
  // ============================================================================
  // Fill out the test case below.
  // Goal: Verify that if the gateway returns success = false,
  // PaymentService throws an Error saying "Payment was declined by card provider".

  test("should throw an error when gateway declines card payment", async () => {
    // TODO: Step 1. Arrange - Setup chargeCard mock to resolve to { success: false }
    // Hint: const mockChargeFn = mockGateway.chargeCard as jest.Mock;
    //       mockChargeFn.mockResolvedValue({ success: false });

    // TODO: Step 2. Act & Assert - Assert that checkoutOrder rejects to throw the decline message
    // Hint: await expect(service.checkoutOrder(99, "tok_declined")).rejects.toThrow("...");

    // TODO: Step 3. Verify - Check that mockGateway.chargeCard was called once
  });
});


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What is the difference between unit tests, integration tests, and e2e tests?
// A:  Unit: Tests a single function/class in isolation (fastest, most numerous).
//     Integration: Tests how multiple modules work together (e.g., controller + DB).
//     E2E (End-to-End): Tests the full application from user perspective (slowest).
//     Follow the "testing pyramid": many unit tests, fewer integration, fewest e2e.
//
// Q2: What is "mocking" and why do we use it?
// A:  Mocking replaces a real dependency with a fake that you control.
//     We mock external APIs, databases, and third-party services so tests are:
//     - Fast (no network calls), Reliable (no external failures), Isolated.
//
// Q3: What is the AAA pattern in testing?
// A:  Arrange-Act-Assert. Arrange: set up test data and mocks. Act: execute the
//     function under test. Assert: verify the output matches expectations.
//     This is the industry-standard structure for writing readable tests.
//
// Q4: What is code coverage? Is 100% coverage a good goal?
// A:  Code coverage measures what % of your code is executed during tests.
//     100% is usually NOT practical or necessary — it leads to brittle tests.
//     Aim for high coverage on business logic (80-90%), less on glue code.
//
// Q5: What is the difference between jest.fn() and jest.spyOn()?
// A:  jest.fn() creates a brand new mock function from scratch.
//     jest.spyOn() wraps an EXISTING method, tracking calls while keeping
//     the original implementation (unless you override with mockImplementation).
