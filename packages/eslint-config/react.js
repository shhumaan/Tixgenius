const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    './base.js',
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended', // Must be last
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  parserOptions: {
    project, // Point to the UI package's tsconfig.json
  },
  ignorePatterns: ['node_modules/', 'dist/'],
  rules: {
    'react/react-in-jsx-scope': 'off', // Usually handled by bundler/framework
    'react/jsx-props-no-spreading': 'off', // Allow prop spreading for UI components
    'react/prop-types': 'off', // Not needed with TypeScript
    'react/require-default-props': 'off', // Not needed with TypeScript
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '\_',
        varsIgnorePattern: '\_',
        caughtErrorsIgnorePattern: '\_',
      },
    ],
  },
};
