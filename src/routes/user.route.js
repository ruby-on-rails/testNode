import { Router } from "express";   
import { loginUser, registerUser,logOutUser ,accessRefreshToken, changeCurrentPassword, getCurrentUser, getUserChannelProfile} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router= Router();
router.post("/register",upload.fields([
    {
        name:"avatar",
        maxCount:1
    }
]),registerUser);
router.post("/userLogin",loginUser)
router.get("/userLogout",verifyJwt,logOutUser)
router.post("/refreshToken",accessRefreshToken)
router.post("/changePassword",verifyJwt,changeCurrentPassword)
router.post("/getCurrentUser",verifyJwt,getCurrentUser)
router.get("/getCurrengetUserChannel",verifyJwt,getUserChannelProfile)

// router.route("/register").post(registerUser)
export default router;
