import mongoose , {Schema , Document , Model , Types} from "mongoose";

export interface UserDocument extends Document {
    email : string ;
    organizationId : Types.ObjectId ;
    createdAt : Date ;
    updatedAt : Date ;
}

const userSchema : Schema<UserDocument> = new Schema(
    {
        email : {type: String , required :true , lowercase : true , trim : true} ,
        organizationId : {type : Schema.Types.ObjectId , ref : "Organization" , required : true} ,
    },
    {timestamps : true}
)

userSchema.index({ email: 1 })
userSchema.index({ organizationId: 1 }) 

export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema)