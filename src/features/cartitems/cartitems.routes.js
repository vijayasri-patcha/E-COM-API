import express from "express";
import CartItemsController from "./cartitems.controller.js";
const router=express.Router();
const cartController=new CartItemsController();
router.post("/",(req,res,next)=>cartController.add(req,res,next));
router.get("/",(req,res,next)=>cartController.get(req,res,next));
router.delete("/:id",(req,res,next)=>cartController.delete(req,res,next));

export default router; 