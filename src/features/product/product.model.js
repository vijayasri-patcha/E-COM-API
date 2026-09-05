import mongoose from "mongoose";
import productSchema from "./product.schema.js";

const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;