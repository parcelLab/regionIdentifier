module.exports = {
  env: {
    commonjs: true,
    node: true,
    mocha: true,
  },
  extends: ["@parcellab/eslint-config/base"],
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    "prefer-const": "error",
    "quote-props": ["error", "consistent-as-needed"],
    "semi": ["error", "always"],
    "unicorn/prefer-module": "off",
  },
};
