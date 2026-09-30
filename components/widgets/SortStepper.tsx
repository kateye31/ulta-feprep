"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Frame = { a: number[]; cmp?: number[]; swap?: boolean; sorted?: number[]; pivot?: number; range?: [number, number]; msg: string; pass?: boolean };
type Algo = "bubble" | "selection" | "insertion" | "merge" | "quick";

const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a) }, (_, i) => a + i);

function bubble(src: number[]): Frame[] {
  const a = [...src];
  const n = a.length;
  const F: Frame[] = [];
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      const sw = a[j] > a[j + 1];
      F.push({ a: [...a], cmp: [j, j + 1], sorted: range(n - i, n), msg: `Compare ${a[j]} and ${a[j + 1]}${sw ? ": out of order, SWAP 🫧" : ": fine"}` });
      if (sw) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        F.push({ a: [...a], cmp: [j, j + 1], swap: true, sorted: range(n - i, n), msg: `Swapped! The bigger one keeps bubbling right.` });
      }
    }
    F.push({ a: [...a], sorted: range(n - 1 - i, n), pass: true, msg: `✨ After pass ${i + 1}: [${a.join(", ")}]. The biggest unsorted value (${a[n - 1 - i]}) floated to the end.` });
  }
  return F;
}

function selection(src: number[]): Frame[] {
  const a = [...src];
  const n = a.length;
  const F: Frame[] = [];
  for (let i = 0; i < n - 1; i++) {
    let m = i;
    for (let j = i + 1; j < n; j++) {
      F.push({ a: [...a], cmp: [m, j], sorted: range(0, i), msg: `Smallest so far is ${a[m]}. Check ${a[j]}…${a[j] < a[m] ? " new smallest!" : ""}` });
      if (a[j] < a[m]) m = j;
    }
    [a[i], a[m]] = [a[m], a[i]];
    F.push({ a: [...a], cmp: [i, m], swap: m !== i, sorted: range(0, i + 1), pass: true, msg: `✨ After pass ${i + 1}: [${a.join(", ")}]. Swapped the min (${a[i]}) into spot ${i}.` });
  }
  return F;
}

function insertion(src: number[]): Frame[] {
  const a = [...src];
  const n = a.length;
  const F: Frame[] = [];
  for (let i = 1; i < n; i++) {
    let j = i;
    F.push({ a: [...a], cmp: [j], sorted: range(0, i), msg: `Pick up ${a[i]} (like a new card) and slide it left into the sorted hand.` });
    while (j > 0 && a[j - 1] > a[j]) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      F.push({ a: [...a], cmp: [j - 1, j], swap: true, sorted: range(0, i + 1), msg: `${a[j]} > ${a[j - 1]}, so slide left.` });
      j--;
    }
    F.push({ a: [...a], sorted: range(0, i + 1), pass: true, msg: `✨ After iteration ${i}: [${a.join(", ")}]. The first ${i + 1} are sorted (relative to each other).` });
  }
  return F;
}

function merge(src: number[]): Frame[] {
  const a = [...src];
  const F: Frame[] = [];
  const rec = (lo: number, hi: number) => {
    if (hi - lo < 1) return;
    const mid = Math.floor((lo + hi) / 2);
    rec(lo, mid);
    rec(mid + 1, hi);
    const L = a.slice(lo, mid + 1);
    const R = a.slice(mid + 1, hi + 1);
    F.push({ a: [...a], range: [lo, hi], cmp: range(lo, hi + 1), msg: `Merge [${L.join(", ")}] + [${R.join(", ")}]: both halves are already sorted, so zipper them together.` });
    let i = 0, j = 0, k = lo;
    while (i < L.length || j < R.length) {
      if (j >= R.length || (i < L.length && L[i] <= R[j])) a[k++] = L[i++];
      else a[k++] = R[j++];
    }
    F.push({ a: [...a], range: [lo, hi], sorted: range(lo, hi + 1), pass: true, msg: `✨ Merged indices ${lo}–${hi}: [${a.slice(lo, hi + 1).join(", ")}]. Whole array: [${a.join(", ")}]` });
  };
  rec(0, a.length - 1);
  return F;
}

/** Partition in the COP3502 style: pivot = first element, two indices walk inward. */
function quick(src: number[]): Frame[] {
  const a = [...src];
  const F: Frame[] = [];
  const done = new Set<number>();
  const rec = (lo: number, hi: number) => {
    if (lo > hi) return;
    if (lo === hi) { done.add(lo); return; }
    const p = lo;
    let l = lo + 1, h = hi;
    F.push({ a: [...a], pivot: p, range: [lo, hi], sorted: [...done], msg: `Partition indices ${lo}–${hi}. Pivot = ${a[p]} (first element). low starts at ${l}, high at ${h}.` });
    while (l <= h) {
      while (l <= h && a[l] <= a[p]) l++;
      while (h >= l && a[h] > a[p]) h--;
      if (l < h) {
        F.push({ a: [...a], pivot: p, cmp: [l, h], range: [lo, hi], sorted: [...done], msg: `low stopped at ${a[l]} (> pivot), high stopped at ${a[h]} (≤ pivot). Swap them!` });
        [a[l], a[h]] = [a[h], a[l]];
        F.push({ a: [...a], pivot: p, cmp: [l, h], swap: true, range: [lo, hi], sorted: [...done], msg: `Swapped.` });
      }
    }
    [a[p], a[h]] = [a[h], a[p]];
    done.add(h);
    F.push({ a: [...a], pivot: h, range: [lo, hi], sorted: [...done], pass: true, msg: `✨ Pointers crossed, so swap the pivot into index ${h}: [${a.join(", ")}]. ${a[h]} is in its FINAL spot. Everything left is ≤, everything right is >.` });
    rec(lo, h - 1);
    rec(h + 1, hi);
  };
  rec(0, a.length - 1);
  F.push({ a: [...a], sorted: range(0, a.length), msg: "🎉 Sorted!" });
  return F;
}

