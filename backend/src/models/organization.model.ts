import mongoose , {Schema , Document , Model} from "mongoose" ;

export interface OrganizationDocument extends Document {
    name : string ;
    createdAt : Date ;
    updatedAt : Date ;
}

const organizationSchema : Schema<OrganizationDocument> = new Schema(
    {name : {type : String , required : true , trim : true}} , 
    {timestamps : true}
)

organizationSchema.index({name : 1} , {unique : true})

export const Organization : Model<OrganizationDocument> = 
    mongoose.model<OrganizationDocument>("Organization" , organizationSchema) 
