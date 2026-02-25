import { SubscriptionStatus } from "../enums/subscriptionStatus"

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: SubscriptionStatus
  startDate: Date
  currentPeriodEnd: Date
  createdAt: Date
  updatedAt: Date
}