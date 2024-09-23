import { TECH_STACKS, type TechStackNamesTypes } from "@/lib/constants";
import { cn, removeArrayItem } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type MouseEvent,
  type KeyboardEvent,
  useState,
  type ElementRef,
  useRef,
  useCallback,
  useEffect,
} from "react";

type SelectProps = {
  selectValues: TechStackNamesTypes[];
  setSelectValues: React.Dispatch<React.SetStateAction<TechStackNamesTypes[]>>;
};

export function Select({ selectValues, setSelectValues }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const divRef = useRef<ElementRef<"div">>(null);
  const detailsRef = useRef<ElementRef<"details">>(null);
  const scrollContainerRef = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    const abortController = new AbortController();
    document.addEventListener(
      "click",
      (event) => {
        if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
          detailsRef.current.open = false;
        }
      },
      {
        signal: abortController.signal,
      }
    );
    return () => {
      abortController.abort();
    };
  }, []);

  const smoothScroll = (direction: "left" | "right") => {
    let scrollXValue = 100;

    if (scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll =
        direction === "left" ? currentScroll - scrollXValue : currentScroll + scrollXValue;

      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

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
      case "ArrowLeft":
        event.preventDefault();
        const prevIdx = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        dropDownNavigation(prevIdx);
        break;
      case "ArrowRight":
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
      className="list-none relative hoverable:hocus-visible:outline-1 hoverable:hocus-visible:outline hoverable:hocus-visible:outline-primary"
      open={isOpen}
      onToggle={(e) => {
        if (e.currentTarget.open) {
          dropDownNavigation(0);
        }
        setIsOpen(e.currentTarget.open);
      }}
      onBlur={(e) => {
        e.target.open = false;
      }}
    >
      <summary className="grid grid-cols-[1fr,auto,auto] gap-2 items-center border pr-2 cursor-pointer relative">
        <div
          ref={scrollContainerRef}
          className="w-full flex overscroll-x-contain gap-2 overflow-x-auto items-center justify-center snap-x snap-mandatory py-2 px-4 scroll-py-4  cursor-default scroll-smooth "
        >
          {selectValues.length > 0 ? (
            selectValues.map((val) => (
              <button
                key={val}
                className={cn(
                  "border group px-2 hoverable:hocus-visible:border-destructive not-hoverable:border-destructive snap-center"
                )}
                type="button"
                onClick={(e) => handleRemoveSelectValue(e, val)}
                onKeyDown={(e) => {
                  if (e.code === "ArrowDown") {
                    setIsOpen((prev) => !prev);
                  }
                }}
              >
                {val}
                <span className="pl-2 hoverable:group-hover:text-destructive not-hoverable:text-destructive hoverable:group-focus-visible:text-destructive ">
                  &times;
                </span>
              </button>
            ))
          ) : (
            <span className="cursor-pointer">Select tech stacks</span>
          )}

          <button
            type="button"
            className={cn(
              "hidden absolute top-1/2 -translate-y-1/2 left-0 z-10 h-full backdrop-blur",
              {
                block: selectValues.length >= 4,
              }
            )}
            onClick={() => smoothScroll("left")}
          >
            {<ChevronLeft />} <span className="sr-only">scroll Left</span>
          </button>
          <button
            type="button"
            className={cn(
              "hidden  absolute top-1/2 -translate-y-1/2 right-6 z-10  border h-full backdrop-blur",
              {
                block: selectValues.length >= 4,
              }
            )}
            onClick={() => smoothScroll("right")}
          >
            {<ChevronRight />} <span className="sr-only">scroll Right</span>
          </button>
        </div>
        <span className=" p-[1px] my-1 self-stretch bg-muted " />
        <span
          className={cn(
            " relative translate-y-1/4 border-4 border-transparent border-t-foreground hoverable:hocus-visible:border-t-primary ",
            {
              "border-b-primary -translate-y-1/4 border-t-transparent hoverable:hocus-visible:border-b-primary hoverable:hocus-visible:border-t-transparent":
                isOpen,
            }
          )}
        ></span>
      </summary>

      <div
        ref={divRef}
        className={cn(
          "absolute top-[calc(100%+.5em)] z-10 w-full flex items-center gap-2 p-1 flex-wrap min-h-fit border backdrop-blur bg-background/90  ",
          { hidden: TECH_STACKS.length === selectValues.length }
        )}
      >
        {TECH_STACKS.map((value) => {
          const isIncluded = selectValues.includes(value.stackName);

          return (
            <>
              <button
                key={value.stackName}
                type="button"
                className={cn(
                  "border focus:text-primary w-fit grow px-2 py-1 hoverable:hover:text-rose-300 ",
                  {
                    " hidden pointer-events-none": isIncluded,
                  }
                )}
                onClick={(e) => {
                  setSelectValues((val) => [...val, value.stackName]);
                  e.stopPropagation();
                  const target = e.target as HTMLButtonElement;
                  // so that the button focus stays on the list of buttons
                  if (target.nextElementSibling instanceof HTMLElement) {
                    target.nextElementSibling.focus();
                  } else {
                    dropDownNavigation(0);
                  }
                }}
                onBlur={() => {
                  if (TECH_STACKS.length === selectValues.length) {
                    setIsOpen(false);
                  }
                }}
                onKeyDown={(e) => handleDropDownKeyDown(e)}
                aria-hidden={isIncluded}
                tabIndex={isIncluded ? -1 : 0}
              >
                {value.stackName}
              </button>
            </>
          );
        })}
      </div>
    </details>
  );
}
