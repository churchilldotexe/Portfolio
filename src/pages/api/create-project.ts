import { projectFormSchema, type CreateProjectPostType } from "@/lib/schema";
import { uploadProjectUseCase } from "@/server/use-case/project";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const formData = await request.formData();

  const userId = locals.userId;
  if (typeof userId !== "string") {
    redirect("/api/redirect", 302);
  }

  const stacks = formData.get("stacks")?.toString().split(",");
  const parsedData = projectFormSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    stacks,
  });

  if (parsedData.success === false) {
    const { image, liveSite, name, repository, description, stacks, addToFeatured } =
      parsedData.error.formErrors.fieldErrors;

    return new Response(
      JSON.stringify({
        description: description?.[0],
        repository: repository?.[0],
        liveSite: liveSite?.[0],
        image: image?.[0],
        name: name?.[0],
        stacks: stacks?.[0],
        addToFeatured: addToFeatured?.[0],
      } as CreateProjectPostType),
      { status: 400 }
    );
  }

  const {
    description,
    name,
    image,
    liveSite: liveUrl,
    repository: repoUrl,
    addToFeatured,
    stacks: techStacks,
  } = parsedData.data;

  await uploadProjectUseCase({
    image,
    name,
    liveUrl,
    repoUrl,
    description,
    userId: userId as string,
    techStacksArr: techStacks,
    isFeatured: addToFeatured,
  });

  return new Response(
    JSON.stringify({
      message: "Success",
    } as CreateProjectPostType),
    { status: 200 }
  );
};
