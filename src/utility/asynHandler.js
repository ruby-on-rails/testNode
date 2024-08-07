const asynHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}
export {asynHandler}



// const asynHandler1=(fn)=>{
// async (req,resp,next)=>{
// try {
    
// } catch (error) {
//     resp.status(error.code||500).json({
//         success:false,
//         message:error.message
//     })
// }
// }
// }