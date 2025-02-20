// User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true } // ✅ Handles createdAt and updatedAt automatically
);

const User = mongoose.model("User", userSchema);

export { User };
