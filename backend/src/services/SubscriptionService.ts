import mongoose from "mongoose";
import { MongoSubscriptionRepository } from "../repositories/mongo/MongoSubscriptionRepository";
import { MongoPlanRepository } from "../repositories/mongo/MongoPlanRepository";
import { MongoUserRepository } from "../repositories/mongo/MongoUserRepository";
import { SubscriptionModel, SubscriptionDocument } from "../models/subscription.model";
import { InvoiceModel } from "../models/invoice.model";
import { SubscriptionStatus } from "../enums/subscriptionStatus";
import { InvoiceStatus } from "../enums/invoiceStatus";
import { SubscriptionEntity } from "../domain/entities/SubscriptionEntity";
import { BillingContext } from "../domain/strategies/BillingContext";
import { FlatRateBillingStrategy } from "../domain/strategies/FlatRateBillingStrategy";
import { ProrationBillingStrategy } from "../domain/strategies/ProrationBillingStrategy";
import { IPaymentGateway } from "../adapters/payment/IPaymentGateway";
import { createPaymentGateway } from "../adapters/payment/GatewayFactory";
import { NotFoundError, ConflictError, PaymentError } from "../errors/AppError";

export class SubscriptionService {
  private subscriptionRepo: MongoSubscriptionRepository;
  private planRepo: MongoPlanRepository;
  private userRepo: MongoUserRepository;
  private gateway: IPaymentGateway;

  constructor() {
    this.subscriptionRepo = new MongoSubscriptionRepository();
    this.planRepo = new MongoPlanRepository();
    this.userRepo = new MongoUserRepository();
    this.gateway = createPaymentGateway();
  }

  async subscribe(params: { userId: string; planId: string }): Promise<SubscriptionDocument> {
    const [user, plan] = await Promise.all([
      this.userRepo.findById(params.userId),
      this.planRepo.findById(params.planId),
    ]);

    if (!user) throw new NotFoundError("User");
    if (!plan) throw new NotFoundError("Plan");

    const existing = await this.subscriptionRepo.findActiveByUserId(params.userId);
    if (existing) {
      throw new ConflictError("User already has an active subscription");
    }

    // Process payment first
    const customerId = await this.gateway.createCustomer({ email: user.email });
    const charge = await this.gateway.charge({
      amount: plan.price,
      currency: plan.currency,
      customerId,
      description: `Subscription to ${plan.name}`,
    });

    if (!charge.success) {
      throw new PaymentError("Payment failed — could not create subscription");
    }

    const now = new Date();
    const periodEnd = this.calcPeriodEnd(now, plan.interval as string);

    // Write subscription + invoice in one transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [subscription] = await SubscriptionModel.create(
        [
          {
            userId: new mongoose.Types.ObjectId(params.userId),
            planId: new mongoose.Types.ObjectId(params.planId),
            status: SubscriptionStatus.ACTIVE,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
          },
        ],
        { session }
      );

