import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import likeSchema from "./likes.schema.js";
const likeModel=mongoose.model("likes",likeSchema);
class LikesRepository{
    async likeProduct(userId,productId){
        try{
            const newLike=new likeModel({
        userId:userId,
        likeable:productId,
        likeableType:"products"
    });
    await newLike.save();}
catch(err){
    throw new Error("Something went wrong in the database. Please try again later.");
}}
async likeCategory(userId,categoryId){
        try{
            const newLike=new likeModel({
        userId:userId,
        likeable:categoryId,
        likeableType:"categories"
    });
    await newLike.save();}
catch(err){
    throw new Error("Something went wrong in the database. Please try again later.");
}}
async getLikes(id,type){
    try{
        return await likeModel.find({ likeable: id, likeableType: type }).populate({
        path: "userId",
        select: "name email type"
    })
.populate({
    path: "likeable",
    model: type,
    select: "name des"
});;
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong in the database. Please try again later.");
    }
}

}
export default LikesRepository;