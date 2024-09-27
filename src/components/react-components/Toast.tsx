import { cn } from "@/lib/utils";
import { useState, type ComponentProps, type CSSProperties, type SVGProps } from "react";
import styles from "./toastStyles.module.css";

//TODO: [] - must come from out of screen to the desired location
//    -- [] use transform translate ?
//    -- [x] fixed position
//    -- [] do display none and take advantage of the offscreen and the display none descrete animation
//    -- [] must be able to put a desired positon of the toast
//      -- do a corresponding variant of positioning top and bottom : mid left right (object? do a lookup instead)
//    -- [] automatically dismissed with a {prop} to set a timer when AND also set a default
//    -- [] can have a prop that can close the toast
//    -- [] try RAF ?

const getTimingNumber = (timeString: string | number): number => {
  let timingNumber: number = 0;
  if (typeof timeString === "string" && timeString.endsWith("ms")) {
    const slicedNumber = Number(timeString.slice(0, -2));
    timingNumber = Math.floor(slicedNumber);
  } else if (typeof timeString === "string" && timeString.endsWith("s")) {
    const slicedNumber = Number(timeString.slice(0, -1));
    timingNumber = Math.floor(slicedNumber) * 1000;
  } else {
    timingNumber = Math.floor(Number(timeString));
  }

  if (isNaN(timingNumber)) {
    throw new Error(
      "closing delay is not a valid argument. must end with 's' 'ms' or number in ms"
    );
  }
  return timingNumber;
};

const toastPosition: Record<Position, string> = {
  "top-middle": "top-5 left-1/2 -translate-x-1/2",
  "top-left": "top-5 left-5",
  "top-right": "top-5 right-5",
  "bottom-middle": "bottom-5 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-5 left-5",
  "bottom-right": "bottom-5 right-5",
};

const variantColorScheme: Record<Variant, string> = {
  default: "border-2  border-zinc-800 ",
  success: "border-2 border-green-700 text-green-700",
  error: "border-2 border-red-700 text-red-700",
  warning: "border-2 border-amber-400 text-amber-700",
  info: "border-2 border-blue-400 text-blue-700",
};

type XPosition = "left" | "right" | "middle";
type Position = `top-${XPosition}` | `bottom-${XPosition}`;
type Variant = "success" | "warning" | "error" | "info" | "default";

type ToastProps = {
  showCloseButton?: boolean;
  closingDelay?: `${number}${"ms" | "s"}`;
  position?: Position;
  variant?: Variant;
} & ComponentProps<"div">;

const XIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="#000000"
    height="100%"
    width="100%"
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 460.775 460.775"
    {...props}
  >
    <path
      d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
	c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
	c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
	c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
	l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
	c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
    />
  </svg>
);

export function Toast({
  children,
  className,
  showCloseButton = true,
  closingDelay = "2s",
  position = "top-middle",
  variant = "default",
  ...props
}: ToastProps) {
  const [closeToast, setCloseToast] = useState<boolean>(false);

  return (
    <div
      className={cn(
        "fixed rounded border w-fit p-4 visible z-[1000] bg-background",
        toastPosition[position],
        variantColorScheme[variant],
        closeToast &&
          " transition-[transform,visibility,top] invisible -top-[100%] duration-300 ease-in-out",
        //styles["close-toast"],
        className
      )}
      style={{ "--toast-delay": closingDelay } as CSSProperties}
      {...props}
    >
      <span
        className={cn(
          "absolute top-0 left-0  bg-green-500 h-[2px] w-full",
          styles["closing-animation"]
        )}
      />
      <button
        className={cn(
          "absolute top-1 right-1 leading-none size-4 rounded-full hidden p-1 group hover:bg-red-100 dark:hover:bg-red-900/30 ",
          {
            block: showCloseButton,
          }
        )}
        type="button"
        onClick={() => setCloseToast(true)}
      >
        <XIcon className="dark:fill-gray-100 group-hover:fill-red-700 dark:group-hover:fill-red-700" />
      </button>
      {children}
    </div>
  );
}
