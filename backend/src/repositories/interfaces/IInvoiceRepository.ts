import { IBaseRepository } from "./IBaseRepository";
import { InvoiceDocument } from "../../models/invoice.model";
import { InvoiceStatus } from "../../enums/invoiceStatus";

export interface IInvoiceRepository extends IBaseRepository<InvoiceDocument> {
  findBySubscriptionId(subscriptionId: string): Promise<InvoiceDocument[]>;
  findByStatus(status: InvoiceStatus): Promise<InvoiceDocument[]>;
}
