import express from "express";
import { PORT } from "./config/env.js";
import connectDB from "./database/mongodb.config.js";
import sequelize from "./database/sqldb.config.js";

const app = express();
app.use(express.json());

const startServer = async () => {
  try {
    await connectDB();

    sequelize.sync();

    app.listen(PORT || 4000, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
