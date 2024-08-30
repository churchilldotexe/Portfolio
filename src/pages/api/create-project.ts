import { projectFormSchema, type CreateProjectPostType, type ProjectFormTypes } from "@/lib/schema";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const rawData = projectFormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (rawData.success === false) {
    console.error(rawData.error.formErrors.fieldErrors, "error from submit");
    const { image, liveSite, name, repository, description } = rawData.error.formErrors.fieldErrors;
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

  return new Response(
    JSON.stringify({
      message: "Success",
    } as CreateProjectPostType),
    { status: 200 }
  );
};
