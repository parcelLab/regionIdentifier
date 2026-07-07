import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier/flat';
import { flatConfigs as importXConfigs } from 'eslint-plugin-import-x';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'coverage/**'],
  },
  js.configs.recommended,
  importXConfigs.recommended,

  unicorn.configs.recommended,
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'unicorn/catch-error-name': [
        'error',
        {
          ignore: [String.raw`^error\d*$`, String.raw`^err\d*$`],
        },
      ],
      'unicorn/import-style': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-for-each': 'off',
      'unicorn/no-await-expression-member': 'off',
      'unicorn/name-replacements': 'off',
      'unicorn/no-null': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prefer-number-coercion': 'off',
      'unicorn/prefer-number-properties': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off',

      'prefer-const': 'error',
      'unicorn/prefer-module': 'off',
    },
  },
  prettierConfig,
];
