import mongoose from "mongoose";
import OrderModel from "./order.model.js";
import ProductModel from "../product/product.model.js";
import cartModel from "../cartitems/cartitems.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class OrderRepository {

    async placeOrder(userId) {

        const session = await mongoose.startSession();

        try {

            session.startTransaction();
            const cartItems = await cartModel.find({ userID: userId });

console.log("Cart Items:", cartItems); 

            const items = await this.getTotalAmount(userId, session);

            const finalTotalAmount = items.reduce((acc, curr) => {
                return acc + curr.totalAmount;
            }, 0);

            const newOrder = new OrderModel({
                userId,
                totalAmount: finalTotalAmount,
                orderDate: new Date()
            });

            await newOrder.save({ session });
console.log("itm:",items);
            for (const item of items) {

    const product = await ProductModel.findById(
        item.productID,
        null,
        { session }
    );

    if (!product) {
        throw new ApplicationError(
            "Product not found",
            404
        );
    }

    // Check stock
    if (product.stock < item.quantity) {
        throw new ApplicationError(
            `${product.name} has only ${product.stock} item(s) in stock`,
            400
        );
    }

    // Reduce stock
    product.stock -= item.quantity;

    await product.save({ session });
}

            await cartModel.deleteMany(
                { userID: userId },
                { session }
            );

            await session.commitTransaction();

        } catch (err) {

            await session.abortTransaction();

            console.log(err);
            if(err instanceof ApplicationError){
                throw err;
            }

            throw new ApplicationError(
                "Something went wrong in database",
                500
            );

        } finally {

            session.endSession();

        }

    }

    async getTotalAmount(userId, session) {

        try {

            const items = await cartModel.aggregate([
                {
    $match: {
        userID: new mongoose.Types.ObjectId(userId)
    }
},
                {
                    $lookup: {
                        from: "products",
                        localField: "productID",
                        foreignField: "_id",
                        as: "productInfo"
                    }
                },
                {
                    $unwind: "$productInfo"
                },
                {
                    $addFields: {
                        totalAmount: {
                            $multiply: [
                                "$productInfo.price",
                                "$quantity"
                            ]
                        }
                    }
                }
            ]).session(session);

            return items;

        } catch (err) {
    console.log(err);
    throw err;
}

    }

}

export default OrderRepository;