import { MongoClient } from "mongodb";

let client;
const url=process.env.DB_URL;
const connectToMongodb=()=>{
    
    console.log(url);
    MongoClient.connect(url)
    .then((clientInstance)=>{
        console.log(clientInstance);
         client=clientInstance;
        console.log("db connected successfully");
        createCounter(client.db());
        createIndexes(client.db());
    })
    .catch((err)=>{
        console.log(err);
    })}
    export const getdb=()=>{
        return client.db();
    }
    export const getClient=()=>{
        return client;
    }
    const createCounter=async(db)=>{
       const counters=['cartItemId','productId','userId']
        for(const counter of counters){
        const existingCounter=await db.collection("counters").findOne({_id:counter});
        if(!existingCounter){
            await db.collection("counters").insertOne({_id:counter,value:0});
        }}
    }
    const createIndexes = async (db) => {
        try{
    await db.collection("products").createIndex({ price: 1 });
await db.collection("products").createIndex({ name: 1,category:-1 });
await db.collection("products").createIndex({ des: "text" });}
    catch(err){
console.log(err);
    }
}
export default connectToMongodb;
