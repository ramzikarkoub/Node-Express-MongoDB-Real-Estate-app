import express from "express";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.get("/", getPosts); // Get all posts
router.get("/:id", getPost); // Get a single post
router.post("/", verifyToken, addPost); // Add a new post / add up to 5 images
router.put("/:id", verifyToken, updatePost); // Update a post
router.delete("/:id", verifyToken, deletePost); // Delete a post

export default router;
