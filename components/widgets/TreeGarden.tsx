"use client";

import { useEffect, useRef, useState } from "react";
import TreeSvg, { type TEdge, type TNode } from "./TreeSvg";

type N = { v: number; l: N | null; r: N | null; h: number };

const ht = (n: N | null) => (n ? n.h : -1);
const mk = (v: number, l: N | null = null, r: N | null = null): N => ({ v, l, r, h: 1 + Math.max(ht(l), ht(r)) });
const bf = (n: N) => ht(n.l) - ht(n.r);

function rotRight(n: N): N {
  const L = n.l!;
  return mk(L.v, L.l, mk(n.v, L.r, n.r));
}
function rotLeft(n: N): N {
  const R = n.r!;
  return mk(R.v, mk(n.v, n.l, R.l), R.r);
}

function rebalance(n: N, log: string[]): N {
  const b = bf(n);
  if (b > 1) {
    if (bf(n.l!) >= 0) {
      log.push(`⚖️ ${n.v} is too heavy on the LEFT (bf = +${b}). Case LL, so do a single RIGHT rotation at ${n.v}.`);
      return rotRight(n);
    }
    log.push(`⚖️ ${n.v} is too heavy on the LEFT (bf = +${b}), but its child ${n.l!.v} leans right. Case LR, so do a DOUBLE rotation (left at ${n.l!.v}, then right at ${n.v}).`);
    return rotRight(mk(n.v, rotLeft(n.l!), n.r));
  }
  if (b < -1) {
    if (bf(n.r!) <= 0) {
      log.push(`⚖️ ${n.v} is too heavy on the RIGHT (bf = ${b}). Case RR, so do a single LEFT rotation at ${n.v}.`);
      return rotLeft(n);
    }
    log.push(`⚖️ ${n.v} is too heavy on the RIGHT (bf = ${b}), but its child ${n.r!.v} leans left. Case RL, so do a DOUBLE rotation (right at ${n.r!.v}, then left at ${n.v}).`);
    return rotLeft(mk(n.v, n.l, rotRight(n.r!)));
  }
  return n;
}

function insert(n: N | null, v: number, avl: boolean, log: string[]): N {
  if (!n) return mk(v);
  let out: N;
  if (v < n.v) out = mk(n.v, insert(n.l, v, avl, log), n.r);
  else if (v > n.v) out = mk(n.v, n.l, insert(n.r, v, avl, log));
  else return n;
  return avl ? rebalance(out, log) : out;
}

const maxNode = (n: N): N => (n.r ? maxNode(n.r) : n);
const minNode = (n: N): N => (n.l ? minNode(n.l) : n);

function remove(n: N | null, v: number, pred: boolean, avl: boolean, log: string[]): N | null {
  if (!n) return null;
  let out: N | null;
  if (v < n.v) out = mk(n.v, remove(n.l, v, pred, avl, log), n.r);
  else if (v > n.v) out = mk(n.v, n.l, remove(n.r, v, pred, avl, log));
  else {
    if (!n.l && !n.r) {
      log.push(`🍂 ${v} is a leaf, so we just snip it off.`);
      return null;
    }
    if (!n.l || !n.r) {
      const kid = (n.l ?? n.r)!;
      log.push(`🌿 ${v} has one child (${kid.v}), so that child moves up and takes its place.`);
      return kid;
    }
    if (pred) {
      const m = maxNode(n.l);
      log.push(`🌳 ${v} has two children. Replace it with the MAX of its left subtree (${m.v}), then delete ${m.v} down there.`);
      out = mk(m.v, remove(n.l, m.v, pred, avl, log), n.r);
    } else {
      const m = minNode(n.r);
      log.push(`🌳 ${v} has two children. Replace it with the MIN of its right subtree (${m.v}), then delete ${m.v} down there.`);
      out = mk(m.v, n.l, remove(n.r, m.v, pred, avl, log));
    }
  }
  return avl && out ? rebalance(out, log) : out;
}

function has(n: N | null, v: number): boolean {
  return !!n && (n.v === v || has(v < n.v ? n.l : n.r, v));
}

