import { boolean, index, pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { sql } from "drizzle-orm";

const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid")
      .default(sql`gen_random_uuid()`)
      .unique(),
    name: varchar("name", { length: 255 }).notNull(),
    isFeatured: boolean("is_featured").notNull().default(false),
    description: varchar("description", { length: 255 }).notNull(),
    repoUrl: varchar("repo_url", { length: 255 }).notNull(),
    liveUrl: varchar("live_url", { length: 255 }).notNull(),
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
    imageKey: varchar("image_key", { length: 255 }).notNull(),
    userId: varchar("user_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIndex: index().on(table.userId),
  })
);

export const insertProjectsSchema = createInsertSchema(projects);
export type InsertProjectTypes = z.infer<typeof insertProjectsSchema>;

export const selectProjectSchema = createSelectSchema(projects);
export type SelectProjectTypes = z.infer<typeof selectProjectSchema>;

export default projects;
