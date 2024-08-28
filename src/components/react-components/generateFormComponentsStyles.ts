import type { CSSProperties } from "react";

type VerticalPosition = "top" | "bottom";
type HorizontalPosition = "middle" | "left";

export type Position = `${VerticalPosition}${Capitalize<HorizontalPosition>}`;

export type ValidationMessageVariant = "error" | "warning";
const variantColor: Record<ValidationMessageVariant, string> = {
  error: "#ef4444",
  warning: "#d97706",
};

type StyleSet = {
  divStyle: CSSProperties;
  spanStyle: CSSProperties;
};

type ErrorMessageStyle = {
  inputStyles: StyleSet;
  textAreaStyles: StyleSet;
};

const createBaseStyle = (variant: string): StyleSet => ({
  divStyle: {
    width: "fit-content",
    gridArea: "1/1",
    justifySelf: "center",
    alignSelf: "center",
    position: "absolute",
    backgroundImage: "linear-gradient(to bottom right, white/10, white/0)",
    backdropFilter: "blur(4px)",
    color: variant,
    padding: "0.1em 0.5em",
    borderRadius: "5px",
    zIndex: "100",
    boxShadow: "0 8px 6px 0 rgba(0,0,0,0.37) ",
  },
  spanStyle: {
    position: "absolute",
    width: "20px",
    height: "20px",
    // backgroundImage: "linear-gradient(to bottom right, white/10, white/0)",
    backdropFilter: "blur(4px)",
    // transform: " rotate(45deg) ",
    background: "inherit",
    clipPath: "polygon(12% 35%, 52% 76%, 87% 32%, 71% 33%, 52% 56%, 26% 33%)",
  },
});

const styleByPosition: Record<Position, ({ divStyle, spanStyle }: StyleSet) => StyleSet> = {
  topMiddle: ({ divStyle, spanStyle }) => ({
    divStyle: {
      ...divStyle,
      margin: "0 auto",
      bottom: "90%",
      left: "50%",
      translate: "-50%",
    },
    spanStyle: {
      ...spanStyle,
      bottom: "-3px",
      left: "50%",
      translate: "-50%",
    },
  }),
  bottomMiddle: ({ divStyle, spanStyle }) => ({
    divStyle: {
      ...divStyle,
      top: "90%",
      margin: "0 auto",
      left: "50%",
      translate: "-50%",
    },
    spanStyle: {
      ...spanStyle,
      top: "-3px",
      left: "50%",
      translate: "-50%",
    },
  }),
  topLeft: ({ divStyle, spanStyle }) => ({
    divStyle: {
      ...divStyle,
      margin: "0 auto",
      bottom: "90%",
      justifySelf: "start",
    },
    spanStyle: {
      ...spanStyle,
      bottom: "-50%",
      left: "0",
      borderRadius: "0 5px",
    },
  }),
  bottomLeft: ({ divStyle, spanStyle }) => ({
    divStyle: {
      ...divStyle,
      margin: "0 auto",
      top: "90%",
      justifySelf: "start",
    },
    spanStyle: {
      ...spanStyle,
      top: "-3px",
      left: "0",
      borderRadius: "0 5px",
    },
  }),
};

export const popUpPosition = ({
  position,
  variant,
}: {
  position: Position;
  variant: ValidationMessageVariant;
}): ErrorMessageStyle => {
  const color = variantColor[variant];
  return {
    inputStyles: styleByPosition[position](createBaseStyle(color)),
    textAreaStyles: styleByPosition[position](createBaseStyle(color)),
  };
};

// <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
