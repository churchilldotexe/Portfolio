import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    date: z.date(),
    description: z.string(),
  }),
});

export const collecctions = {
  posts: postsCollection,
};
