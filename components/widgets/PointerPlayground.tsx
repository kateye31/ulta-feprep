"use client";

import { useState } from "react";

type Block = { id: number; vals: (number | null)[]; state: "live" | "freed" | "leaked" };
let bid = 1;

export default function PointerPlayground() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [p, setP] = useState<number | null>(null); // id of block p points to
  const [dangling, setDangling] = useState(false);
  const [log, setLog] = useState<{ t: string; kind: "ok" | "bad" | "info" }[]>([{ t: "🧠 int *p = NULL;  p is a sticky note on the STACK. It holds an address, and right now nothing.", kind: "info" }]);

  const say = (t: string, kind: "ok" | "bad" | "info" = "ok") => setLog((l) => [{ t, kind }, ...l].slice(0, 5));
  const cur = blocks.find((b) => b.id === p);

  const malloc = (n: number) => {
    const nb: Block = { id: bid++, vals: Array(n).fill(null), state: "live" };
    const leaking = !!cur && cur.state === "live" && !dangling;
    const next = leaking ? blocks.map((b) => (b.id === cur!.id ? { ...b, state: "leaked" as const } : b)) : blocks;
    setBlocks([...next, nb]);
    setP(nb.id);
    setDangling(false);
    say(`📦 p = malloc(${n} * sizeof(int)); asks the HEAP for ${n * 4} bytes (${n} ints). The values start as garbage (?).`);
    if (leaking) say(`💧 MEMORY LEAK! p was the only pointer to block #${cur!.id}, and now it's lost forever. You can never free() it.`, "bad");
  };

  const fill = () => {
    if (p === null) return say("💥 p is NULL! p[0] = ... would SEGFAULT. Always check if malloc returned NULL.", "bad");
    if (dangling) return say("👻 USE AFTER FREE! That memory isn't yours anymore. Undefined behavior: it might work, it might crash, it might corrupt something.", "bad");
    setBlocks(blocks.map((b) => (b.id === p ? { ...b, vals: b.vals.map(() => 1 + Math.floor(Math.random() * 9)) } : b)));
    say("✏️ for (i...) p[i] = ...; fills the block. p[i] is the same as *(p + i).");
  };

  const free = () => {
    if (p === null) return say("😌 free(NULL) is totally safe. It does nothing.", "info");
    if (dangling) return say("💥 DOUBLE FREE! You already freed this block. This can crash your program.", "bad");
    setBlocks(blocks.map((b) => (b.id === p ? { ...b, state: "freed" } : b)));
    setDangling(true);
    say("🗑 free(p); gives the block back to the heap. BUT p still holds the old address. p is now a DANGLING pointer 👻", "info");
  };

  const nullify = () => {
    setP(null);
    setDangling(false);
    if (cur && cur.state === "live") {
      setBlocks(blocks.map((b) => (b.id === cur.id ? { ...b, state: "leaked" } : b)));
      return say("💧 LEAK! You set p = NULL without freeing first. The block is still reserved but unreachable.", "bad");
    }
    say("🧹 p = NULL; Good habit after free: now p can't be accidentally used.");
  };

  const realloc = () => {
    if (!cur || dangling) return say("🤔 realloc needs a live block (realloc(NULL, n) acts like malloc, though).", "info");
    const n = cur.vals.length + 2;
    const nb: Block = { id: bid++, vals: [...cur.vals, null, null], state: "live" };
    setBlocks([...blocks.map((b) => (b.id === cur.id ? { ...b, state: "freed" as const } : b)), nb]);
    setP(nb.id);
    say(`📏 p = realloc(p, ${n} * sizeof(int)); might MOVE the data to a bigger block, copy the old values over, and free the old block for you.`);
  };

  const COLORS = { live: "var(--matcha-soft)", freed: "var(--paper)", leaked: "var(--blush-soft)" };

  return (
    <div className="widget">
      <div className="widget-title">📦 Pointer Playground</div>
      <div className="widget-sub">Click the C lines in any order. Try to cause a leak, a dangling pointer and a double free (on purpose!).</div>
      <div className="controls">
        <button className="btn small mono" onClick={() => malloc(3)}>p = malloc(3*sizeof(int));</button>
        <button className="btn small secondary mono" onClick={fill}>p[i] = …;</button>
        <button className="btn small secondary mono" onClick={realloc}>p = realloc(p, …);</button>
        <button className="btn small secondary mono" onClick={free}>free(p);</button>
        <button className="btn small secondary mono" onClick={nullify}>p = NULL;</button>
        <button className="btn small secondary" onClick={() => { setBlocks([]); setP(null); setDangling(false); setLog([{ t: "🔄 Fresh program.", kind: "info" }]); }}>↺</button>
      </div>
      <div className="stage" style={{ display: "grid", gridTemplateColumns: "minmax(120px, 160px) 1fr", gap: 18 }}>
        <div>
          <div className="muted" style={{ fontSize: "0.8rem", fontWeight: 800, marginBottom: 6 }}>📚 STACK (auto)</div>
          <div style={{ border: "2.5px solid var(--ink)", borderRadius: 12, padding: 10, background: "var(--card)" }}>
            <div className="mono" style={{ fontSize: "0.8rem" }}>int *p</div>
            <div className="mono" style={{ fontWeight: 800, color: dangling ? "var(--blush)" : p ? "var(--matcha)" : "var(--ink-faint)" }}>
              {p === null ? "NULL" : dangling ? `👻 #${p} (freed!)` : `→ block #${p}`}
            </div>
          </div>
          <p className="muted" style={{ fontSize: "0.8rem", marginTop: 8 }}>Local variables live here and vanish when the function returns.</p>
        </div>
        <div>
          <div className="muted" style={{ fontSize: "0.8rem", fontWeight: 800, marginBottom: 6 }}>🏔 HEAP (you manage it)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {!blocks.length && <span className="muted hand">empty… malloc something!</span>}
            {blocks.map((b) => (
              <div key={b.id} className="pop-in" style={{ border: `2.5px ${b.state === "freed" ? "dashed" : "solid"} var(--ink)`, borderRadius: 12, padding: 8, background: COLORS[b.state], opacity: b.state === "freed" ? 0.55 : 1, outline: b.id === p ? "3px solid var(--butter)" : undefined }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 800 }}>
                  #{b.id} {b.state === "leaked" ? "💧 leaked" : b.state === "freed" ? "🗑 freed" : "✅ live"}
                </div>
                <div className="row" style={{ gap: 4 }}>
                  {b.vals.map((v, i) => (
                    <div key={i} className="cell" style={{ width: 34, height: 34, fontSize: "0.85rem" }}>{v ?? "?"}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="log" aria-live="polite">
        {log.map((l, i) => (
          <div key={i} style={{ opacity: i ? 0.55 : 1, color: l.kind === "bad" && i === 0 ? "var(--blush)" : undefined, fontWeight: i === 0 ? 700 : 400 }}>{l.t}</div>
        ))}
      </div>
    </div>
  );
}
