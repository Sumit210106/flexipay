export interface ChargeResult {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
}

export interface IPaymentGateway {
  charge(params: {
    amount: number;
    currency: string;
    customerId: string;
    description: string;
  }): Promise<ChargeResult>;

  refund(params: {
    transactionId: string;
    amount: number;
  }): Promise<boolean>;

  createCustomer(params: {
    email: string;
    name?: string;
  }): Promise<string>; // returns customerId
}
