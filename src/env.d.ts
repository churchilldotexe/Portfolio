/// <reference path="../.astro/types.d.ts" />
///// <reference types="astro/client" />
/// <reference types="@clerk/astro/env" />
import type { AdvancedRuntime } from "@astrojs/cloudflare";

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare global {
  declare namespace App {
    interface Locals extends Runtime {
      otherLocals: {
        CLIENT_ID: string;
        CLIENT_SECRET: string;
        DRIZZLE_DATABASE_URL: string;
        UPLOADTHING_SECRET: string;
        UPLOADTHING_APP_ID: string;
        CLIENT_SECRET: string;
        CLIENT_ID: string;
        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;
      };
      userId?: string;
    }
  }
}

declare type GithubParams = {
  code: string;
  state: string;
};
