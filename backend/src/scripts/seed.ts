import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../database/connect";
import { Organization } from "../models/organization.model";
import { UserModel } from "../models/user.model";
import { PlanModel } from "../models/plan.model";
import { SubscriptionModel } from "../models/subscription.model";
import { InvoiceModel } from "../models/invoice.model";
import { SubscriptionStatus } from "../enums/subscriptionStatus";
import { InvoiceStatus } from "../enums/invoiceStatus";

const seed = async () => {
  await connectDB();

  await Organization.deleteMany({});
  await UserModel.deleteMany({});
  await PlanModel.deleteMany({});
  await SubscriptionModel.deleteMany({});
  await InvoiceModel.deleteMany({});

  const org = await Organization.create({ name: "Test Org" });

  const user = await UserModel.create({
    email: "test@flexipay.com",
    organizationId: org._id,
  });

  const plan = await PlanModel.create({
    name: "Starter",
    price: 199,
    currency: "INR",
    interval: "month",
    organizationId: org._id,
  });

  const subscription = await SubscriptionModel.create({
    userId: user._id,
    planId: plan._id,
    status: SubscriptionStatus.ACTIVE,
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  await InvoiceModel.create({
    subscriptionId: subscription._id,
    amount: 199,
    currency: "INR",
    status: InvoiceStatus.PAID,
  });

  console.log("✅ Seed data inserted successfully");
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
