import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  { ignores: ["**/node_modules/**", "**/dist/**", ".npm-cache/**", "test-results/**", "playwright-report/**"] },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: { globals: globals.node },
    rules: { "no-unused-vars": ["error", { argsIgnorePattern: "^_", args: "after-used" }] },
  },
  ...tseslint.configs.recommended.map((config) => ({ ...config, files: ["**/*.ts", "**/*.tsx"] })),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { "react-hooks": reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
  {
    files: ["apps/web/src/**/*.{ts,tsx}"],
    ignores: ["apps/web/src/components/ui/**"],
    rules: { "no-restricted-imports": ["error", { patterns: ["@heroui/*"] }] },
  },
);
