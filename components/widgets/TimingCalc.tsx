"use client";

import { useState } from "react";

const F: Record<string, { f: (n: number) => number; show: (n: string) => string }> = {
  "O(n)": { f: (n) => n, show: (n) => n },
  "O(n²)": { f: (n) => n * n, show: (n) => `${n}²` },
  "O(n³)": { f: (n) => n ** 3, show: (n) => `${n}³` },
  "O(log n)": { f: (n) => Math.log2(n), show: (n) => `lg ${n}` },
  "O(n log n)": { f: (n) => n * Math.log2(n), show: (n) => `${n}·lg ${n}` },
  "O(2ⁿ)": { f: (n) => 2 ** n, show: (n) => `2^${n}` },
};

const fmt = (x: number) => (Number.isInteger(x) ? x.toLocaleString() : Number(x.toPrecision(6)).toLocaleString());

export default function TimingCalc() {
  const [fn, setFn] = useState("O(n²)");
  const [n1, setN1] = useState(1000);
  const [t1, setT1] = useState(4);
  const [n2, setN2] = useState(3000);
  const [unit, setUnit] = useState("sec");

  const { f, show } = F[fn];
  const c = t1 / f(n1);
  const t2 = c * f(n2);
  const ok = n1 > 0 && n2 > 0 && Number.isFinite(t2);

  return (
    <div className="widget">
      <div className="widget-title">⏱ Timing Problem Solver</div>
      <div className="widget-sub">&ldquo;An O(f(n)) algorithm takes T₁ for n₁. How long for n₂?&rdquo; This shows up on nearly every FE.</div>
      <div className="controls">
        <select className="input" value={fn} onChange={(e) => setFn(e.target.value)} aria-label="Complexity">
          {Object.keys(F).map((k) => <option key={k}>{k}</option>)}
        </select>
        <span>takes</span>
        <input className="input" type="number" value={t1} onChange={(e) => setT1(+e.target.value)} aria-label="Time 1" style={{ width: 90 }} />
        <select className="input" value={unit} onChange={(e) => setUnit(e.target.value)} aria-label="Unit">
          {["ms", "sec", "min", "hours"].map((u) => <option key={u}>{u}</option>)}
        </select>
        <span>for n =</span>
        <input className="input" type="number" value={n1} onChange={(e) => setN1(+e.target.value)} aria-label="n1" />
        <span>→ n =</span>
        <input className="input" type="number" value={n2} onChange={(e) => setN2(+e.target.value)} aria-label="n2" />
      </div>
      <div className="stage">
        {ok ? (
          <div className="steps">
            <div className="step"><span className="step-n">1</span>Write the model: <b>T(n) = c · f(n)</b>, where c is a secret constant (how fast this computer is).</div>
            <div className="step"><span className="step-n">2</span>Solve for c using what you know: <span className="mono">{t1} = c · {show(String(n1))}</span> → <span className="mono">c = {t1} / {fmt(f(n1))} = {c.toExponential(3)}</span></div>
            <div className="step"><span className="step-n">3</span>Plug in the new n: <span className="mono">T({n2}) = c · {show(String(n2))} = {c.toExponential(3)} × {fmt(f(n2))}</span></div>
            <div className="step" style={{ background: "var(--matcha-soft)", borderColor: "var(--matcha)" }}><span className="step-n">✓</span><b>T = {fmt(t2)} {unit}</b>{fn !== "O(log n)" && fn !== "O(n log n)" && fn !== "O(2ⁿ)" && n2 % n1 === 0 && <> · shortcut: n grew ×{n2 / n1}, so time grows ×{fmt(f(n2 / n1))}</>}</div>
          </div>
        ) : (
          <span className="muted">Enter positive numbers 🙂</span>
        )}
      </div>
      <div className="log">💡 <b>Ratio trick:</b> T₂ / T₁ = f(n₂) / f(n₁). For O(n²), tripling n multiplies time by 3² = 9. Pick n&apos;s that are powers of 2 for log problems. The FE usually does!</div>
    </div>
  );
}
