/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'], // Point to the tsconfig in each package
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: [
    '@typescript-eslint',
    'import',
    'import-newlines',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  rules: {
    'prettier/prettier': 'error',
    // Airbnb overrides
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-param-reassign': ['error', { props: false }], // Allow modifying properties of parameters
    'no-underscore-dangle': 'off', // Allow dangling underscores (often used for private members)
    'import/prefer-default-export': 'off', // Allow named exports without a default export
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.ts',
          '**/*.spec.ts',
          '**/*.test.tsx',
          '**/*.spec.tsx',
          '**/vite.config.ts',
          '**/tsup.config.ts',
          '**/playwright.config.ts',
          '**/jest.config.ts',
          '**/tailwind.config.js',
          '**/postcss.config.js',
        ],
        optionalDependencies: false,
      },
    ],
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-floating-promises': 'error',
    // Import sorting and organization
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        pathGroups: [
          {
            pattern: 'react*(-dom)',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'next*/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@*/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import-newlines/enforce': [
      'error',
      {
        items: 1,
        'max-len': 120,
        semi: true,
      },
    ],
    'sort-imports': ['error', { ignoreDeclarationSort: true }], // Required for import/order
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.turbo/',
    'coverage/',
    '.next/',
    'public/',
    'build/',
    '*.js', // Ignore root JS config files (like this one)
    '*.mjs',
    '*.cjs',
  ],
};
