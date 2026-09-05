import mongoose from "mongoose";
import UserModel from "../features/user/user.model.js";
import counterModel from "../features/counter/counter.schema.js";
import { catagoryModel } from "../features/product/product.repository.js";

const url=process.env.DB_URL;
export const connectUsingMongoose=async()=>{
   
   try
   { 
    await mongoose.connect(url);
console.log("connected using mongoose");
createIndexes();
createCounter();
createCategories();
}
    catch(err){
        console.log(err);
    }

}
const createIndexes = async () => {
        try{
            const productCollection  = mongoose.connection.db.collection("products");
    await productCollection.createIndex({ price: 1 });
await productCollection.createIndex({ name: 1,category:-1 });
await productCollection.createIndex({ des: "text" });}
    catch(err){
console.log(err);
    }
}
const createCounter=async()=>{

       const counters=['cartItemId']
        for(const counter of counters){
        const existingCounter=await counterModel.findOne({_id:counter});
        if(!existingCounter){
            await new counterModel({_id:counter,value:0}).save();
        }}
    }
const createCategories=async()=>{
    const categories=await catagoryModel.find({});
    if(!categories||categories.length==0){
        await catagoryModel.insertMany([{name:"Womens wear"},{name:"Mens wear"},{name:"kids wear"}]);
        
        
    }
}
