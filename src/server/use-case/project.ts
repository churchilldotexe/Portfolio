export const prerender = false;

import { UTApi } from "uploadthing/server";
import {
  getAllProjectsFromDB,
  getFeaturedProjectFromDB,
  uploadProjectToDB,
} from "../data-access/project";

export const utapi = new UTApi({ apiKey: import.meta.env.UPLOADTHING_SECRET });

type UploadProjectUseCaseTypes = {
  image: File;
  name: string;
  liveUrl: string;
  repoUrl: string;
  description: string;
  userId: string;
};

export async function uploadProjectUseCase({
  description,
  repoUrl,
  liveUrl,
  name,
  image,
  userId,
}: UploadProjectUseCaseTypes) {
  const imageFile = await utapi.uploadFiles(image);

  if (imageFile.error) {
    throw new Error(`${imageFile.error}`);
  }

  const { url: imageUrl, key: imageKey } = imageFile.data;

  await uploadProjectToDB({
    name,
    liveUrl,
    repoUrl,
    imageKey,
    imageUrl,
    description,
    userId,
  });
}

type GetProjectReturnedTypes = {
  name: string;
  description: string;
  repoUrl: string;
  liveUrl: string;
  imageUrl: string;
};

export async function getFeaturedProjectUseCase(): Promise<GetProjectReturnedTypes[]> {
  const userId = "userid"; //prototype

  const featuredProject = await getFeaturedProjectFromDB(userId);
  return featuredProject;
}

export async function getAllProjects(): Promise<GetProjectReturnedTypes[]> {
  const userId = "userid"; //prototype

  const featuredProject = await getAllProjectsFromDB(userId);
  return featuredProject;
}
