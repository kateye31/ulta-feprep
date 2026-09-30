"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MAIN = [
  { href: "/menu", label: "📜 Menu" },
  { href: "/studio", label: "💻 Studio" },
  { href: "/plan", label: "🧭 My Plan" },
  { href: "/journal", label: "📓 Journal" },
  { href: "/runtime", label: "⏱ Runtime Gym" },
];
const MORE = [
  { href: "/cheatsheet", label: "🧾 Cheat Sheet" },
  { href: "/flashcards", label: "🃏 Flashcards" },
  { href: "/exams", label: "📚 Past Exams" },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const more = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    setOpen(false);
    if (more.current) more.current.open = false;
  }, [path]);
  useEffect(() => setDark(document.documentElement.dataset.theme === "dark"), []);

  const toggleTheme = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("fe-cafe-theme", next);
    } catch {}
    setDark(!dark);
  };

  const cur = (href: string) => (path.startsWith(href) ? "page" : undefined);

  return (
    <header className="nav">
      <nav className="wrap nav-inner" aria-label="Main">
        <Link href="/" className="brand">
          <span className="brand-cup" aria-hidden>☕</span> FE Café
        </Link>
        <button className="icon-btn nav-menu-btn" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>
        <div className="nav-links" data-open={open}>
          {MAIN.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link" aria-current={cur(l.href)}>
              {l.label}
            </Link>
          ))}
          <details className="nav-more" ref={more}>
            <summary className="nav-link" aria-current={MORE.some((m) => cur(m.href)) ? "page" : undefined}>
              ✨ More ▾
            </summary>
            <div className="nav-more-menu">
              {MORE.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link" aria-current={cur(l.href)}>
                  {l.label}
                </Link>
              ))}
            </div>
          </details>
          <button className="icon-btn" onClick={toggleTheme} aria-label={dark ? "Switch to day café" : "Switch to night café"} title={dark ? "Day café" : "Night café"}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>
    </header>
  );
}
