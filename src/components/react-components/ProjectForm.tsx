import {
  projectPostSchema,
  projectFormSchema,
  type CreateProjectPostType,
  type ProjectFormTypes,
} from "@/lib/schema";
import { GenerateFormComponents } from "./GenerateFormComponents";
import { cn, fetcher } from "@/lib/utils";
import { useState, type FormEvent } from "react";

export const prerender = false;

const { Form, Input, ErrorMessage } = GenerateFormComponents({ schema: projectFormSchema });

const PROJECT_INPUT_DATA = [
  {
    name: "name",
    label: "Project Name",
  },
  {
    name: "repository",
    label: "Repository URL",
  },
  {
    name: "liveSite",
    label: "Live Site URL",
  },
] as const;

export default function ProjectForm() {
  const [responseMessage, setResponseMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState<CreateProjectPostType>({
    name: "",
    repository: "",
    description: "",
    liveSite: "",
    image: "",
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const rawData = projectFormSchema.safeParse(Object.fromEntries(formData.entries()));
    if (rawData.success === false) {
      console.error(rawData.error.formErrors.fieldErrors, "error from submit");
      const { image, liveSite, name, repository, description } =
        rawData.error.formErrors.fieldErrors;
      setFormErrorMessage({
        image: image?.[0],
        liveSite: liveSite?.[0],
        name: name?.[0],
        repository: repository?.[0],
        description: description?.[0],
      });
      return;
    }

    const data = await fetcher(
      "/api/create-project",
      { method: "POST", body: formData },
      projectPostSchema
    );
    if (data instanceof Error) {
      throw new Error(`${data.name}. ${data.cause}. ${data.message}`);
    }

    if (data.message) {
      (event.target as HTMLFormElement).reset();
      setResponseMessage(data.message);
    }
  }

  return (
    <Form
      className="space-y-5 max-w-2xl w-full"
      method="POST"
      encType="multipart/form-data"
      onSubmit={submit}
    >
      <fieldset className="w-full relative">
        <Input name="image" id="image" type="file" className="sr-only" />

        <label
          htmlFor="image"
          className="w-full relative cursor-pointer p-1 bg-foreground text-background rounded"
        >
          Upload Image
        </label>
        <ErrorMessage useDefaultStyling={false} name="image">
          {formErrorMessage["image"]}
        </ErrorMessage>
      </fieldset>

      {PROJECT_INPUT_DATA.map(({ label, name }) => (
        <fieldset className="relative w-full" key={name}>
          <Input
            className="peer w-full rounded border p-2 placeholder-transparent outline-none text-gray-950"
            name={name}
            id={name}
            type="text"
            placeholder={label}
            required
          />
          <label
            className={cn(
              "-top-2.5 absolute left-1.5 cursor-text text-lg text-foreground leading-none backdrop-blur-[2px] transition-all [text-shadow:1px_1px_2px_hsl(var(--background)),_0_0_1em_hsl(var(--background)),_0_0_0.2em_hsl(var(--background))]",
              "peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:text-foreground peer-focus:text-lg peer-focus:leading-none peer-focus:backdrop-blur-[2px] peer-focus:[text-shadow:1px_1px_2px_hsl(var(--background)),_0_0_1em_hsl(var(--background)),_0_0_0.2em_hsl(var(--background))] ",
              "peer-placeholder-shown:top-2 peer-placeholder-shown:left-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:select-none peer-placeholder-shown:backdrop-blur-none peer-placeholder-shown:[text-shadow:none]"
            )}
            htmlFor={name}
          >
            {label}
          </label>
          <ErrorMessage useDefaultStyling={false} position="bottomMiddle" name={name}>
            {formErrorMessage[name]}
          </ErrorMessage>
        </fieldset>
      ))}

      <fieldset className="relative ">
        <textarea
          className="peer w-full rounded border p-2 placeholder-transparent outline-none text-gray-950"
          name="description"
          id="description"
          placeholder="Project Description"
          required
        />
        <label
          className={cn(
            "-top-2.5 absolute left-1.5 cursor-text text-lg text-foreground leading-none backdrop-blur-[2px] transition-all [text-shadow:1px_1px_2px_hsl(var(--background)),_0_0_1em_hsl(var(--background)),_0_0_0.2em_hsl(var(--background))]",
            "peer-focus:-top-2.5 peer-focus:left-1.5 peer-focus:text-foreground peer-focus:text-lg peer-focus:leading-none peer-focus:backdrop-blur-[2px] peer-focus:[text-shadow:1px_1px_2px_hsl(var(--background)),_0_0_1em_hsl(var(--background)),_0_0_0.2em_hsl(var(--background))] ",
            "peer-placeholder-shown:top-2 peer-placeholder-shown:left-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:select-none peer-placeholder-shown:backdrop-blur-none peer-placeholder-shown:[text-shadow:none]"
          )}
          htmlFor="description"
        >
          Project Description
        </label>
        <ErrorMessage useDefaultStyling={false} position="bottomMiddle" name="description">
          {formErrorMessage["description"]}
        </ErrorMessage>
      </fieldset>
      <button type="submit">submit</button>
      {responseMessage && <p>{responseMessage}</p>}
    </Form>
  );
}
