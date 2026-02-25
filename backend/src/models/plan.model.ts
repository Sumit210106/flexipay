import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface PlanDocument extends Document {
  name: String;
  price: number;
  currency: string;
  interval: string;
  organizationId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema: Schema<PlanDocument> = new Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    default: "INR",
  },
  interval: {
    type: String,
    required: true,
    enum: ["day", "week", "month", "year"],
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  }},{
    timestamps: true
  }
);


planSchema.index({ organizationId: 1 })
planSchema.index({ name: 1, organizationId: 1 })

export const PlanModel: Model<PlanDocument> = mongoose.model<PlanDocument>("Plan", planSchema)