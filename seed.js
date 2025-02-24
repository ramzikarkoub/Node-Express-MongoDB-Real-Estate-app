import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./models/post.model.js"; // Adjust the path to your Post model
import data from "./fake_posts.js"; // Adjust the path to your fake data

dotenv.config(); // Load environment variables

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Optional: Clear existing posts before seeding
    await Post.deleteMany();

    // Insert the fake data
    await Post.insertMany(data);

    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
