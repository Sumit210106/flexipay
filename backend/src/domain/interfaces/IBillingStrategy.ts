export interface IBillingStrategy {
  calculate(params: BillingParams): number;
}

export interface BillingParams {
  amount: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  changeDate?: Date; // only needed for proration
}
