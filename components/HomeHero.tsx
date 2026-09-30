"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CafeScene from "./CafeScene";

gsap.registerPlugin(useGSAP);

export default function HomeHero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "back.out(1.7)" } });
        tl.from(".hero-title .word", { y: 40, opacity: 0, rotate: () => gsap.utils.random(-12, 12), duration: 0.7, stagger: 0.08 })
          .from(".hero-sub", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
          .from(".hero-cta > *", { y: 20, opacity: 0, scale: 0.8, duration: 0.5, stagger: 0.1 }, "-=0.2")
          .from(".hero-scene-wrap", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.2);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const title = ["Welcome", "to", "FE", "Café ☕"];

  return (
    <section className="hero" ref={root}>
      <div className="wrap hero-copy">
        <div>
          <span className="eyebrow">a cozy study spot for UCF&apos;s Foundation Exam</span>
          <h1 className="hero-title">
            {title.map((w, i) => (
              <span key={i} className="word" style={{ marginRight: "0.25em", color: w.startsWith("Café") ? "var(--accent)" : undefined, whiteSpace: "nowrap" }}>
                {w}
              </span>
            ))}
          </h1>
          <p className="hero-sub" style={{ fontSize: "1.15rem", maxWidth: 560 }}>
            COP 3502 turned into bite-sized pastries: <b>pictures first</b>, then baby steps, then exam level. With analogies, memory tricks, playgrounds you can poke,
            and all the <b>missing puzzle pieces</b> lectures skip. 🧩
          </p>
          <div className="hero-cta controls" style={{ marginTop: 20 }}>
            <Link href="/plan" className="btn">🧭 My Plan</Link>
            <Link href="/studio" className="btn secondary">💻 Code Studio</Link>
            <Link href="/menu" className="btn secondary">📜 Menu</Link>
          </div>
        </div>
        <div className="card" style={{ background: "var(--butter-soft)", borderColor: "var(--butter)" }}>
          <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>🧠 Made for ADHD brains</strong>
          <ul style={{ margin: "10px 0 0" }}>
            <li><b>TL;DR first</b>, then go only as deep as you want</li>
            <li><b>One idea per card</b>, color-coded and emoji-tagged</li>
            <li><b>Step-by-step reveals</b>, never a wall of text</li>
            <li>🍅 <b>Brew timer</b>, 🌧 <b>rain sounds</b> &amp; 🎯 <b>focus mode</b> (bottom-right corner!)</li>
            <li>🐾 <b>Stamps</b> for every topic you finish. Dopamine included.</li>
          </ul>
        </div>
      </div>
      <div className="wrap hero-scene-wrap" style={{ marginTop: 10 }}>
        <div style={{ borderRadius: 30, overflow: "hidden", border: "3px solid var(--ink)", boxShadow: "0 8px 0 var(--ink)" }}>
          <CafeScene />
        </div>
      </div>
    </section>
  );
}
