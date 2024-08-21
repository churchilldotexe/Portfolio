/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      boxShadow: {
        "elevate-light": "0 8px 6px 0 rgba(0,0,0,.37), -6px -4px 10px white",
        "elevate-dark": "0 8px 6px 0 rgba(0,0,0,0.2), -6px -4px 10px black",
      },
    },
  },
  plugins: [],
};
