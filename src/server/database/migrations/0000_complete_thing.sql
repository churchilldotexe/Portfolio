CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" uuid DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"description" varchar(255) NOT NULL,
	"repo_url" varchar(255) NOT NULL,
	"live_url" varchar(255) NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"image_key" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" uuid DEFAULT gen_random_uuid(),
	"auth_id" integer NOT NULL,
	"email" varchar(255),
	"avatar_url" varchar(255),
	"display_name" varchar(255) NOT NULL,
	"refresh_token" varchar(255),
	"refresh_token_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_userId_unique" UNIQUE("userId"),
	CONSTRAINT "users_auth_id_unique" UNIQUE("auth_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_userId_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_user_id_index" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_project_id_index" ON "projects" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_userId_index" ON "users" USING btree ("userId");