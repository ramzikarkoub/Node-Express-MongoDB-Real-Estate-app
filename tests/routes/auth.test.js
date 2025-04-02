import bcrypt from "bcryptjs";
import request from "supertest";
import app from "../../app.js";
import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import "../setup";

const api = request(app);

let token;

afterEach(async () => {
  await User.deleteMany({});
});

describe("Authentication Routes", () => {
  it("registers a new user successfully", async () => {
    const res = await api.post("/api/auth/register").send({
      username: "john",
      email: "john@example.com",
      password: "Password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("john@example.com");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("does not allow registering with existing email", async () => {
    await api.post("/api/auth/register").send({
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
  });

  it("logs in user successfully", async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10);
    await User.create({
      username: "john",
      email: "john@example.com",
      password: hashedPassword,
    });

    const res = await api.post("/api/auth/login").send({
      email: "john@example.com",
      password: "Password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("john@example.com");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("fails login with incorrect credentials", async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10);
    await User.create({
      username: "john",
      email: "john@example.com",
      password: hashedPassword,
    });

    const res = await api.post("/api/auth/login").send({
      email: "john@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
  });

  it("clears cookie on logout", async () => {
    const res = await api.post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"][0]).toMatch(/token=;/);
  });

  it("retrieves user info if authenticated", async () => {
    const user = await User.create({
      username: "john",
      email: "john@example.com",
      password: await bcrypt.hash("Password123", 10),
    });

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const res = await api.get("/api/auth/me").set("Cookie", [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("john@example.com");
  });

  it("fails without token", async () => {
    const res = await api.get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
