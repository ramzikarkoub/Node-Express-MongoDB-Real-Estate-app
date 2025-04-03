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
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ramzillow-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-git-feature-in-progress-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-7mtm8kt0d-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow.vercel.app",
      "https://ramzillow-cy71afymb-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-gd850yjys-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-ramzikarkoub-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-o0rz80xs7-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-a0y7stc0w-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-fw1forblz-ramzikarkoubs-projects.vercel.app",
    ],
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
