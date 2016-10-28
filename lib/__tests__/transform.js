/**
 * Copyright 2013-present, Novivia, Inc.
 * All rights reserved.
 */

import transform from "../transform";

describe(
  "Jest script preprocessor",
  () => it(
    "returns a valid transformer",
    () => {
      expect(transform).toBeDefined();
      expect(transform.process).toBeDefined();
    },
  ),
);
