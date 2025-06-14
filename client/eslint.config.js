//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  ...tanstackConfig,
  {
    rules: {
      "import/order": "off",
      "sort-imports": "off",
      "import/consistent-type-specifier-style": "off",
      "@typescript-eslint/array-type": "off",
    },
  },
];
