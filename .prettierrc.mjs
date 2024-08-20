/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  printWidth: 100,
  singleQuote: false,
  semi: true,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
  bracketSpacing: true,
  endOfLine: "lf",
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
