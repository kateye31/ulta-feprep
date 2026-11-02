"use client";

import type { TreeSpec } from "@/lib/arcade/types";

/**
 * Draws a tree from x/y percentages. Fixed nodes show their value; slot nodes become little
 * round input boxes (used by "fill in the tree" steps).
 */
export function TreeView({
  tree,
  values,
  onChange,
  marks,
  locked,
}: {
  tree: TreeSpec;
  values?: Record<string, string>;
  onChange?: (slot: string, v: string) => void;
  marks?: Record<string, "ok" | "bad" | undefined>;
  locked?: boolean;
}) {
  const at = Object.fromEntries(tree.nodes.map((n) => [n.id, n]));
  const maxY = Math.max(...tree.nodes.map((n) => n.y)) + 10;
  return (
    <div className="tree" style={{ aspectRatio: `100 / ${Math.max(40, maxY * 0.62)}` }}>
      <svg viewBox={`0 0 100 ${maxY}`} preserveAspectRatio="none" aria-hidden>
        {tree.edges.map(([a, b]) => (
          <line key={a + b} x1={at[a].x} y1={at[a].y} x2={at[b].x} y2={at[b].y} stroke="currentColor" strokeWidth={1.6} vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity={0.7} />
        ))}
      </svg>
      {tree.nodes.map((n) =>
        n.slot ? (
          <div key={n.id} className={`node slot ${marks?.[n.slot] ?? ""}`} style={{ left: `${n.x}%`, top: `${(n.y / maxY) * 100}%` }}>
            <input
              aria-label={`tree node ${n.slot}`}
              value={values?.[n.slot] ?? ""}
              disabled={locked}
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              placeholder="?"
              onChange={(e) => onChange?.(n.slot!, e.target.value)}
            />
          </div>
        ) : (
          <div key={n.id} className="node" style={{ left: `${n.x}%`, top: `${(n.y / maxY) * 100}%` }}>
            {n.v}
          </div>
        ),
      )}
    </div>
  );
}
