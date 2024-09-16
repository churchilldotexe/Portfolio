import { TECH_STACKS, type TechStackNamesTypes } from "@/lib/constants";
import { cn, removeArrayItem } from "@/lib/utils";
import type { MouseEvent, KeyboardEvent } from "react";

type SelectProps = {
  selectValues: TechStackNamesTypes[];
  setSelectValues: React.Dispatch<React.SetStateAction<TechStackNamesTypes[]>>;
};

// TODO:
// - [x] use details html instead for another accessibility feature
// - [ ] design the details div to make it like a dropdown
// - [ ] the summary must show the selected value as a button so it can be closed on click and on keypress(enter)
// - [ ] use the includes method to check if the selected value is already in the array if it is marked/remove in the list
//       -- if not add it in the array of list

export function Select({ selectValues, setSelectValues }: SelectProps) {
  const handleRemoveSelectValue = (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
    value: TechStackNamesTypes
  ) => {
    event.stopPropagation();
    if (event instanceof KeyboardEvent) {
      switch (event.code) {
        case "Enter":
          setSelectValues((prevArr) => removeArrayItem(value, prevArr));
          break;
      }
    } else {
      setSelectValues((prevArr) => removeArrayItem(value, prevArr));
    }
  };

  return (
    <details className="list-none relative">
      <summary className="flex gap-2 w-full max-w-sm min-h-fit border p-2">
        {selectValues.map((val) => (
          <button
            key={val}
            type="button"
            onClick={(e) => {
              handleRemoveSelectValue(e, val);
            }}
            onKeyDown={(e) => {
              handleRemoveSelectValue(e, val);
            }}
          >
            {val}
          </button>
        ))}
      </summary>

      <div
        className={cn("absolute top-[calc(100%+2em)] flex flex-col gap-1 items-center", {
          hidden: selectValues.length === TECH_STACKS.length,
        })}
      >
        {TECH_STACKS.map((value) => {
          const isIncluded = selectValues.includes(value.stackName);

          return (
            <button
              type="button"
              className={cn("", { hidden: isIncluded })}
              onClick={(e) => {
                e.stopPropagation();
                setSelectValues((val) => [...val, value.stackName]);
              }}
            >
              {value.stackName}
            </button>
          );
        })}
      </div>
    </details>
  );
}
