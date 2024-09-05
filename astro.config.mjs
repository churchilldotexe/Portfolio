import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
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
      noExternal: ["@upstash/redis"],
    },
    build: {
      minify: false,
    },
  },
  security: { checkOrigin: true },
});
