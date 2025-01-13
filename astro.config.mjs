import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  adapter: vercel(),
  integrations: [tailwind(), react()],
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

