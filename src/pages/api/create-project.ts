import { projectFormSchema, type CreateProjectPostType } from "@/lib/schema";
import { uploadProjectUseCase } from "@/server/use-case/project";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const formData = await request.formData();

  const auth = locals.auth();
  const userId = auth.userId;
  if (userId === null) {
    auth.redirectToSignIn();
  }
  console.log(userId, "userid");
  const parsedData = projectFormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (parsedData.success === false) {
    const { image, liveSite, name, repository, description } =
      parsedData.error.formErrors.fieldErrors;

    return new Response(
      JSON.stringify({
        description: description?.[0],
        repository: repository?.[0],
        liveSite: liveSite?.[0],
        image: image?.[0],
        name: name?.[0],
      } as CreateProjectPostType),
      { status: 400 }
    );
  }
  const { description, name, image, liveSite: liveUrl, repository: repoUrl } = parsedData.data;
  await uploadProjectUseCase({
    image,
    name,
    liveUrl,
    repoUrl,
    description,
    userId: auth.userId as string,
  });

  return new Response(
    JSON.stringify({
      message: "Success",
    } as CreateProjectPostType),
    { status: 200 }
  );
};
