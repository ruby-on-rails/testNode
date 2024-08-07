import mongoose, { Schema, Types } from "mongoose";

const memberSchema= new mongoose.Schema({
         strLastName:{
            type:String,
            require:true
         },
         strFirstName:{
            type:String,
            require:true
         },
         strOthersName:{
            type:String
       
         },
         strIDPPNumber:{
            type:String,
            require:true
         },
         dateBirth:{
            type:Date,
            require:true
         },
         strGender:{
            type:String,
            require:true,
            length:1
         },
         strEmail:{
            type:String,
            require:true
         },
         strEnterpriseId:{
            type:String,
            require:true
         },
         intHostprofileId:{
            type:Schema.Types.ObjectId,
            ref:"Member"
         },
         intCitizenShipId:{
            type:Schema.Types.ObjectId,
            ref:"Country"
         },
         strUserId:{
            type:Schema.Types.ObjectId,
            ref:"User"
         }


})



export const Member= mongoose.model("Member",memberSchema)