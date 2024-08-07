import mongoose from "mongoose";

const countrySchema= new mongoose.Schema({
    strCountryName:{
        type:String,
        require:true
    },
    strDialingCode:{
        type:String,
        require:true
    }
})
export const Country= mongoose.model("Country",countrySchema);