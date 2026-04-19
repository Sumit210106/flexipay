import Stripe from "stripe";
import { IPaymentGateway, ChargeResult } from "./IPaymentGateway";

/**
 * Stripe implementation for the billing engine.
 * Handles customer creation, one-off charges (for subscriptions/upgrades), and refunds.
 */
export class StripeGatewayAdapter implements IPaymentGateway {
  private stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: "2024-12-18.acacia",
    });
  }

  async charge(params: {
    amount: number;
    currency: string;
    customerId: string;
    description: string;
  }): Promise<ChargeResult> {
    try {
      // In a real subscription flow, we might use SetupIntents or Subscription schedules.
      // For this unified billing engine, we use PaymentIntents with automatic confirmation
      // to simulate the "charge" event triggered by the engine state machine.
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(params.amount * 100), // Stripe expects amounts in cents
        currency: params.currency.toLowerCase(),
        customer: params.customerId,
        description: params.description,
        confirm: true,
        payment_method: "pm_card_visa", // In production, this would be passed from frontend
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });

      return {
        success: paymentIntent.status === "succeeded",
        transactionId: paymentIntent.id,
        amount: params.amount,
        currency: params.currency,
      };
    } catch (error: any) {
      console.error("[Stripe] Charge failed:", error.message);
      return {
        success: false,
        transactionId: "",
        amount: params.amount,
        currency: params.currency,
      };
    }
  }

  async refund(params: { transactionId: string; amount: number }): Promise<boolean> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: params.transactionId,
        amount: Math.round(params.amount * 100),
      });
      return refund.status === "succeeded";
    } catch (error: any) {
      console.error("[Stripe] Refund failed:", error.message);
      return false;
    }
  }

  async createCustomer(params: { email: string; name?: string }): Promise<string> {
    try {
      // Check if customer already exists for this email to avoid duplicates
      const existing = await this.stripe.customers.list({
        email: params.email,
        limit: 1,
      });

      if (existing.data.length > 0) {
        return existing.data[0].id;
      }

      const customer = await this.stripe.customers.create({
        email: params.email,
        name: params.name,
      });
      return customer.id;
    } catch (error: any) {
      console.error("[Stripe] Customer creation failed:", error.message);
      throw error;
    }
  }
}
