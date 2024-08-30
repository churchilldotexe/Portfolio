ALTER TABLE "projects" RENAME COLUMN "userId" TO "user_uuid";--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_name_unique";--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_description_unique";--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_userId_users_uuid_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "projects_userId_index";--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "image_key" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_user_uuid_index" ON "projects" USING btree ("user_uuid");