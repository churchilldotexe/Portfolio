import type { ComponentProps } from "react";

type CarouselButtonProps = { projectLength: number } & ComponentProps<"button">;

const CarouselButton = ({ projectLength, children, ...props }: CarouselButtonProps) => {
  return (
    <button
      id="go-next"
      className="absolute right-0 z-10 hidden h-full w-fit border p-1 backdrop-blur-md active:scale-95 group-hover:block group-focus-visible:block hocus-visible:outline hocus-visible:outline-1 md:p-2 lg:p-4"
      data-length={projectLength}
      {...props}
    >
      {children}
    </button>
  );
};

export default CarouselButton;
