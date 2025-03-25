export default {
  testEnvironment: "node",
  transform: { "^.+\\.js$": "babel-jest" },
  moduleFileExtensions: ["js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};
