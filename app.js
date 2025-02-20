// Import dependencies
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// Initialize app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS
app.use(morgan("dev")); // Logging
dotenv.config();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
