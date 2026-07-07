module.exports = {
  env: {
    commonjs: true,
    node: true,
  },
  extends: ['@parcellab/eslint-config/base'],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'prefer-const': 'error',
    'quote-props': ['error', 'consistent-as-needed'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'unicorn/prefer-module': 'off',
  },
};
