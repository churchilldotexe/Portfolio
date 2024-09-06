import { env } from "@/env/server";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/database/schema/index.ts",
  out: "./src/server/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DRIZZLE_DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
