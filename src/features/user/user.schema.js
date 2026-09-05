import mongoose from "mongoose";
import bcrypt from "bcrypt";

 const userSchema=new mongoose.Schema({
    
    name:{type:String,match: [
    /^[A-Za-z]+( [A-Za-z]+)*$/,
    "Name should contain only alphabets with single spaces between words"
]},
    email:{type:String,unique:true,required:true,match: [/^\S+@\S+\.\S+$/, "Please enter valid email(e.g abc@gmail.com)"]},
    password:{type:String,required:true,minlength:[8,"Password should be minimum 8 characters long"]},
    type:{type:String,enum:['Customer','Seller']}
}).pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);
})

export default userSchema;