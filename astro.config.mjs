import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  prefetch: true,
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [tailwind(), react()],
  output: "server",
  vite: {
    ssr: {
      external: ["node:crypto"],
      noExternal: ["@upstash/redis"],
    },
    resolve: {
      alias: {
        crypto: "crypto-browserify",
      },
    },
    build: {
      minify: false,
    },
  },
  security: { checkOrigin: true },
});
