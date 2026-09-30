"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

const COLORS = ["#ec9f9f", "#f2c95f", "#9cc58e", "#86c3d7", "#b39ddb", "#d98c6a", "#f4b6b6"];
const NAMES = ["A", "B", "C"];

function solve(n: number, from: number, to: number, via: number, out: [number, number, number][]) {
  if (n === 0) return;
  solve(n - 1, from, via, to, out);
  out.push([n, from, to]);
  solve(n - 1, via, to, from, out);
}

export default function Hanoi() {
  const [n, setN] = useState(3);
  const [pegs, setPegs] = useState<number[][]>([[3, 2, 1], [], []]);
  const [held, setHeld] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [msg, setMsg] = useState("🗼 Move the whole tower from A to C. Rules: one disk at a time, and never put a big disk on a smaller one. Click a peg to pick up, then click another to drop.");
  const [auto, setAuto] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = (k = n) => {
    if (timer.current) clearInterval(timer.current);
    setAuto(false);
    setN(k);
    setPegs([Array.from({ length: k }, (_, i) => k - i), [], []]);
    setHeld(null);
    setMoves(0);
    setMsg(`🗼 ${k} disk${k > 1 ? "s" : ""}. Minimum moves = 2^${k} − 1 = ${2 ** k - 1}.`);
  };
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const win = (p: number[][]) => {
    if (p[2].length === n) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      return true;
    }
    return false;
  };

  const click = (i: number) => {
    if (auto) return;
    if (held === null) {
      if (!pegs[i].length) return setMsg(`Peg ${NAMES[i]} is empty!`);
      setHeld(i);
      setMsg(`✋ Holding disk ${pegs[i][pegs[i].length - 1]} from ${NAMES[i]}. Where to?`);
      return;
    }
    if (held === i) {
      setHeld(null);
      setMsg("Put it back down.");
      return;
    }
    const d = pegs[held][pegs[held].length - 1];
    const top = pegs[i][pegs[i].length - 1];
    if (top !== undefined && top < d) {
      setHeld(null);
      return setMsg(`🙅 Can't put disk ${d} on smaller disk ${top}!`);
    }
    const p = pegs.map((x) => [...x]);
    p[held].pop();
    p[i].push(d);
    setPegs(p);
    setHeld(null);
    setMoves(moves + 1);
    setMsg(win(p) ? `🎉 Solved in ${moves + 1} moves! (minimum is ${2 ** n - 1})` : `Moved disk ${d}: ${NAMES[held]} → ${NAMES[i]}`);
  };

  const autoSolve = () => {
    const start: number[][] = [Array.from({ length: n }, (_, i) => n - i), [], []];
    setPegs(start);
    setMoves(0);
    setHeld(null);
    const list: [number, number, number][] = [];
    solve(n, 0, 2, 1, list);
    let k = 0;
    let cur = start.map((x) => [...x]);
    setAuto(true);
    timer.current = setInterval(() => {
      if (k >= list.length) {
        clearInterval(timer.current!);
        setAuto(false);
        win(cur);
        return;
      }
      const [d, f, t] = list[k];
      cur = cur.map((x) => [...x]);
      cur[f].pop();
      cur[t].push(d);
      setPegs(cur);
      k++;
      setMoves(k);
      setMsg(
        d === n
          ? `🌟 The BIG move: disk ${d} goes ${NAMES[f]} → ${NAMES[t]}. Everything smaller was parked on ${NAMES[3 - f - t]} first (that was one recursive call!). Now another recursive call moves them on top.`
          : `Move disk ${d}: ${NAMES[f]} → ${NAMES[t]}`,
      );
    }, n > 5 ? 250 : 650);
  };

  return (
    <div className="widget">
      <div className="widget-title">🗼 Towers of Hanoi (Macaron Edition)</div>
      <div className="widget-sub">The recursion in one sentence: move n−1 out of the way, move the big one, move n−1 back on top.</div>
      <div className="controls">
        <label style={{ fontWeight: 800 }}>
          disks{" "}
          <select className="input" value={n} disabled={auto} onChange={(e) => reset(+e.target.value)} aria-label="Number of disks">
            {[1, 2, 3, 4, 5, 6, 7].map((k) => <option key={k}>{k}</option>)}
          </select>
        </label>
        <button className="btn small" disabled={auto} onClick={autoSolve}>🪄 Watch recursion solve it</button>
        <button className="btn small secondary" onClick={() => reset()}>↺ Reset</button>
        <span className="chip">moves: {moves} / min {2 ** n - 1}</span>
      </div>
      <div className="stage" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, minHeight: 60 + n * 24 }}>
        {pegs.map((p, i) => (
          <button key={i} onClick={() => click(i)} aria-label={`Peg ${NAMES[i]}`} style={{ background: held === i ? "var(--butter-soft)" : "transparent", border: "none", borderRadius: 14, cursor: auto ? "default" : "pointer", display: "flex", flexDirection: "column-reverse", alignItems: "center", position: "relative", padding: "6px 0 26px", minHeight: 50 + (n + 1) * 24 }}>
            <div style={{ position: "absolute", bottom: 32, width: 8, top: 10, background: "var(--wood)", borderRadius: 4 }} aria-hidden />
            <div style={{ width: "95%", height: 10, background: "var(--wood-dark)", borderRadius: 6, zIndex: 1 }} />
            <div style={{ position: "absolute", bottom: -2, fontWeight: 900 }}>{NAMES[i]}</div>
            {p.map((d, j) => (
              <div key={d} style={{ width: `${20 + (d / n) * 75}%`, height: 22, marginBottom: 2, borderRadius: 12, background: COLORS[(d - 1) % COLORS.length], border: "2.5px solid #3d2b52", zIndex: 1, transform: held === i && j === p.length - 1 ? "translateY(-14px)" : undefined, transition: "transform .2s", fontSize: "0.75rem", fontWeight: 900, color: "#2c1d42" }}>{d}</div>
            ))}
            <div style={{ height: 18 }} />
          </button>
        ))}
      </div>
      <div className="log" aria-live="polite">{msg}</div>
    </div>
  );
}
