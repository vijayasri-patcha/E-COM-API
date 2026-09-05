//manage routes to product controller
//1.import express
import express from "express";
import ProductController from "./product.controller.js";
import upload from "../../middlewares/file.upload.middleware.js"
import jwtAuth from "../../middlewares/jwt.middleware.js";
const productController=new ProductController();
//2.initialize express router
const router=express.Router();
//all the paths to controller methods
//after /api/products rest will come Here
router.get('/',jwtAuth,(req,res,next)=>{productController.getAllProducts(req,res,next)});
router.post('/',upload.single("imageUrl"),jwtAuth,(req,res,next)=>{productController.addProduct(req,res,next)});
router.get('/filter',jwtAuth,    (req,res,next) =>
        productController.filterProducts(req,res,next)
);
router.get('/featured',(req,res,next)=>{productController.getLatestProducts(req,res,next)})
router.get('/averagePrice',jwtAuth,(req,res,next)=>{productController.averagePrice(req,res,next)});
router.get('/countOfReviews',jwtAuth,(req,res,next)=>{productController.countOfReviews(req,res,next)});

router.get('/:id',jwtAuth,(req,res,next)=>{productController.getOneProduct(req,res,next)});
router.post(
    '/rate',
    jwtAuth,
    (req,res,next)=>
        productController.rateProduct(req,res,next)
);


export default router;
