import type { AstroCookieSetOptions } from "astro";

export const MAX_FILE_SIZE = 4 * 1024 * 1024;

export const ACCEPTED_FILE_TYPE = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
];

export enum COOKIES_PROPERTIES {
  STATE = "state",
  USERID = "userId",
}

export type COOKIES_PROPERTIES_TYPES = `${COOKIES_PROPERTIES}`;

const isProd = Boolean(import.meta.env.ISPROD);
export const COOKIES_OPTIONS: AstroCookieSetOptions = {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 600,
  path: "/",
  secure: isProd,
} as const;
