// @ts-check
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  extends: [
    'eslint:recommended',
    'plugin:lit/recommended',
    'plugin:wc/recommended',
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
    // enable when refactoring to identify unused exports
    // will falsely report litelement classes, not useful
    // during development
    // 'import/no-unused-modules': ['warn', { unusedExports: true }],
    '@typescript-eslint/consistent-type-definitions': ['off'],
    'import/no-duplicates': ['error'],
    'import/no-self-import': ['error'],
    'import/no-import-module-exports': ['error'],
    'import/no-mutable-exports': ['error'],
    'import/no-extraneous-dependencies': ['error'],
    'import/no-empty-named-blocks': ['error'],
    'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
    'import/no-default-export': [2],
    'import/order': [
      'warn',
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
            pattern: '@/api/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/modules/auth/types/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/modules/auth/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/modules/app/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/modules/projects/types/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/modules/projects/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/modules/user/types/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/modules/user/**',
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
