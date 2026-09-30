"use client";

import { useEffect, useRef, useState } from "react";

type Ev = { cols: number[]; row: number; col: number; kind: "try" | "bad" | "place" | "back" | "solved" };

function* search(n: number): Generator<Ev> {
  const cols: number[] = [];
  function* rec(r: number): Generator<Ev> {
    if (r === n) {
      yield { cols: [...cols], row: r, col: -1, kind: "solved" };
      return;
    }
    for (let c = 0; c < n; c++) {
      const bad = cols.some((cc, rr) => cc === c || Math.abs(cc - c) === r - rr);
      if (bad) {
        yield { cols: [...cols], row: r, col: c, kind: "bad" };
        continue;
      }
      cols.push(c);
      yield { cols: [...cols], row: r, col: c, kind: "place" };
      yield* rec(r + 1);
      cols.pop();
      yield { cols: [...cols], row: r, col: c, kind: "back" };
    }
  }
  yield* rec(0);
}

export default function NQueens() {
  const [n, setN] = useState(5);
  const gen = useRef<Generator<Ev>>(search(5));
  const [ev, setEv] = useState<Ev | null>(null);
  const [steps, setSteps] = useState(0);
  const [sols, setSols] = useState(0);
  const [play, setPlay] = useState(false);
  const [finished, setFinished] = useState(false);

  const reset = (k = n) => {
    setN(k);
    gen.current = search(k);
    setEv(null);
    setSteps(0);
    setSols(0);
    setPlay(false);
    setFinished(false);
  };

  const step = () => {
    const r = gen.current.next();
    if (r.done) {
      setFinished(true);
      setPlay(false);
      return null;
    }
    setEv(r.value);
    setSteps((s) => s + 1);
    if (r.value.kind === "solved") setSols((s) => s + 1);
    return r.value;
  };

  const toSolution = () => {
    for (let i = 0; i < 200000; i++) {
      const e = step();
      if (!e || e.kind === "solved") return;
    }
  };

  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => {
      const e = step();
      if (!e || e.kind === "solved") setPlay(false);
    }, 260);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  const cols = ev?.cols ?? [];
  const MSG: Record<Ev["kind"], string> = {
    try: "",
    bad: `❌ Row ${ev?.row}, col ${ev?.col}: attacked (same column or diagonal). Skip it. This is PRUNING!`,
    place: `👑 Row ${ev?.row}, col ${ev?.col} is safe. Place a queen and RECURSE into the next row.`,
    back: `↩️ Everything below row ${ev?.row} failed (or we've recorded the solution). Pick UP the queen at col ${ev?.col} (undo!) and try the next column. This is BACKTRACKING.`,
    solved: `🎉 All ${n} rows filled: that's a solution! (#${sols}) Keep going to find more.`,
  };

  return (
    <div className="widget">
      <div className="widget-title">👑 N-Queens Backtracking</div>
      <div className="widget-sub">Place n queens so none attack each other. One queen per row, so recursion goes row by row.</div>
      <div className="controls">
        <select className="input" value={n} onChange={(e) => reset(+e.target.value)} aria-label="Board size">
          {[4, 5, 6, 7, 8].map((k) => <option key={k} value={k}>{k}×{k}</option>)}
        </select>
        <button className="btn small" disabled={finished} onClick={step}>Step ▶</button>
        <button className="btn small secondary" disabled={finished} onClick={() => setPlay(!play)}>{play ? "⏸ Pause" : "▶ Play"}</button>
        <button className="btn small secondary" disabled={finished} onClick={toSolution}>⏭ Next solution</button>
        <button className="btn small secondary" onClick={() => reset()}>↺</button>
        <span className="chip">steps {steps} · solutions {sols}</span>
      </div>
      <div className="stage" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, width: "min(100%, 360px)", aspectRatio: "1", border: "3px solid var(--ink)", borderRadius: 12, overflow: "hidden" }}>
          {Array.from({ length: n * n }, (_, i) => {
            const r = Math.floor(i / n), c = i % n;
            const queen = cols[r] === c;
            const isEv = ev && ev.row === r && ev.col === c;
            let bg = (r + c) % 2 ? "var(--paper-2)" : "var(--card)";
            if (isEv && ev.kind === "bad") bg = "var(--blush)";
            if (isEv && ev.kind === "back") bg = "var(--sky-soft)";
            if (queen && ev?.kind === "solved") bg = "var(--matcha)";
            else if (queen) bg = "var(--butter)";
            return (
              <div key={i} style={{ background: bg, display: "grid", placeItems: "center", fontSize: `min(${24 / n}vw, ${150 / n}px)`, transition: "background .2s" }}>
                {queen ? "👑" : isEv && ev.kind === "bad" ? "✗" : ""}
              </div>
            );
          })}
        </div>
      </div>
      <div className="log" aria-live="polite">
        {finished ? `🏁 Search finished! Found all ${sols} solutions for ${n}×${n} in ${steps} steps.` : ev ? MSG[ev.kind] : "Press Step to start at row 0."}
      </div>
    </div>
  );
}
