import request from "supertest";
import { app } from "../../app.js";
import Post from "../../models/post.model.js";
import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";

const api = request(app);
let token, userId;

beforeAll(async () => {
  const user = await User.create({
    username: "testuser",
    email: "testuser@example.com",
    password: "Password123",
  });

  userId = user._id;
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
});

beforeEach(async () => {
  await Post.deleteMany({});
});

describe("Posts Routes", () => {
  it("fetches all posts", async () => {
    await Post.create({
      title: "House Example",
      price: 150000,
      address: "123 Main St",
      city: "Charlotte",
      bedroom: 3,
      bathroom: 2,
      type: "buy",
      property: "house",
      postDetail: { desc: "Nice property" },
      images: ["http://image.url/image.jpg"],
      userId,
    });

    const res = await api.get("/api/posts");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("creates a new post when authenticated", async () => {
    const res = await api
      .post("/api/posts")
      .set("Cookie", [`token=${token}`])
      .send({
        title: "New House",
        price: 200000,
        address: "456 Elm St",
        city: "Charlotte",
        bedroom: 4,
        bathroom: 3,
        type: "buy",
        property: "house",
        postDetail: { desc: "Amazing property" },
        imageUrls: ["http://image.url/image.jpg"],
      });

    expect(res.status).toBe(201);
    expect(res.body.post.title).toBe("New House");
  });

  it("rejects creating post if unauthenticated", async () => {
    const res = await api.post("/api/posts").send({
      title: "House",
      price: 100000,
    });

    expect(res.status).toBe(401);
  });
});
