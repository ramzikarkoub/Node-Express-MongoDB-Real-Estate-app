import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./models/post.model.js";
import data from "./fake_posts.js";

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    //  Clear existing posts before seeding
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
