import mongoose from "mongoose";
import UserModel from "./user.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class UserRepository {

    // ==================== SIGNUP ====================

    async SignUp(user) {
        try {

            const newUser = new UserModel(user);

            await newUser.save();

            return newUser;

        } catch (err) {

            if (err instanceof mongoose.Error.ValidationError) {
                throw new ApplicationError(
                    err.message,
                    400
                );
            }

            if (err.code === 11000) {
                throw new ApplicationError(
                    "Email already exists",
                    400
                );
            }

            throw new ApplicationError(
                "Something went wrong with database",
                500
            );
        }
    }


    // ==================== FIND BY EMAIL ====================

    async findByEmail(email) {
        try {

            return await UserModel.findOne({
                email
            });

        } catch (err) {

            throw new ApplicationError(
                "Something went wrong with database",
                500
            );
        }
    }


    // ==================== FIND BY ID ====================

    async findById(userID) {
        try {

            return await UserModel.findById(userID);

        } catch (err) {

            if (err instanceof mongoose.Error.CastError) {
                throw new ApplicationError(
                    "Invalid user ID",
                    400
                );
            }

            throw new ApplicationError(
                "Something went wrong with database",
                500
            );
        }
    }


    // ==================== RESET PASSWORD ====================

    async resetPassword(newPassword, userID) {
        try {

            const user = await UserModel.findOne({
                _id: userID
            });

            if (!user) {
                throw new ApplicationError(
                    "User not found",
                    404
                );
            }

            user.password = newPassword;

            await user.save();

        } catch (err) {

            if (err instanceof ApplicationError) {
                throw err;
            }

            if (err instanceof mongoose.Error.ValidationError) {
                throw new ApplicationError(
                    err.message,
                    400
                );
            }

            throw new ApplicationError(
                "Something went wrong with database",
                500
            );
        }
    }
}

export default UserRepository;