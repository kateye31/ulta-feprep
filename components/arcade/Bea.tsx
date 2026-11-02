"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import type { Mood } from "@/lib/arcade/types";
import { Peep } from "./Art";
import { inline } from "./Rich";

export type BeaMsg = { text: string; mood: Mood; sticky: boolean; n: number };

/** Bea the barista pops up from the corner with hints and cheers. */
export function Bea({ msg, onClose }: { msg: BeaMsg | null; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  // rendered into <body> so nothing on the page can paint over her
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setHost(document.body);
  }, []);

  useEffect(() => {
    if (!msg || !root.current) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current;
    const tl = gsap.timeline();
    if (!calm) {
      tl.fromTo(el.querySelector(".cameo"), { y: 70, rotate: -8 }, { y: 0, rotate: 0, duration: 0.5, ease: "back.out(2)" });
      tl.fromTo(el.querySelector(".bea-bubble"), { opacity: 0, x: -10, scale: 0.92, transformOrigin: "0% 100%" }, { opacity: 1, x: 0, scale: 1, duration: 0.35, ease: "back.out(2.2)" }, "-=0.25");
    }
    let t: ReturnType<typeof setTimeout> | undefined;
    if (!msg.sticky) t = setTimeout(onClose, 6500);
    return () => {
      tl.kill();
      if (t) clearTimeout(t);
    };
  }, [msg, onClose]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!msg || !host) return null;
  return createPortal(
    <div className="bea arcade-portal" ref={root} role="status" aria-live="polite">
      <Peep who="bea" mood={msg.mood} size={92} />
      <div className="bea-bubble">
        <span className="bea-name">Bea</span>
        {inline(msg.text)}
        <button className="x" onClick={onClose} aria-label="Dismiss Bea">
          ✕
        </button>
      </div>
    </div>,
    host,
  );
}
