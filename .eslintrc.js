module.exports = {
  env: {
    commonjs: true,
    node: true,
    mocha: true,
  },
  extends: ["@parcellab/eslint-config/base"],
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    "eqeqeq": "error",
    "for-direction": "error",
    "no-sequences": "error",
    "no-undef": "error",
    "no-unused-vars": "error",
    "no-use-before-define": "error",
    "prefer-const": "error",
    "quote-props": ["error", "consistent-as-needed"],
    "semi": ["error", "always"],
    "unicorn/prefer-module": "off",
  },
};
