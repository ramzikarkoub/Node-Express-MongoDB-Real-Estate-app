import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { server } from "../app.js"; // imported ONCE here

dotenv.config({ path: ".env.test" });

let mongoServer;

jest.setTimeout(20000); // increase timeout for safety

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
  server.close();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});
