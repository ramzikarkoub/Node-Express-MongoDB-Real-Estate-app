import Post from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";

// GET ALL PROPERTY LISTINGS WITH FILTERING
export const getPosts = async (req, res) => {
  try {
    const { location, type, property, minPrice, maxPrice, bedroom } = req.query;

    const filters = {};

    // Location (case-insensitive)
    if (location) filters.city = { $regex: location, $options: "i" };

    // Type (rent or buy)
    if (type && type !== "any") filters.type = type;

    // Property (apartment, house, condo, land)
    if (property && property !== "any") filters.property = property;

    // Price range
    if (minPrice) filters.price = { $gte: Number(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, $lte: Number(maxPrice) };

    // Number of bedrooms
    if (bedroom) filters.bedroom = Number(bedroom);

    // Fetch posts based on filters
    const posts = await Post.find(filters).sort({ createdAt: -1 });

    if (posts.length === 0)
      return res.status(200).json({ message: "No properties found." });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE PROPERTY LISTING BY ID

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate("userId", "username email");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL POSTS BY LOGGED-IN USER
// export const getUserPosts = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     console.log("Extracted userId:", userId);

//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     const posts = await Post.find({ userId }).populate(
//       "userId",
//       "username email"
//     );
//     console.log("Posts found:", posts);

//     if (!posts || posts.length === 0) {
//       return res.status(200).json({ message: "You have no posts yet." });
//     }

//     res.status(200).json(posts);
//   } catch (error) {
//     console.error("Error fetching user posts:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// ✅ Backend: Apply filters when fetching user posts
export const getUserPosts = async (req, res) => {
  try {
    const { location, type, property, minPrice, maxPrice, bedroom } = req.query;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const filters = { userId }; // ✅ Filter by userId
    if (location) filters.city = { $regex: location, $options: "i" };
    if (type && type !== "any") filters.type = type;
    if (property && property !== "any") filters.property = property;
    if (minPrice) filters.price = { $gte: Number(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, $lte: Number(maxPrice) };
    if (bedroom) filters.bedroom = Number(bedroom);

    const posts = await Post.find(filters)
      .populate("userId", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ADD NEW PROPERTY LISTING )
export const addPost = async (req, res) => {
  const {
    title,
    price,
    address,
    city,
    bedroom,
    bathroom,
    type,
    property,
    postDetail,
    imageUrls, // Array of Cloudinary URLs
  } = req.body;

  try {
    const newPost = new Post({
      title,
      price,
      images: imageUrls, //Save URLs directly in MongoDB
      address,
      city,
      bedroom,
      bathroom,
      type,
      property,
      postDetail,
      userId: req.user.id,
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//  UPDATE PROPERTY LISTING
export const updatePost = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation is applied
    });

    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });
    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE PROPERTY LISTING AND CLOUDINARY IMAGES

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Delete Images from Cloudinary
    await Promise.all(
      post.images.map((url) => {
        const publicId = url.split("/").pop().split(".")[0]; // Extract public ID from URL
        return cloudinary.uploader.destroy(publicId);
      })
    );

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
