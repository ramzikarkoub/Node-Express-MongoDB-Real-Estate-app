import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  if (process.env.NODE_ENV !== "test") {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected...");
    } catch (err) {
      console.error(`MongoDB connection error: ${err.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
