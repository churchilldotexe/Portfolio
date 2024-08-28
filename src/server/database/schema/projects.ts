import { index, pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import users from "./users";
import { relations } from "drizzle-orm";

const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).unique().notNull(),
    description: varchar("description", { length: 255 }).unique().notNull(),
    repoUrl: varchar("repo_url", { length: 255 }).notNull(),
    liveUrl: varchar("live_url", { length: 255 }).notNull(),
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.uuid),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIndex: index().on(table.userId),
  })
);

export const projectRelations = relations(projects, ({ one }) => ({
  user: one(users, { fields: [projects.userId], references: [users.uuid] }),
}));

export const insertProjectsSchema = createInsertSchema(projects);
export type InsertProjectTypes = z.infer<typeof insertProjectsSchema>;

export const selectProjectSchema = createSelectSchema(projects);
export type SelectProjectTypes = z.infer<typeof selectProjectSchema>;

export default projects;
