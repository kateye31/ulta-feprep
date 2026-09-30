"use client";

import { useEffect, useState } from "react";

const DATE_KEY = "fe-cafe-exam-date";

const PHASES = [
  { share: 0.35, emoji: "🧱", name: "Build it yourself", what: "Studio drills: linked list, BST, heap, bitwise. Runtime Gym every day. Re-read one topic per day (TL;DR + worked problem)." },
  { share: 0.4, emoji: "📄", name: "Past-exam parts", what: "One exam PART per session (like I-B only), hand-written, then graded with the solutions. Log every question in the Journal." },
  { share: 0.2, emoji: "⏱", name: "Full timed exams", what: "Whole past exams under real time, once or twice a week. Redo every miss in the Studio the next day." },
  { share: 0.05, emoji: "🌙", name: "Rest & review", what: "Cheat sheet + flashcards only. Sleep. Eat. You've done the work. 💜" },
];

export function ExamCountdown() {
  const [date, setDate] = useState("");
  useEffect(() => {
    try {
      setDate(localStorage.getItem(DATE_KEY) ?? "");
    } catch {}
  }, []);
  const save = (d: string) => {
    setDate(d);
    try {
      localStorage.setItem(DATE_KEY, d);
    } catch {}
  };

  const days = date ? Math.ceil((new Date(date + "T09:00:00").getTime() - Date.now()) / 86400000) : null;
  const weeks = days != null ? Math.max(1, Math.round(days / 7)) : 14;

  let cum = 0;
  let prevEnd = 0;
  const phases = PHASES.map((p) => {
    cum += p.share;
    const end = Math.min(weeks, Math.round(cum * weeks));
    const from = prevEnd + 1;
    prevEnd = Math.max(prevEnd, end);
    return { ...p, from, to: end };
  });

  return (
    <div>
      <div className="controls" style={{ alignItems: "center" }}>
        <label style={{ fontWeight: 700 }}>
          📅 My next exam date:{" "}
          <input type="date" className="input" style={{ width: "auto" }} value={date} onChange={(e) => save(e.target.value)} />
        </label>
        {days != null && days >= 0 && (
          <span className="chip" style={{ fontSize: "1rem", background: "var(--lavender-soft)", borderColor: "var(--lavender)" }}>
            ⏳ {days} days · about {weeks} weeks
          </span>
        )}
        {days != null && days < 0 && <span className="chip">That date has passed. Set the next one! 🌱</span>}
      </div>
      {!date && <p className="muted" style={{ fontSize: "0.9rem" }}>Set the date (check the UCF registration page) and the plan below scales to fit. Until then it assumes ~14 weeks.</p>}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", marginTop: 10 }}>
        {phases.map((p, i) => (
          <div key={i} className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: "1.8rem" }}>{p.emoji}</div>
            <h3 style={{ margin: "4px 0" }}>{p.name}</h3>
            <span className="chip" style={{ marginBottom: 8 }}>
              {p.from > p.to ? "squeeze it in" : p.from === p.to ? `week ${p.from}` : `weeks ${p.from}–${p.to}`}
            </span>
            <p className="muted" style={{ margin: "8px 0 0", fontSize: "0.92rem" }}>{p.what}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReadChecklist({ items }: { items: string[] }) {
  const [on, setOn] = useState<boolean[]>(() => items.map(() => false));
  const all = on.every(Boolean);
  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
        {items.map((t, i) => (
          <li key={i} style={{ margin: 0 }}>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", padding: "8px 12px", borderRadius: 12, background: on[i] ? "var(--matcha-soft)" : "var(--card)", border: "2px solid", borderColor: on[i] ? "var(--matcha)" : "var(--line)", transition: "all .2s" }}>
              <input type="checkbox" checked={on[i]} onChange={() => setOn(on.map((v, k) => (k === i ? !v : v)))} style={{ marginTop: 5, accentColor: "var(--accent)" }} />
              <span style={{ textDecoration: on[i] ? "line-through" : undefined, opacity: on[i] ? 0.7 : 1 }}>{t}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="controls" style={{ marginTop: 10 }}>
        {all ? <span className="hand" style={{ color: "var(--matcha)" }}>✨ All checked. Now hand it in with confidence!</span> : <span className="muted" style={{ fontSize: "0.9rem" }}>Tick these off for every coding question you practice.</span>}
        <button className="btn small secondary" onClick={() => setOn(items.map(() => false))}>↺ reset</button>
      </div>
    </div>
  );
}
