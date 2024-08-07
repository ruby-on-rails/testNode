
// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
import dbConnect from "./db/db.js";
import { app } from "./app.js";
dotenv.config({
    path:'./env'
})
dbConnect().then(()=>{
    
    app.listen(5000,()=>{
        console.log("server is running on port ")
    })

//     app.get('/',(req, resp)=>{
// resp.send("this is my first api")
//     })
//     app.get('/customer',(req, resp)=>{
//         resp.send("this is my first api for customer")
//             })
   
}
   
).catch((eror)=>{
    console.log("db connection failed ",eror)
});



// import express from express
// const app= express();
  

// (async ()=>{
// try{
// await mongoose.connect(`${process.env.MONGODB_URi}/${db_name}`)
// app.on("eror",(eror)=>{
//     console.log("eror", eror)
//     throw eror
// })

// app.listen(process.env.PORT,()=>{
//     console.log("server is running on ", process.env.PORT)
// })
// }catch(eror){
// console.log(eror)
// }
// })()