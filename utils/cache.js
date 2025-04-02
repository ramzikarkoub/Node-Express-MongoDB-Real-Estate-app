import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

if (process.env.NODE_ENV !== "test") {
  client
    .connect()
    .then(() => console.log("✅ Redis connected successfully"))
    .catch((err) => console.error("❌ Redis connection error:", err));
}

export default client;
