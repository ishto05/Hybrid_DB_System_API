import BlobSchema from "../models/mongo/mongo.record.js";
import record from "../models/sql/sql.record.js";
import redisClient from "../services/config.redis.js";
import { ROUTING_KEYS } from "../config/rabbitmq_keys/rabbitmq.keys.js";
import { publishToQueue } from "../services/rabbitmq/producer/producer.js";

export const uploadData = async (req, res) => {
  try {
    const { structured, data } = req.body;
    const userId = req.user.id; // sent by authguard

    if (!data || typeof structured !== "boolean") {
      return res.status(400).json({
        status: "error",
        message: "Missing or invalid data/structured flag.",
      });
    }

    // Determine routing key based on structured flag for producer of rabbitMQ

    const routingKey = structured
      ? ROUTING_KEYS.SQL_SAVE
      : ROUTING_KEYS.MONGO_SAVE;

    //preparing payload for producer
    const payload = {
      userId,
      data,
    };

    await publishToQueue(routingKey, payload);

    return res.status(202).json({
      status: "accepted",
      message: "Data queued for async processing.",
    });
    // //separating structured data
    // if (structured) {
    //   //store in sql
    //   const datarecord = await record.create({ ...data, userId });

    //   return res.status(201).json({
    //     status: "success",
    //     message: "Structured data stored in SQL.",
    //     datarecord,
    //   });
    // }
    // //separating unstructured data
    // else {
    //   //store in mongo
    //   const blob = await BlobSchema.create({ payload: data, userId });
    //   return res.status(201).json({
    //     status: "success",
    //     message: "Unstructured data stored in MongoDB.",
    //     blob,
    //   });
    // }
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to store data.",
    });
  }
};

export const getData = async (req, res) => {
  try {
    const userId = req.user.id;
    //redis cache key
    const cacheKey = `user:data:${userId}`;

    // check redis
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        status: "success (from cache)",
        ...JSON.parse(cached),
      });
    }

    //If no cache → get from DBs
    //SQL data
    const structured = await record.findAll({ where: { userId } });

    //MONGO data
    const unstructured = await BlobSchema.find({ userId });

    const responseData = {
      message: "User data retrieved successfully.",
      structured,
      unstructured,
    };

    // Store in Redis with TTL (5 mins)
    await redisClient.setex(cacheKey, 50, JSON.stringify(responseData));

    return res.status(200).json({
      status: "success",
      ...responseData,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    console.error("Redis/Data error:", error);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};
