import mongoose from "mongoose";

const Type = ["buy", "rent"];
const Property = ["apartment", "house", "condo", "land"];

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    images: [String],
    address: { type: String, required: true },
    city: { type: String, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    type: { type: String, enum: Type, required: true },
    property: { type: String, enum: Property, required: true },
    postDetail: {
      desc: { type: String, required: true },
      utilities: String,
      pet: String,
      size: Number,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Optimized Indexes
postSchema.index({ title: "text", address: "text", city: "text" }); // Full-text search
postSchema.index({ type: 1, property: 1 }); // Filtering
postSchema.index({ price: 1 }); // Sorting
postSchema.index({ createdAt: -1 }); // Recent listings
postSchema.index({ userId: 1 }); // User listings

const Post = mongoose.model("Post", postSchema);

export default Post;
