

import mongoose from "mongoose";
import { db_name } from "../constants.js";

const dbConnect = async ()=>{
    try{
      
      const connectionInstance=  await mongoose.connect(`mongodb+srv://manish:v05Dth2Saz@cluster0.beybim1.mongodb.net/test`)
    console.log("mongodb connected  ",connectionInstance.connection.host)
    }catch(error){
        console.log(error,'errr')
        process.exit(1)
    }
}

export default  dbConnect