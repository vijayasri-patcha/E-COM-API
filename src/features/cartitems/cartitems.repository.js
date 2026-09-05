
import { getdb } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import cartModel from "./cartitems.model.js";

class CartItemRepository{
async add(productID, userID, quantity, size) {
    try {

        const existing = await cartModel.findOne({
    productID,
    userID,
    size
});
        if (existing) {

            existing.quantity += quantity;

            if (existing.quantity <= 0) {
                await existing.deleteOne();
            } else {
                await existing.save();
            }

        } else {

            // Don't create a cart item if quantity is 0 or negative
            if (quantity > 0) {
                await cartModel.create({
    productID,
    userID,
    quantity,
    size
});
            }

        }

    } catch (err) {
        console.log(err);
        throw new ApplicationError(
            "Something went wrong in database",
            500
        );
    }
}
    
    async get(userID){
        try{
        
       return  await cartModel.find({userID:userID}).populate({path:"productID",select:"name price imageUrl"});}

        catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in databse",500);
        }
    }
    async delete(cartItemID,userID){
        try{
        
        console.log("cartItemID:", cartItemID);
console.log("userID:", userID);
       const result=  await cartModel.deleteOne({_id:cartItemID,userID:userID})
       console.log(result);
    return result.deletedCount>0;}
        catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in databse",500);
        }
        

    }
    
}
export default CartItemRepository;