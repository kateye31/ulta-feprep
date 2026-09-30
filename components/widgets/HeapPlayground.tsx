"use client";

import { useEffect, useRef, useState } from "react";
import TreeSvg, { type TEdge, type TNode } from "./TreeSvg";

type Frame = { arr: number[]; hl: number[]; msg: string };

/** 1-indexed heap (index 0 unused), the way COP3502 draws it. */
function insertFrames(heap: number[], v: number, isMin: boolean): Frame[] {
  const a = [...heap, v];
  const frames: Frame[] = [{ arr: [...a], hl: [a.length - 1], msg: `🍡 Put ${v} at the next open spot (index ${a.length - 1}) so the tree stays complete.` }];
  let i = a.length - 1;
  const better = (x: number, y: number) => (isMin ? x < y : x > y);
  while (i > 1) {
    const p = Math.floor(i / 2);
    if (better(a[i], a[p])) {
      frames.push({ arr: [...a], hl: [i, p], msg: `⬆️ ${a[i]} ${isMin ? "<" : ">"} parent ${a[p]} (index ${p} = ${i}/2). Swap! (percolate up)` });
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
      frames.push({ arr: [...a], hl: [i], msg: `…now ${a[i]} sits at index ${i}.` });
    } else {
      frames.push({ arr: [...a], hl: [i, p], msg: `✅ ${a[i]} vs parent ${a[p]}: order is fine, so we stop.` });
      return frames;
    }
  }
  frames.push({ arr: [...a], hl: [1], msg: `👑 ${a[1]} reached the root. Done!` });
  return frames;
}

function removeFrames(heap: number[], isMin: boolean): Frame[] {
  if (heap.length <= 1) return [];
  const a = [...heap];
  const top = a[1];
  const frames: Frame[] = [{ arr: [...a], hl: [1], msg: `🎁 Remove the ${isMin ? "min" : "max"} (${top}) from the root.` }];
  const last = a.pop()!;
  if (a.length === 1) {
    frames.push({ arr: [...a], hl: [], msg: "Heap is empty now." });
    return frames;
  }
  a[1] = last;
  frames.push({ arr: [...a], hl: [1], msg: `🔁 Move the LAST element (${last}) up to the root to fill the hole.` });
  const better = (x: number, y: number) => (isMin ? x < y : x > y);
  let i = 1;
  const n = a.length - 1;
  while (2 * i <= n) {
    let c = 2 * i;
    if (c + 1 <= n && better(a[c + 1], a[c])) c++;
    if (better(a[c], a[i])) {
      frames.push({ arr: [...a], hl: [i, c], msg: `⬇️ Kids of ${a[i]} are at ${2 * i} and ${2 * i + 1}. The ${isMin ? "smaller" : "bigger"} kid is ${a[c]}. Swap! (percolate down)` });
      [a[i], a[c]] = [a[c], a[i]];
      i = c;
    } else {
      frames.push({ arr: [...a], hl: [i, c], msg: `✅ ${a[i]} is already ${isMin ? "≤" : "≥"} its kids. Stop.` });
      return frames;
    }
  }
  frames.push({ arr: [...a], hl: [i], msg: `🍃 ${a[i]} reached a leaf. Done!` });
  return frames;
}

export default function HeapPlayground() {
  const [isMin, setIsMin] = useState(true);
  const [heap, setHeap] = useState<number[]>([0, 3, 8, 5, 12, 10, 9]);
  const [hl, setHl] = useState<number[]>([]);
  const [msg, setMsg] = useState("A min-heap: every parent ≤ its kids. The smallest thing is always on top, like the ripest dango on the skewer 🍡");
  const [val, setVal] = useState("");
  const [busy, setBusy] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const play = (frames: Frame[]) => {
    if (!frames.length) return;
    setBusy(true);
    frames.forEach((f, k) => {
      timers.current.push(
        setTimeout(() => {
          setHeap(f.arr);
          setHl(f.hl);
          setMsg(f.msg);
          if (k === frames.length - 1) setBusy(false);
        }, k * 900),
      );
    });
  };

  const add = (v: number) => play(insertFrames(heap, v, isMin));

  const nodes: TNode[] = [];
  const edges: TEdge[] = [];
  for (let i = 1; i < heap.length; i++) {
    const d = Math.floor(Math.log2(i));
    const posInRow = i - 2 ** d;
    const maxD = Math.floor(Math.log2(Math.max(1, heap.length - 1)));
    const slots = 2 ** maxD;
    const span = slots / 2 ** d;
    nodes.push({ id: i, label: String(heap[i]), x: posInRow * span + (span - 1) / 2, y: d, tone: hl[0] === i ? "hl" : hl.includes(i) ? "hl3" : undefined, sub: `[${i}]` });
    if (i > 1) edges.push({ from: Math.floor(i / 2), to: i });
  }

  return (
    <div className="widget">
      <div className="widget-title">🍡 Heap Dango Stand</div>
      <div className="widget-sub">The tree and the array are the SAME heap. Parent of i is i/2, and the kids of i are 2i and 2i+1.</div>
      <div className="controls">
        <input className="input" inputMode="numeric" placeholder="number" value={val} disabled={busy} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && val && (add(+val), setVal(""))} aria-label="Value" />
        <button className="btn small" disabled={busy || !val || Number.isNaN(+val)} onClick={() => { add(+val); setVal(""); }}>➕ Insert</button>
        <button className="btn small secondary" disabled={busy || heap.length <= 1} onClick={() => play(removeFrames(heap, isMin))}>🎁 Remove {isMin ? "min" : "max"}</button>
        <button className="btn small secondary" disabled={busy} onClick={() => add(1 + Math.floor(Math.random() * 40))}>🎲 Random</button>
        <select className="input" value={isMin ? "min" : "max"} disabled={busy} aria-label="Heap type" onChange={(e) => {
          const m = e.target.value === "min";
          setIsMin(m);
          const vals = heap.slice(1);
          let h: number[] = [0];
          vals.forEach((v) => { const f = insertFrames(h, v, m); h = f[f.length - 1].arr; });
          setHeap(h);
          setHl([]);
          setMsg(m ? "Switched to a MIN-heap: smallest on top." : "Switched to a MAX-heap: biggest on top.");
        }}>
          <option value="min">min-heap</option>
          <option value="max">max-heap</option>
        </select>
      </div>
      <div className="stage">
        <TreeSvg nodes={nodes} edges={edges} slotW={62} empty="🍡 empty skewer" />
      </div>
      <div className="stage" style={{ minHeight: 0, marginTop: 10, paddingBottom: 30 }}>
        <div className="row">
          <div className="cell empty" title="index 0 unused">
            ✗<span className="cell-idx">0</span>
          </div>
          {heap.slice(1).map((v, k) => (
            <div key={k} className={`cell ${hl[0] === k + 1 ? "hl" : hl.includes(k + 1) ? "hl3" : ""}`}>
              {v}
              <span className="cell-idx">{k + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="log" aria-live="polite">{msg}</div>
    </div>
  );
}
