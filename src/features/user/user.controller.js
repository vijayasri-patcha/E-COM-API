
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {

    constructor() {
        this.userRepository = new UserRepository();
    }


    // ==================== SIGNUP ====================

    async signUp(req, res, next) {
        try {

            const { name, email, password, type } = req.body;

            const user = {
                name,
                email,
                password,
                type
            };

            const savedUser =
                await this.userRepository.SignUp(user);

            return res.status(201).json({
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                type: savedUser.type
            });

        } catch (err) {
            next(err);
        }
    }


    // ==================== SIGNIN ====================

    async signIn(req, res, next) {
        try {

            const { email, password } = req.body;

            const user =
                await this.userRepository.findByEmail(email);

            if (!user) {
                return res.status(400).json({
                    message: "Incorrect Credentials"
                });
            }

            const isMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isMatch) {
                return res.status(400).json({
                    message: "Incorrect Credentials"
                });
            }

            // Create JWT
            const token = jwt.sign(
                {
                    userId: user._id,
                    email: user.email,
                    type: user.type
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            // Store JWT in HttpOnly cookie
            res.cookie("token", token, {
                httpOnly: true,

                // false for localhost
                // true for production HTTPS
                secure: process.env.NODE_ENV === "production",

                sameSite: "lax",

                maxAge: 60 * 60 * 1000
            });

            return res.status(200).json({
                message: "Login Successful",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    type: user.type
                }
            });

        } catch (err) {
            next(err);
        }
    }


    // ==================== CURRENT USER ====================

    async getCurrentUser(req, res, next) {
        try {

            // req.userID is added by jwtAuth middleware
            const user =
                await this.userRepository.findById(
                    req.userID
                );

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                type: user.type
            });

        } catch (err) {
            next(err);
        }
    }


    // ==================== RESET PASSWORD ====================

    async resetPassword(req, res, next) {
        try {

            const { newPassword } = req.body;

            await this.userRepository.resetPassword(
                newPassword,
                req.userID
            );

            return res.status(200).json({
                message: "Password updated successfully"
            });

        } catch (err) {
            next(err);
        }
    }


    // ==================== SIGNOUT ====================

    async signout(req, res, next) {
        try {

            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            });

            return res.status(200).json({
                message: "Logout Successful"
            });

        } catch (err) {
            next(err);
        }
    }
}
