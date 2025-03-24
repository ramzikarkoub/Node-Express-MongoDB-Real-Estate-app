import bcrypt from "bcryptjs";
import request from "supertest";
import mongoose from "mongoose";
import { server } from "../../app.js";
import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";

const api = request(server);

describe("Authentication Routes", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("registers a new user successfully", async () => {
      const res = await api.post("/api/auth/register").send({
        username: "john",
        email: "john@example.com",
        password: "Password123",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("user");
      expect(res.body.user.email).toBe("john@example.com");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("does not allow registering with existing email", async () => {
      await User.create({
        username: "john",
        email: "john@example.com",
        password: "Password123",
      });

      const res = await api.post("/api/auth/register").send({
        username: "john",
        email: "john@example.com",
        password: "Password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("Password123", 10);
      await User.create({
        username: "john",
        email: "john@example.com",
        password: hashedPassword,
      });
    });

    it("logs in user successfully", async () => {
      const res = await api.post("/api/auth/login").send({
        email: "john@example.com",
        password: "Password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("email", "john@example.com");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("fails login with incorrect credentials", async () => {
      const res = await api.post("/api/auth/login").send({
        email: "john@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid credentials");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("clears cookie on logout", async () => {
      const res = await api.post("/api/auth/logout");

      expect(res.status).toBe(200);
      expect(res.headers["set-cookie"][0]).toMatch(/token=;/);
      expect(res.body.message).toBe("Logout successful");
    });
  });

  describe("GET /api/auth/me", () => {
    let token;

    beforeEach(async () => {
      const user = await User.create({
        username: "john",
        email: "john@example.com",
        password: await bcrypt.hash("Password123", 10),
      });

      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
    });

    it("retrieves user info if authenticated", async () => {
      const res = await api
        .get("/api/auth/me")
        .set("Cookie", [`token=${token}`]);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe("john@example.com");
      expect(res.body).not.toHaveProperty("password");
    });

    it("fails without token", async () => {
      const res = await api.get("/api/auth/me");

      expect(res.status).toBe(401);
    });
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  server.close(); // properly close the server
});
