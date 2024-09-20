import { index, pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import projects from "./projects";

const techStacks = pgTable(
  "tech-stacks",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    projectId: uuid("project_id")
      .references(() => projects.projectId, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  },
  (table) => ({
    projectIdIndex: index().on(table.projectId),
  })
);

export const techStacksRelation = relations(techStacks, ({ one }) => ({
  user: one(projects, { fields: [techStacks.projectId], references: [projects.projectId] }),
}));

export const insertTechStacksSchema = createInsertSchema(techStacks);
export type InsertTechStacksTypes = z.infer<typeof insertTechStacksSchema>;

export const selectTechStacksSchema = createSelectSchema(techStacks);
export type SelectTechStacksTypes = z.infer<typeof selectTechStacksSchema>;

export default techStacks;
