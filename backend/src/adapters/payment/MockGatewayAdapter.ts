import { IPaymentGateway, ChargeResult } from "./IPaymentGateway";
import { randomUUID } from "crypto";

// In-process mock — no real API calls, safe to use in dev/test
export class MockGatewayAdapter implements IPaymentGateway {
  async charge(params: {
    amount: number;
    currency: string;
    customerId: string;
    description: string;
  }): Promise<ChargeResult> {
    console.log(`[MockGateway] Charging ${params.amount} ${params.currency} for customer ${params.customerId}`);

    return {
      success: true,
      transactionId: `mock_txn_${randomUUID()}`,
      amount: params.amount,
      currency: params.currency,
    };
  }

  async refund(params: { transactionId: string; amount: number }): Promise<boolean> {
    console.log(`[MockGateway] Refunding ${params.amount} for transaction ${params.transactionId}`);
    return true;
  }

  async createCustomer(params: { email: string; name?: string }): Promise<string> {
    const customerId = `mock_cus_${randomUUID()}`;
    console.log(`[MockGateway] Created customer ${customerId} for ${params.email}`);
    return customerId;
  }
}
