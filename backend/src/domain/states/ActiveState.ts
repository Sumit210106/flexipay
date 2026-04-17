import { ISubscriptionState } from "../interfaces/ISubscriptionState";
import { UnprocessableError } from "../../errors/AppError";

export class ActiveState implements ISubscriptionState {
  readonly name = "active";

  charge(): ISubscriptionState {
    throw new UnprocessableError("Subscription is already active");
  }

  renew(): ISubscriptionState {
    // Renewing just keeps it active
    return new ActiveState();
  }

  cancel(): ISubscriptionState {
    const { CanceledState } = require("./CanceledState");
    return new CanceledState();
  }

  resolve(): ISubscriptionState {
    throw new UnprocessableError("Active subscription has no dues to resolve");
  }
}
