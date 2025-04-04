// utils/cache.js
import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

let redisClient = {
  get: async () => null,
  setEx: async () => null,
  flushAll: async () => null,
  quit: async () => null,
};

if (redisUrl && process.env.NODE_ENV !== "test") {
  redisClient = createClient({ url: redisUrl });

  redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
  });

  redisClient.connect().then(() => {
    console.log("Redis connected");
  });
}

export default redisClient;
