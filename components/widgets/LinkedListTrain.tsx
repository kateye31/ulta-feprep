"use client";

import { useEffect, useRef, useState } from "react";

type Car = { id: number; v: number };
type Kind = "singly" | "doubly" | "circular";
let uid = 100;

export default function LinkedListTrain() {
  const [list, setList] = useState<Car[]>([
    { id: 1, v: 3 },
    { id: 2, v: 7 },
    { id: 3, v: 12 },
  ]);
  const [kind, setKind] = useState<Kind>("singly");
  const [walker, setWalker] = useState<number | null>(null);
  const [fresh, setFresh] = useState<number | null>(null);
  const [val, setVal] = useState("");
  const [msg, setMsg] = useState("🚂 Each car holds a value and a hook (next pointer) to the next car. 'head' is the only car we know directly!");
  const [busy, setBusy] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (ms: number, f: () => void) => timers.current.push(setTimeout(f, ms));

  /** Animate a "temp" pointer walking from head to index `to`, then run `done`. */
  const walk = (to: number, label: (i: number) => string, done: () => void) => {
    setBusy(true);
    for (let i = 0; i <= to; i++) {
      later(i * 600, () => {
        setWalker(i);
        setMsg(label(i));
      });
    }
    later((to + 1) * 600, () => {
      setWalker(null);
      setBusy(false);
      done();
    });
  };

  const num = () => {
    const n = parseInt(val, 10);
    if (Number.isNaN(n)) {
      setMsg("🙈 Type a number first!");
      return null;
    }
    setVal("");
    return n;
  };

  const front = () => {
    const v = num();
    if (v === null) return;
    const car = { id: uid++, v };
    setList([car, ...list]);
    setFresh(car.id);
    setMsg(`⚡ O(1)! newNode->next = head; head = newNode. ${v} is the new engine.${kind === "circular" ? " (Circular: the LAST car's next must also be updated to point at the new head!)" : ""}`);
  };

  const back = () => {
    const v = num();
    if (v === null) return;
    const car = { id: uid++, v };
    if (!list.length) {
      setList([car]);
      setFresh(car.id);
      setMsg("List was empty (head == NULL), so the new car simply becomes head.");
      return;
    }
    walk(list.length - 1, (i) => `🚶 temp is on ${list[i].v}. ${i < list.length - 1 ? "temp->next isn't NULL, so keep walking…" : "temp->next == NULL. This is the caboose!"}`, () => {
      setList((l) => [...l, car]);
      setFresh(car.id);
      setMsg(`🔗 temp->next = newNode. Adding to the back took O(n) because we had to walk all ${list.length} cars (unless you keep a tail pointer!).`);
    });
  };

  const ordered = () => {
    const v = num();
    if (v === null) return;
    const car = { id: uid++, v };
    const pos = list.findIndex((c) => c.v >= v);
    const at = pos === -1 ? list.length : pos;
    if (at === 0) {
      setList([car, ...list]);
      setFresh(car.id);
      setMsg(`${v} is smallest, so it goes in front: special case, head changes!`);
      return;
    }
    walk(at - 1, (i) => `🚶 temp on ${list[i].v}. Is temp->next->data < ${v}? ${i < at - 1 ? "Yes, keep going." : "No (or next is NULL), stop here!"}`, () => {
      setList((l) => [...l.slice(0, at), car, ...l.slice(at)]);
      setFresh(car.id);
      setMsg(`🪡 newNode->next = temp->next; temp->next = newNode. Order matters! Do it backwards and you lose the rest of the train.`);
    });
  };

  const del = () => {
    const v = num();
    if (v === null) return;
    const at = list.findIndex((c) => c.v === v);
    if (at === -1) {
      setMsg(`🔍 ${v} isn't in the list.`);
      return;
    }
    if (at === 0) {
      setList(list.slice(1));
      setMsg(`🗑 Deleting the head: tmp = head; head = head->next; free(tmp). Save the pointer BEFORE free!`);
      return;
    }
    walk(at - 1, (i) => `🚶 temp on ${list[i].v}. We stop one car BEFORE the victim so we can re-hook around it.`, () => {
      setList((l) => l.filter((_, i) => i !== at));
      setMsg(`✂️ del = temp->next; temp->next = del->next; free(del). Car ${v} is gone and the train is still connected.`);
    });
  };

  const reverse = () => {
    setList([...list].reverse());
    setMsg("🔄 Reversed with 3 pointers: prev, cur, next. Each step: next = cur->next; cur->next = prev; prev = cur; cur = next.");
  };

  return (
    <div className="widget">
      <div className="widget-title">🚂 Linked List Train</div>
      <div className="widget-sub">Nodes don&apos;t sit next to each other in memory. They&apos;re scattered, and only the hooks connect them.</div>
      <div className="controls">
        <input className="input" inputMode="numeric" placeholder="value" value={val} disabled={busy} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && front()} aria-label="Value" />
        <button className="btn small" disabled={busy} onClick={front}>⬅️ Add front</button>
        <button className="btn small secondary" disabled={busy} onClick={back}>➡️ Add back</button>
        <button className="btn small secondary" disabled={busy} onClick={ordered}>📏 Add in order</button>
        <button className="btn small secondary" disabled={busy} onClick={del}>✂️ Delete</button>
        <button className="btn small secondary" disabled={busy || list.length < 2} onClick={reverse}>🔄 Reverse</button>
        <select className="input" value={kind} onChange={(e) => setKind(e.target.value as Kind)} aria-label="List type">
          <option value="singly">singly linked</option>
          <option value="doubly">doubly linked</option>
          <option value="circular">circular</option>
        </select>
      </div>
      <div className="stage" style={{ paddingTop: 34, paddingBottom: kind === "circular" ? 44 : 20 }}>
        <div className="row" style={{ gap: 0, position: "relative" }}>
          <div style={{ fontWeight: 900, marginRight: 8, textAlign: "center", fontSize: "0.85rem" }}>
            head
            <div>➜</div>
          </div>
          {list.length === 0 && <span className="mono muted">NULL</span>}
          {list.map((c, i) => (
            <div key={c.id} className="row" style={{ gap: 0 }}>
              <div className={fresh === c.id ? "pop-in" : ""} style={{ position: "relative", display: "flex", border: "2.5px solid var(--ink)", borderRadius: 12, background: walker === i ? "var(--butter)" : fresh === c.id ? "var(--matcha-soft)" : "var(--card)", transition: "background .3s", flexShrink: 0 }}>
                {walker === i && <span style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", fontWeight: 900, fontSize: "0.8rem", whiteSpace: "nowrap" }}>👆 temp</span>}
                {kind === "doubly" && <span className="mono" style={{ padding: "8px 6px", borderRight: "2px dashed var(--line)", fontSize: "0.7rem", color: "var(--ink-faint)" }}>prev</span>}
                <span className="mono" style={{ padding: "8px 14px", fontWeight: 800, color: walker === i ? "#2c1d42" : undefined }}>{c.v}</span>
                <span className="mono" style={{ padding: "8px 6px", borderLeft: "2px dashed var(--line)", fontSize: "0.7rem", color: walker === i ? "#2c1d42" : "var(--ink-faint)" }}>next</span>
              </div>
              <span style={{ fontSize: "1.2rem", padding: "0 4px", color: "var(--ink-soft)" }} aria-hidden>
                {i === list.length - 1 ? (kind === "circular" ? "⤵" : "➜") : kind === "doubly" ? "⇄" : "➜"}
              </span>
              {i === list.length - 1 && kind !== "circular" && <span className="mono muted" style={{ fontWeight: 800 }}>NULL</span>}
            </div>
          ))}
          {kind === "circular" && list.length > 0 && (
            <div style={{ position: "absolute", left: 50, right: 20, bottom: -30, borderBottom: "2.5px dashed var(--accent)", borderLeft: "2.5px dashed var(--accent)", borderRight: "2.5px dashed var(--accent)", height: 20, borderRadius: "0 0 14px 14px" }}>
              <span style={{ position: "absolute", left: -8, top: -14, color: "var(--accent)" }}>▲</span>
              <span className="hand" style={{ position: "absolute", left: "40%", bottom: -26, fontSize: "1rem", color: "var(--accent)" }}>last→next = head</span>
            </div>
          )}
        </div>
      </div>
      <div className="log" aria-live="polite">{msg}</div>
    </div>
  );
}
