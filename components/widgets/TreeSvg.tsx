"use client";

export type TNode = {
  id: string | number;
  label: string;
  x: number; // in "slot" units
  y: number; // depth
  tone?: "hl" | "hl2" | "hl3" | "flag";
  sub?: string; // small caption under the node (e.g. balance factor)
};
export type TEdge = { from: string | number; to: string | number; label?: string };

const TONE: Record<string, [string, string]> = {
  hl: ["var(--butter)", "#2c1d42"],
  hl2: ["var(--matcha)", "#1f2d1c"],
  hl3: ["var(--blush)", "#3b1f1f"],
  flag: ["var(--lavender)", "#2b2140"],
};

/** Draws a tree from pre-laid-out nodes. Nodes glide when positions change. */
export default function TreeSvg({ nodes, edges, slotW = 56, levelH = 70, r = 21, minSlots = 5, empty = "🌱 empty, plant something!" }: {
  nodes: TNode[];
  edges: TEdge[];
  slotW?: number;
  levelH?: number;
  r?: number;
  minSlots?: number;
  empty?: string;
}) {
  if (!nodes.length) {
    return (
      <div className="center muted hand" style={{ padding: "40px 0" }}>
        {empty}
      </div>
    );
  }
  const maxX = Math.max(minSlots - 1, ...nodes.map((n) => n.x));
  const maxY = Math.max(...nodes.map((n) => n.y));
  const W = (maxX + 1) * slotW;
  const H = (maxY + 1) * levelH + 18;
  const pos = new Map(nodes.map((n) => [n.id, { x: n.x * slotW + slotW / 2, y: n.y * levelH + r + 6 }]));
  return (
    <svg className="tree-svg" viewBox={`0 0 ${W} ${H}`} style={{ maxHeight: 460, minWidth: Math.min(W, 640) }}>
      {edges.map((e) => {
        const a = pos.get(e.from);
        const b = pos.get(e.to);
        if (!a || !b) return null;
        return (
          <g key={`${e.from}-${e.to}`}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--ink-soft)" strokeWidth="2.5" strokeLinecap="round" />
            {e.label && (
              <text x={(a.x + b.x) / 2 + (b.x < a.x ? -8 : 8)} y={(a.y + b.y) / 2} fontSize="13" fill="var(--accent)" textAnchor="middle" fontWeight={800}>
                {e.label}
              </text>
            )}
          </g>
        );
      })}
      {nodes.map((n) => {
        const p = pos.get(n.id)!;
        const [bg, fg] = n.tone ? TONE[n.tone] : ["var(--card)", "var(--ink)"];
        return (
          <g key={n.id} style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: "transform 0.45s cubic-bezier(.3,1.3,.5,1)" }}>
            <circle r={r} fill={bg} stroke="var(--ink)" strokeWidth="2.5" style={{ transition: "fill 0.3s" }} />
            <text textAnchor="middle" dy="5" fontSize={n.label.length > 3 ? 11 : 15} fill={fg}>
              {n.label}
            </text>
            {n.sub && (
              <text textAnchor="middle" y={r + 14} fontSize="11" fill="var(--ink-soft)">
                {n.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
