import UserModel from "./user.model.js";
import  {getdb} from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
class UserRepository_old{

 async SignUp(newUser){
        try{
       const db=getdb();
       const collection=db.collection("users");
       const id= await this.getNextCounter(db);
       newUser._id=id;
       await collection.insertOne(newUser);
    return newUser;}
       catch(err){
         throw new ApplicationError("something went wrong with database",500);
       }
        
    }
     async findByEmail(email){
        try{
            const db=getdb();
            const collection=db.collection("users");
           const result= await collection.findOne({"email":email});
           return result;
            
        }
        catch(err){
            throw new ApplicationError("something went wrong in database please try again",500);
        }
     }
     async getNextCounter(db){
       
       const counter = await db.collection("counters")
  .findOneAndUpdate(
    { _id: "userId" },
    { $inc: { value: 1 } },
    {
      upsert: true,
      returnDocument: "after"
    }
  );
  console.log(counter.value);
  console.log(counter.value.value);
  return counter.value;

    }
}
export default UserRepository_old;

