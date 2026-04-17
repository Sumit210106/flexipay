import { IBillingStrategy, BillingParams } from "../interfaces/IBillingStrategy";

export class BillingContext {
  private strategy: IBillingStrategy;

  constructor(strategy: IBillingStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: IBillingStrategy): void {
    this.strategy = strategy;
  }

  calculate(params: BillingParams): number {
    return this.strategy.calculate(params);
  }
}
