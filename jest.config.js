module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/test-setup.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
};