function layout(root: N | null, avl: boolean, tones: Map<number, TNode["tone"]>) {
  const nodes: TNode[] = [];
  const edges: TEdge[] = [];
  let x = 0;
  const walk = (n: N | null, d: number) => {
    if (!n) return;
    walk(n.l, d + 1);
    nodes.push({ id: n.v, label: String(n.v), x: x++, y: d, tone: tones.get(n.v), sub: avl ? `bf ${bf(n) > 0 ? "+" : ""}${bf(n)}` : undefined });
    walk(n.r, d + 1);
    if (n.l) edges.push({ from: n.v, to: n.l.v });
    if (n.r) edges.push({ from: n.v, to: n.r.v });
  };
  walk(root, 0);
  return { nodes, edges };
}

function traversal(n: N | null, kind: string): number[] {
  if (!n) return [];
  if (kind === "level") {
    const out: number[] = [];
    const q: N[] = [n];
    while (q.length) {
      const c = q.shift()!;
      out.push(c.v);
      if (c.l) q.push(c.l);
      if (c.r) q.push(c.r);
    }
    return out;
  }
  const L = traversal(n.l, kind);
  const R = traversal(n.r, kind);
  if (kind === "pre") return [n.v, ...L, ...R];
  if (kind === "in") return [...L, n.v, ...R];
  return [...L, ...R, n.v];
}

const TRAV: Record<string, string> = {
  pre: "Pre-order (Root → Left → Right)",
  in: "In-order (Left → Root → Right) = sorted!",
  post: "Post-order (Left → Right → Root)",
  level: "Level-order (row by row, like reading)",
};

const START_BST = [50, 30, 70, 20, 40, 60, 80, 35];
const START_AVL = [10, 20, 30];

