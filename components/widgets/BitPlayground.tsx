"use client";

import { useState } from "react";

const OPS = ["&", "|", "^", "~a", "a << k", "a >> k"] as const;
type Op = (typeof OPS)[number];

function Bits({ v, label, onFlip, tone }: { v: number; label: string; onFlip?: (i: number) => void; tone?: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "70px auto 1fr", gap: 10, alignItems: "center", marginBottom: 8 }}>
      <span className="mono" style={{ fontWeight: 800 }}>{label}</span>
      <div className="row" style={{ gap: 4 }}>
        {Array.from({ length: 8 }, (_, k) => {
          const bit = 7 - k;
          const on = (v >> bit) & 1;
          return (
            <button key={k} disabled={!onFlip} onClick={() => onFlip?.(bit)} title={`bit ${bit} (worth ${1 << bit})`} className="mono" style={{ width: 34, height: 38, borderRadius: 10, border: "2px solid var(--ink)", background: on ? tone ?? "var(--butter)" : "var(--card)", color: on ? "#2c1d42" : "var(--ink-faint)", fontWeight: 900, cursor: onFlip ? "pointer" : "default", fontSize: "1rem" }}>
              {on}
            </button>
          );
        })}
      </div>
      <span className="mono" style={{ fontWeight: 800 }}>= {v}</span>
    </div>
  );
}

export default function BitPlayground() {
  const [a, setA] = useState(0b01101100);
  const [b, setB] = useState(0b00111010);
  const [op, setOp] = useState<Op>("&");
  const [k, setK] = useState(2);

  const res = (() => {
    switch (op) {
      case "&": return a & b;
      case "|": return a | b;
      case "^": return a ^ b;
      case "~a": return ~a & 0xff;
      case "a << k": return (a << k) & 0xff;
      case "a >> k": return a >> k;
    }
  })();

  const EXPLAIN: Record<Op, string> = {
    "&": "AND: 1 only if BOTH are 1. Like a door with two locks 🔐🔐. Used to CHECK or CLEAR bits (masking).",
    "|": "OR: 1 if EITHER is 1. Like two light switches for one lamp 💡. Used to SET bits.",
    "^": "XOR: 1 if they're DIFFERENT. Used to TOGGLE bits. Also, x ^ x = 0 and x ^ 0 = x.",
    "~a": "NOT: flips every bit. (Shown as 8 bits here. A real int is 32 bits, so ~ also flips all the leading zeros!)",
    "a << k": `Left shift: slide bits left, zeros fill in. Each shift doubles the number, so a << ${k} = a × 2^${k} (until bits fall off).`,
    "a >> k": `Right shift: slide bits right, low bits fall off. For non-negative numbers a >> ${k} = a / 2^${k} (integer division).`,
  };

  const binary = op === "&" || op === "|" || op === "^";

  return (
    <div className="widget">
      <div className="widget-title">💡 Bit Light-Switch Board</div>
      <div className="widget-sub">Click any bit to flip it. Each position is a power of 2: 128 64 32 16 8 4 2 1.</div>
      <div className="controls">
        {OPS.map((o) => (
          <button key={o} className={`btn small mono ${o === op ? "" : "secondary"}`} onClick={() => setOp(o)}>{o}</button>
        ))}
        {!binary && op !== "~a" && (
          <label style={{ fontWeight: 800 }}>
            k = <select className="input" value={k} onChange={(e) => setK(+e.target.value)} aria-label="Shift amount">{[1, 2, 3, 4].map((x) => <option key={x}>{x}</option>)}</select>
          </label>
        )}
      </div>
      <div className="stage" style={{ overflowX: "auto" }}>
        <div className="mono muted" style={{ display: "grid", gridTemplateColumns: "70px auto", gap: 10, fontSize: "0.7rem" }}>
          <span />
          <div className="row" style={{ gap: 4 }}>{[128, 64, 32, 16, 8, 4, 2, 1].map((p) => <span key={p} style={{ width: 34, textAlign: "center" }}>{p}</span>)}</div>
        </div>
        <Bits v={a} label="a" onFlip={(i) => setA(a ^ (1 << i))} />
        {binary && <Bits v={b} label="b" onFlip={(i) => setB(b ^ (1 << i))} tone="var(--sky)" />}
        <div style={{ borderTop: "2.5px dashed var(--ink-soft)", margin: "6px 0 10px", width: 380, maxWidth: "100%" }} />
        <Bits v={res} label={op.includes("k") ? op.replace("k", String(k)) : op === "~a" ? "~a" : `a ${op} b`} tone="var(--matcha)" />
      </div>
      <div className="log">{EXPLAIN[op]}</div>
      <details style={{ marginTop: 12 }}>
        <summary style={{ cursor: "pointer", fontWeight: 800 }}>🍬 The 4 bit recipes you&apos;ll use forever (with a and bit i = {k})</summary>
        <table className="cozy mono" style={{ marginTop: 8 }}>
          <tbody>
            <tr><td>Is bit i on?</td><td>(a &gt;&gt; i) &amp; 1</td><td>{(a >> k) & 1}</td></tr>
            <tr><td>Turn bit i on</td><td>a | (1 &lt;&lt; i)</td><td>{a | (1 << k)}</td></tr>
            <tr><td>Turn bit i off</td><td>a &amp; ~(1 &lt;&lt; i)</td><td>{a & ~(1 << k)}</td></tr>
            <tr><td>Flip bit i</td><td>a ^ (1 &lt;&lt; i)</td><td>{a ^ (1 << k)}</td></tr>
          </tbody>
        </table>
      </details>
    </div>
  );
}
