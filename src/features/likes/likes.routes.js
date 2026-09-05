import express from "express";
import LikesController from "./likes.controller.js";
const likesController=new LikesController();
const router=express.Router();

router.post("/",(req,res,next)=>{
    likesController.LikeItem(req,res,next);
});
router.get("/",(req,res,next)=>{
    likesController.getLikes(req,res,next);
});
export default router;