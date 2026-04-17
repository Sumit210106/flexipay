export interface ISubscriptionState {
  readonly name: string;
  charge(): ISubscriptionState;
  renew(): ISubscriptionState;
  cancel(): ISubscriptionState;
  resolve(): ISubscriptionState;
}

