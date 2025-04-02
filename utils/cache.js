import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL not defined in .env");
}

const redisClient = createClient({ url: redisUrl });

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.connect().then(() => {
  console.log("Redis connected");
});

export default redisClient;
