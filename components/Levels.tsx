"use client";

import { useState, type ReactNode } from "react";

const ICONS = ["🌱", "🌿", "🌳", "🌸"];
const NAMES = ["Sprout", "Sapling", "Tree", "Bloom"];

export default function Levels({ levels }: { levels: { title: string; body: ReactNode }[] }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="levels-tabs" role="tablist">
        {levels.map((l, k) => (
          <button key={k} role="tab" aria-selected={i === k} className="level-tab" onClick={() => setI(k)}>
            {ICONS[k]} Lv {k + 1} · {NAMES[k]}
          </button>
        ))}
      </div>
      <div className="card level-panel pop-in" key={i} role="tabpanel">
        <h3>
          {ICONS[i]} {levels[i].title}
        </h3>
        {levels[i].body}
        <div className="controls" style={{ marginTop: 14, marginBottom: 0 }}>
          {i > 0 && (
            <button className="btn small secondary" onClick={() => setI(i - 1)}>
              ← easier
            </button>
          )}
          {i < levels.length - 1 && (
            <button className="btn small matcha" onClick={() => setI(i + 1)}>
              Level up → {ICONS[i + 1]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
