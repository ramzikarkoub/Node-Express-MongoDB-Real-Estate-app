import mongoose from "mongoose";

// Set environment BEFORE importing db.js
process.env.NODE_ENV = "test";
process.env.MONGO_URI = "mongodb://localhost:27017/test";

jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

import connectDB from "../db.js"; // AFTER env is set

describe("connectDB", () => {
  it("does not connect in test environment", async () => {
    await connectDB();
    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  it("connects to MongoDB when not in test environment", async () => {
    process.env.NODE_ENV = "development";
    await connectDB();
    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://localhost:27017/test"
    );
  });
});
