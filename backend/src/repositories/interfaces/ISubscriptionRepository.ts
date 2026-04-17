import { IBaseRepository } from "./IBaseRepository";
import { SubscriptionDocument } from "../../models/subscription.model";
import { SubscriptionStatus } from "../../enums/subscriptionStatus";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionDocument> {
  findByUserId(userId: string): Promise<SubscriptionDocument[]>;
  findActiveByUserId(userId: string): Promise<SubscriptionDocument | null>;
  findByStatus(status: SubscriptionStatus): Promise<SubscriptionDocument[]>;
  findExpired(before: Date): Promise<SubscriptionDocument[]>;
}
