export const prerender = false;

import { UTApi } from "uploadthing/server";
import {
  getAllProjectsFromDB,
  getFeaturedProjectFromDB,
  getMyProjectFromDb,
  uploadProjectToDB,
  uploadTechStacksToDb,
} from "../data-access/project";

export const utapi = new UTApi({ apiKey: import.meta.env.UPLOADTHING_SECRET });

type UploadProjectUseCaseTypes = {
  image: File;
  name: string;
  liveUrl: string;
  repoUrl: string;
  description: string;
  userId: string;
  techStacksArr: string[];
  isFeatured: boolean;
};

export async function uploadProjectUseCase({
  description,
  repoUrl,
  liveUrl,
  name,
  image,
  userId,
  techStacksArr,
  isFeatured,
}: UploadProjectUseCaseTypes) {
  const imageFile = await utapi.uploadFiles(image);
  if (imageFile.error) {
    throw new Error(`${imageFile.error}`);
  }

  const { url: imageUrl, key: imageKey } = imageFile.data;

  const projectId = await uploadProjectToDB({
    name,
    liveUrl,
    repoUrl,
    imageKey,
    imageUrl,
    description,
    userId,
    isFeatured,
  });

  await uploadTechStacksToDb(techStacksArr, projectId);
}

type GetProjectReturnedTypes = {
  name: string;
  description: string;
  repoUrl: string;
  liveUrl: string;
  imageUrl: string;
  imageKey: string;
  techStacks: string[];
};

export async function getFeaturedProjectUseCase(): Promise<GetProjectReturnedTypes[]> {
  const userId = import.meta.env.USER_ID;

  const featuredProject = await getFeaturedProjectFromDB(userId);
  return featuredProject;
}

export async function getAllProjects(): Promise<GetProjectReturnedTypes[]> {
  const userId = import.meta.env.USER_ID;

  const featuredProject = await getAllProjectsFromDB(userId);
  return featuredProject;
}

export async function getSpecificProjectUseCase(
  imageKey: string | undefined
): Promise<GetProjectReturnedTypes | undefined> {
  const featuredProject = await getMyProjectFromDb(imageKey);
  return featuredProject;
}
