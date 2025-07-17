import express from "express";
import { PORT } from "./config/env.js";
import connectDB from "./database/mongodb.config.js";
import sequelize from "./database/sqldb.config.js";
import testRouter from "./routes/data.routes.js";
import userAuthRoute from "./routes/user.auth.route.js";
import redisClient from "./redis/config.redis.js";

const app = express();
app.use(express.json());

app.use("/api/v1/test", testRouter);
app.use("/api/v1/auth", userAuthRoute);

const startServer = async () => {
  try {
    await connectDB();

    sequelize.sync();

    await redisClient.ping();

    app.listen(PORT || 4000, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
