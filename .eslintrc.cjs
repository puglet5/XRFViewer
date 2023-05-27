module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    ecmaFeatures: {
      jsx: true
    },
    sourceType: "module"
  },
  plugins: ["react-refresh", "prettier"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react-refresh/only-export-components": "warn",
    "@typescript-eslint/no-non-null-assertion": "off",
    "prettier/prettier": "warn"
  }
}
