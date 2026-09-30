"use client";

import { useState } from "react";

type Preset = {
  rec: string;
  who: string;
  levels: { nodes: number; each: string; total: string }[];
  sum: string;
  answer: string;
};

const PRESETS: Preset[] = [
  {
    rec: "T(n) = T(n/2) + 1",
    who: "binary search 🔍",
    levels: [
      { nodes: 1, each: "1", total: "1" },
      { nodes: 1, each: "1", total: "1" },
      { nodes: 1, each: "1", total: "1" },
      { nodes: 1, each: "1", total: "1" },
    ],
    sum: "1 + 1 + … + 1, with one level per halving = log₂n levels",
    answer: "O(log n)",
  },
  {
    rec: "T(n) = 2T(n/2) + n",
    who: "merge sort 🍰",
    levels: [
      { nodes: 1, each: "n", total: "n" },
      { nodes: 2, each: "n/2", total: "n" },
      { nodes: 4, each: "n/4", total: "n" },
      { nodes: 8, each: "n/8", total: "n" },
    ],
    sum: "Every level adds up to n, and there are log₂n levels",
    answer: "O(n log n)",
  },
  {
    rec: "T(n) = T(n−1) + n",
    who: "selection / insertion sort (worst) 🐢",
    levels: [
      { nodes: 1, each: "n", total: "n" },
      { nodes: 1, each: "n−1", total: "n−1" },
      { nodes: 1, each: "n−2", total: "n−2" },
      { nodes: 1, each: "…", total: "…" },
    ],
    sum: "n + (n−1) + … + 1 = n(n+1)/2",
    answer: "O(n²)",
  },
  {
    rec: "T(n) = 2T(n−1) + 1",
    who: "Towers of Hanoi 🗼",
    levels: [
      { nodes: 1, each: "1", total: "1" },
      { nodes: 2, each: "1", total: "2" },
      { nodes: 4, each: "1", total: "4" },
      { nodes: 8, each: "1", total: "8" },
    ],
    sum: "1 + 2 + 4 + … + 2ⁿ⁻¹ = 2ⁿ − 1",
    answer: "O(2ⁿ)",
  },
  {
    rec: "T(n) = T(n−1) + 1",
    who: "walking a linked list recursively 🚂",
    levels: [
      { nodes: 1, each: "1", total: "1" },
      { nodes: 1, each: "1", total: "1" },
      { nodes: 1, each: "1", total: "1" },
      { nodes: 1, each: "…", total: "…" },
    ],
    sum: "1 + 1 + … (n times) = n",
    answer: "O(n)",
  },
];

export default function RecurrenceTree() {
  const [k, setK] = useState(1);
  const [shown, setShown] = useState(1);
  const p = PRESETS[k];
  return (
    <div className="widget">
      <div className="widget-title">🌲 Recurrence Tree Unroller</div>
      <div className="widget-sub">Each box is one function call, and the number inside is the work it does besides recursing. Add up each row, then add up the rows.</div>
      <div className="controls">
        {PRESETS.map((q, i) => (
          <button key={i} className={`btn small ${i === k ? "" : "secondary"} mono`} onClick={() => { setK(i); setShown(1); }}>{q.rec}</button>
        ))}
      </div>
      <p className="muted" style={{ margin: "4px 0" }}>This is the recurrence for <b>{p.who}</b></p>
      <div className="stage">
        {p.levels.slice(0, shown).map((L, i) => (
          <div key={i} className="pop-in" style={{ display: "grid", gridTemplateColumns: "1fr 110px", gap: 12, alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
              {Array.from({ length: L.nodes }, (_, j) => (
                <div key={j} className="cell mono" style={{ width: "auto", minWidth: 44, height: 38, padding: "0 8px", fontSize: "0.85rem" }}>{L.each}</div>
              ))}
            </div>
            <div className="chip" style={{ justifyContent: "center" }}>row: {L.total}</div>
          </div>
        ))}
        {shown >= p.levels.length && (
          <div className="pop-in callout tip" style={{ marginBottom: 0 }}>
            <span className="callout-icon">🧮</span>
            <span className="callout-title">{p.sum}</span>
            So <b className="mono">{p.rec}</b> is <b>{p.answer}</b>
          </div>
        )}
      </div>
      <div className="controls">
        {shown < p.levels.length ? (
          <button className="btn small" onClick={() => setShown(shown + 1)}>🌿 Grow next level</button>
        ) : (
          <button className="btn small secondary" onClick={() => setShown(1)}>↺ Start over</button>
        )}
      </div>
    </div>
  );
}
