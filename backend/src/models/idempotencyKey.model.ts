import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IdempotencyKeyDocument extends Document {
  key: string;
  requestHash: string;
  responseSnapshot: string;
  createdAt: Date;
  updatedAt: Date;
}

const idempotencyKeySchema = new Schema<IdempotencyKeyDocument>({
    key : {type : String , required : true , unique : true} ,
    requestHash : {type : String , required : true} ,
    responseSnapshot : {type : String , required : true}
} , {timestamps : true})

idempotencyKeySchema.index({key : 1} , {unique : true})
idempotencyKeySchema.index({ createdAt: 1 })

export const IdempotencyKeyModel : Model<IdempotencyKeyDocument> = 
    mongoose.model<IdempotencyKeyDocument>("IdempotencyKey" , idempotencyKeySchema)
