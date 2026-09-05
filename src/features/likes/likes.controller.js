import LikesRepository from "./likes.repositry.js";

class LikesController {
    constructor(){
        this.likesRepository = new LikesRepository();
    }
    async LikeItem(req, res,next) {
    const { id, type } = req.body;
    const userId =    req.userID;
    try {
        if(type!=="products"&&type!=="categories"){
            return res.status(400).send({message:"Invalid likeable type. Must be either 'products' or 'categories'."});
         }
         if(type==="products"){
await this.likesRepository.likeProduct( userId,id);
        res.status(201).send( "Product liked successfully");
         }
         else{
await this.likesRepository.likeCategory( userId,id);
        res.status(201).send( "Category liked successfully");
         }
}
        catch(err){
            next(err);
        } }
        async getLikes(req,res,next){
            const {id,type}=req.query;
            try{
                const likes=await this.likesRepository.getLikes(id,type);
                res.status(200).send(likes);
            }
            catch(err){
                next(err);
            }
        }
    
    async likedCategories(req,res,next){
        const userId=req.userID;
        try{
            const likedCategories=await this.likesRepository.getLikedCategories(userId);
            res.status(200).send(likedCategories);
        }
        catch(err){
            next(err);
        }
    }
}
export default LikesController;