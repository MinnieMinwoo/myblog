const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  rootDir: "./src",
  modulePaths: ["<rootDir>"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

const jestConfigWithOverrides = async (...args) => {
  const fn = createJestConfig(config);
  const res = await fn(...args);

  res.transformIgnorePatterns = res.transformIgnorePatterns.map((pattern) => {
    if (pattern === "/node_modules/") {
      return "/node_modules(?!/rehype-sanitize|hast-util-sanitize|react-syntax-highlighter|react-markdown)/";
    }
    return pattern;
  });

  return res;
};

module.exports = jestConfigWithOverrides;
