import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";
const router=express.Router();
const userController=new UserController();
router.post("/signin",(req,res,next)=>{
    userController.signIn(req,res,next);
});
router.post("/signup",(req,res,next)=>{
    userController.signUp(req,res,next);
});
router.get("/me", jwtAuth, (req,res,next)=>{userController.getCurrentUser(req,res,next)});
router.post("/signout",(req,res,next)=>{
    userController.signout(req,res,next);});
router.put("/resetpassword",jwtAuth,(req,res,next)=>{
    userController.resetPassword(req,res,next);
});
export default router; 