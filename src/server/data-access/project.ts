export const prerender = false;

import { and, eq } from "drizzle-orm";
import db from "../database";
import projects, {
  insertProjectsSchema,
  type InsertProjectTypes,
  type SelectProjectTypes,
} from "../database/schema/projects";
import { z, ZodError } from "zod";
import stacks, { insertTechStacksSchema } from "../database/schema/stacks";

export async function uploadProjectToDB(uploadData: InsertProjectTypes): Promise<string> {
  const parsedUploadData = insertProjectsSchema.safeParse(uploadData);

  if (parsedUploadData.success === false) {
    throw new ZodError(parsedUploadData.error.errors);
  }

  const { userId, description, imageUrl, imageKey, repoUrl, liveUrl, name, isFeatured } =
    parsedUploadData.data;

  const uploadProject = await db
    .insert(projects)
    .values({ name, liveUrl, repoUrl, imageKey, imageUrl, description, userId, isFeatured })
    .returning({ projectId: projects.projectId });

  const [project] = uploadProject;

  if (!project) {
    throw new Error("Unable to upload your Proect, Please try again");
  }

  // projectId auto generated uuid always defined as long as upload success
  return project.projectId as string;
}

const uploadStacksSchema = insertTechStacksSchema.extend({
  name: z.array(z.string().min(1)),
});

export async function uploadTechStacksToDb(
  techStacksArr: string[],
  projectId: string
): Promise<void> {
  const parsedUploadData = uploadStacksSchema.safeParse({
    name: techStacksArr,
    projectId,
  });
  if (parsedUploadData.success === false) {
    throw new ZodError(parsedUploadData.error.errors);
  }

  const valuesToInsert = parsedUploadData.data.name.map((techStacks) => ({
    name: techStacks,
    projectId: parsedUploadData.data.projectId,
  }));

  await db.insert(stacks).values(valuesToInsert);
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
