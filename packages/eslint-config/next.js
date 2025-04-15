import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import pluginNext from "@next/eslint-plugin-next";
import { config as baseConfig } from "./base.js";
const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
    },
  },
];

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    './base.js',
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@next/next/recommended',
    'plugin:prettier/recommended', // Must be last
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    browser: true,
    node: true,
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
    project, // Point to the Next.js app's tsconfig.json
  },
  ignorePatterns: ['node_modules/', 'dist/', '.next/', 'public/'],
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed with Next.js >= 17
    'react/jsx-props-no-spreading': 'off', // Allows prop spreading
    'react/prop-types': 'off', // Not needed with TypeScript
    'react/require-default-props': 'off', // Not needed with TypeScript
    'jsx-a11y/anchor-is-valid': 'off', // Next.js Link component handles this
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
    // Ensure Next.js specific rules are configured if needed
    // '@next/next/no-html-link-for-pages': ['error', `./src/pages`], // Example if using pages dir
  },
  overrides: [
    {
      files: ['*.config.js', '*.config.ts', '.eslintrc.js'],
      env: {
        node: true,
      },
    },
  ],
};
