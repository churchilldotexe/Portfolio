import { env } from "@/env/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export const connection = neon(env.DRIZZLE_DATABASE_URL);
const db = drizzle(connection);

export type db = typeof db;

export default db;
