import mongoose from "mongoose";
import orderSchema from "./order.schema.js";

const OrderModel = mongoose.model("orders", orderSchema);

export default OrderModel;