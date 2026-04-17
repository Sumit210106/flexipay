import { ISubscriptionState } from "../interfaces/ISubscriptionState";
import { UnprocessableError } from "../../errors/AppError";

export class CanceledState implements ISubscriptionState {
  readonly name = "canceled";

  charge(): ISubscriptionState {
    throw new UnprocessableError("Cannot charge a canceled subscription");
  }

  renew(): ISubscriptionState {
    throw new UnprocessableError("Cannot renew a canceled subscription");
  }

  cancel(): ISubscriptionState {
    throw new UnprocessableError("Subscription is already canceled");
  }

  resolve(): ISubscriptionState {
    throw new UnprocessableError("Cannot resolve a canceled subscription");
  }
}
