/**
 * Copyright 2013-present, Novivia, Inc.
 * All rights reserved.
 */

import getIgnoreRegex from "@novivia/babel/ignoreRegex";
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
    notify: true,
    setupFiles: [
      require.resolve("babel-polyfill"),
      resolvePath(__dirname, "..", "monkeyPatch.js"),
      ...(customConfiguration.setupFiles || []),
    ],
    testEnvironment: customConfiguration.environment || "node",
    testPathIgnorePatterns: [
      "/node_modules/",
      ...(customConfiguration.ignoreTests || []),
    ],
    testRegex: "[\\/]__tests__[\\/][^\\/]*?\\.jsx?$",
    transform: {
      ".*": resolvePath(__dirname, "transform"),
    },
    transformIgnorePatterns: [
      // Converts `/some[\\/]path/` or `/some[\\\/]path/` to `some[\\\\/]path`.
      getIgnoreRegex()
      .toString()
      .replace(/^\//, "")
      .replace(/\/$/, "")
      .replace(/\\\\\\?\//g, "\\\\\\\\/"),
    ],
  };

  return configuration;
}

argv.push(
  "--watch",
  "--config",
  JSON.stringify(createJestConfig()),
);

jest.run(argv);
