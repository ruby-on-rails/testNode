import { v2 as cloudinary } from 'cloudinary';

import fs from "fs"


cloudinary.config({
    cloud_name:"dtdzg0zvb",
    api_key:"392441931379924",
    api_secret:"j-Do06IxITDxgpIhTaocwacFvKs"
});

const uploadONCloudinay= async(localfilePath)=>{
    try {
        if(!localfilePath)return null
        //upload the file on cloudinay

       const response= await cloudinary.uploader.upload(localfilePath,{
            resource_type:"auto"
        })
        // file has been uploaded successfully
   

        return response;
    } catch (error) {
        
        fs.unlinkSync(localfilePath) // remove the localy save temprary file 
        return null;
    }
}


export { uploadONCloudinay};

