"use client";

import Link from "next/link";
import confetti from "canvas-confetti";
import { useStamps } from "@/lib/progress";

export function StampButton({ slug }: { slug: string }) {
  const { has, toggle } = useStamps();
  const done = has(slug);
  return (
    <button
      className={`btn ${done ? "matcha" : ""}`}
      onClick={(e) => {
        if (!done) {
          const r = e.currentTarget.getBoundingClientRect();
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { x: (r.left + r.width / 2) / innerWidth, y: r.top / innerHeight },
            colors: ["#d98c6a", "#f2c95f", "#7fae74"],
          });
        }
        toggle(slug);
      }}
    >
      {done ? "✅ Stamped! (got it)" : "🐾 Stamp my card"}
    </button>
  );
}

export function DoneBadge({ slug }: { slug: string }) {
  const { has } = useStamps();
  return has(slug) ? (
    <span className="done-badge" title="Stamped!">
      🐾
    </span>
  ) : null;
}

export function MenuCheck({ slug }: { slug: string }) {
  const { has } = useStamps();
  return (
    <span className="check" aria-label={has(slug) ? "done" : "not yet"}>
      {has(slug) ? "🐾" : "·"}
    </span>
  );
}

export function LoyaltyCard({ topics }: { topics: { slug: string; emoji: string; short: string }[] }) {
  const { stamps, reset } = useStamps();
  const n = topics.filter((t) => stamps.includes(t.slug)).length;
  return (
    <div className="loyalty">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8, marginBottom: 14, position: "relative", zIndex: 1 }}>
        <div>
          <h3 style={{ margin: 0 }}>🐾 Loyalty Card</h3>
          <span className="muted" style={{ fontSize: "0.9rem" }}>
            Stamp a topic once you could explain it to a friend.
          </span>
        </div>
        <span className="hand" style={{ color: "var(--accent)" }}>
          {n} / {topics.length} {n === topics.length ? "🎉 free cake!" : "stamps"}
        </span>
      </div>
      <div className="stamps" style={{ position: "relative", zIndex: 1 }}>
        {topics.map((t) => (
          <Link key={t.slug} href={`/topics/${t.slug}`} className={`stamp ${stamps.includes(t.slug) ? "done" : ""}`} title={t.short}>
            <span>{t.emoji}</span>
          </Link>
        ))}
      </div>
      {n > 0 && (
        <button className="btn small secondary" style={{ marginTop: 14, position: "relative", zIndex: 1 }} onClick={() => confirm("Wipe all stamps?") && reset()}>
          ↺ Reset card
        </button>
      )}
    </div>
  );
}
