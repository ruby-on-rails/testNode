import { Country } from "../models/country.model.js";
import { Member } from "../models/member.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asynHandler } from "../utility/asynHandler.js";
import filterModel from "../utility/modelFilter.js"



const addCountry= asynHandler(async(req,res)=>{    
    
    const  requireFields= ["countryName","DialingCode"];
    const validation = filterModel(req.body,requireFields);
    
    if(!validation.isValid){
        return res.status(400).json(new ApiError(400,"",validation.errorMessages))
    }

    const country= await Country.create({
        strCountryName:req.body.countryName,
        strDialingCode:req.body.DialingCode
    })
if(!country){
    throw new ApiError(500,"error while adding country");
}

return res.status(200).json(new ApiResponse(200,country,"country added successfully"));

})

const createMember= asynHandler(async(req,res)=>{

    const  requireFields= ["strEnterpriseId","strEmail","strGender","dateBirth","strIDPPNumber","strFirstName","strLastName","intCitizenShipId"];
    const validation = filterModel(req.body,requireFields);
    
    if(!validation.isValid){
        return res.status(400).json(new ApiError(400,"",validation.errorMessages))
    }
    
    const member = await Member.create({
        strLastName:req.body.strLastName,
        strFirstName:req.body.strFirstName,
        strIDPPNumber:req.body.strIDPPNumber,
        dateBirth:req.body.dateBirth,
        strGender:req.body.strGender,
        strEmail:req.body.strEmail,
        strEnterpriseId:req.body.strEnterpriseId,
        intCitizenShipId:req.body.intCitizenShipId,
        strUserId:req.user?._id
    })
    if(!member){
        throw new ApiError(500,"error while creating member ");
    }

    member.intHostprofileId=member._id;
    await member.save()

    return res.status(200).json(new ApiResponse(200, member,"member created successfully"));

})

const getMemberByEnterprise= asynHandler(async(req,res)=>{
    const {strEnterpriseId}= req.query;  
    if(strEnterpriseId==undefined){
        throw new ApiError(400,"enterprise id is required")
    }
    // const  requireFields= ["strEnterpriseId"];
    // const validation = filterModel(params1,requireFields);
    
    // if(!validation.isValid){
    //     return res.status(400).json(new ApiError(400,"",validation.errorMessages))
    // }

    const memberList= await Member.find({strEnterpriseId:strEnterpriseId})
    const member= await Member.aggregate([
        {
            $match:{
                strEnterpriseId:strEnterpriseId
            }
        },
        {
            $lookup:{
                from:"countries",
                localField:"intCitizenShipId",
                foreignField:"_id",
                as:"country"
            }
        },{
            $addFields:{
                countryName: { 
                    $ifNull: [{ $arrayElemAt: ["$country.strCountryName", 0] }, null] 
                },
                countryCode: { 
                    $ifNull: [{ $arrayElemAt: ["$country.strDialingCode", 0] }, null] 
                }
            }
        }
    ])
    if(!memberList.length){
        throw new ApiError(400,"no record found");
    }
    return res.status(200).json(new ApiResponse(200,member,""))

})
export{addCountry,createMember,getMemberByEnterprise}