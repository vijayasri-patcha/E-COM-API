import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    
    name: String,
    des: String,
    price: Number,
    stock: Number,
    imageUrl: String,
    reviews:[{type:mongoose.Schema.Types.ObjectId,ref:"reviews"}],
    categories:[
        {type:mongoose.Schema.Types.ObjectId,ref:"categories"}
    ],
    sizes:[String],
averageRating: {
    type: Number,
    default: 0
}},
    {
    timestamps: true,
  }
);

export default productSchema;