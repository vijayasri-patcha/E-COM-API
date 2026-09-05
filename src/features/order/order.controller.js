import OrderRepository from "./order.repository.js";

class OrderController{
    constructor(){
        this.orderRepository=new OrderRepository();
    }
    async placeOrder(req,res,next){
        try{
const userId = req.userID;
console.log(userId,"place");
await this.orderRepository.placeOrder(userId);

res.status(201).send("order is created");
        }
        catch(err){
            next(err);
        }
    }
}
export default OrderController;