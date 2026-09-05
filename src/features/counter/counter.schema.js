import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    _id:{
        type:String
    },
value:{
    type:Number
}
})
const counterModel=mongoose.model("counters",counterSchema);
export default counterModel;