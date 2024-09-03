import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [tailwind(), react()],
  output: "hybrid",
  vite: {
    ssr: {
      external: ["node:buffer"],
    },
    build: {
      minify: false,
    },
  },
  security: { checkOrigin: true },
});
