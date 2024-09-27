import {
  useCallback,
  useState,
  type ComponentProps,
  type CSSProperties,
  type SVGProps,
} from "react";
import styles from "./toastStyles.module.css";

const getTimingNumber = (timeString: string): number => {
  let timingNumber: number = 0;
  if (timeString.endsWith("ms")) {
    const slicedNumber = Number(timeString.slice(0, -2));
    timingNumber = Math.floor(slicedNumber);
  }
  if (timeString.endsWith("s")) {
    const slicedNumber = Number(timeString.slice(0, -1));
    timingNumber = Math.floor(slicedNumber) * 1000;
  }

  if (isNaN(timingNumber)) {
    throw new Error(
      "closing delay is not a valid argument. must end with 's' 'ms' or number in ms"
    );
  }
  return timingNumber;
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

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
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
}

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

  const timingNumber = getTimingNumber(closingDelay);
  const divRef = useCallback((divNode: HTMLDivElement) => {
    setTimeout(() => (divNode.style.display = "none"), timingNumber);
  }, []);

  const exitAnimationPercentage = position.startsWith("top")
    ? {
        "--exit-top-value": "-50%",
        "--exit-bottom-value": "unset",
        "--top-value": "1.25em",
        "--bottom-value": "unset",
      }
    : {
        "--exit-top-value": "unset",
        "--exit-bottom-value": "-50%",
        "--top-value": "unset",
        "--bottom-value": "1.25em",
      };

  return (
    <div
      ref={divRef}
      data-hide={closeToast}
      className={`${styles["toast-styles"]} ${styles[position]} ${styles[variant]} ${styles["toast-animation"]} ${styles["force-close-animation"]} ${className}`}
      style={{ "--toast-delay": closingDelay, ...exitAnimationPercentage } as CSSProperties}
      {...props}
    >
      <span className={styles["closing-timer"]} />
      <button
        className={styles["close-btn"]}
        data-show={showCloseButton}
        type="button"
        onClick={() => setCloseToast(true)}
      >
        <XIcon />
      </button>
      {children}
    </div>
  );
}
