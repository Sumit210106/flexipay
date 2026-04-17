import { InvoiceModel, InvoiceDocument } from "../../models/invoice.model";
import { InvoiceStatus } from "../../enums/invoiceStatus";
import { IInvoiceRepository } from "../interfaces/IInvoiceRepository";

export class MongoInvoiceRepository implements IInvoiceRepository {
  async findById(id: string): Promise<InvoiceDocument | null> {
    return InvoiceModel.findById(id);
  }

  async create(data: Partial<InvoiceDocument>): Promise<InvoiceDocument> {
    return InvoiceModel.create(data);
  }

  async update(id: string, data: Partial<InvoiceDocument>): Promise<InvoiceDocument | null> {
    return InvoiceModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await InvoiceModel.findByIdAndDelete(id);
    return result !== null;
  }

  async findBySubscriptionId(subscriptionId: string): Promise<InvoiceDocument[]> {
    return InvoiceModel.find({ subscriptionId }).sort({ createdAt: -1 });
  }

  async findByStatus(status: InvoiceStatus): Promise<InvoiceDocument[]> {
    return InvoiceModel.find({ status });
  }
}
