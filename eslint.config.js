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
]
