/**
 * Copyright 2013-present, Novivia, Inc.
 * All rights reserved.
 */

import jest from "jest";
import pkgInfo from "pkginfo-json5";
import {resolve as resolvePath} from "path";

const packageInfo = pkgInfo(
  null,
  {
    dir: process.cwd(),
    include: ["novivia-tester"],
  },
);

const customConfiguration = packageInfo["novivia-tester"] || {};

// eslint-disable-next-line no-magic-numbers
const argv = process.argv.slice(2);

function createJestConfig() {
  const configuration = {
    collectCoverage: customConfiguration.noCoverage === undefined,
    collectCoverageFrom: [
      "**/*.{js,jsx}",
      "!**/__tests__/**",
      "!**/coverage/**",
      "!**/node_modules/**",
      "!**/vendor/**",
      ...(customConfiguration.coverageLocations || []),
    ],
    coverageThreshold: {
      global: {
        branches: 95,
        functions: 95,
        lines: 95,
        statements: 95,
      },
      ...(customConfiguration.coverageThreshold || {}),
    },
    "globals": {
      "__TESTING__": true,
    },
    moduleFileExtensions: [
      "jsx",
      "js",
      "json",
    ],
    notify: true,
    scriptPreprocessor: resolvePath(__dirname, "lib", "transform"),
    setupFiles: [
      require.resolve("babel-polyfill"),
      resolvePath(__dirname, "monkeyPatch.js"),
      ...(customConfiguration.setupFiles || []),
    ],
    testEnvironment: customConfiguration.environment || "node",
    testPathIgnorePatterns: [
      "/node_modules/",
      ...(customConfiguration.ignoreTests || []),
    ],
    testRegex: "[\\/]__tests__[\\/][^\\/]*?\\.jsx?$",
  };

  return configuration;
}

argv.push(
  "--watch",
  "--config",
  JSON.stringify(createJestConfig()),
);

jest.run(argv);
