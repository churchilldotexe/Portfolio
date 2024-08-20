import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="space-y-4">
      <h2>Count: {count} </h2>
      <button
        className=" size-full rounded bg-rose-500 px-4 py-2"
        onClick={() => setCount((prev) => prev + 1)}
      >
        add
      </button>
    </div>
  );
}
