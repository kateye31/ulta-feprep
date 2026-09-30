"use client";

import { useState } from "react";

const CAP = 6;
const GUESTS = ["🐰", "🦊", "🐻", "🐼", "🐸", "🐨", "🦔", "🐧", "🐹", "🦝"];

/** Array queue the COP3502 way: an array + front index + numElements. back = (front + size) % CAP. */
export default function CafeLine() {
  const [arr, setArr] = useState<(string | null)[]>(["🐰", "🦊", null, null, null, null]);
  const [front, setFront] = useState(0);
  const [size, setSize] = useState(2);
  const [n, setN] = useState(2);
  const [msg, setMsg] = useState("☕ A queue is the line at the café counter. Join at the BACK, get served from the FRONT. FIFO: First In, First Out.");

  const enqueue = () => {
    if (size === CAP) return setMsg("🚪 The café is full! (numElements == CAPACITY). A dynamic queue would realloc to a bigger array here.");
    const back = (front + size) % CAP;
    const g = GUESTS[n % GUESTS.length];
    const a = [...arr];
    a[back] = g;
    setArr(a);
    setSize(size + 1);
    setN(n + 1);
    setMsg(`🚶 enqueue(${g}): back = (front + size) % ${CAP} = (${front} + ${size}) % ${CAP} = ${back}.${back < front ? " It WRAPPED around to the start of the array! 🔄" : ""}`);
  };
  const dequeue = () => {
    if (!size) return setMsg("🫙 Nobody in line: can't dequeue an empty queue.");
    const g = arr[front];
    const a = [...arr];
    a[front] = null;
    setArr(a);
    const nf = (front + 1) % CAP;
    setFront(nf);
    setSize(size - 1);
    setMsg(`☕ ${g} got their latte and left! front = (${front} + 1) % ${CAP} = ${nf}. Nobody shuffles forward: we just move the front index. O(1)!`);
  };

  const order = Array.from({ length: size }, (_, k) => arr[(front + k) % CAP]);
  const back = (front + size - 1 + CAP) % CAP;

  return (
    <div className="widget">
      <div className="widget-title">☕ The Café Line (Queue)</div>
      <div className="widget-sub">Top: what the customers see. Bottom: what the circular array really looks like.</div>
      <div className="controls">
        <button className="btn small" onClick={enqueue}>🚶 enqueue</button>
        <button className="btn small secondary" onClick={dequeue}>☕ dequeue</button>
        <button className="btn small secondary" onClick={() => setMsg(size ? `👀 peek: ${arr[front]} is next to be served.` : "👀 The line is empty.")}>👀 peek</button>
      </div>
      <div className="stage">
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", minHeight: 70 }}>
          <span style={{ fontSize: "2rem" }} title="counter">🧑‍🍳</span>
          <span className="hand" style={{ color: "var(--accent)" }}>counter ←</span>
          {order.map((g, k) => (
            <span key={`${g}-${k}`} className="pop-in" style={{ fontSize: "2.2rem", filter: k === 0 ? "drop-shadow(0 0 6px var(--butter))" : undefined }}>
              {g}
            </span>
          ))}
          {!size && <span className="muted">(nobody here)</span>}
        </div>
        <div className="muted" style={{ fontSize: "0.8rem", fontWeight: 800, margin: "14px 0 6px" }}>
          array · front = {front} · numElements = {size}
        </div>
        <div className="row" style={{ paddingBottom: 44 }}>
          {arr.map((g, i) => {
            const inQ = size > 0 && ((i - front + CAP) % CAP) < size;
            return (
              <div key={i} className={`cell ${inQ ? (i === front ? "hl" : "") : "empty"}`} style={{ fontSize: "1.4rem" }}>
                {inQ ? g : "·"}
                <span className="cell-idx" style={{ fontSize: "0.7rem", textAlign: "center", lineHeight: 1.1 }}>
                  {i}
                  {size > 0 && i === front && <><br />front</>}
                  {size > 0 && i === back && <><br />back</>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="log" aria-live="polite">{msg}</div>
    </div>
  );
}
