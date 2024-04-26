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
  ignorePatterns: [
    '.eslintrc.cjs',
    'dist/*',
    'coverage/*',
    'public/*',
    'stylelint.config.js',
    'src/**/*.css',
  ],
  rules: {
    '@typescript-eslint/consistent-type-definitions': [0],
    'import/no-duplicates': [2],
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
            pattern: '@/config',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/theme/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/pages/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/constants/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/routes',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/modules/auth',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/modules/gitlab',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/modules/projects',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/modules/user',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/elements/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/features/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/utils/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/*',
            group: 'external',
            position: 'after',
          },
        ],
      },
    ],
  },
})
