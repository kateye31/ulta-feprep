"use client";

import { useState, type ReactNode } from "react";
import confetti from "canvas-confetti";

type Q = { q: ReactNode; choices: ReactNode[]; answer: number; why: ReactNode };

export default function Quiz({ items }: { items: Q[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => items.map(() => null));
  const score = picked.filter((p, i) => p === items[i].answer).length;
  const finished = picked.every((p) => p !== null);

  const choose = (qi: number, ci: number) => {
    if (picked[qi] !== null) return;
    const next = [...picked];
    next[qi] = ci;
    setPicked(next);
    if (next.every((p, i) => p === items[i].answer)) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 }, colors: ["#f2c95f", "#7fae74", "#ec9f9f", "#86c3d7", "#b39ddb"] });
    }
  };

  return (
    <div>
      {items.map((it, qi) => (
        <div className="quiz-q card" key={qi}>
          <div className="quiz-q-title">
            <span aria-hidden>🫖 </span>
            {it.q}
          </div>
          <div className="quiz-choices" role="group">
            {it.choices.map((c, ci) => {
              const p = picked[qi];
              const cls = p === null ? "" : ci === it.answer ? "right" : ci === p ? "wrong" : "";
              return (
                <button key={ci} className={`quiz-choice ${cls}`} disabled={p !== null} onClick={() => choose(qi, ci)}>
                  <span aria-hidden>{p === null ? "○" : ci === it.answer ? "✅" : ci === p ? "❌" : "○"}</span>
                  <span>{c}</span>
                </button>
              );
            })}
          </div>
          {picked[qi] !== null && (
            <div className="quiz-why pop-in">
              <strong>{picked[qi] === it.answer ? "Yes! 🎉 " : "Almost! 🌧 "}</strong>
              {it.why}
            </div>
          )}
        </div>
      ))}
      {finished && (
        <div className="callout gold pop-in">
          <span className="callout-icon">🏅</span>
          <span className="callout-title">
            You scored {score} / {items.length}
          </span>
          {score === items.length
            ? "Perfect cup! Stamp your loyalty card at the top ☕"
            : "Every miss tells you what to reread. Go back to the level tabs and try again later."}
          <div style={{ marginTop: 8 }}>
            <button className="btn small secondary" onClick={() => setPicked(items.map(() => null))}>
              ↺ Retry quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
