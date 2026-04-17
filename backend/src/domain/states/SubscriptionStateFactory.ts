import { SubscriptionStatus } from "../../enums/subscriptionStatus";
import { ISubscriptionState } from "../interfaces/ISubscriptionState";
import { TrialingState } from "./TrialingState";
import { ActiveState } from "./ActiveState";
import { PastDueState } from "./PastDueState";
import { CanceledState } from "./CanceledState";
import { BadRequestError } from "../../errors/AppError";

export class SubscriptionStateFactory {
  static create(status: SubscriptionStatus): ISubscriptionState {
    switch (status) {
      case SubscriptionStatus.TRIALING:
        return new TrialingState();
      case SubscriptionStatus.ACTIVE:
        return new ActiveState();
      case SubscriptionStatus.PAST_DUE:
        return new PastDueState();
      case SubscriptionStatus.CANCELED:
        return new CanceledState();
      default:
        throw new BadRequestError(`Unknown subscription status: ${status}`);
    }
  }
}
