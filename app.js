// Import dependencies
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";

// Initialize app
const app = express();
app.use(cookieParser());

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ramzillow-ramzikarkoubs-projects.vercel.app",
      "https://ramzillow-7mtm8kt0d-ramzikarkoubs-projects.vercel.app/",
    ],
    credentials: true,
  })
);
app.use(morgan("dev")); // Logging
dotenv.config();

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
