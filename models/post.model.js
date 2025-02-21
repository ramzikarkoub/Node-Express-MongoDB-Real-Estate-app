import mongoose from "mongoose"; // ✅ Make sure to import Mongoose

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

const Post = mongoose.model("Post", postSchema);

export default Post;
