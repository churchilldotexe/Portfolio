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
  ACCESSTOKEN = "myAccessToken",
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
    logo: ReactIcon,
  },
  {
    stackName: "Nextjs",
    href: "https://nextjs.org/",
    logo: NextjsIcon,
  },
  {
    stackName: "Drizzle",
    href: "https://orm.drizzle.team/",
    logo: DrizzleIcon,
  },
  {
    stackName: "JavaScript",
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    logo: JavaScript,
  },
  {
    stackName: "Astro",
    href: "https://docs.astro.build/en/getting-started/",
    logo: AstroIcon,
  },
  {
    stackName: "CSS",
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    logo: CSS,
  },
  {
    stackName: "HTML",
    href: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    logo: HTML5,
  },
  {
    stackName: "SQLite",
    href: "https://www.sqlite.org/index.html",
    logo: SQLite,
  },
  {
    stackName: "PostgreSQL",
    href: "https://www.postgresql.org/",
    logo: PostgreSQL,
  },
  {
    stackName: "TailwindCSS",
    href: "https://tailwindcss.com/",
    logo: TailwindCSS,
  },
  {
    stackName: "TypeScript",
    href: "https://www.typescriptlang.org/docs/",
    logo: TypeScript,
  },
] as const;

export type TechStackNamesTypes = (typeof TECH_STACKS)[number]["stackName"];
