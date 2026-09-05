import mongoose, { Mongoose } from "mongoose";
const likeSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"likeableType"
    },
    likeableType:{
        type:String,
        enum:["products","categories"]
        }
})
export default likeSchema;