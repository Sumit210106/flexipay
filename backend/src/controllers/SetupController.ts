import { Request, Response, NextFunction } from "express";
import { Organization } from "../models/organization.model";
import { UserModel } from "../models/user.model";
import { PlanModel } from "../models/plan.model";

export class SetupController {
  async bootstrap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Create Organization
      const org = await Organization.create({ name: "Default Production Org" });

      // 2. Create Admin User
      const admin = await UserModel.create({
        email: "admin@flexipay.com",
        organizationId: org._id,
      });

      // 3. Create Sample Plans
      const plans = await PlanModel.create([
        {
          name: "Basic Plan",
          price: 499,
          currency: "INR",
          interval: "month",
          organizationId: org._id,
        },
        {
          name: "Premium Plan",
          price: 1499,
          currency: "INR",
          interval: "month",
          organizationId: org._id,
        }
      ]);

      res.status(201).json({
        success: true,
        data: {
          organizationId: org._id,
          adminUserId: admin._id,
          plansCreated: plans.length
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
