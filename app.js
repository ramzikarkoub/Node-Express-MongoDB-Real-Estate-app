import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";

const app = express();

// Connect to DB ONLY if not testing
if (process.env.NODE_ENV !== "test") {
  connectDB();
}
app.set("port", process.env.PORT || 5000);
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
const allowedOrigins = [
  "http://localhost:5173",
  "https://ramzillow-ramzikarkoubs-projects.vercel.app", // main
  "https://ramzillow-ramzikarkoub-ramzikarkoubs-projects.vercel.app", // feature/in-progress
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

// Start server ONLY if not testing
if (process.env.NODE_ENV !== "test") {
  const PORT = app.get("port");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
