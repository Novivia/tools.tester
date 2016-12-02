/**
 * Copyright 2013-present, Novivia, Inc.
 * All rights reserved.
 */

/* eslint-disable comma-dangle */
module.exports = require("babel-jest").createTransformer(
  require("@novivia/babel/config/backend")()
);
