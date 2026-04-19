import { Request, Response, NextFunction } from "express";
import { PlanService } from "../services/PlanService";

const planService = new PlanService();

export class PlanController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, price, currency, interval } = req.body;
      const organizationId = req.tenantId!;

      const plan = await planService.createPlan({ name, price, currency, interval, organizationId });
      res.status(201).json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plan = await planService.getPlanById(req.params.id as string);
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  async listByOrg(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plans = await planService.getPlansForOrg(req.tenantId!);
      res.json({ success: true, data: plans });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plan = await planService.updatePlan(req.params.id as string, req.body);
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await planService.deletePlan(req.params.id as string);
      res.json({ success: true, message: "Plan deleted" });
    } catch (err) {
      next(err);
    }
  }
}
