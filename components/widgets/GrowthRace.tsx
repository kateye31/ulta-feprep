"use client";

import { useState } from "react";

const FNS: { name: string; f: (n: number) => number; emoji: string; color: string; nick: string }[] = [
  { name: "O(1)", f: () => 1, emoji: "🚀", color: "var(--matcha)", nick: "teleport" },
  { name: "O(log n)", f: (n) => Math.log2(Math.max(n, 1)), emoji: "🐇", color: "var(--matcha)", nick: "bunny hop" },
  { name: "O(n)", f: (n) => n, emoji: "🚲", color: "var(--sky)", nick: "bike ride" },
  { name: "O(n log n)", f: (n) => n * Math.log2(Math.max(n, 1)), emoji: "🚗", color: "var(--sky)", nick: "good sorting" },
  { name: "O(n²)", f: (n) => n * n, emoji: "🐢", color: "var(--butter)", nick: "nested loops" },
  { name: "O(n³)", f: (n) => n ** 3, emoji: "🐌", color: "var(--accent)", nick: "triple loops" },
  { name: "O(2ⁿ)", f: (n) => 2 ** n, emoji: "🦥", color: "var(--blush)", nick: "all subsets" },
  { name: "O(n!)", f: (n) => { let r = 1; for (let i = 2; i <= n && Number.isFinite(r); i++) r *= i; return r; }, emoji: "🪨", color: "var(--blush)", nick: "all orderings" },
];

function human(steps: number) {
  const s = steps / 1e9; // 1 billion simple steps per second
  if (!Number.isFinite(s) || s > 3.15e17) return "longer than the universe has existed 🌌";
  if (s < 1e-6) return "instant ⚡";
  if (s < 1e-3) return `${(s * 1e6).toFixed(1)} µs`;
  if (s < 1) return `${(s * 1e3).toFixed(1)} ms`;
  if (s < 60) return `${s.toFixed(1)} sec`;
  if (s < 3600) return `${(s / 60).toFixed(1)} min`;
  if (s < 86400) return `${(s / 3600).toFixed(1)} hours`;
  if (s < 3.15e7) return `${(s / 86400).toFixed(1)} days`;
  return `${(s / 3.15e7).toExponential(1)} years 😱`;
}

const NS = [1, 2, 5, 10, 20, 30, 50, 100, 1000, 10_000, 100_000, 1_000_000, 1_000_000_000];

export default function GrowthRace() {
  const [k, setK] = useState(4);
  const n = NS[k];
  const vals = FNS.map((F) => F.f(n));
  const maxLog = Math.log10(Math.max(...vals.filter(Number.isFinite), 10)) || 1;

  return (
    <div className="widget">
      <div className="widget-title">🏁 The Big-O Race</div>
      <div className="widget-sub">Slide n up and watch who falls behind. Times assume a computer doing 1 billion steps per second.</div>
      <label style={{ fontWeight: 800 }}>
        n = <span className="mono" style={{ color: "var(--accent)" }}>{n.toLocaleString()}</span>
        <input className="range" type="range" min={0} max={NS.length - 1} value={k} onChange={(e) => setK(+e.target.value)} />
      </label>
      <div className="stage" style={{ display: "grid", gap: 8 }}>
        {FNS.map((F, i) => {
          const v = vals[i];
          const w = Number.isFinite(v) ? Math.max(2, (Math.log10(Math.max(v, 1)) / maxLog) * 100) : 100;
          return (
            <div key={F.name} style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 10, alignItems: "center" }}>
              <div className="mono" style={{ fontWeight: 800, fontSize: "0.9rem" }}>{F.name}</div>
              <div>
                <div style={{ height: 22, width: `${Math.min(w, 100)}%`, background: F.color, borderRadius: 999, border: "2px solid var(--ink)", transition: "width .5s cubic-bezier(.3,1.3,.5,1)", position: "relative", minWidth: 30 }}>
                  <span style={{ position: "absolute", right: -4, top: -8, fontSize: "1.3rem", transform: "scaleX(-1)" }}>{F.emoji}</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--ink-soft)" }}>
                  {F.nick} · {!Number.isFinite(v) ? "∞" : v < 1e15 ? Math.round(v).toLocaleString() : v.toExponential(1)} steps · <b>{human(v)}</b>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="log">📏 Bars are on a <b>log scale</b> (each step right is ×10), otherwise the slow ones would be miles off-screen. See how n = 1,000,000 makes O(n²) take ~17 minutes while O(n log n) takes 0.02 seconds? That&apos;s why sorting algorithms matter.</div>
    </div>
  );
}
