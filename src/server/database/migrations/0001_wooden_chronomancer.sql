ALTER TABLE "projects" RENAME COLUMN "user_uuid" TO "user_id";--> statement-breakpoint
DROP INDEX IF EXISTS "projects_user_uuid_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_user_id_index" ON "projects" USING btree ("user_id");