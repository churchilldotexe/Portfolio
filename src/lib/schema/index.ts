import { z } from "zod";
import { ACCEPTED_FILE_TYPE, MAX_FILE_SIZE } from "../constants";

export const projectFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z
    .custom<File | null>()
    .refine(
      (file): file is File => file !== null && file instanceof File,
      "Please provide an image"
    )
    .refine((file) => file.size <= MAX_FILE_SIZE, "Try uploading an image that is 4MB or lower")
    .refine((file) => ACCEPTED_FILE_TYPE.includes(file.type), "Can only accept an image file"),
  description: z.string().min(1, "description is required"),
  repository: z.string().min(1, "repository is required").url("Please provide a proper url"),
  liveSite: z.string().min(1, "liveSite is required").url("Please provide a proper url"),
  stacks: z.array(z.string().min(1, "Please select at least 1 tech")),
  addToFeatured: z.string().default("").pipe(z.coerce.boolean()),
});

export type ProjectFormTypes = z.infer<typeof projectFormSchema>;

export type CreateProjectPostType = Record<keyof ProjectFormTypes, string | undefined> & {
  message?: "Success";
};
