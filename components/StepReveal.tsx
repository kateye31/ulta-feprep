"use client";

import { useState, type ReactNode } from "react";

/** Show a worked problem one step at a time, so it's never a wall of text. */
export default function StepReveal({ prompt, steps }: { prompt: ReactNode; steps: ReactNode[] }) {
  const [n, setN] = useState(0);
  return (
    <div>
      <div className="prompt">{prompt}</div>
      <div className="steps">
        {steps.slice(0, n).map((s, i) => (
          <div className="step pop-in" key={i}>
            <span className="step-n">{i + 1}</span>
            {s}
          </div>
        ))}
      </div>
      <div className="controls" style={{ marginTop: 12 }}>
        {n < steps.length ? (
          <button className="btn small" onClick={() => setN(n + 1)}>
            👣 Show step {n + 1} of {steps.length}
          </button>
        ) : (
          <span className="hand" style={{ color: "var(--matcha)" }}>
            ✨ All done! You got through it.
          </span>
        )}
        {n > 0 && n < steps.length && (
          <button className="btn small secondary" onClick={() => setN(steps.length)}>
            Show all
          </button>
        )}
        {n > 0 && (
          <button className="btn small secondary" onClick={() => setN(0)}>
            ↺ Hide again
          </button>
        )}
      </div>
    </div>
  );
}
