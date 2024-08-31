import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/database/schema/index.ts",
  out: "./src/server/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: import.meta.env.DRIZZLE_DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
