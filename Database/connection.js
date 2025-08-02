import mongoose from "mongoose";

const db_connection = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION);
    console.log("Database is connected");
  } catch (error) {
    console.log("error in db connection");
  }
};

export default db_connection;
