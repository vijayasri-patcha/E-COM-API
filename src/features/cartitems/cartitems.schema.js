import mongoose from "mongoose";
const cartSchema=new mongoose.Schema({
    productID:{type:mongoose.Schema.Types.ObjectId,ref:"products"},
    userID:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    quantity:{type:Number,default:1,min:0},
    size: {
        type: String,
        required: true
    }
})
export default cartSchema;