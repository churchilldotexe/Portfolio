import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import clerk from "@clerk/astro";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), clerk()],
  output: "hybrid",
  server: {
    proxy: {
      "/auth": {
        target: "https://engaged-hermit-56.accounts.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ""),
      },
    },
  },
});
