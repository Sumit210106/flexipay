import { IBillingStrategy, BillingParams } from "../interfaces/IBillingStrategy";

export class FlatRateBillingStrategy implements IBillingStrategy {
  calculate(params: BillingParams): number {
    // Simple flat rate — charge the full plan amount
    return params.amount;
  }
}
