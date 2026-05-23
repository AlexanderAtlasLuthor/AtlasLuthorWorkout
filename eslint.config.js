import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  { ignores: ["dist/**", "node_modules/**", "public/**", "*.config.js"] },
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    plugins: { react: reactPlugin, "react-hooks": reactHooks },
    settings: { react: { version: "19" } },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.es2022 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-vars": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-prototype-builtins": "off",
    },
  },
  {
    files: ["src/**/*.test.{js,jsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
];
