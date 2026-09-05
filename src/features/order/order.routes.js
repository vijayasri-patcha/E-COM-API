import express from "express";
import OrderController from "./order.controller.js";
import upload from "../../middlewares/file.upload.middleware.js"
const orderController=new OrderController();
//2.initialize express router
const router=express.Router();
router.post("/",(req,res,next)=>{
    orderController.placeOrder(req,res,next);
})
export default router;