/**
 * Copyright 2013-present, Novivia, Inc.
 * All rights reserved.
 */

import babelJest from "babel-jest";

module.exports = babelJest.createTransformer(require("../babelConfig"));
