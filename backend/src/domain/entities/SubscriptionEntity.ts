import { Types } from "mongoose";
import { SubscriptionStatus } from "../../enums/subscriptionStatus";
import { ISubscriptionState } from "../interfaces/ISubscriptionState";
import { SubscriptionStateFactory } from "../states/SubscriptionStateFactory";

export class SubscriptionEntity {
  public readonly id: string;
  public readonly userId: Types.ObjectId;
  public readonly planId: Types.ObjectId;
  public readonly currentPeriodStart: Date;
  public readonly currentPeriodEnd: Date;
  private state: ISubscriptionState;

  constructor(data: {
    id: string;
    userId: Types.ObjectId;
    planId: Types.ObjectId;
    status: SubscriptionStatus;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  }) {
    this.id = data.id;
    this.userId = data.userId;
    this.planId = data.planId;
    this.currentPeriodStart = data.currentPeriodStart;
    this.currentPeriodEnd = data.currentPeriodEnd;
    this.state = SubscriptionStateFactory.create(data.status);
  }

  get status(): string {
    return this.state.name;
  }

  charge(): void {
    this.state = this.state.charge();
  }

  renew(): void {
    this.state = this.state.renew();
  }

  cancel(): void {
    this.state = this.state.cancel();
  }

  resolve(): void {
    this.state = this.state.resolve();
  }
}
