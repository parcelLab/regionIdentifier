module.exports = {
  env: {
    commonjs: true,
    node: true,
  },
  extends: ['@parcellab/eslint-config/base', 'prettier'],
  rules: {
    'prefer-const': 'error',
    'unicorn/prefer-module': 'off',
  },
};
