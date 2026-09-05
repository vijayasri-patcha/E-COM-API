import CartModel from "./cartitems.model.js";
import CartItemRepository from "./cartitems.repository.js";
export default class CartItemsController{
  constructor(){
    this.cartItemsRepository=new CartItemRepository();
  }
   async add(req, res, next) {
    try {
        console.log("Controller Start");

        const { productID, quantity, size } = req.body;
        const userID = req.userID;

        console.log("Before Repository");

        await this.cartItemsRepository.add(productID, userID, parseInt(quantity),size);

        console.log("After Repository");

        return res.status(201).json({
            message: "Cart updated"
        });

    } catch (err) {
        console.log("Controller Error:", err);
        next(err);
    }
}
    async get(req,res,next){
      try{
      const userID=req.userID;
     const items= await this.cartItemsRepository.get(userID);
     return res.status(200).send(items);}
     catch(err){
      next(err);
     }
    }
   async delete(req,res,next){
    try{
      const userID=req.userID;
      const cartItemID=req.params.id;
      const isDeleted=await this.cartItemsRepository.delete(cartItemID,userID);
      if(!isDeleted){
        return res.status(404).send("Item not found");
      }
      
        return res.status(200).send("cart Item deleted successfully");
    }
    catch(err){
      next(err);
    }
    }
}