import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../../app.js";
import mongoose from "mongoose";
import User from "../../models/user.model.js";

const api = request(app);

describe("Authentication Middleware", () => {
  let user, validToken;

  beforeAll(async () => {
    user = await User.create({
      username: "middlewareUser",
      email: "middleware@example.com",
      password: "Password123",
    });

    validToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  test("rejects request if token is missing", async () => {
    const res = await api.get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/access denied/i);
  });

  test("rejects request with invalid token", async () => {
    const res = await api
      .get("/api/auth/me")
      .set("Cookie", ["token=invalidtoken"]);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid token/i);
  });

  test("rejects request with expired token", async () => {
    const expiredToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "-1s",
    });

    const res = await api
      .get("/api/auth/me")
      .set("Cookie", [`token=${expiredToken}`]);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid token/i); // updated here
  });

  test("allows request with valid token", async () => {
    const res = await api
      .get("/api/auth/me")
      .set("Cookie", [`token=${validToken}`]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", "middleware@example.com");
  });
});