export default function TreeGarden({ mode = "bst" }: { mode?: "bst" | "avl" }) {
  const avl = mode === "avl";
  const [root, setRoot] = useState<N | null>(() => {
    const log: string[] = [];
    return (avl ? START_AVL : START_BST).reduce<N | null>((t, v) => insert(t, v, avl, log), null);
  });
  const [val, setVal] = useState("");
  const [pred, setPred] = useState(true);
  const [log, setLog] = useState<string[]>([avl ? "🌱 I inserted 10, 20, 30. The tree auto-balanced! Try inserting 25, then 27." : "🌱 Here's a starter BST. Try inserting 45 or deleting 30."]);
  const [tones, setTones] = useState(new Map<number, TNode["tone"]>());
  const [trav, setTrav] = useState<{ kind: string; order: number[]; i: number } | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTrav = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };
  useEffect(() => stopTrav, []);

  const num = () => {
    const n = parseInt(val, 10);
    if (Number.isNaN(n)) {
      setLog(["🙈 Type a whole number first!"]);
      return null;
    }
    return n;
  };

  const pathTo = (v: number) => {
    const path: number[] = [];
    let c = root;
    while (c) {
      path.push(c.v);
      if (c.v === v) break;
      c = v < c.v ? c.l : c.r;
    }
    return path;
  };

  const doInsert = () => {
    const v = num();
    if (v === null) return;
    stopTrav();
    setTrav(null);
    if (has(root, v)) {
      setLog([`🙅 ${v} is already in the tree. BSTs here don't store duplicates.`]);
      return;
    }
    const path = pathTo(v);
    const l: string[] = [`🚶 Walk: ${path.map((p) => `${p} (${v < p ? "go left" : "go right"})`).join(" → ")} → empty spot, so plant ${v} there 🌱`];
    if (!path.length) l[0] = `🌱 Tree was empty, so ${v} becomes the root.`;
    const next = insert(root, v, avl, l);
    if (avl && l.length === 1) l.push("✅ Every node's balance factor is still -1, 0, or +1. No rotation needed.");
    setRoot(next);
    setTones(new Map([[v, "hl2"]]));
    setLog(l);
    setVal("");
  };

  const doDelete = () => {
    const v = num();
    if (v === null) return;
    stopTrav();
    setTrav(null);
    if (!has(root, v)) {
      setLog([`🔍 ${v} isn't in the tree, so there's nothing to delete.`]);
      return;
    }
    const l: string[] = [];
    setRoot(remove(root, v, pred, avl, l));
    setTones(new Map());
    setLog(l);
    setVal("");
  };

  const doSearch = () => {
    const v = num();
    if (v === null) return;
    stopTrav();
    setTrav(null);
    const path = pathTo(v);
    const found = has(root, v);
    setTones(new Map(path.map((p) => [p, p === v ? "hl2" : "hl"] as const)));
    setLog([
      found
        ? `🔍 Found ${v} after checking ${path.length} node(s): ${path.join(" → ")}. Each step throws away half the tree (if it's balanced).`
        : `🔍 ${v} not found. Checked ${path.join(" → ") || "nothing"}, then fell off the tree.`,
    ]);
  };

  const runTrav = (kind: string) => {
    stopTrav();
    const order = traversal(root, kind);
    let i = 0;
    setTrav({ kind, order, i: 0 });
    setTones(new Map());
    timer.current = setInterval(() => {
      i++;
      if (i > order.length) {
        stopTrav();
        return;
      }
      setTrav({ kind, order, i });
      setTones(new Map(order.slice(0, i).map((v, k) => [v, k === i - 1 ? "hl" : "hl2"] as const)));
    }, 650);
  };

  const random = () => {
    stopTrav();
    setTrav(null);
    const vals = new Set<number>();
    while (vals.size < 8) vals.add(1 + Math.floor(Math.random() * 99));
    const l: string[] = [];
    setRoot([...vals].reduce<N | null>((t, v) => insert(t, v, avl, l), null));
    setTones(new Map());
    setLog([`🎲 Inserted ${[...vals].join(", ")} in that order.`]);
  };

  const { nodes, edges } = layout(root, avl, tones);

  return (
    <div className="widget">
      <div className="widget-title">{avl ? "⚖️ AVL Balancing Garden" : "🌳 BST Garden"}</div>
      <div className="widget-sub">
        {avl
          ? "Insert or delete and watch the tree rotate itself to stay balanced. bf = height(left) − height(right)."
          : "Smaller goes left, bigger goes right. Plant numbers, pull weeds, and walk the tree."}
      </div>
      <div className="controls">
        <input className="input" inputMode="numeric" placeholder="number" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doInsert()} aria-label="Value" />
        <button className="btn small" onClick={doInsert}>🌱 Insert</button>
        <button className="btn small secondary" onClick={doDelete}>✂️ Delete</button>
        <button className="btn small secondary" onClick={doSearch}>🔍 Search</button>
        <button className="btn small secondary" onClick={random}>🎲 Random</button>
        <button className="btn small secondary" onClick={() => { stopTrav(); setTrav(null); setRoot(null); setTones(new Map()); setLog(["🧹 Cleared!"]); }}>🧹 Clear</button>
      </div>
      <div className="controls" style={{ fontSize: "0.9rem" }}>
        <span className="muted">Deleting a node with 2 kids? Replace with</span>
        <select className="input" value={pred ? "pred" : "succ"} onChange={(e) => setPred(e.target.value === "pred")} aria-label="Two-child deletion rule">
          <option value="pred">max of LEFT subtree</option>
          <option value="succ">min of RIGHT subtree</option>
        </select>
      </div>
      <div className="stage">
        <TreeSvg nodes={nodes} edges={edges} />
      </div>
      {!avl && (
        <div className="controls">
          <span className="muted" style={{ fontWeight: 700 }}>Walk it:</span>
          {Object.keys(TRAV).map((k) => (
            <button key={k} className="btn small secondary" onClick={() => runTrav(k)} disabled={!root}>
              {k === "pre" ? "👑 Pre" : k === "in" ? "📏 In" : k === "post" ? "🍂 Post" : "🪜 Level"}
            </button>
          ))}
        </div>
      )}
      <div className="log" aria-live="polite">
        {trav ? (
          <>
            <b>{TRAV[trav.kind]}</b>
            <div className="mono" style={{ marginTop: 4 }}>{trav.order.slice(0, trav.i).join(", ") || "…"}</div>
          </>
        ) : (
          log.map((l, i) => <div key={i}>{l}</div>)
        )}
      </div>
    </div>
  );
}
