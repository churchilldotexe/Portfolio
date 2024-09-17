import { TECH_STACKS, type TechStackNamesTypes } from "@/lib/constants";
import { cn, removeArrayItem } from "@/lib/utils";
import {
  type MouseEvent,
  type KeyboardEvent,
  useState,
  type ElementRef,
  useRef,
  useCallback,
} from "react";

type SelectProps = {
  selectValues: TechStackNamesTypes[];
  setSelectValues: React.Dispatch<React.SetStateAction<TechStackNamesTypes[]>>;
};

export function Select({ selectValues, setSelectValues }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef<ElementRef<"details">>(null);
  const divRef = useRef<ElementRef<"div">>(null);

  const dropDownNavigation = useCallback((index: number) => {
    if (divRef.current) {
      const buttons = divRef.current.querySelectorAll("button:not([aria-hidden='true'])");
      (buttons[index] as HTMLButtonElement)?.focus();
    }
  }, []);

  const handleDropDownKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();
    const buttons = divRef.current?.querySelectorAll("button:not([aria-hidden='true'])") || [];
    const currentIndex = Array.from(buttons).findIndex(
      (button) => button === document.activeElement
    );

    switch (event.code) {
      case "ArrowUp":
        event.preventDefault();
        const prevIdx = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        dropDownNavigation(prevIdx);
        break;
      case "ArrowDown":
        event.preventDefault();
        const nextIdx = (currentIndex + 1) % buttons.length;
        dropDownNavigation(nextIdx);
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleRemoveSelectValue = (
    event: MouseEvent<HTMLButtonElement>,
    value: TechStackNamesTypes
  ) => {
    event.stopPropagation();
    setSelectValues((prevArr) => removeArrayItem(value, prevArr));
  };

  return (
    <details
      ref={detailsRef}
      className="list-none relative"
      open={isOpen}
      onToggle={(e) => {
        if (e.currentTarget.open) {
          dropDownNavigation(0);
        }
        setIsOpen(e.currentTarget.open);
      }}
    >
      <summary className="flex gap-2 w-full max-w-sm min-h-fit border p-2 cursor-pointer">
        {selectValues.length > 0 ? (
          selectValues.map((val) => (
            <button
              key={val}
              className="border group px-2 hocus-visible:border-destructive min-w-fit"
              type="button"
              onClick={(e) => handleRemoveSelectValue(e, val)}
            >
              {val}{" "}
              <span className=" group-hover:text-destructive group-focus-visible:text-destructive ">
                &times;
              </span>
            </button>
          ))
        ) : (
          <span>Select tech stacks</span>
        )}
      </summary>

      <div
        ref={divRef}
        className="absolute top-[calc(100%+2em)] flex flex-col gap-1 items-center border"
      >
        {TECH_STACKS.map((value, index) => {
          const isIncluded = selectValues.includes(value.stackName);

          return (
            <button
              key={value.stackName}
              type="button"
              className={cn("focus:text-primary", { " hidden pointer-events-none": isIncluded })}
              onClick={(e) => {
                e.stopPropagation();
                setSelectValues((val) => [...val, value.stackName]);
                handleDropDownKeyDown({
                  code: "ArrowDown",
                  preventDefault: () => {},
                } as KeyboardEvent);
              }}
              onKeyDown={(e) => handleDropDownKeyDown(e)}
              aria-hidden={isIncluded}
              tabIndex={isIncluded ? -1 : 0}
            >
              {value.stackName}
            </button>
          );
        })}
      </div>
    </details>
  );
}
