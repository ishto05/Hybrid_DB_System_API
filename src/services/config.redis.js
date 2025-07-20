import Redis from "ioredis";

const redisClient = new Redis({
  host: "localhost",
  port: 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});
try {
  redisClient.on("connect", () => {
    console.log("✅ Redis Connected");
  });

  redisClient.on("error", (error) => {
    console.error("❌ Redis Connection Failed:", error);
  });
} catch (err) {
  console.error("❌ Redis setup failed hard:", err);
}

export default redisClient;
