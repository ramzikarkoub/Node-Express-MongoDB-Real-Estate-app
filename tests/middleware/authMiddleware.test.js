import { verifyToken } from "../../middleware/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

describe("Authentication Middleware", () => {
  const mockNext = jest.fn();
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("rejects request if token is missing", () => {
    const req = { cookies: {} };

    verifyToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Access denied" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("rejects request with invalid token", () => {
    const req = { cookies: { token: "invalidtoken" } };

    verifyToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("allows request with valid token", () => {
    const user = { id: "123" };
    const token = jwt.sign(user, process.env.JWT_SECRET);
    const req = { cookies: { token } };

    verifyToken(req, res, mockNext);

    expect(req.user).toMatchObject(user);
    expect(mockNext).toHaveBeenCalled();
  });
});
