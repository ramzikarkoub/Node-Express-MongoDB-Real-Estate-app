export default {
  testEnvironment: "node",
  transform: { "^.+\\.js$": "babel-jest" },
  moduleFileExtensions: ["js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 60000, // ⏱ Extend timeout for slow CI runs
};
