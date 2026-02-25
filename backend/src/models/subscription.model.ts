import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { SubscriptionStatus } from "../enums/subscriptionStatus";

export interface SubscriptionDocument extends Document {
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema: Schema<SubscriptionDocument> = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      required: true,
    },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
  },
  {
    timestamps: true,
  },
);

subscriptionSchema.index({ userId: 1 })
subscriptionSchema.index({ planId: 1 })
subscriptionSchema.index({ status: 1 })
subscriptionSchema.index({ userId: 1, status: 1 })

export const SubscriptionModel: Model<SubscriptionDocument> =
  mongoose.model<SubscriptionDocument>("Subscription", subscriptionSchema)