import express from "express";
const router = express.Router();

router.get("/", getPosts); // Get all posts
router.get("/:id", getPost); // Get a single post
router.post("/", addPost); // Add a new post
router.put("/:id", updatePost); // Update a post
router.delete("/:id", deletePost); // Delete a post

export default router;
