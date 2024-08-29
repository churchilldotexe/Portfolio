import { z } from "zod";
import { ACCEPTED_FILE_TYPE, MAX_FILE_SIZE } from "../constants";

export const projectFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z
    .custom<File>()
    .refine((file) => file !== null && file !== undefined, "Please provide an image")
    .refine((file) => file.size <= MAX_FILE_SIZE, "Try uploading an image that is 4MB or lower")
    .refine((file) => ACCEPTED_FILE_TYPE.includes(file.type), "Can only accept an image file"),
  description: z.string().min(1, "description is required"),
  repository: z.string().min(1, "repository is required"),
  liveSite: z.string().min(1, "liveSite is required"),
});
