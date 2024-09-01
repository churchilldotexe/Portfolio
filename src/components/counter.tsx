import { useState, type ComponentProps } from "react";

type CounterProps = ComponentProps<"div">;

export default function Counter({ children, ...props }: CounterProps) {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="space-y-4" {...props}>
      <h2>Count: {count} </h2>
      <button
        className=" size-full rounded bg-rose-500 px-4 py-2"
        onClick={() => setCount((prev) => prev + 1)}
      >
        add
      </button>
      {children}
    </div>
  );
}
