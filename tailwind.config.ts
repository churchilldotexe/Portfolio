import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import typography from "@tailwindcss/typography";

import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      dropShadow: {
        "custom-dark": ["0 1px 1px hsl(var(--foreground))", "0 -1px 1px hsl(var(--background)) "],
        custom: ["0 1px 1px hsl(var(--background))", "0 -1px 1px hsl(var(--foreground)) "],
      },
      boxShadow: {
        "elevate-light": "0 8px 6px 0 rgba(0,0,0,.37), -6px -4px 10px white",
        "elevate-dark": "0 8px 6px 0 rgba(0,0,0,0.15), -6px -4px 10px black",
        glass: "0px -7px 12px -7px rgba(0,0,0,0.65)",
        "elevate-light-inset": "0 8px 6px 0 rgba(0,0,0,.37) inset, -6px -4px 10px white inset",
        "elevate-dark-inset": "0 8px 6px 0 rgba(0,0,0,0.15) inset, -6px -4px 10px black inset",
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in forwards",
        slideFromLeft: "slideFromLeft 5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideFromLeft: {
          "0": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "100" },
        },
      },
    },
  },
  plugins: [
    typography,
    plugin(({ addVariant }) => {
      addVariant("hocus-visible", ["&:hover", "&:focus:visible"]);
      addVariant("hoverable", "@media (hover: hover)");
      addVariant("not-hoverable", "@media (hover: none)");
    }),
  ],
} satisfies Config;

export default config;
