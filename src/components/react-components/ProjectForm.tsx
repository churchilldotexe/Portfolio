import { projectFormSchema } from "@/lib/schema";
import { GenerateFormComponents } from "./GenerateFormComponents";
import { cn } from "@/lib/utils";

const { Form, Input, ErrorMessage } = GenerateFormComponents({ schema: projectFormSchema });

const PROJECT_INPUT_DATA = [
  {
    name: "name",
    label: "Project Name",
  },
  {
    name: "description",
    label: "Project Description",
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
  return (
    <Form className="space-y-5">
      <fieldset>
        <label htmlFor="image">Project Image</label>
        <Input name="image" id="image" type="file" />

        <ErrorMessage useDefaultStyling={false} name="image" />
      </fieldset>

      {PROJECT_INPUT_DATA.map(({ label, name }) => (
        <fieldset className="relative ">
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
              "peer-placeholder-shown:top-2 peer-placeholder-shown:left-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:backdrop-blur-none peer-placeholder-shown:[text-shadow:none]"
            )}
            htmlFor={name}
          >
            {label}
          </label>
          <ErrorMessage useDefaultStyling={false} position="bottomMiddle" name="name" />
        </fieldset>
      ))}
    </Form>
  );
}
