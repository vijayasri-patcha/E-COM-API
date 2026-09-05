import cartSchema from "./cartitems.schema.js";
import mongoose from "mongoose";

const cartModel = mongoose.model("cartitems", cartSchema);
export default cartModel;