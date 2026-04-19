import { Request, Response, NextFunction } from "express";
import { InvoiceService } from "../services/InvoiceService";

const invoiceService = new InvoiceService();

export class InvoiceController {
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoice = await invoiceService.getInvoiceById(req.params.id as string);
      res.json({ success: true, data: invoice });
    } catch (err) {
      next(err);
    }
  }

  async listBySubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subscriptionId } = req.query;
      if (!subscriptionId) {
        res.status(400).json({ success: false, error: { message: "subscriptionId query param required" } });
        return;
      }
      const invoices = await invoiceService.getInvoicesForSubscription(subscriptionId as string);
      res.json({ success: true, data: invoices });
    } catch (err) {
      next(err);
    }
  }
}
