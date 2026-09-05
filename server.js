import "./env.js";

import express from "express";
import swagger from "swagger-ui-express";
import ProductRouter from "./src/features/product/product.routes.js";
import UserRouter from "./src/features/user/user.routes.js";
import upload from "./src/middlewares/file.upload.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cartitems/cartitems.routes.js";
import apiDocs from "./swagger.json" with { type: "json" };
import cors from "cors";
import cookieParser from "cookie-parser";

import loggerMiddleware, {
    logger
} from "./src/middlewares/logger.middleware.js";

import { ApplicationError } from "./src/error-handler/applicationError.js";
import connectToMongodb from "./src/config/mongodb.js";
import OrderRouter from "./src/features/order/order.routes.js";
import LikesRouter from "./src/features/likes/likes.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";

import path from "path";


const server = express();


// ===============================
// CORS
// ===============================

server.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);


// ===============================
// Body Parser
// ===============================

server.use(express.json());


// ===============================
// Cookie Parser
// ===============================

server.use(cookieParser());


// ===============================
// Logger
// ===============================

server.use(loggerMiddleware);


// ===============================
// Swagger
// ===============================

server.use(
    "/api-docs",
    swagger.serve,
    swagger.setup(apiDocs)
);


// ===============================
// Routes
// ===============================

// User routes
// Login does NOT require JWT
server.use("/api/user", UserRouter);


// Product routes
server.use("/api/products", ProductRouter);


// Protected routes
server.use(
    "/api/order",
    jwtAuth,
    OrderRouter
);

server.use(
    "/api/cartItems",
    jwtAuth,
    cartRouter
);

server.use(
    "/api/likes",
    jwtAuth,
    LikesRouter
);


// ===============================
// Test Route
// ===============================

server.get("/test", (req, res) => {

    console.log("Test route reached");

    res.send({
        message: "Test route reached"
    });

});


// ===============================
// Root Route
// ===============================

server.get("/", (req, res) => {

    res.send("Welcome to Ecommerce APIs");

});


// ===============================
// Static Files
// ===============================

server.use(
    "/uploads",
    express.static(
        path.join(process.cwd(), "uploads")
    )
);


// ===============================
// Error Handler
// ===============================

server.use((err, req, res, next) => {

    if (err instanceof ApplicationError) {

        return res
            .status(err.code)
            .send(err.message);
    }

    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
    });

    return res
        .status(500)
        .send(
            "Something went wrong. Please try later."
        );

});


// ===============================
// 404 Handler
// ===============================

server.use((req, res) => {

    res
        .status(404)
        .send(
            "API not found. Please check our documentation for more information at http://localhost:3200/api-docs/"
        );

});


// ===============================
// Start Server
// ===============================

server.listen(3200, () => {

    console.log("listening on port 3200");

    // connectToMongodb();

    connectUsingMongoose();

});