import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import clerk from "@clerk/astro";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [tailwind(), react(), clerk()],
  output: "hybrid",
  vite: {
    ssr: {
      external: ["node:buffer"],
    },
    build: {
      minify: false,
    },
  },
});

