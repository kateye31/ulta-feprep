"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const KINDS = ["🌸", "🪻", "✨", "🫧", "🍃", "💜"];

/** A few leaves & petals drifting down the page. Hidden in focus mode / reduced motion. */
export default function Leaves() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".leaf").forEach((leaf, i) => {
          const fall = () => {
            gsap.set(leaf, { x: gsap.utils.random(0, window.innerWidth), y: -40, rotation: gsap.utils.random(0, 360), opacity: 0.75 });
            gsap.to(leaf, {
              y: window.innerHeight + 60,
              duration: gsap.utils.random(14, 24),
              ease: "none",
              onComplete: fall,
            });
            gsap.to(leaf, { x: `+=${gsap.utils.random(-140, 140)}`, rotation: `+=${gsap.utils.random(-200, 200)}`, duration: gsap.utils.random(4, 7), repeat: 4, yoyo: true, ease: "sine.inOut" });
          };
          gsap.delayedCall(i * 2.6, fall);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div className="ambient" ref={root} aria-hidden>
      {KINDS.map((k, i) => (
        <span key={i} className="leaf" style={{ opacity: 0 }}>
          {k}
        </span>
      ))}
    </div>
  );
}
