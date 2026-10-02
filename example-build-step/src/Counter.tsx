import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <output>{count}</output>
      <div className="buttons">
        <button type="button" aria-label="Decrease" onClick={() => setCount(count - 1)}>
          −
        </button>
        <button type="button" onClick={() => setCount(0)}>
          Reset
        </button>
        <button type="button" aria-label="Increase" onClick={() => setCount(count + 1)}>
          +
        </button>
      </div>
    </>
  );
}
