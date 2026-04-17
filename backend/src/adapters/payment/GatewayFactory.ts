import { IPaymentGateway } from "./IPaymentGateway";
import { MockGatewayAdapter } from "./MockGatewayAdapter";
import { StripeGatewayAdapter } from "./StripeGatewayAdapter";
import { config } from "../../config";

export function createPaymentGateway(): IPaymentGateway {
  if (config.paymentGateway === "stripe") {
    return new StripeGatewayAdapter(config.stripeSecretKey);
  }
  return new MockGatewayAdapter();
}
