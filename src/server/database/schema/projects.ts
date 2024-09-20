import { boolean, index, pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { relations, sql } from "drizzle-orm";
import users from "./users";
import techStacks from "./stacks";

const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    projectId: uuid("project_id")
      .default(sql`gen_random_uuid()`)
      .unique(),
    name: varchar("name", { length: 255 }).notNull(),
    isFeatured: boolean("is_featured").notNull().default(false),
    description: varchar("description", { length: 255 }).notNull(),
    repoUrl: varchar("repo_url", { length: 255 }).notNull(),
    liveUrl: varchar("live_url", { length: 255 }).notNull(),
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
    imageKey: varchar("image_key", { length: 255 }).notNull(),
    userId: uuid("user_id")
      .references(() => users.userId, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIndex: index().on(table.userId),
    projectIdIndex: index().on(table.projectId),
  })
);

export const projectRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.userId] }),
  techStacks: many(techStacks),
}));

export const insertProjectsSchema = createInsertSchema(projects);
export type InsertProjectTypes = z.infer<typeof insertProjectsSchema>;

export const selectProjectSchema = createSelectSchema(projects);
export type SelectProjectTypes = z.infer<typeof selectProjectSchema>;

export default projects;
