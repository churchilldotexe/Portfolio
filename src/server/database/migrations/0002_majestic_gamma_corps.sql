ALTER TABLE "projects" ADD COLUMN "uuid" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_uuid_unique" UNIQUE("uuid");