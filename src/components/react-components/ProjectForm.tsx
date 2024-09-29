import { projectFormSchema, type CreateProjectPostType } from "@/lib/schema";
import { GenerateFormComponents } from "./GenerateFormComponents";
import { cn, fetcher } from "@/lib/utils";
import { useReducer, useState, type FormEvent } from "react";
import { ACCEPTED_FILE_TYPE, type TechStackNamesTypes } from "@/lib/constants";
import { Crown, ImagePlus, Loader2 } from "lucide-react";
import { Select } from "./Select";
import { ZodError, z } from "zod";
import { Toast } from "./Toast";
import type { LoginParamsTypes } from "@/pages/api/callback";

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

type State = {
  responseMessage: string;
  errorMessage: CreateProjectPostType;
  isFormPending: boolean;
  objectUrls: string[];
  selectValues: TechStackNamesTypes[];
};

const initialState: State = {
  responseMessage: "",
  errorMessage: {
    name: "",
    repository: "",
    description: "",
    liveSite: "",
    image: "",
    stacks: "",
    addToFeatured: "",
  },
  isFormPending: false,
  objectUrls: [],
  selectValues: [],
};

type Action =
  | { type: "SET_RESPONSE_MESSAGE"; payload: string }
  | { type: "SET_ERROR_MESSAGE"; payload: CreateProjectPostType }
  | { type: "SET_IS_FORM_PENDING"; payload: boolean }
  | { type: "SET_OBJECT_URLS"; payload: string[] }
  | { type: "SET_SELECT_VALUES"; payload: TechStackNamesTypes[] };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_RESPONSE_MESSAGE":
      return { ...state, responseMessage: action.payload };
    case "SET_SELECT_VALUES":
      return { ...state, selectValues: action.payload };
    case "SET_IS_FORM_PENDING":
      return { ...state, isFormPending: action.payload };
    case "SET_OBJECT_URLS":
      for (let url of state.objectUrls) {
        URL.revokeObjectURL(url);
      }
      return { ...state, objectUrls: action.payload };
    case "SET_ERROR_MESSAGE":
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

export default function ProjectForm({
  isLoggedIn,
  loginParams,
}: {
  isLoggedIn: boolean;
  loginParams: LoginParamsTypes;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [isLoggingIn, setIsLogginIn] = useState<boolean>(
    () => loginParams.status === "success" && false
  );
  const handleSelectValuesChange = (newValues: TechStackNamesTypes[]) => {
    dispatch({ type: "SET_SELECT_VALUES", payload: newValues });
  };

  const handleImageChange = (fileList: FileList | null) => {
    if (fileList === null) {
      return;
    }

    const files = Array.from(fileList);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    dispatch({ type: "SET_OBJECT_URLS", payload: newUrls });
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch({ type: "SET_IS_FORM_PENDING", payload: true });
    const formData = new FormData(event.target as HTMLFormElement);
    const stacks = formData.get("stacks")?.toString().split(",");
    const parsedData = projectFormSchema.safeParse({
      ...Object.fromEntries(formData.entries()),
      stacks,
    });

    if (parsedData.success === false) {
      const { image, liveSite, name, repository, description, stacks, addToFeatured } =
        parsedData.error.formErrors.fieldErrors;

      dispatch({ type: "SET_IS_FORM_PENDING", payload: false });
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: {
          image: image?.[0],
          liveSite: liveSite?.[0],
          name: name?.[0],
          repository: repository?.[0],
          description: description?.[0],
          stacks: stacks?.[0],
          addToFeatured: addToFeatured?.[0],
        },
      });
      return;
    }

    const result = await fetcher(
      "/api/create-project",
      { method: "POST", body: formData },
      fetcherSchema
    );

    if (!result.success) {
      if (result.error instanceof ZodError) {
        throw new Error(`Validation error: ${result.error.message}`);
      } else {
        throw new Error(`Error: ${result.error.message}`);
      }
    }

    (event.target as HTMLFormElement).reset();
    dispatch({ type: "SET_OBJECT_URLS", payload: [] });

    dispatch({ type: "SET_SELECT_VALUES", payload: [] });
    dispatch({ type: "SET_IS_FORM_PENDING", payload: false });
    dispatch({ type: "SET_RESPONSE_MESSAGE", payload: result.data.message });
  }

  return (
    <div
      className={cn("size-full p-6 grid place-items-center gap-6 grid-cols-1", {
        "xl:grid-cols-2": state.objectUrls.length > 0,
      })}
    >
      <Form
        className="w-full max-w-4xl space-y-5"
        method="POST"
        encType="multipart/form-data"
        onSubmit={submit}
      >
        {PROJECT_INPUT_DATA.map(({ label, name }) => (
          <fieldset className="relative w-full" key={name}>
            <Input
              className="peer w-full rounded border p-2 text-gray-950 outline-none placeholder:text-transparent"
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
              {state.errorMessage[name]}
            </ErrorMessage>
          </fieldset>
        ))}

        <fieldset className="relative">
          <Textarea
            className="peer w-full rounded border p-2 text-gray-950 outline-none placeholder:text-transparent"
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
            {state.errorMessage["description"]}
          </ErrorMessage>
        </fieldset>

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4 px-2">
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
                  {state.errorMessage["image"]}
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
            <Input type="hidden" name="stacks" value={state.selectValues} required />

            <Select selectValues={state.selectValues} setSelectValues={handleSelectValuesChange} />
            <ErrorMessage useDefaultStyling={false} name="stacks" position="topMiddle">
              {state.errorMessage["stacks"]}
            </ErrorMessage>
          </fieldset>
        </div>

        <div className="relative ">
          <button
            disabled={state.isFormPending || !isLoggedIn}
            className={cn("relative grid size-full bg-primary p-1 ", {
              "bg-muted": state.isFormPending,
            })}
            type="submit"
          >
            {state.isFormPending && (
              <>
                <Loader2
                  className={cn(
                    "animate-spin absolute text-muted-foreground [grid-area:1/1] place-self-center w-full block"
                  )}
                />
                <Toast variant="info" position="bottom-right">
                  Uploading project to Database
                </Toast>
              </>
            )}
            <span className={cn("", { "opacity-0 select-none": state.isFormPending })}>Submit</span>
          </button>
          <a
            className={cn(
              " absolute flex items-center justify-center inset-0 size-full z-[1] backdrop-blur-sm text-neutral-950 font-semibold bg-neutral-100/25 ",
              { hidden: isLoggedIn }
            )}
            href="/api/redirect"
            aria-disabled={isLoggingIn}
            onClick={(e) => {
              e.preventDefault();

              setIsLogginIn(true);
              location.assign("/api/redirect");
            }}
          >
            {isLoggingIn ? (
              <Loader2
                className={cn(
                  "animate-spin absolute text-muted-foreground [grid-area:1/1] place-self-center w-full block"
                )}
              />
            ) : (
              "Connect to Github"
            )}
          </a>

          {isLoggingIn && (
            <Toast variant="info" position="bottom-right">
              Logging in
            </Toast>
          )}
        </div>
      </Form>

      {state.objectUrls.length > 0 ? <img src={state.objectUrls[0]} alt="project preview" /> : null}

      {Boolean(state.responseMessage) && (
        <Toast variant="success" position="bottom-right">
          {state.responseMessage}
        </Toast>
      )}

      {loginParams.status === "success" && (
        <Toast variant="success" position="bottom-right">
          You can now Post a Project
        </Toast>
      )}
    </div>
  );
}
