/// <reference path="../.astro/types.d.ts" />
///// <reference types="astro/client" />
/// <reference types="@clerk/astro/env" />
import type { AdvancedRuntime } from "@astrojs/cloudflare";

interface Runtime {
  env: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
  };
}

declare global {
  declare namespace App {
    interface Locals {
      runtime: Runtime;
    }
  }
}
