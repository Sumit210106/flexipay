import { IPaymentGateway, ChargeResult } from "./IPaymentGateway";

// Skeleton Stripe adapter — fill in when PAYMENT_GATEWAY=stripe
// Install: npm install stripe
export class StripeGatewayAdapter implements IPaymentGateway {
  private stripe: any; // Replace with: import Stripe from 'stripe'

  constructor(secretKey: string) {
    // this.stripe = new Stripe(secretKey, { apiVersion: '2024-12-18.acacia' });
    console.warn("[StripeAdapter] Stripe SDK not initialized — install stripe package first");
  }

  async charge(params: {
    amount: number;
    currency: string;
    customerId: string;
    description: string;
  }): Promise<ChargeResult> {
    // const paymentIntent = await this.stripe.paymentIntents.create({
    //   amount: Math.round(params.amount * 100), // Stripe uses cents
    //   currency: params.currency.toLowerCase(),
    //   customer: params.customerId,
    //   description: params.description,
    //   confirm: true,
    // });
    // return { success: true, transactionId: paymentIntent.id, amount: params.amount, currency: params.currency };
    throw new Error("StripeGatewayAdapter.charge() not yet implemented");
  }

  async refund(params: { transactionId: string; amount: number }): Promise<boolean> {
    // await this.stripe.refunds.create({ payment_intent: params.transactionId, amount: Math.round(params.amount * 100) });
    // return true;
    throw new Error("StripeGatewayAdapter.refund() not yet implemented");
  }

  async createCustomer(params: { email: string; name?: string }): Promise<string> {
    // const customer = await this.stripe.customers.create({ email: params.email, name: params.name });
    // return customer.id;
    throw new Error("StripeGatewayAdapter.createCustomer() not yet implemented");
  }
}
