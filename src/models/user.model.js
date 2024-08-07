import mongoose,{Schema} from "mongoose"
// import jwt from jsonwebtoken
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        lowecase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowecase:true,
        trim:true,
        
    },
    fullname:{
        type:String,
        required:true,
        
        lowecase:true,
        trim:true,
       
    },
    avatar:{
        type:String,
        required:true
      
    },
    coverImage:{
        type:String
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})


userSchema.pre("save",async function (next){
if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
next();
})

userSchema.methods.isPasswordCorrect =  async function (password){

 return  await  bcrypt.compare(password,this.password);


}

userSchema.methods.generateAccessToken= function (){
return jwt.sign({
    _id:this._id,
    email:this.email,
    username:this.username,
    fullname:this.fullname

},"fdsfjdsfjdjlgfsghkajfioweufrosdjfsd",{expiresIn:"1d"})
}
userSchema.methods.gerarateRefreshToken=function (){
  return   jwt.sign({
        _id:this._id     
    },"fdsfjdsfjdjlgfsghkajfioweufrosdjfsd",{expiresIn:"10d"})
    }
export const User= mongoose.model("User",userSchema);