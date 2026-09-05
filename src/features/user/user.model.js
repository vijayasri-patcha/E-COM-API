import mongoose from "mongoose";
import userSchema from "./user.schema.js";

 const UserModel = mongoose.model("users", userSchema);
 export default UserModel;