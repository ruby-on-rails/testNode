import {asynHandler} from "../utility/asynHandler.js"
import filterModel from "../utility/modelFilter.js"
import {ApiError} from "../utility/ApiError.js"
import {ApiResponse} from "../utility/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadONCloudinay} from "../utility/cloudnary.js"
import jwt from "jsonwebtoken";
const registerUser= asynHandler(async(req,res)=>{

    var model = req.body
    var requireFields = ["password","fullname","email","username"];
  
    const validation = filterModel(model, requireFields);
    if (!validation.isValid) {
        // throw  new ApiError(400,"",validation.errorMessages)
        return res.status(400).json(new ApiError(400,"sfgfd",validation.errorMessages));
    }

   const existedUser=await User.findOne({
$or:[{email:model.email},{username:model.username}]
    })

    
    if(existedUser){
        return res.status(409).json(new ApiError(409,"",["user is already exist"]));
    }

   const avatarLocalPath= req.files?.avatar[0]?.path
   if(!avatarLocalPath){
    return res.status(400).json(new ApiError(409,"avatar image is required"));
  
   }
  const avatar=  await uploadONCloudinay(avatarLocalPath);
  console.log(avatar,'avatar')
if(!avatar){
    return res.status(500).json(new ApiError(500,"",["something went wrong while uploding image"]));
  
}

var createdUser= await User.create({
    fullname:model.fullname,
    email:model.email,
    avatar:avatar.url,
    password:model.password,
    username:model.username,

})


var user=await User.findById(createdUser._id).select("-password -refreshToken");
if(!user){
    return res.status(500).json(new ApiError(500," ",["something went wrong while registering user"]));
}
return res.status(200).json(new ApiResponse(200,user,"user register successfully"))

// return res.status(200).json(new ApiResponse(200,model,"user register successfully"))

   
})

const loginUser= asynHandler(async(req,res)=>{

    var loginModel = req.body;
var requireFields= ["username","password"];
var validation = filterModel(req.body,requireFields);

if(!validation.isValid){
    return res.status(400).json(new ApiError(400,"",validation.errorMessages))
}

var userExist= await User.findOne({
    $or:[{email:loginModel.username},{username:loginModel.username}]
})
if(!userExist){
    return res.status(400).json(new ApiError(400,"",["user is not registerd"]))
}

if(!await userExist.isPasswordCorrect(loginModel.password)){
    return res.status(400).json(new ApiError(400,"",["incorrect password or username"]))
}

var accesToken= userExist.generateAccessToken()
var refreshToken = userExist.gerarateRefreshToken();

userExist.refreshToken = refreshToken; // Update the user document
await userExist.save(); // Save changes

const options= {
    httpOnly:true,
    secure:true
}


return res.status(201).cookie("accessToken",accesToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,accesToken,"user is valide"))

})

const logOutUser= asynHandler(async(req,res)=>{

    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined
        } } ,{
            new:true
        }
    )
    const options= {
        httpOnly:true,
        secure:true
    }

   return  res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200, {},"user logged out"))

})

const accessRefreshToken= asynHandler(async(req,res)=>{
    console.log("start")
    const incomingAccesstoken = req.cookies.refreshToken || req.body.refreshToken;
    console.log("start 1" ,incomingAccesstoken)
    if(!incomingAccesstoken){
        throw new ApiError(401,"invalid user");

    }

    var decodeUser = jwt.verify(incomingAccesstoken,"fdsfjdsfjdjlgfsghkajfioweufrosdjfsd");

        const user = await User.findById(decodeUser._id);
        if(!user){
            throw new ApiError(401,"invalid refresh token ");

        }
console.log("user ",user)
        if(incomingAccesstoken !==user.refreshToken){
            throw  new ApiError(401,"refresh token is expired or used")
        }
        const options= {
            httpOnly:true,
            secure:true
        }

        

        const accestoken = user.generateAccessToken()
        const refreshToken= user.gerarateRefreshToken();
        user.refreshToken=refreshToken;
        user.save();
        return res.status(201).cookie("accessToken",accestoken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{refreshtoken:refreshToken,accesstoken:accestoken},"user refresh successfully"))
})

const changeCurrentPassword= asynHandler(async(req,res)=>{
//    const oldPassword=req.body;
//    const newPassword= req.body;


   var requireFields= ["oldPassword","newPassword"];
   var validation = filterModel(req.body,requireFields);
   
   if(!validation.isValid){
       return res.status(400).json(new ApiError(400,"",validation.errorMessages))
   }
    const user= await User.findById(req.user?.id);

    if(!user){
        throw new ApiError(401,"")
    }
    const isPasswordCorrect= await user.isPasswordCorrect(req.body.oldPassword);
    if(!isPasswordCorrect){
        throw new ApiError(400,"incorrect old password");

    }
    user.password= req.body.newPassword;
    await user.save({validateBeforeSave:false});
    return res.status(200).json(new ApiResponse(200,{},"password changed successfully"));

    
})

const getCurrentUser=asynHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"user fetched "));
})

const getUserChannelProfile= asynHandler(async(req,res)=>{
    const {username}=req.query;
    console.log("username ",username)
    if(!username?.trim()){
        throw new ApiError(400,"username is missing")
    }
    const channel = await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribersFor"
            }
        },{
            $addFields:{
                subscribercount:{
                    $size:"$subscribers"
                },
                subscribesTocount:{
                    $size:"$subscribersFor"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },{
            $project:{
                fullname:1,
                username:1,
                isSubscribed:1,
                subscribesTocount:1,
                subscribercount:1


            }
        }

    ])
    if(!channel?.length){
        throw new ApiError(400,"channel does not exist")
    }

    return res.status(200).json(new ApiResponse(200,channel[0],"user channel fetched successfully"))
})
export {registerUser,loginUser,logOutUser,accessRefreshToken,changeCurrentPassword,getCurrentUser,getUserChannelProfile}