import mongoose from "mongoose";
const reviewSchema=new mongoose.Schema({
    userID:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    productID:{type:mongoose.Schema.Types.ObjectId,ref:"products"},
    ratings:{type:Number,min:0,max:5}
})
export default reviewSchema;
