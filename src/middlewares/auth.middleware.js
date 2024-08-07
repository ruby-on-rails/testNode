import { User } from "../models/user.model.js";
import { ApiError } from "../utility/ApiError.js";
import { asynHandler } from "../utility/asynHandler.js";
import jwt from "jsonwebtoken"

export const verifyJwt= asynHandler(async(req,res,next)=>{

 try {
       var token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
       console.log("token ",token)
   
       if(!token){
           throw new ApiError(401,"unauthorized user");
       }
       var decodeToken = jwt.verify(token,"fdsfjdsfjdjlgfsghkajfioweufrosdjfsd");
   
       var user =await User.findById(decodeToken._id);
         if(!user){
           throw new ApiError(401, "invalid user");
         }
   
         req.user= user;
         next();
 } catch (error) {
    throw new ApiError(401, error?.message|| "Invalid acces token")
 }
 

})

