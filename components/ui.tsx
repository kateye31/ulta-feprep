import type { ReactNode } from "react";

type Kind = "tip" | "warn" | "info" | "fun" | "gold";
const ICON: Record<Kind, string> = { tip: "🌱", warn: "🚨", info: "💡", fun: "✨", gold: "⭐" };

export function Callout({ kind = "info", title, icon, children }: { kind?: Kind; title?: ReactNode; icon?: string; children: ReactNode }) {
  return (
    <div className={`callout ${kind}`}>
      <span className="callout-icon" aria-hidden>
        {icon ?? ICON[kind]}
      </span>
      {title && <span className="callout-title">{title}</span>}
      {children}
    </div>
  );
}

/** A little emoji "picture" row with labels under each item. Handy for analogies. */
export function EmojiRow({ items }: { items: [string, string][] }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end" }}>
      {items.map(([e, l], i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.2rem", lineHeight: 1.1 }}>{e}</div>
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--ink-soft)", lineHeight: 1.3 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

/** Colored highlight word, like a highlighter pen. */
export function Hi({ children, c = "butter" }: { children: ReactNode; c?: "butter" | "matcha" | "blush" | "sky" | "lavender" }) {
  return (
    <mark style={{ background: `var(--${c}-soft)`, color: "inherit", padding: "0 4px", borderRadius: 6, boxShadow: `inset 0 -3px 0 var(--${c})` }}>
      {children}
    </mark>
  );
}
