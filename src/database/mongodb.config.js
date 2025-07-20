import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  console.error("No Database URI found!");
  process.exit(1);
}

const connectDB = async () => {
  console.log("Initializing connection to MongoDB....");

  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    };

    mongoose.connection.on("error", (err) => {
      console.log("--------------------------------------------------\n")
      console.error("❌ MongoDB connection error:", err);
      console.log("--------------------------------------------------\n")
    });

    mongoose.connection.on("disconnected", () => {
      console.log("--------------------------------------------------\n")
      console.warn("❌ MongoDB disconnected. Attempting to reconnect...");
      console.log("--------------------------------------------------\n")
    });

    mongoose.connection.on("connected", () => {
      console.log("--------------------------------------------------\n")
      console.log("✅ MongoDB connection established");
      console.log("--------------------------------------------------\n")
    });

    mongoose.connection.on("reconnected", () => {
      console.log("--------------------------------------------------\n")
      console.log("✅ MongoDB reconnected");
      console.log("--------------------------------------------------\n")
    });

    if (NODE_ENV === "Development") {
      //debug mode
      mongoose.set("debug", true);
    }

    await mongoose.connect(DB_URI, options);
    console.log("--------------------------------------------------\n")
    console.log(`✅ MongoDB connected in --${NODE_ENV}-- mode`);
    console.log("--------------------------------------------------\n")
  } catch (error) {
    console.log("--------------------------------------------------\n")
    console.error("❌ Failed to connect to database:", error.message);
    process.exit(1);
    console.log("--------------------------------------------------\n")
  }
};

export default connectDB;
