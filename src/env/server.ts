import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DRIZZLE_DATABASE_URL: z.string().min(1),
    UPLOADTHING_SECRET: z.string().min(1),
    UPLOADTHING_APP_ID: z.string().min(1),
    CLIENT_ID: z.string().min(1),
    CLIENT_SECRET: z.string().min(1),
    ACCESS_TOKEN_SECRET: z.string().min(1),
    REFRESH_TOKEN_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
});
