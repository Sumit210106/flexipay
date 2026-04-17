import { IBillingStrategy, BillingParams } from "../interfaces/IBillingStrategy";
import { BadRequestError } from "../../errors/AppError";

export class ProrationBillingStrategy implements IBillingStrategy {
  calculate(params: BillingParams): number {
    if (!params.changeDate) {
      throw new BadRequestError("changeDate is required for proration calculation");
    }

    const totalDays = this.daysBetween(params.currentPeriodStart, params.currentPeriodEnd);
    const daysUsed = this.daysBetween(params.currentPeriodStart, params.changeDate);
    const daysRemaining = totalDays - daysUsed;

    if (totalDays <= 0) return 0;

    // Credit for unused days on the old plan
    const unusedCredit = (params.amount / totalDays) * daysRemaining;

    return Math.max(0, Math.round(unusedCredit * 100) / 100);
  }

  private daysBetween(start: Date, end: Date): number {
    const ms = end.getTime() - start.getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }
}
