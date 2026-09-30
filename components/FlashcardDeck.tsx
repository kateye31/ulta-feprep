"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import type { SectionId } from "@/lib/types";

type Card = { front: string; back: string; topic: string; emoji: string; section: SectionId };

const FILTERS: { id: SectionId | "all"; label: string }[] = [
  { id: "all", label: "🍱 Everything" },
  { id: "IA", label: "🥐 I-A" },
  { id: "IB", label: "🍵 I-B" },
  { id: "IIA", label: "☕ II-A" },
  { id: "IIB", label: "🍰 II-B" },
];

function shuffle<T>(a: T[]) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export default function FlashcardDeck({ cards }: { cards: Card[] }) {
  const [filter, setFilter] = useState<SectionId | "all">("all");
  const [deck, setDeck] = useState<Card[]>(cards);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [again, setAgain] = useState<Card[]>([]);

  const pool = useMemo(() => (filter === "all" ? cards : cards.filter((c) => c.section === filter)), [cards, filter]);

  const restart = useCallback((p: Card[], mix = true) => {
    setDeck(mix ? shuffle(p) : p);
    setI(0);
    setFlipped(false);
    setKnown(0);
    setAgain([]);
  }, []);

  useEffect(() => restart(pool), [pool, restart]);

  const done = i >= deck.length;
  const card = deck[i];

  const answer = useCallback(
    (gotIt: boolean) => {
      if (done) return;
      if (gotIt) setKnown((k) => k + 1);
      else setAgain((a) => [...a, deck[i]]);
      setFlipped(false);
      setI((x) => x + 1);
      if (i + 1 >= deck.length && gotIt && again.length === 0) confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    },
    [done, deck, i, again.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === " ") { e.preventDefault(); setFlipped((f) => !f); }
      if (e.key === "ArrowRight" && flipped) answer(true);
      if (e.key === "ArrowLeft" && flipped) answer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, flipped]);

  return (
    <div>
      <div className="controls" style={{ justifyContent: "center" }}>
        {FILTERS.map((f) => (
          <button key={f.id} className={`btn small ${filter === f.id ? "" : "secondary"}`} onClick={() => setFilter(f.id)}>{f.label}</button>
        ))}
      </div>
      <p className="center muted" style={{ fontSize: "0.9rem" }}>
        {Math.min(i + 1, deck.length)} / {deck.length} · ✅ {known} · 🔁 {again.length} · <kbd>space</kbd> flip, <kbd>←</kbd> again, <kbd>→</kbd> got it
      </p>
      <div style={{ height: 8, background: "var(--line)", borderRadius: 99, maxWidth: 560, margin: "0 auto 20px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(i / Math.max(1, deck.length)) * 100}%`, background: "var(--matcha)", transition: "width .3s" }} />
      </div>

      {!done && card ? (
        <>
          <div className="flash-wrap">
            <div className={`flash ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)} role="button" tabIndex={0} aria-label={flipped ? "Show question" : "Show answer"}>
              <div className="flash-face flash-front">
                <div>
                  <div className="chip" style={{ marginBottom: 14 }}>{card.emoji} {card.topic}</div>
                  <div>{card.front}</div>
                  <div className="hand muted" style={{ marginTop: 16, fontSize: "1.1rem" }}>tap to flip ↻</div>
                </div>
              </div>
              <div className="flash-face flash-back">
                <div>
                  <div className="chip" style={{ marginBottom: 14 }}>✨ answer</div>
                  <div>{card.back}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="controls" style={{ justifyContent: "center", marginTop: 24 }}>
            <button className="btn secondary" disabled={!flipped} onClick={() => answer(false)}>🔁 Again later</button>
            <button className="btn matcha" disabled={!flipped} onClick={() => answer(true)}>✅ Got it!</button>
          </div>
        </>
      ) : (
        <div className="card center pop-in" style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ fontSize: "3rem" }}>{again.length ? "🌱" : "🏆"}</div>
          <h2>{again.length ? "Nice round!" : "Perfect deck!"}</h2>
          <p className="muted">You knew {known} of {deck.length}.{again.length ? ` ${again.length} card(s) want another look.` : ""}</p>
          <div className="controls" style={{ justifyContent: "center" }}>
            {again.length > 0 && <button className="btn" onClick={() => restart(again)}>🔁 Review the {again.length} missed</button>}
            <button className="btn secondary" onClick={() => restart(pool)}>🔀 Shuffle &amp; restart</button>
          </div>
        </div>
      )}
    </div>
  );
}
