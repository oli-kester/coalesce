"use strict";

module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  "extends": ['plugin:react/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    // "import/no-named-as-default": 0
    'import/no-cycle': 0,
    'indent': 0
  }
};