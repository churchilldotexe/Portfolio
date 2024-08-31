export const prerender = false;

import db from "../database";
import projects, {
  insertProjectsSchema,
  type InsertProjectTypes,
} from "../database/schema/projects";
import { ZodError } from "zod";

export async function uploadProjectToDB(uploadData: InsertProjectTypes) {
  const parsedUploadData = insertProjectsSchema.safeParse(uploadData);

  if (parsedUploadData.success === false) {
    throw new ZodError(parsedUploadData.error.errors);
  }

  const { userId, description, imageUrl, imageKey, repoUrl, liveUrl, name } = parsedUploadData.data;

  await db
    .insert(projects)
    .values({ name, liveUrl, repoUrl, imageKey, imageUrl, description, userId });
}
