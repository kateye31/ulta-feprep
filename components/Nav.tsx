"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CozyDock from "./CozyDock";
import { IconChevron, IconClose, IconMenu } from "./icons";

/** The zine's masthead: the name in hand lettering, sections as pill tabs. */
const MAIN = [
  { href: "/", label: "Today" },
  { href: "/menu", label: "Topics" },
  { href: "/arcade", label: "Night Shift" },
  { href: "/studio", label: "Studio" },
  { href: "/calendar", label: "Calendar" },
];
const MORE = [
  { href: "/recipes", label: "Recipes" },
  { href: "/arcade/fe100", label: "FE 100" },
  { href: "/analytics", label: "Analytics" },
  { href: "/plan", label: "My Plan" },
  { href: "/journal", label: "Journal" },
  { href: "/runtime", label: "Runtime Gym" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/cheatsheet", label: "Cheat Sheet" },
  { href: "/exams", label: "Past Exams" },
  { href: "/print", label: "Paper Practice" },
  { href: "/library", label: "Library" },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const more = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    setOpen(false);
    if (more.current) more.current.open = false;
  }, [path]);

  const cur = (href: string) => (href === "/" ? path === "/" : path.startsWith(href)) ? "page" : undefined;

  return (
    <header className="nav">
      <nav className="wrap nav-inner" aria-label="Main">
        <Link href="/" className="brand">
          FE Café
        </Link>
        <button className="nav-menu-btn" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <IconClose /> : <IconMenu />}
        </button>
        <div className="nav-links" data-open={open}>
          {MAIN.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link" aria-current={cur(l.href)}>
              {l.label}
            </Link>
          ))}
          <details className="nav-more" ref={more}>
            <summary className="nav-link" aria-current={MORE.some((m) => cur(m.href)) ? "page" : undefined}>
              More <IconChevron size={16} />
            </summary>
            <div className="nav-more-menu">
              {MORE.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link" aria-current={cur(l.href)}>
                  {l.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
        <CozyDock />
      </nav>
    </header>
  );
}
