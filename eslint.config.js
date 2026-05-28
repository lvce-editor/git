import * as config from '@lvce-editor/eslint-config'

export default [
  {
    ignores: ['packages/git-web/**'],
  },
  ...config.default,
  {
    files: ['**/*.ts'],
    rules: {
      'unicorn/consistent-function-scoping': 'off',
    },
  },
  {
    files: ['packages/git-requests/src/**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'sonarjs/no-dead-store': 'off',
      'sonarjs/no-redundant-jump': 'off',
    },
  },
  {
    files: ['packages/extension/src/**/*.ts', 'packages/extension/test/**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'no-console': 'off',
      'no-useless-escape': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-switch-case': 'off',
      'prefer-destructuring': 'off',
      'unicorn/prefer-export-from': 'off',
      'unicorn/prefer-number-properties': 'off',
    },
  },
]
