"use client";

import { useState } from "react";

export default function GaussStairs() {
  const [n, setN] = useState(6);
  const [twin, setTwin] = useState(false);
  const S = 26;
  const W = (n + 1) * S;
  const H = n * S;
  return (
    <div className="widget">
      <div className="widget-title">🧱 Gauss&apos;s Sugar-Cube Staircase</div>
      <div className="widget-sub">1 + 2 + … + n. Build the staircase, then add an upside-down copy. Together they make a perfect rectangle!</div>
      <div className="controls">
        <label style={{ fontWeight: 800, flex: 1, minWidth: 200 }}>
          n = {n}
          <input className="range" type="range" min={1} max={12} value={n} onChange={(e) => setN(+e.target.value)} />
        </label>
        <button className={`btn small ${twin ? "matcha" : ""}`} onClick={() => setTwin(!twin)}>{twin ? "🙈 Hide twin" : "🪞 Add upside-down twin"}</button>
      </div>
      <div className="stage" style={{ display: "grid", placeItems: "center" }}>
        <svg viewBox={`-2 -2 ${W + 4} ${H + 4}`} style={{ width: "100%", maxWidth: 420, height: "auto" }} role="img" aria-label={`Staircase of ${n} rows`}>
          {Array.from({ length: n }, (_, r) =>
            Array.from({ length: n + 1 }, (_, c) => {
              const mine = c < r + 1; // row r (0-based from top) has r+1 cubes
              if (!mine && !twin) return null;
              return (
                <rect key={`${r}-${c}`} x={c * S} y={r * S} width={S - 3} height={S - 3} rx={5} fill={mine ? "#f2c95f" : "#86c3d7"} stroke="#3d2b52" strokeWidth="1.5" style={{ transition: "opacity .3s" }} />
              );
            }),
          )}
        </svg>
      </div>
      <div className="log">
        {twin ? (
          <>🟨 + 🟦 = a rectangle that is <b>n</b> tall and <b>n+1</b> wide = {n} × {n + 1} = {n * (n + 1)} cubes. The yellow is exactly half: <b>{n}·{n + 1} / 2 = {(n * (n + 1)) / 2}</b> ✨</>
        ) : (
          <>🟨 1 + 2 + … + {n} = <b>{(n * (n + 1)) / 2}</b>. Press the twin button to see WHY it equals n(n+1)/2.</>
        )}
      </div>
    </div>
  );
}
