"use client";

import { useState } from "react";

type Strat = "linear" | "quadratic" | "chain";

export default function HashTable() {
  const [m, setM] = useState(10);
  const [strat, setStrat] = useState<Strat>("linear");
  const [table, setTable] = useState<(number | null)[]>(() => Array(10).fill(null));
  const [chains, setChains] = useState<number[][]>(() => Array.from({ length: 10 }, () => []));
  const [probe, setProbe] = useState<{ idx: number; ok: boolean }[]>([]);
  const [log, setLog] = useState<string[]>(["🧥 A hash table is a coat check: h(key) tells you which hook to use. Try inserting 23, 43, 13, 27."]);
  const [val, setVal] = useState("");

  const reset = (size = m, s = strat) => {
    setTable(Array(size).fill(null));
    setChains(Array.from({ length: size }, () => []));
    setProbe([]);
    setLog([`🧹 Fresh table of size ${size} using ${s === "chain" ? "separate chaining" : s + " probing"}.`]);
  };

  const insert = (k: number) => {
    const h = ((k % m) + m) % m;
    const l = [`🔢 h(${k}) = ${k} % ${m} = ${h}`];
    if (strat === "chain") {
      const c = chains.map((x) => [...x]);
      c[h].push(k);
      setChains(c);
      setProbe([{ idx: h, ok: true }]);
      l.push(c[h].length > 1 ? `🔗 Hook ${h} already has stuff, so ${k} joins the linked list there (${c[h].join(" → ")}).` : `✅ Hang ${k} on hook ${h}.`);
      setLog(l);
      return;
    }
    if (table.includes(k)) {
      setLog([`🙅 ${k} is already in the table.`]);
      return;
    }
    const t = [...table];
    const pr: { idx: number; ok: boolean }[] = [];
    for (let i = 0; i < m; i++) {
      const idx = strat === "linear" ? (h + i) % m : (h + i * i) % m;
      if (i > 0) l.push(strat === "linear" ? `➡️ try (${h} + ${i}) % ${m} = ${idx}` : `🦘 try (${h} + ${i}²) % ${m} = (${h} + ${i * i}) % ${m} = ${idx}`);
      if (t[idx] === null) {
        t[idx] = k;
        pr.push({ idx, ok: true });
        l.push(`✅ Spot ${idx} is free! ${k} goes there.${i > 0 ? ` (${i} collision${i > 1 ? "s" : ""})` : ""}`);
        setTable(t);
        setProbe(pr);
        setLog(l);
        return;
      }
      pr.push({ idx, ok: false });
      l.push(`💥 Spot ${idx} is taken by ${t[idx]}.`);
    }
    setProbe(pr);
    l.push(strat === "quadratic" ? "😵 Quadratic probing checked m spots and found no room, even though the table might not be full! This is why the table size should be prime and the load factor ≤ ½." : "😵 Table is full!");
    setLog(l);
  };

  const load = strat === "chain" ? chains.reduce((s, c) => s + c.length, 0) / m : table.filter((x) => x !== null).length / m;

  return (
    <div className="widget">
      <div className="widget-title">🧥 Coat-Check Hash Table</div>
      <div className="widget-sub">Keys hash to a hook. When two keys want the same hook, that's a collision, and the strategy decides where the second one goes.</div>
      <div className="controls">
        <input className="input" inputMode="numeric" placeholder="key" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && val && !Number.isNaN(+val)) { insert(+val); setVal(""); } }} aria-label="Key" />
        <button className="btn small" disabled={!val || Number.isNaN(+val)} onClick={() => { insert(+val); setVal(""); }}>🧥 Insert</button>
        <button className="btn small secondary" onClick={() => insert(Math.floor(Math.random() * 100))}>🎲 Random</button>
        <select className="input" value={strat} aria-label="Collision strategy" onChange={(e) => { const s = e.target.value as Strat; setStrat(s); reset(m, s); }}>
          <option value="linear">linear probing</option>
          <option value="quadratic">quadratic probing</option>
          <option value="chain">separate chaining</option>
        </select>
        <select className="input" value={m} aria-label="Table size" onChange={(e) => { const s = +e.target.value; setM(s); reset(s); }}>
          {[7, 10, 11, 13].map((s) => (
            <option key={s} value={s}>size {s}{[7, 11, 13].includes(s) ? " (prime)" : ""}</option>
          ))}
        </select>
        <button className="btn small secondary" onClick={() => reset()}>🧹 Clear</button>
      </div>
      <div className="stage">
        <div className="row" style={{ alignItems: "flex-start" }}>
          {Array.from({ length: m }, (_, i) => {
            const p = probe.find((x) => x.idx === i);
            const cls = p ? (p.ok ? "hl2" : "hl3") : "";
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--ink-faint)" }}>{i}</div>
                <div style={{ fontSize: "1.1rem", lineHeight: 1 }} aria-hidden>🪝</div>
                {strat === "chain" ? (
                  <>
                    <div className={`cell ${cls} ${chains[i].length ? "" : "empty"}`}>
                      {chains[i][0] ?? "·"}                    </div>
                    {chains[i].slice(1).map((k, j) => (
                      <div key={j} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <span style={{ lineHeight: 1 }}>↓</span>
                        <div className="cell" style={{ width: 44, height: 40 }}>{k}</div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className={`cell ${cls} ${table[i] === null ? "empty" : ""}`}>
                    {table[i] ?? "·"}                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="log" aria-live="polite">
        <div style={{ float: "right" }} className="chip">load α = {load.toFixed(2)}</div>
        {log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
