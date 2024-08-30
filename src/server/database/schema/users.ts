import { relations, sql } from "drizzle-orm";
import { index, pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import projects from "./projects";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid")
      .default(sql`gen_random_uuid()`)
      .unique(),
    userName: varchar("user_name", { length: 255 }).unique().notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
    salt: varchar("salt", { length: 255 }).notNull(),
    refreshToken: varchar("refresh_token", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  (table) => ({ uuidIndex: index().on(table.uuid) })
);

export const projectRelation = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const insertUsersSchema = createInsertSchema(users);
export type InsertUsersTypes = z.infer<typeof insertUsersSchema>;

export const selectUsersSchema = createSelectSchema(users);
export type SelectUsersTypes = z.infer<typeof selectUsersSchema>;

export default users;
