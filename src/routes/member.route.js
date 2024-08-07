import { Router } from "express";
import { addCountry, createMember, getMemberByEnterprise } from "../controllers/member.contoller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";



const router= Router();

router.post("/addCountry",verifyJwt,addCountry)
router.post("/addMember",verifyJwt,createMember)
router.get("/getMemberByEnterprise",verifyJwt,getMemberByEnterprise)

export default router;  