      await InvoiceModel.create(
        [
          {
            subscriptionId: subscription._id,
            amount: plan.price,
            currency: plan.currency,
            status: InvoiceStatus.PAID,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      return subscription;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async upgrade(params: {
    subscriptionId: string;
    newPlanId: string;
  }): Promise<SubscriptionDocument> {
    const subscription = await this.subscriptionRepo.findById(params.subscriptionId);
    if (!subscription) throw new NotFoundError("Subscription");

    const newPlan = await this.planRepo.findById(params.newPlanId);
    if (!newPlan) throw new NotFoundError("Plan");

    // Load the domain entity to validate the state transition
    const entity = new SubscriptionEntity({
      id: subscription._id.toString(),
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
    });

    // Calculate prorated amount for the remaining period
    const oldPlan = await this.planRepo.findById(subscription.planId.toString());
    const billingContext = new BillingContext(new ProrationBillingStrategy());

    const credit = oldPlan
      ? billingContext.calculate({
          amount: oldPlan.price,
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: subscription.currentPeriodEnd,
          changeDate: new Date(),
        })
      : 0;

    const amountDue = Math.max(0, newPlan.price - credit);

    if (amountDue > 0) {
      const customerId = await this.gateway.createCustomer({ email: "" }); // real flow: store customerId on user
      const charge = await this.gateway.charge({
        amount: amountDue,
        currency: newPlan.currency,
        customerId,
        description: `Upgrade to ${newPlan.name} (prorated)`,
      });

      if (!charge.success) {
        throw new PaymentError("Payment failed during plan upgrade");
      }
    }

    // Update the subscription
    const now = new Date();
    const periodEnd = this.calcPeriodEnd(now, newPlan.interval as string);

    const updated = await this.subscriptionRepo.update(params.subscriptionId, {
      planId: new mongoose.Types.ObjectId(params.newPlanId) as any,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    });

    return updated!;
  }

  async cancel(subscriptionId: string): Promise<SubscriptionDocument> {
    const subscription = await this.subscriptionRepo.findById(subscriptionId);
    if (!subscription) throw new NotFoundError("Subscription");

    // Domain entity validates the state allows cancellation (throws if already canceled)
    const entity = new SubscriptionEntity({
      id: subscription._id.toString(),
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
    });

    entity.cancel(); // throws UnprocessableError if invalid

    const updated = await this.subscriptionRepo.update(subscriptionId, {
      status: SubscriptionStatus.CANCELED,
    });

    return updated!;
  }

  async processRenewal(subscriptionId: string): Promise<SubscriptionDocument> {
    const subscription = await this.subscriptionRepo.findById(subscriptionId);
    if (!subscription) throw new NotFoundError("Subscription");

    const plan = await this.planRepo.findById(subscription.planId.toString());
    if (!plan) throw new NotFoundError("Plan");

    const billingContext = new BillingContext(new FlatRateBillingStrategy());
    const amount = billingContext.calculate({ amount: plan.price, currentPeriodStart: subscription.currentPeriodStart, currentPeriodEnd: subscription.currentPeriodEnd });

    const customerId = await this.gateway.createCustomer({ email: "" });
    const charge = await this.gateway.charge({
      amount,
      currency: plan.currency,
      customerId,
      description: `Renewal for plan ${plan.name}`,
    });

    const nextStatus = charge.success ? SubscriptionStatus.ACTIVE : SubscriptionStatus.PAST_DUE;
    const now = new Date();
    const nextPeriodEnd = charge.success ? this.calcPeriodEnd(now, plan.interval as string) : subscription.currentPeriodEnd;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [updated] = await SubscriptionModel.find({ _id: subscriptionId }).session(session);
      await SubscriptionModel.findByIdAndUpdate(subscriptionId, {
        status: nextStatus,
        currentPeriodStart: now,
        currentPeriodEnd: nextPeriodEnd,
      }, { session });

      await InvoiceModel.create(
        [
          {
            subscriptionId: new mongoose.Types.ObjectId(subscriptionId),
            amount,
            currency: plan.currency,
            status: charge.success ? InvoiceStatus.PAID : InvoiceStatus.OPEN,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      return (await this.subscriptionRepo.findById(subscriptionId))!;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async getSubscription(id: string): Promise<SubscriptionDocument> {
    const sub = await this.subscriptionRepo.findById(id);
    if (!sub) throw new NotFoundError("Subscription");
    return sub;
  }

  async getActiveSubscriptionByUserId(userId: string): Promise<SubscriptionDocument | null> {
    return this.subscriptionRepo.findActiveByUserId(userId);
  }

  private calcPeriodEnd(from: Date, interval: string): Date {
    const end = new Date(from);
    switch (interval) {
      case "day":   end.setDate(end.getDate() + 1); break;
      case "week":  end.setDate(end.getDate() + 7); break;
      case "month": end.setMonth(end.getMonth() + 1); break;
      case "year":  end.setFullYear(end.getFullYear() + 1); break;
    }
    return end;
  }
}
