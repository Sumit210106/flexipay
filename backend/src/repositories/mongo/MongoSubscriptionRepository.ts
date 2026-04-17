import { SubscriptionModel, SubscriptionDocument } from "../../models/subscription.model";
import { SubscriptionStatus } from "../../enums/subscriptionStatus";
import { ISubscriptionRepository } from "../interfaces/ISubscriptionRepository";

export class MongoSubscriptionRepository implements ISubscriptionRepository {
  async findById(id: string): Promise<SubscriptionDocument | null> {
    return SubscriptionModel.findById(id);
  }

  async create(data: Partial<SubscriptionDocument>): Promise<SubscriptionDocument> {
    return SubscriptionModel.create(data);
  }

  async update(id: string, data: Partial<SubscriptionDocument>): Promise<SubscriptionDocument | null> {
    return SubscriptionModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await SubscriptionModel.findByIdAndDelete(id);
    return result !== null;
  }

  async findByUserId(userId: string): Promise<SubscriptionDocument[]> {
    return SubscriptionModel.find({ userId });
  }

  async findActiveByUserId(userId: string): Promise<SubscriptionDocument | null> {
    return SubscriptionModel.findOne({ userId, status: SubscriptionStatus.ACTIVE });
  }

  async findByStatus(status: SubscriptionStatus): Promise<SubscriptionDocument[]> {
    return SubscriptionModel.find({ status });
  }

  async findExpired(before: Date): Promise<SubscriptionDocument[]> {
    return SubscriptionModel.find({
      status: SubscriptionStatus.ACTIVE,
      currentPeriodEnd: { $lte: before },
    });
  }
}
