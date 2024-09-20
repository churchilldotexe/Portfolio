import {
  DrizzleIcon,
  JavaScript,
  AstroIcon,
  CSS,
  HTML5,
  SQLite,
  PostgreSQL,
  TailwindCSS,
  NextjsIcon,
  ReactIcon,
  TypeScript,
} from "@/components/svg/StacksIcons";
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
  ACCESSTOKEN = "userInfoToken",
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

export const TECH_STACKS = [
  {
    stackName: "React",
    href: "https://react.dev/",
    Logo: ReactIcon,
  },
  {
    stackName: "Nextjs",
    href: "https://nextjs.org/",
    Logo: NextjsIcon,
  },
  {
    stackName: "Drizzle",
    href: "https://orm.drizzle.team/",
    Logo: DrizzleIcon,
  },
  {
    stackName: "JavaScript",
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    Logo: JavaScript,
  },
  {
    stackName: "Astro",
    href: "https://docs.astro.build/en/getting-started/",
    Logo: AstroIcon,
  },
  {
    stackName: "CSS",
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    Logo: CSS,
  },
  {
    stackName: "HTML",
    href: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    Logo: HTML5,
  },
  {
    stackName: "SQLite",
    href: "https://www.sqlite.org/index.html",
    Logo: SQLite,
  },
  {
    stackName: "PostgreSQL",
    href: "https://www.postgresql.org/",
    Logo: PostgreSQL,
  },
  {
    stackName: "TailwindCSS",
    href: "https://tailwindcss.com/",
    Logo: TailwindCSS,
  },
  {
    stackName: "TypeScript",
    href: "https://www.typescriptlang.org/docs/",
    Logo: TypeScript,
  },
] as const;

export type TechStackNamesTypes = (typeof TECH_STACKS)[number]["stackName"];
