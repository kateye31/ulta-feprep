"use client";

import { useState } from "react";

const CAP = 6;
const TOPPINGS = ["🍓", "🫐", "🍌", "🧈", "🍯", "🍫"];

export default function PancakeStack() {
  const [items, setItems] = useState<number[]>([4, 9]);
  const [val, setVal] = useState("");
  const [msg, setMsg] = useState("🥞 A stack is a plate of pancakes. You can only add to the top or take from the top. LIFO: Last In, First Out.");
  const [peek, setPeek] = useState(false);

  const push = () => {
    const v = val === "" ? Math.floor(Math.random() * 50) : parseInt(val, 10);
    if (Number.isNaN(v)) return setMsg("🙈 Numbers only!");
    setVal("");
    setPeek(false);
    if (items.length >= CAP) return setMsg(`💥 STACK OVERFLOW! The array only holds ${CAP}. In code: if (s->top == SIZE - 1) return 0;`);
    setItems([...items, v]);
    setMsg(`⬆️ push(${v}): top goes from ${items.length - 1} to ${items.length}, then items[top] = ${v}. O(1).`);
  };
  const pop = () => {
    setPeek(false);
    if (!items.length) return setMsg("🫙 STACK UNDERFLOW! You can't pop an empty stack. Always check isEmpty() first.");
    const v = items[items.length - 1];
    setItems(items.slice(0, -1));
    setMsg(`⬇️ pop() returned ${v}. top is now ${items.length - 2}. (The old value is still in the array; we just stop caring about it.)`);
  };

  return (
    <div className="widget">
      <div className="widget-title">🥞 Pancake Stack</div>
      <div className="widget-sub">Array version: items[] plus an int top. top = -1 means empty.</div>
      <div className="controls">
        <input className="input" inputMode="numeric" placeholder="value" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && push()} aria-label="Value" />
        <button className="btn small" onClick={push}>⬆️ push</button>
        <button className="btn small secondary" onClick={pop}>⬇️ pop</button>
        <button className="btn small secondary" onClick={() => { setPeek(true); setMsg(items.length ? `👀 peek() = ${items[items.length - 1]}. We look without removing.` : "👀 peek on an empty stack: nothing there!"); }}>👀 peek</button>
        <button className="btn small secondary" onClick={() => setMsg(`🤔 isEmpty() = ${items.length === 0 ? "true (top == -1)" : `false (top == ${items.length - 1})`}`)}>🤔 isEmpty</button>
      </div>
      <div className="stage" style={{ display: "flex", gap: 30, alignItems: "flex-end", justifyContent: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center", minHeight: 220, justifyContent: "flex-start" }}>
          <div style={{ width: 190, height: 14, borderRadius: "0 0 60px 60px", background: "var(--sky)", border: "2.5px solid var(--ink)" }} aria-hidden />
          {items.map((v, i) => (
            <div key={`${i}-${v}`} className="pop-in" style={{ width: 150 - i * 6, height: 30, marginBottom: -2, borderRadius: 16, background: i === items.length - 1 && peek ? "var(--butter)" : "#e9b872", border: "2.5px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 900, color: "#2c1d42", fontFamily: "var(--font-mono)", position: "relative" }}>
              {v} <span style={{ fontSize: "0.9rem" }}>{TOPPINGS[i % TOPPINGS.length]}</span>
              {i === items.length - 1 && <span style={{ position: "absolute", right: -64, fontFamily: "var(--font-hand)", fontSize: "1.2rem", color: "var(--accent)", fontWeight: 700 }}>← top</span>}
            </div>
          ))}
        </div>
        <div>
          <div className="muted" style={{ fontSize: "0.8rem", fontWeight: 800, marginBottom: 6 }}>the actual array (top = {items.length - 1})</div>
          <div className="row" style={{ paddingBottom: 26 }}>
            {Array.from({ length: CAP }, (_, i) => (
              <div key={i} className={`cell ${i < items.length ? (i === items.length - 1 ? "hl" : "") : "empty"}`} style={{ width: 42, height: 42 }}>
                {i < items.length ? items[i] : "·"}
                <span className="cell-idx">{i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="log" aria-live="polite">{msg}</div>
    </div>
  );
}
