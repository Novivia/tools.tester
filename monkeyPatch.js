/**
 * Copyright 2013-present, Novivia, Inc.
 * All rights reserved.
 */

import {
  dirname,
  join as joinPath,
  parse as parsePath,
  resolve as resolvePath,
} from "path";
import fs from "fs";
import JSON5 from "json5";
import pathExists from "path-exists";

// FIXME: Ideally we could avoid all this monkeypatching if the underlying issue
// is fixed upstream in
// https://github.com/istanbuljs/babel-plugin-istanbul/issues/66 and possibly
// https://github.com/facebook/jest/issues/2016

const findUp = require("find-up");

const origFindUpSync = findUp.sync;

// Inspired by
// https://github.com/sindresorhus/find-up/blob/80342293c547b6982091f6ff141a76fd70317f57/index.js#L28-L46
findUp.sync = (filename, opts = {}) => {
  if (filename !== "package.json") {
    return origFindUpSync(filename, opts);
  }

  let dir = resolvePath(opts.cwd || "");
  const {root} = parsePath(dir);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const fullPathJson5 = joinPath(dir, "package.json5");
    const fullPathJson = joinPath(dir, "package.json");

    if (pathExists.sync(fullPathJson5)) {
      return fullPathJson5;
    } else if (pathExists.sync(fullPathJson)) {
      return fullPathJson;
    } else if (dir === root) {
      return null;
    }

    dir = dirname(dir);
  }
};

// https://github.com/sindresorhus/load-json-file/blob/49620f12bce627dc2459a08f5ef18cd2ff151eb2/index.js#L11
const loadJsonFile = require("load-json-file");

// eslint-disable-next-line security/detect-non-literal-fs-filename
loadJsonFile.sync = fullPath => JSON5.parse(fs.readFileSync(fullPath, "utf8"));
