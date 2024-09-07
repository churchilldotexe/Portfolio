import { relations, sql } from "drizzle-orm";
import { index, integer, pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import projects from "./projects";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    userId: uuid("userId")
      .default(sql`gen_random_uuid()`)
      .unique(),
    authId: integer("auth_id").notNull().unique(),
    email: varchar("email", { length: 255 }).unique(),
    avatarUrl: varchar("avatar_url", { length: 255 }),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    refreshToken: varchar("refresh_token", { length: 255 }),
    refreshTokenVersion: integer("refresh_token_version").notNull().default(1),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  (table) => ({ userIdIndex: index().on(table.userId) })
);

export const projectRelation = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const insertUsersSchema = createInsertSchema(users);
export type InsertUsersTypes = z.infer<typeof insertUsersSchema>;

export const selectUsersSchema = createSelectSchema(users).extend({ userId: z.string().uuid() });
export type SelectUsersTypes = z.infer<typeof selectUsersSchema>;

export default users;
