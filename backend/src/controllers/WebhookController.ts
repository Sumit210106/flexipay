import { Request, Response, NextFunction } from "express";
import { WebhookService } from "../services/WebhookService";

const webhookService = new WebhookService();

export class WebhookController {
  async receive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, payload } = req.body;
      const event = await webhookService.receiveEvent(type, payload);

      // Process asynchronously — don't block the gateway's HTTP response
      webhookService.processEvent(event._id.toString()).catch(console.error);

      res.status(202).json({ success: true, message: "Webhook received" });
    } catch (err) {
      next(err);
    }
  }
}
