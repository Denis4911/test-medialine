module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaFeatures: { legacyDecorators: true }
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:prettier/recommended",
    "plugin:vue/essential",
    "@vue/prettier",
    "@vue/typescript"
  ],
  // required to lint *.vue files
  plugins: ["vue", "@typescript-eslint"],
  // add your custom rules here
  rules: {
    quotes: ["error", "double"],
    "no-console": "off",
    "no-debugger": "off",
    "vue/max-attributes-per-line": "off",
    "vue/no-v-html": "off",
    "no-irregular-whitespace": "off",
    "no-useless-escape": "off"
  }
};
