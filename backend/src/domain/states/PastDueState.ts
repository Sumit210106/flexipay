import { ISubscriptionState } from "../interfaces/ISubscriptionState";
import { UnprocessableError } from "../../errors/AppError";

export class PastDueState implements ISubscriptionState {
  readonly name = "past_due";

  charge(): ISubscriptionState {
    throw new UnprocessableError("Subscription is past due, use resolve() after payment retry");
  }

  renew(): ISubscriptionState {
    // Failed renewal — stays past_due
    return new PastDueState();
  }

  cancel(): ISubscriptionState {
    const { CanceledState } = require("./CanceledState");
    return new CanceledState();
  }

  resolve(): ISubscriptionState {
    // Payment was retried successfully — move back to active
    const { ActiveState } = require("./ActiveState");
    return new ActiveState();
  }
}
