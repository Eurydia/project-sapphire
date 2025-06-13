//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      // turn import/order off project-wide
      'import/order': 'off',
      'sort-imports': 'off',
      'import/consistent-type-specifier-style': 'off',
    },
  },
]
