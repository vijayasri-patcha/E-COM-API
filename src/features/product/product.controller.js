import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
import { ApplicationError } from "../../error-handler/applicationError.js";


export default class ProductController {

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(req, res, next) {
        try {
            const products = await this.productRepository.getAll();
            res.status(200).send(products);
        }
        catch (err) {
            next(err);
        }
    }

    async addProduct(req, res, next) {
        try {

            let { name, des, price, categories, stock, sizes } = req.body;
categories = categories
    ? categories.split(",").map(c => c.trim())
    : [];

sizes = sizes
    ? sizes.split(",").map(s => s.trim())
    : [];
const imageUrl = req.file ? req.file.filename : null;
            const newproduct = {
                name,
                des,
                price: parseFloat(price),
                stock: parseInt(stock),
                imageUrl: imageUrl,
                categories,
                sizes
            };
console.log(typeof(categories));
            const createdRecord = await this.productRepository.add(newproduct);

            res.status(201).json(createdRecord);

        }
        catch (err) {
            next(err);
        }
    }
    async getLatestProducts(req, res, next) {
        try {
            const products = await this.productRepository.getLatestProducts();
            res.status(200).json(products);
        }
        catch (err) {
            next(err);
        }
    }

    async getOneProduct(req, res, next) {
        try {

            // ObjectId is a string, so don't use parseInt()
            const id = req.params.id;

            const product = await this.productRepository.get(id);

            if (!product) {
                return res.status(404).send("Product not found");
            }

          return  res.status(200).json(product);

        }
        catch (err) {
            next(err);
        }
    }

    async filterProducts(req, res, next) {
    try {

        const result = await this.productRepository.filter(
            req.query.minPrice,
            req.query.maxPrice,
            req.query.category,
            req.query.search
        );

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

    async rateProduct(req, res, next) {

        const userID = req.userID;
        const productID = req.body.productID;
        const rating = req.body.rating;

        try {

            await this.productRepository.rateProduct(
                userID,
                productID,
              parseInt(rating)
            );

            return res.status(200).json({
    message: "Rating submitted successfully"
});
        }
        catch (err) {
            next(err);
        }}
    async averagePrice(req,res,next){
        try{
       const result= await this.productRepository.averageProductPricePerCategory();
       return res.status(200).send(result);
        }
        catch(err){
            next(err);
        }
    }
    async countOfReviews(req,res,next){
        try{
            const result=await this.productRepository.countOfReviews();
            return res.status(200).send(result);
        }
        catch(err){
            next(err);
        }
    }
    
    
}