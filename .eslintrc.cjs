// @ts-check
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  parserOptions: {
    project: true,
    __tsconfigRootDir: __dirname,
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  ignorePatterns: ['.eslintrc.cjs', 'dist/*', 'coverage/*', 'public/*'],
  rules: {
    '@typescript-eslint/consistent-type-definitions': 0,
    'import/order': [
      1,
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: '@/components/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/auth/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/pages/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/state/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/utils/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/config/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/theme/**',
            group: 'external',
            position: 'after',
          },
        ],
      },
    ],
    'import/no-duplicates': [2],
  },
})
