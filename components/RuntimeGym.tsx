"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import type { GymQ } from "@/content/runtime-gym";
import { KEYS, persist, readLocal, ready } from "@/lib/persist";

const BEST_KEY = KEYS.gymBest;
const LEVELS = [
  { id: 0, label: "🍱 All" },
  { id: 1, label: "🌱 Warm-up" },
  { id: 2, label: "🌿 Tricky" },
  { id: 3, label: "🌳 Exam-level" },
];

function shuffle<T>(a: T[]) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export default function RuntimeGym({ questions }: { questions: GymQ[] }) {
  const [level, setLevel] = useState(0);
  const pool = useMemo(() => (level ? questions.filter((q) => q.level === level) : questions), [questions, level]);
  const [order, setOrder] = useState<GymQ[]>(pool);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const [right, setRight] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    ready().then(() => setBest(+(readLocal(BEST_KEY) ?? 0)));
  }, []);

  useEffect(() => {
    setOrder(shuffle(pool));
    setI(0);
    setPicked(null);
    setHint(false);
    setRight(0);
    setStreak(0);
  }, [pool]);

  const q = order[i];
  const done = i >= order.length;

  const choose = (c: string) => {
    if (picked) return;
    setPicked(c);
    if (c === q.answer) {
      setRight((r) => r + 1);
      const s = streak + 1;
      setStreak(s);
      if (s > best) {
        setBest(s);
        persist(BEST_KEY, String(s));
      }
      if (s > 0 && s % 5 === 0) confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors: ["#c2a9f2", "#f39cbd", "#f7d77f"] });
    } else setStreak(0);
  };

  const next = () => {
    setI(i + 1);
    setPicked(null);
    setHint(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!q || done) return;
      if (!picked && /^[1-4]$/.test(e.key)) choose(q.choices[+e.key - 1]);
      if (picked && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div>
      <div className="controls" style={{ justifyContent: "center" }}>
        {LEVELS.map((l) => (
          <button key={l.id} className={`btn small ${level === l.id ? "" : "secondary"}`} onClick={() => setLevel(l.id)}>
            {l.label}
          </button>
        ))}
      </div>
      <div className="controls" style={{ justifyContent: "center", gap: 14 }}>
        <span className="chip">✅ {right} / {Math.min(i + (picked ? 1 : 0), order.length)}</span>
        <span className="chip">🔥 streak {streak}</span>
        <span className="chip">🏆 best {best}</span>
        <span className="chip">
          {Math.min(i + 1, order.length)} of {order.length}
        </span>
      </div>

      {!done && q ? (
        <div className="card pop-in" key={q.id} style={{ maxWidth: 760, margin: "10px auto 0" }}>
          <p style={{ fontWeight: 700, margin: "0 0 6px" }}>⏱ What&apos;s the Big-O runtime{/\bm\b/.test(q.code) ? " (in terms of n and m)" : ""}?</p>
          <div className="code">
            <pre>
              <code style={{ background: "none", border: "none", padding: 0, color: "inherit", fontSize: "inherit" }}>{q.code}</code>
            </pre>
          </div>
          <div className="quiz-choices" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
            {q.choices.map((c, k) => {
              const cls = !picked ? "" : c === q.answer ? "right" : c === picked ? "wrong" : "";
              return (
                <button key={c} className={`quiz-choice ${cls}`} disabled={!!picked} onClick={() => choose(c)} style={{ justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "1.05rem" }}>
                  <span className="muted" style={{ fontSize: "0.75rem" }}>{k + 1}</span> {c}
                </button>
              );
            })}
          </div>
          {!picked && !hint && (
            <button className="btn small secondary" style={{ marginTop: 12 }} onClick={() => setHint(true)}>
              🧠 hint please
            </button>
          )}
          {hint && !picked && <div className="callout info" style={{ marginBottom: 0 }}><span className="callout-icon">🧠</span>{q.hint}</div>}
          {picked && (
            <div className={`callout ${picked === q.answer ? "tip" : "warn"} pop-in`} style={{ marginBottom: 0 }}>
              <span className="callout-icon">{picked === q.answer ? "🎉" : "🌧"}</span>
              <span className="callout-title">{picked === q.answer ? "Yes!" : `It's ${q.answer}`}</span>
              {q.why}
              <div style={{ marginTop: 10 }}>
                <button className="btn small" onClick={next}>
                  Next → <kbd style={{ background: "transparent", color: "inherit", borderColor: "currentColor" }}>Enter</kbd>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card center pop-in" style={{ maxWidth: 520, margin: "10px auto 0" }}>
          <div style={{ fontSize: "3rem" }}>{right === order.length ? "🏆" : "🌱"}</div>
          <h2>
            {right} / {order.length}
          </h2>
          <p className="muted">
            {right === order.length
              ? "Perfect! You can SEE runtime now."
              : "Every miss is a pattern to remember. Read the explanations again tomorrow. Spaced practice wins."}
          </p>
          <button
            className="btn"
            onClick={() => {
              setOrder(shuffle(pool));
              setI(0);
              setRight(0);
              setStreak(0);
            }}
          >
            🔀 Go again
          </button>
        </div>
      )}
    </div>
  );
}
