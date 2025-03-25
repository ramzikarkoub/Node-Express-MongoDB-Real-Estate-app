import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ramzillow-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-7mtm8kt0d-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow.vercel.app",
      "https://ramzillow-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-cy71afymb-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-gd850yjys-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-ramzikarkoub-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-o0rz80xs7-ramzikarkoubs-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

let server;
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 4000;
  server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export { app, server };
