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
]
