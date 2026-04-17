import { Request, Response, NextFunction } from "express";
import { SubscriptionService } from "../services/SubscriptionService";

const subscriptionService = new SubscriptionService();

export class SubscriptionController {
  async subscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, planId } = req.body;
      const subscription = await subscriptionService.subscribe({ userId, planId });
      res.status(201).json({ success: true, data: subscription });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subscription = await subscriptionService.getSubscription(req.params.id);
      res.json({ success: true, data: subscription });
    } catch (err) {
      next(err);
    }
  }

  async getByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subscription = await subscriptionService.getActiveSubscriptionByUserId(req.params.userId);
      res.json({ success: true, data: subscription });
    } catch (err) {
      next(err);
    }
  }

  async upgrade(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { newPlanId } = req.body;
      const subscription = await subscriptionService.upgrade({
        subscriptionId: req.params.id,
        newPlanId,
      });
      res.json({ success: true, data: subscription });
    } catch (err) {
      next(err);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subscription = await subscriptionService.cancel(req.params.id);
      res.json({ success: true, data: subscription });
    } catch (err) {
      next(err);
    }
  }

  async renew(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subscriptionId } = req.body;
      const subscription = await subscriptionService.processRenewal(subscriptionId);
      res.json({ success: true, data: subscription });
    } catch (err) {
      next(err);
    }
  }
}
