import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  console.error("No Database URI found!");
  process.exit(1);
}

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    };

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("❌ MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connection established");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });

    if (NODE_ENV === "Development") {
      //debug mode
      mongoose.set("debug", true);
    }

    await mongoose.connect(DB_URI, options);
    console.log(`✅ MongoDB connected in --${NODE_ENV}-- mode`);
  } catch (error) {
    console.error("❌ Failed to connect to database:", error.message);
    process.exit(1);
  }
};

export default connectDB;
