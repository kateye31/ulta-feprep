"use client";

import { useState } from "react";

const DIG = "0123456789ABCDEF";

export default function BaseConverter() {
  const [n, setN] = useState(156);
  const [base, setBase] = useState(2);

  const rows: { q: number; r: number; n: number }[] = [];
  let x = Math.max(0, Math.floor(n));
  if (x === 0) rows.push({ n: 0, q: 0, r: 0 });
  while (x > 0) {
    rows.push({ n: x, q: Math.floor(x / base), r: x % base });
    x = Math.floor(x / base);
  }
  const answer = rows.map((r) => DIG[r.r]).reverse().join("");

  return (
    <div className="widget">
      <div className="widget-title">🔢 Base Converter</div>
      <div className="widget-sub">Decimal → base b: keep dividing by b and collect the remainders. Then read them BOTTOM-UP.</div>
      <div className="controls">
        <input className="input" type="number" min={0} value={n} onChange={(e) => setN(Math.min(1e9, Math.max(0, +e.target.value)))} aria-label="Decimal number" />
        <span>in base</span>
        <select className="input" value={base} onChange={(e) => setBase(+e.target.value)} aria-label="Base">
          {[2, 3, 4, 5, 6, 7, 8, 9, 16].map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>
      <div className="stage">
        <table className="cozy mono" style={{ maxWidth: 440 }}>
          <thead><tr><th>n</th><th>n / {base}</th><th>n % {base}</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}><td>{r.n}</td><td>{r.q}</td><td style={{ fontWeight: 900, color: "var(--accent)" }}>{DIG[r.r]} {i === rows.length - 1 ? "⬆ read up!" : ""}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="log">
        <b className="mono">{n}₁₀ = {answer}₍{base}₎</b>
        <div className="muted" style={{ fontSize: "0.9rem", marginTop: 4 }}>
          Check it going back: {answer.split("").map((d, i, arr) => `${d}·${base}^${arr.length - 1 - i}`).join(" + ")} = {n} ✓
        </div>
      </div>
    </div>
  );
}
