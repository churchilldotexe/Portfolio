CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"repo_url" varchar(255) NOT NULL,
	"live_url" varchar(255) NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"image_key" varchar(255) NOT NULL,
	"user_uuid" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_user_uuid_index" ON "projects" USING btree ("user_uuid");