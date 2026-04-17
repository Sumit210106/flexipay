import { ISubscriptionState } from "../interfaces/ISubscriptionState";
import { UnprocessableError } from "../../errors/AppError";

export class TrialingState implements ISubscriptionState {
  readonly name = "trialing";

  charge(): ISubscriptionState {
    // Trial converts to active on successful charge
    const { ActiveState } = require("./ActiveState");
    return new ActiveState();
  }

  renew(): ISubscriptionState {
    throw new UnprocessableError("Cannot renew a trialing subscription");
  }

  cancel(): ISubscriptionState {
    const { CanceledState } = require("./CanceledState");
    return new CanceledState();
  }

  resolve(): ISubscriptionState {
    throw new UnprocessableError("Trialing subscription has no outstanding dues to resolve");
  }
}
