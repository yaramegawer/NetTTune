import mongoose from "mongoose"

export const connectDB=async()=>{
    await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(()=>console.log("Mongodb connected successfully"))
    .catch((err)=>console.log("Error connecting to mongoDB",err));
};