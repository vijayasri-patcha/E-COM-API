import { ObjectId } from "mongodb";
import { getdb } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import reviewSchema from "./review.schema.js";
import productSchema from "./product.schema.js";
import mongoose from "mongoose";
import UserModel from "../user/user.model.js";
import categorySchema from "./category.schema.js";
import productModel from "./product.model.js";

export const reviewModel = mongoose.model("reviews", reviewSchema);
export const catagoryModel = mongoose.model("categories", categorySchema);

class ProductRepository {

    async getAll() {
        try {
            const product = await productModel
                .find({})
                .populate("reviews");

            console.log(product);
            return product;

        } catch (err) {
            throw new ApplicationError(
                "something went wrong in databse so try again after sometime",
                500
            );
        }
    }
    async add(newProduct) {
        try{

            const categoryIds = [];

            for (const categoryName of newProduct.categories) {
console.log(typeof(categoryName));
                const category = await catagoryModel.findOne({
                    name: categoryName
                });

                if (category) {
                    categoryIds.push(category._id);
                } else {
                    throw new ApplicationError(
                        `Category '${categoryName}' not found`,
                        400
                    );
                }
            }

            newProduct.categories = categoryIds;

            return await productModel.create(newProduct);

        } catch (err) {

            if (err instanceof ApplicationError) {
                throw err;
            }

            throw new Error(
                "something went wrong in databse so try again after sometime"
            );
        }
    }

    async get(id) {
        try {

            return await productModel.findOne({ _id: id }).populate("reviews").populate("categories");

        } catch (err) {
            throw new ApplicationError(
                "something went wrong in databse so try again after sometime",
                500
            );
        }
    }

    async filter(minPrice, maxPrice, category, search) {
    try {

        const filterExpression = {};

        // Price filter
        if (minPrice) {
            filterExpression.price = {
                $gte: parseFloat(minPrice)
            };
        }

        if (maxPrice) {
            filterExpression.price = {
                ...filterExpression.price,
                $lte: parseFloat(maxPrice)
            };
        }

        // Category filter
        if (category) {
            console.log("Category received:", category);

            const cat = await catagoryModel.findOne({
    name: { $regex: `^${category}$`, $options: "i" }
});

            console.log("Category found:", cat);

            if (cat) {
                filterExpression.categories = cat._id;
            }
        }

        // Search filter
        if (search) {
            console.log("Search received:", search);

            filterExpression.name = {
                $regex: search,
                $options: "i"
            };
        }

        console.log("Filter:", filterExpression);

        const products = await productModel
            .find(filterExpression)
            .populate("categories");

        console.log("Products:", products);

        return products;

    } catch (err) {
        throw new ApplicationError(
            "Something went wrong in database",
            500
        );
    }
}
    async getLatestProducts() {
    try {
        return await productModel
            .find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("categories");
    } catch (err) {
        throw new ApplicationError(
            "Something went wrong in database",
            500
        );
    }
}

    async rateProduct(userID, productId, rating) {

    try {

        const user = await UserModel.findById(userID);

        if (!user) {
            throw new ApplicationError("User not found", 404);
        }

        const product = await productModel.findById(productId);

        if (!product) {
            throw new ApplicationError("Product not found", 404);
        }

        const userReview = await reviewModel.findOne({
            productID: productId,
            userID: userID
        });

        if (userReview) {

            // Update existing review
            userReview.ratings = rating;
            await userReview.save();

        } else {

            // Create new review
            const newReview = await reviewModel.create({
                productID: productId,
                userID: userID,
                ratings: rating
            });

            product.reviews.push(newReview._id);
        }

        // Recalculate average rating
        const reviews = await reviewModel.find({
            productID: productId
        });

        const total = reviews.reduce(
            (sum, review) => sum + review.ratings,
            0
        );

        product.averageRating = reviews.length > 0
            ? total / reviews.length
            : 0;

        await product.save();

    } catch (err) {

        if (err instanceof ApplicationError) {
            throw err;
        }

        console.log(err);
        throw new Error("Something went wrong in database");
    }
}
    async averageProductPricePerCategory() {
    return await productModel.aggregate([
    {
        $unwind: "$categories"
    },
    {
        $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "category"
        }
    },
    {
        $unwind: "$category"
    },
    {
        $group: {
            _id: "$category.name",
            averagePrice: {
                $avg: "$price"
            }
        }
    }
]);}
  async countOfReviews() {
    try{
  
  return await productModel
    .aggregate([
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          reviewsCount: {
            $sum: {
              $cond: {
                if: { $isArray: "$reviews" },
                then: { $size: "$reviews" },
                else: 0
              }
            }
          }
        }
      },
      {
        $sort: {
          reviewsCount: -1
        }
      },
      {
        $project: {
          
          name: 1,
          countOfReviews: "$reviewsCount"
        }
      }
    ]);
}
catch(err){
  throw new ApplicationError("something went wrong in database",500);
}}}
export default ProductRepository;