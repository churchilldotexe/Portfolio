export const prerender = false;

import { and, eq } from "drizzle-orm";
import db from "../database";
import projects, {
  insertProjectsSchema,
  type InsertProjectTypes,
  type SelectProjectTypes,
} from "../database/schema/projects";
import { ZodError } from "zod";

export async function uploadProjectToDB(uploadData: InsertProjectTypes): Promise<void> {
  const parsedUploadData = insertProjectsSchema.safeParse(uploadData);

  if (parsedUploadData.success === false) {
    throw new ZodError(parsedUploadData.error.errors);
  }

  const { userId, description, imageUrl, imageKey, repoUrl, liveUrl, name } = parsedUploadData.data;

  await db
    .insert(projects)
    .values({ name, liveUrl, repoUrl, imageKey, imageUrl, description, userId });
}

type GetProjectReturnedTypes = Pick<
  SelectProjectTypes,
  "name" | "imageUrl" | "repoUrl" | "description" | "liveUrl" | "imageKey"
>;

export async function getFeaturedProjectFromDB(userId: string): Promise<GetProjectReturnedTypes[]> {
  const featuredProjectData = await db
    .select({
      name: projects.name,
      description: projects.description,
      repoUrl: projects.repoUrl,
      liveUrl: projects.repoUrl,
      imageUrl: projects.imageUrl,
      imageKey: projects.imageKey,
    })
    .from(projects)
    .where(and(eq(projects.userId, userId), eq(projects.isFeatured, true)))
    .orderBy(projects.createdAt);

  return featuredProjectData;
}

export async function getAllProjectsFromDB(userId: string): Promise<GetProjectReturnedTypes[]> {
  const projectData = await db
    .select({
      name: projects.name,
      description: projects.description,
      repoUrl: projects.repoUrl,
      liveUrl: projects.repoUrl,
      imageUrl: projects.imageUrl,
      imageKey: projects.imageKey,
    })
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(projects.updatedAt);

  return projectData;
}

export async function getMyProjectFromDb(
  imageKey: string | undefined
): Promise<GetProjectReturnedTypes | undefined> {
  const projectData = await db.query.projects.findFirst({
    columns: {
      name: true,
      description: true,
      repoUrl: true,
      liveUrl: true,
      imageUrl: true,
      imageKey: true,
    },
    where: (project, { eq }) => eq(project.imageKey, imageKey as string),
  });
  return projectData;
}
