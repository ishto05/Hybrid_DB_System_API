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
    console.log("--------------------------------------------------\n")
    console.log("✅ Redis Connected");
    console.log("--------------------------------------------------\n")
  });

  redisClient.on("error", (error) => {
    console.log("--------------------------------------------------\n")
    console.error("❌ Redis Connection Failed:", error);
    console.log("--------------------------------------------------\n")
  });
} catch (err) {
  console.log("--------------------------------------------------\n")
  console.error("❌ Redis setup failed hard:", err);
  console.log("--------------------------------------------------\n")
}

export default redisClient;