const ALGOS: Record<Algo, { name: string; fn: (a: number[]) => Frame[]; big: string }> = {
  bubble: { name: "🫧 Bubble", fn: bubble, big: "O(n²) always (unless you add an early-exit check)" },
  selection: { name: "🎯 Selection", fn: selection, big: "O(n²) always, even when already sorted" },
  insertion: { name: "🃏 Insertion", fn: insertion, big: "O(n²) worst, O(n) best (already sorted)" },
  merge: { name: "🍰 Merge", fn: merge, big: "O(n log n) always, but needs O(n) extra memory" },
  quick: { name: "⚡ Quick", fn: quick, big: "O(n log n) average, O(n²) worst (bad pivots)" },
};

const rand = () => Array.from({ length: 8 }, () => 1 + Math.floor(Math.random() * 30));

export default function SortStepper({ initial = "bubble" }: { initial?: Algo }) {
  const [algo, setAlgo] = useState<Algo>(initial);
  const [arr, setArr] = useState([12, 3, 27, 8, 15, 1, 20, 6]);
  const [passes, setPasses] = useState(false);
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(false);
  const [custom, setCustom] = useState("");
  const all = useMemo(() => ALGOS[algo].fn(arr), [algo, arr]);
  const frames = passes ? all.filter((f) => f.pass) : all;
  const f: Frame = i === 0 ? { a: arr, msg: "Starting array. Press Step ▶ or Play." } : frames[Math.min(i, frames.length) - 1];
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!play) return;
    timer.current = setInterval(() => setI((k) => (k >= frames.length ? (setPlay(false), k) : k + 1)), passes ? 1200 : 600);
    return () => clearInterval(timer.current!);
  }, [play, frames.length, passes]);

  const max = Math.max(...arr);

  return (
    <div className="widget">
      <div className="widget-title">🍰 Sorting Bake-Off</div>
      <div className="widget-sub">FE tip: they often ask for &ldquo;the array after each pass/iteration&rdquo;. Turn on <b>passes only</b> to see exactly that.</div>
      <div className="controls">
        {(Object.keys(ALGOS) as Algo[]).map((k) => (
          <button key={k} className={`btn small ${k === algo ? "" : "secondary"}`} onClick={() => { setAlgo(k); setI(0); setPlay(false); }}>{ALGOS[k].name}</button>
        ))}
      </div>
      <div className="controls">
        <button className="btn small secondary" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>◀</button>
        <button className="btn small" onClick={() => setI(Math.min(frames.length, i + 1))} disabled={i >= frames.length}>Step ▶</button>
        <button className="btn small secondary" onClick={() => { if (i >= frames.length) setI(0); setPlay(!play); }}>{play ? "⏸ Pause" : "▶ Play"}</button>
        <button className="btn small secondary" onClick={() => { setArr(rand()); setI(0); setPlay(false); }}>🎲 New array</button>
        <label style={{ display: "flex", gap: 6, alignItems: "center", fontWeight: 700, fontSize: "0.9rem" }}>
          <input type="checkbox" checked={passes} onChange={(e) => { setPasses(e.target.checked); setI(0); }} /> passes only
        </label>
        <input className="input mono" style={{ width: 170 }} placeholder="your own: 5 2 9 1" value={custom} onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          const v = custom.split(/[\s,]+/).map(Number).filter((x) => !Number.isNaN(x)).slice(0, 12);
          if (v.length > 1) { setArr(v); setI(0); setPlay(false); }
        }} aria-label="Custom array (press Enter)" />
      </div>
      <div className="stage" style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 230, justifyContent: "center" }}>
        {f.a.map((v, k) => {
          const inRange = !f.range || (k >= f.range[0] && k <= f.range[1]);
          let bg = "var(--card)";
          if (f.sorted?.includes(k)) bg = "var(--matcha)";
          if (f.cmp?.includes(k)) bg = f.swap ? "var(--blush)" : "var(--butter)";
          if (f.pivot === k) bg = "var(--lavender)";
          return (
            <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: inRange ? 1 : 0.3, transition: "opacity .3s", flex: "0 1 48px" }}>
              <div style={{ width: "100%", maxWidth: 48, height: 20 + (v / max) * 150, background: bg, border: "2.5px solid var(--ink)", borderRadius: "12px 12px 6px 6px", transition: "height .35s cubic-bezier(.3,1.3,.5,1), background .25s", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 4, fontWeight: 900, fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: bg === "var(--card)" ? "var(--ink)" : "#2c1d42" }}>{v}</div>
              <span style={{ fontSize: "0.7rem", color: "var(--ink-faint)", fontWeight: 700 }}>{k}</span>
            </div>
          );
        })}
      </div>
      <div className="controls" style={{ fontSize: "0.8rem", gap: 12 }}>
        <span><span className="chip" style={{ background: "var(--butter)", color: "#2c1d42" }}>comparing</span></span>
        <span><span className="chip" style={{ background: "var(--blush)", color: "#2c1d42" }}>swapped</span></span>
        <span><span className="chip" style={{ background: "var(--matcha)", color: "#2c1d42" }}>in final spot</span></span>
        {algo === "quick" && <span><span className="chip" style={{ background: "var(--lavender)", color: "#2c1d42" }}>pivot</span></span>}
        <span className="muted">step {Math.min(i, frames.length)} / {frames.length}</span>
      </div>
      <div className="log" aria-live="polite">
        {f.msg}
        <div className="muted" style={{ fontSize: "0.85rem", marginTop: 4 }}>⏱ {ALGOS[algo].big}</div>
      </div>
    </div>
  );
}
