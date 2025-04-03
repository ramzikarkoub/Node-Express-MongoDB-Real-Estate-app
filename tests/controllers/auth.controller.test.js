import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../app.js";
import User from "../../models/user.model.js";

jest.setTimeout(30000);

describe("Auth Controller", () => {
  let mongoServer;
  let token;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect(); // Ensure no duplicate connections
    await mongoose.connect(uri);
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  it("registers a user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "controllerUser",
      email: "controller@example.com",
      password: "Password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("controller@example.com");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("doesn't register duplicate email", async () => {
    await User.create({
      username: "controllerUser",
      email: "controller@example.com",
      password: "hashed",
    });

    const res = await request(app).post("/api/auth/register").send({
      username: "controllerUser",
      email: "controller@example.com",
      password: "Password123",
    });

    expect(res.status).toBe(400);
  });

  it("logs in successfully with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      username: "loginUser",
      email: "login@example.com",
      password: "Password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "Password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("login@example.com");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("fails login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      username: "wrongPass",
      email: "wrongpass@example.com",
      password: "Password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "wrongpass@example.com",
      password: "WrongPassword",
    });

    expect(res.status).toBe(400);
  });

  it("returns user info on /me if authenticated", async () => {
    const user = await User.create({
      username: "meUser",
      email: "me@example.com",
      password: "hashed",
    });

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("me@example.com");
  });

  it("returns 401 on /me without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("clears cookie on logout", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"][0]).toMatch(/token=;/);
  });
});
