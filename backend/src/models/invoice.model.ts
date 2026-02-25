import mongoose , {Schema , Document , Model ,Types} from "mongoose" ;
import {InvoiceStatus} from "../enums/invoiceStatus";

export interface InvoiceDocument extends Document {
    amount : number ; 
    currency : string ;
    subscriptionId : Types.ObjectId ;
    status : InvoiceStatus ;
    createdAt : Date ;
    updatedAt : Date ;
}

const invoiceSchema : Schema<InvoiceDocument> = new Schema( {
    amount : {type : Number , required : true , min : 0} ,
    currency : {type : String , required : true , uppercase : true , trim : true , default : "INR"} ,
    subscriptionId : {type : Schema.Types.ObjectId , ref : "Subscription" , required : true} ,
    status : {type : String , required : true , enum : Object.values(InvoiceStatus)}
} ,{timestamps : true} )

invoiceSchema.index({ subscriptionId: 1 })
invoiceSchema.index({ status: 1 })
invoiceSchema.index({ createdAt: -1 })

export const InvoiceModel: Model<InvoiceDocument> = mongoose.model<InvoiceDocument>("Invoice", invoiceSchema)