/**
 * MODULE 5: Advanced Backend Concepts
 * FILE 3: Unit Testing Boilerplate with Jest
 * 
 * ==========================================
 * WHAT IS UNIT TESTING AND JEST?
 * ==========================================
 * When shipping code to production, we must guarantee that making changes today 
 * doesn't break yesterday's features. We write "unit tests" to isolate small sections 
 * (units) of code (like a single function or class) and assert they behave correctly.
 * 
 * Jest is the most popular testing framework in the JavaScript/TypeScript ecosystem.
 * It provides:
 *   - A test runner (finds and executes test files).
 *   - Assertion utilities (like `expect(value).toBe(result)`).
 *   - Mocking mechanisms (to mock external networks or databases).
 * 
 * ==========================================
 * THE CODE UNDER TEST (Payment Processor)
 * ==========================================
 * Below is a PaymentService. It depends on an external third-party api Gateway
 * (like Stripe) to charge cards.
 */

// Interface for our external Stripe payment gateway client.
export interface IPaymentGateway {
  chargeCard(amount: number, token: string): Promise<{ success: boolean; transactionId?: string }>;
}

export class PaymentService {
  private gateway: IPaymentGateway;

  constructor(gateway: IPaymentGateway) {
    this.gateway = gateway;
  }

  /**
   * Process a checkout order.
   * If the amount is less than or equal to 0, reject it immediately.
   * If correct, call the payment gateway to process the charge.
   */
  public async checkoutOrder(amount: number, cardToken: string): Promise<string> {
    if (amount <= 0) {
      throw new Error("Invalid order amount");
    }

    const chargeResult = await this.gateway.chargeCard(amount, cardToken);

    if (!chargeResult.success) {
      throw new Error("Payment was declined by card provider");
    }

    return `Checkout successful! Transaction ID: ${chargeResult.transactionId}`;
  }
}
