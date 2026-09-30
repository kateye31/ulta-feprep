"use client";

import { useEffect, useState } from "react";

export default function Toc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-90px 0px -60% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);
  return (
    <nav className="toc" aria-label="On this page">
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} className={active === i.id ? "active" : ""}>
          {i.label}
        </a>
      ))}
    </nav>
  );
}
