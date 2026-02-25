import mongoose , {Schema , Document , Model } from 'mongoose' ;

export interface WebhookEventDocument extends Document {
    type : String , 
    payload : Record<string , any> , 
    processed : boolean ,
    receivedAt : Date , 
    createdAt : Date ,
    updatedAt : Date 
}

const webHookEventSchema = new Schema<WebhookEventDocument>({
    type : {type : String , required : true} ,
    payload : {type : Schema.Types.Mixed , required : true} ,
    processed : {type : Boolean , default : false} ,
    receivedAt : {type : Date , default : Date.now}
} , {timestamps : true})

webHookEventSchema.index({type : 1})
webHookEventSchema.index({processed : 1})
webHookEventSchema.index({receivedAt : 1})

export const WebhookEventModel : Model<WebhookEventDocument> = 
    mongoose.model<WebhookEventDocument>("WebhookEvent" , webHookEventSchema)


    