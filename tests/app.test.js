import request from "supertest";
import app from "../app.js";

describe("App.js Integration", () => {
  it("should respond with 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404); // Express default
  });

  it("should mount /api/auth route", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "appTestUser",
      email: "apptest@example.com",
      password: "Password123",
    });

    expect([200, 201, 400]).toContain(res.statusCode); // Allow success or "already exists"
  });

  it("should mount /api/posts route", async () => {
    const res = await request(app).get("/api/posts");
    expect(res.status).toBe(200); // Should respond even if empty
  });

  it("should include necessary CORS headers", async () => {
    const res = await request(app)
      .get("/api/posts")
      .set("Origin", "http://localhost:5173");

    expect(res.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173"
    );
  });
});
