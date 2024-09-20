import { projectFormSchema, type CreateProjectPostType } from "@/lib/schema";
import { GenerateFormComponents } from "./GenerateFormComponents";
import { cn, fetcher } from "@/lib/utils";
import { useState, type FormEvent } from "react";
import { ACCEPTED_FILE_TYPE, type TechStackNamesTypes } from "@/lib/constants";
import { Crown, ImagePlus, Loader2 } from "lucide-react";
import { Select } from "./Select";
import { ZodError, z } from "zod";

export const prerender = false;

const fetcherSchema = z.object({ message: z.string().min(1) });

const { Form, Input, ErrorMessage, Textarea } = GenerateFormComponents({
  schema: projectFormSchema,
});

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

export default function ProjectForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [responseMessage, setResponseMessage] = useState("");
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  const [selectValues, setSelectValues] = useState<TechStackNamesTypes[]>([]);
  const [formErrorMessage, setFormErrorMessage] = useState<CreateProjectPostType>({
    name: "",
    repository: "",
    description: "",
    liveSite: "",
    image: "",
    stacks: "",
    addToFeatured: "",
  });
  const [isFormPending, setIsFormPending] = useState<boolean>(false);

  const handleImageChange = (fileList: FileList | null) => {
    if (fileList === null) {
      return;
    }

    const files = Array.from(fileList);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setObjectUrls((prevUrls) => {
      for (const url of prevUrls) {
        URL.revokeObjectURL(url);
      }
      return newUrls;
    });
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsFormPending(true);
    const formData = new FormData(event.target as HTMLFormElement);
    const stacks = formData.get("stacks")?.toString().split(",");
    const parsedData = projectFormSchema.safeParse({
      ...Object.fromEntries(formData.entries()),
      stacks,
    });

    if (parsedData.success === false) {
      const { image, liveSite, name, repository, description, stacks, addToFeatured } =
        parsedData.error.formErrors.fieldErrors;

      setIsFormPending(false);
      setFormErrorMessage({
        image: image?.[0],
        liveSite: liveSite?.[0],
        name: name?.[0],
        repository: repository?.[0],
        description: description?.[0],
        stacks: stacks?.[0],
        addToFeatured: addToFeatured?.[0],
      });
      return;
    }

    const data = await fetcher(
      "/api/create-project",
      { method: "POST", body: formData },
      fetcherSchema
    );

    if (data instanceof Error || data instanceof ZodError) {
      throw new Error(`${data.name}. ${data.cause}. ${data.message}`);
    }
    if (data.message) {
      (event.target as HTMLFormElement).reset();
      setObjectUrls((prevUrl) => {
        return prevUrl.filter((url) => URL.revokeObjectURL(url));
      });

      setIsFormPending(false);
      setResponseMessage(data.message);
    }
  }

  return (
    <div
      className={cn("size-full p-6 grid place-items-center gap-6 grid-cols-1", {
        "xl:grid-cols-2": objectUrls.length > 0,
      })}
    >
      <Form
        className="space-y-5 max-w-4xl w-full"
        method="POST"
        encType="multipart/form-data"
        onSubmit={submit}
      >
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

        <fieldset className="relative">
          <Textarea
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

        <div className="flex w-full justify-between items-center">
          <div className="flex gap-4 items-center px-2">
            <fieldset className="w-full">
              <legend className="sr-only">Image Upload</legend>
              <label className="relative cursor-pointer" htmlFor="imageFile">
                <div>
                  <ImagePlus />
                </div>

                <span className="sr-only">Select Image</span>
                <Input
                  id="imageFile"
                  className="sr-only"
                  name="image"
                  type="file"
                  accept={ACCEPTED_FILE_TYPE.join(",")}
                  onChange={(e) => {
                    handleImageChange(e.target.files);
                  }}
                  required
                />
                <ErrorMessage useDefaultStyling={false} name="image">
                  {formErrorMessage["image"]}
                </ErrorMessage>
              </label>
            </fieldset>
            <fieldset>
              <legend className="sr-only">Image Upload</legend>
              <label htmlFor="feature-checkbox" className="cursor-pointer">
                <Input
                  id="feature-checkbox"
                  className="peer sr-only"
                  type="checkbox"
                  name="addToFeatured"
                />
                <Crown className={cn("peer-checked:fill-amber-600 size-6 ")} />
              </label>
            </fieldset>
          </div>

          <fieldset className="relative w-full ">
            <legend className="sr-only">Technology Stacks</legend>
            <Input type="hidden" name="stacks" value={selectValues} required />

            <Select selectValues={selectValues} setSelectValues={setSelectValues} />
            <ErrorMessage useDefaultStyling={false} name="stacks" position="topMiddle">
              {formErrorMessage["stacks"]}
            </ErrorMessage>
          </fieldset>
        </div>

        <div className="relative ">
          <button
            disabled={isFormPending || !isLoggedIn}
            className={cn("relative grid size-full bg-primary p-1 ", {
              "bg-muted": isFormPending,
            })}
            type="submit"
          >
            <Loader2
              className={cn(
                "animate-spin absolute text-muted-foreground [grid-area:1/1] place-self-center w-full hidden",
                {
                  block: isFormPending,
                }
              )}
            />
            <span className={cn("", { "opacity-0 select-none": isFormPending })}>Submit</span>
          </button>
          <a
            className={cn(
              " absolute flex items-center justify-center inset-0 size-full z-[1] backdrop-blur-sm text-neutral-950 font-semibold bg-neutral-100/25 ",
              { hidden: isLoggedIn }
            )}
            href="/api/redirect"
          >
            Connect to Github
          </a>
        </div>

        {responseMessage && <p>{responseMessage}</p>}
      </Form>

      {objectUrls.length > 0 ? <img src={objectUrls[0]} alt="project preview" /> : null}
    </div>
  );
}
