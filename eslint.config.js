import eslintPluginAstro from "eslint-plugin-astro";
import tailwind from "eslint-plugin-tailwindcss";
import react from "@eslint-react/eslint-plugin";
import * as tsParser from "@typescript-eslint/parser";

export default [
  // add more generic rule sets here, such as:
  //js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    ...react.configs.recommended,
    languageOptions: {
      parser: tsParser,
    },
  },
  ...eslintPluginAstro.configs.recommended,
  ...tailwind.configs["flat/recommended"],
  {
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },
];
