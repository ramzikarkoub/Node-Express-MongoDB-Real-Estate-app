import mongoose from "mongoose";
import connectDB from "../../config/db.js";

jest.mock("mongoose", () => ({
  connect: jest.fn().mockResolvedValue(),
  connection: {
    on: jest.fn(),
  },
}));

const ORIGINAL_ENV = process.env;

jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(process, "exit").mockImplementation(() => {});

describe("connectDB", () => {
  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      MONGO_URI: "mockuri",
    };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("calls mongoose.connect", async () => {
    await connectDB();
    expect(mongoose.connect).toHaveBeenCalledWith("mockuri");
  });

  it("logs successful connection", async () => {
    await connectDB();
    expect(console.log).toHaveBeenCalledWith("MongoDB Connected...");
  });

  it("logs error and exits on failure", async () => {
    mongoose.connect.mockRejectedValueOnce(new Error("mock error"));
    await connectDB();
    expect(console.error).toHaveBeenCalledWith(
      "MongoDB connection error: mock error"
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
