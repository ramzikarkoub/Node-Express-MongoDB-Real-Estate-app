import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../app.js";
import Post from "../../models/post.model.js";
import User from "../../models/user.model.js";

jest.setTimeout(30000);

// Mock Redis
jest.mock("../../utils/cache.js", () => ({
  get: jest.fn(),
  setEx: jest.fn(),
  flushAll: jest.fn(),
}));

describe("Post Controller", () => {
  let mongoServer;
  let token;
  let userId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect();
    await mongoose.connect(uri);

    const user = await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: "hashed",
    });

    userId = user._id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterEach(async () => {
    await Post.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  it("fetches all posts", async () => {
    await Post.create({
      title: "Test Post",
      price: 100000,
      address: "123 Main St",
      city: "Charlotte",
      bedroom: 3,
      bathroom: 2,
      type: "buy",
      property: "house",
      postDetail: { desc: "Great house" },
      images: ["http://img.com/test.jpg"],
      userId,
    });

    const res = await request(app).get("/api/posts");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("creates a new post when authenticated", async () => {
    const res = await request(app)
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

  it("rejects post creation if unauthenticated", async () => {
    const res = await request(app).post("/api/posts").send({
      title: "House",
      price: 100000,
    });

    expect(res.status).toBe(401);
  });

  it("returns a single post by ID", async () => {
    const post = await Post.create({
      title: "Single Post",
      price: 120000,
      address: "789 Main St",
      city: "Charlotte",
      bedroom: 2,
      bathroom: 1,
      type: "rent",
      property: "apartment",
      postDetail: { desc: "Nice spot" },
      images: [],
      userId,
    });

    const res = await request(app).get(`/api/posts/${post._id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Single Post");
  });

  it("deletes a post with token", async () => {
    const post = await Post.create({
      title: "To Delete",
      price: 123000,
      address: "Del St",
      city: "Charlotte",
      bedroom: 1,
      bathroom: 1,
      type: "rent",
      property: "condo",
      postDetail: { desc: "To be deleted" },
      images: [],
      userId,
    });

    const res = await request(app)
      .delete(`/api/posts/${post._id}`)
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it("updates a post with token", async () => {
    const post = await Post.create({
      title: "Old Title",
      price: 150000,
      address: "Old Addr",
      city: "Charlotte",
      bedroom: 2,
      bathroom: 2,
      type: "buy",
      property: "house",
      postDetail: { desc: "Old desc" },
      images: [],
      userId,
    });

    const res = await request(app)
      .put(`/api/posts/${post._id}`)
      .set("Cookie", [`token=${token}`])
      .send({ title: "Updated Title", price: 160000 });

    expect(res.status).toBe(200);
    expect(res.body.post.title).toBe("Updated Title");
  });

  it("fetches posts for authenticated user", async () => {
    await Post.create({
      title: "My Post",
      price: 99999,
      address: "User St",
      city: "Charlotte",
      bedroom: 3,
      bathroom: 2,
      type: "buy",
      property: "house",
      postDetail: { desc: "My home" },
      images: [],
      userId,
    });

    const res = await request(app)
      .get("/api/posts/user")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("My Post");
  });
});
