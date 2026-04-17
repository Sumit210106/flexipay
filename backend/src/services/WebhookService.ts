import { WebhookEventModel, WebhookEventDocument } from "../models/webhookEvent.model";

export class WebhookService {
  async receiveEvent(type: string, payload: Record<string, any>): Promise<WebhookEventDocument> {
    return WebhookEventModel.create({ type, payload, receivedAt: new Date() });
  }

  async processEvent(eventId: string): Promise<void> {
    const event = await WebhookEventModel.findById(eventId);
    if (!event || event.processed) return;

    // Route to the right handler based on event type
    switch (event.type) {
      case "payment.succeeded":
        console.log(`[WebhookService] Payment succeeded for`, event.payload);
        break;
      case "payment.failed":
        console.log(`[WebhookService] Payment failed for`, event.payload);
        break;
      default:
        console.log(`[WebhookService] Unknown event type: ${event.type}`);
    }

    await WebhookEventModel.findByIdAndUpdate(eventId, { processed: true });
  }

  async getPendingEvents(): Promise<WebhookEventDocument[]> {
    return WebhookEventModel.find({ processed: false }).sort({ receivedAt: 1 });
  }
}
