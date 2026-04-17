import mongoose from "mongoose";
import { InvoiceModel, InvoiceDocument } from "../models/invoice.model";
import { MongoInvoiceRepository } from "../repositories/mongo/MongoInvoiceRepository";
import { InvoiceStatus } from "../enums/invoiceStatus";
import { NotFoundError } from "../errors/AppError";

export class InvoiceService {
  private invoiceRepo: MongoInvoiceRepository;

  constructor() {
    this.invoiceRepo = new MongoInvoiceRepository();
  }

  async createInvoice(params: {
    subscriptionId: string;
    amount: number;
    currency: string;
    status?: InvoiceStatus;
    session?: mongoose.ClientSession;
  }): Promise<InvoiceDocument> {
    const data: Partial<InvoiceDocument> = {
      subscriptionId: new mongoose.Types.ObjectId(params.subscriptionId) as any,
      amount: params.amount,
      currency: params.currency,
      status: params.status ?? InvoiceStatus.OPEN,
    };

    if (params.session) {
      const [doc] = await InvoiceModel.create([data], { session: params.session });
      return doc;
    }

    return this.invoiceRepo.create(data);
  }

  async markPaid(invoiceId: string): Promise<InvoiceDocument> {
    const updated = await this.invoiceRepo.update(invoiceId, { status: InvoiceStatus.PAID });
    if (!updated) throw new NotFoundError("Invoice");
    return updated;
  }

  async getInvoiceById(id: string): Promise<InvoiceDocument> {
    const invoice = await this.invoiceRepo.findById(id);
    if (!invoice) throw new NotFoundError("Invoice");
    return invoice;
  }

  async getInvoicesForSubscription(subscriptionId: string): Promise<InvoiceDocument[]> {
    return this.invoiceRepo.findBySubscriptionId(subscriptionId);
  }
}
