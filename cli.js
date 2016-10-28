/**
 * Copyright 2013-present, Novivia, Inc.
 * All rights reserved.
 */

import jest from "jest";
import {resolve as resolvePath} from "path";

const packageInfo = require(resolvePath(process.cwd(), "package"));

const customConfiguration = packageInfo["novivia-tester"] || {};

// eslint-disable-next-line no-magic-numbers
const argv = process.argv.slice(2);

function createJestConfig() {
  const configuration = {
    collectCoverage: customConfiguration.noCoverage === undefined,
    collectCoverageFrom: [
      "**/*.{js,jsx}",
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
      "__TEST__": true,
    },
    moduleFileExtensions: [
      "jsx",
      "js",
      "json",
    ],
    notify: true,
    scriptPreprocessor: resolvePath(__dirname, "lib", "transform"),
    testEnvironment: customConfiguration.environment || "node",
  };

  return configuration;
}

argv.push(
  "--watch",
  "--config",
  JSON.stringify(createJestConfig()),
);

jest.run(argv);
