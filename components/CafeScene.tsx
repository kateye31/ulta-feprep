"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Mochi, Pip, Tofu } from "./characters";

gsap.registerPlugin(useGSAP);

const STARS = [
  [260, 90], [330, 150], [410, 70], [470, 130], [560, 95], [640, 160], [700, 80], [880, 70], [930, 150], [980, 110], [300, 200], [760, 190], [520, 190],
];

const BULBS = Array.from({ length: 15 }, (_, i) => {
  const t = i / 14;
  const x = 60 + t * 1080;
  const y = 22 + Math.sin(t * Math.PI * 3) * 4 + 26 * (1 - Math.pow(2 * t - 1, 2)) * 0.9;
  return { x, y, c: ["#f7d98b", "#f4b6b6", "#a8d5e2", "#c9e2b3"][i % 4] };
});

export default function CafeScene() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<SVGGElement>(".cloud").forEach((c, i) => {
          gsap.to(c, { x: i % 2 ? -70 : 80, duration: 18 + i * 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        });
        gsap.utils.toArray<SVGPathElement>(".steam").forEach((s, i) => {
          gsap.fromTo(
            s,
            { y: 10, opacity: 0, scaleX: 0.8 },
            { y: -34, opacity: 0.85, scaleX: 1.1, duration: 2.6, repeat: -1, delay: i * 0.8, ease: "sine.out", keyframes: { opacity: [0, 0.85, 0] } },
          );
        });
        gsap.utils.toArray<SVGCircleElement>(".bulb").forEach((b) => {
          gsap.to(b, { opacity: 0.45, duration: gsap.utils.random(0.8, 2.2), repeat: -1, yoyo: true, ease: "sine.inOut", delay: gsap.utils.random(0, 2) });
        });
        gsap.to(".char-mochi", { y: -5, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(".char-pip", { y: -8, rotation: 3, transformOrigin: "50% 100%", duration: 1.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(".char-tofu", { rotation: -4, transformOrigin: "50% 100%", duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(".sway", { rotation: 2.5, transformOrigin: "50% 100%", duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.4 });
        gsap.to(".sun", { scale: 1.06, transformOrigin: "50% 50%", duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(".star", { opacity: 0.25, duration: 1.4, repeat: -1, yoyo: true, stagger: { each: 0.3, from: "random" } });
        gsap.from(".scene-pop", { y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: "back.out(1.6)" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <svg ref={root} viewBox="0 0 1200 560" className="hero-scene" role="img" aria-label="A cozy café with a big arched window looking out over green hills. Mochi the cat is behind the counter, Pip the acorn sits on a stack of books, and Tofu the owl perches by a steaming mug.">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--sky-top)" />
          <stop offset="1" stopColor="var(--sky-bottom)" />
        </linearGradient>
        <clipPath id="win">
          <path d="M180 410 V210 A420 170 0 0 1 1020 210 V410 Z" />
        </clipPath>
        <radialGradient id="lamp" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0" stopColor="var(--glow)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* wall */}
      <rect width="1200" height="560" fill="var(--paper-2)" />
      <g opacity="0.35" stroke="var(--line)" strokeWidth="2">
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={i * 90} y1="0" x2={i * 90} y2="420" />
        ))}
      </g>

      {/* outside world */}
      <g clipPath="url(#win)">
        <rect x="170" y="30" width="860" height="400" fill="url(#sky)" />
        <g className="stars-g">
          {STARS.map(([x, y], i) => (
            <circle key={i} className="star" cx={x} cy={y} r={i % 3 ? 1.8 : 2.6} fill="#fff6d8" />
          ))}
        </g>
        <g className="sun">
          <circle cx="840" cy="140" r="44" fill="#ffe3a0" opacity="0.5" />
          <circle cx="840" cy="140" r="32" fill="#ffd978" />
        </g>
        <g className="moon">
          <circle cx="840" cy="140" r="30" fill="#fff4d6" />
          <circle cx="853" cy="130" r="26" fill="var(--sky-top)" />
        </g>
        {[
          [300, 110, 1],
          [560, 80, 1.3],
          [700, 170, 0.8],
          [950, 90, 1],
        ].map(([x, y, s], i) => (
          <g key={i} className="cloud" transform={`translate(${x} ${y}) scale(${s})`} opacity="0.92">
            <ellipse cx="0" cy="10" rx="58" ry="18" fill="#fffaf0" />
            <circle cx="-22" cy="2" r="20" fill="#fffaf0" />
            <circle cx="10" cy="-6" r="26" fill="#fffaf0" />
            <circle cx="36" cy="4" r="17" fill="#fffaf0" />
          </g>
        ))}
        {/* hills */}
        <path d="M170 330 C300 250 420 260 560 310 C700 360 820 250 1030 290 V430 H170 Z" fill="var(--hill-1)" />
        <path d="M170 370 C320 320 460 330 600 360 C760 395 880 320 1030 345 V430 H170 Z" fill="var(--hill-2)" />
        {/* cottage */}
        <g transform="translate(700 282)">
          <rect x="0" y="16" width="56" height="40" fill="#fbf1e0" stroke="#3d2b52" strokeWidth="2.5" />
          <path d="M-8 18 L28 -10 L64 18 Z" fill="#d98c6a" stroke="#3d2b52" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="10" y="28" width="14" height="12" fill="#f7d98b" stroke="#3d2b52" strokeWidth="2" className="cottage-win" />
          <rect x="34" y="32" width="12" height="24" fill="#9b6a43" stroke="#3d2b52" strokeWidth="2" />
          <rect x="40" y="-8" width="8" height="14" fill="#9b6a43" stroke="#3d2b52" strokeWidth="2" />
        </g>
        {/* trees */}
        <g className="sway" transform="translate(360 262)">
          <rect x="-5" y="30" width="10" height="40" fill="#9b6a43" />
          <circle cx="0" cy="18" r="30" fill="var(--hill-3)" />
          <circle cx="-16" cy="30" r="20" fill="var(--hill-3)" />
          <circle cx="16" cy="30" r="20" fill="var(--hill-3)" />
        </g>
        <g className="sway" transform="translate(920 290)">
          <rect x="-4" y="22" width="8" height="30" fill="#9b6a43" />
          <circle cx="0" cy="14" r="22" fill="var(--hill-3)" />
        </g>
        <path d="M170 400 C360 380 700 390 1030 380 V430 H170 Z" fill="var(--hill-3)" />
      </g>

      {/* window frame */}
      <path d="M180 410 V210 A420 170 0 0 1 1020 210 V410" fill="none" stroke="var(--wood)" strokeWidth="20" />
      <path d="M600 42 V410 M180 250 H1020" stroke="var(--wood)" strokeWidth="10" />
      <path d="M180 410 V210 A420 170 0 0 1 1020 210 V410" fill="none" stroke="var(--wood-dark)" strokeWidth="3" />

      {/* hanging plant */}
      <g className="sway deco">
        <path d="M120 0 V120" stroke="var(--wood-dark)" strokeWidth="2" />
        <path d="M96 118 h48 l-6 30 h-36 z" fill="#d98c6a" stroke="#3d2b52" strokeWidth="2.5" />
        <path d="M104 120 C90 150 96 190 86 220 M120 120 C118 160 126 190 118 240 M136 120 C150 150 146 180 156 206" fill="none" stroke="#7fae74" strokeWidth="3" />
        {[[92, 160], [88, 200], [120, 170], [122, 214], [150, 160], [152, 196]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="9" ry="5" fill="#8db580" stroke="#3d2b52" strokeWidth="1.5" transform={`rotate(${i % 2 ? 30 : -30} ${x} ${y})`} />
        ))}
      </g>

      {/* string lights */}
      <path d={`M40 18 ${BULBS.map((b) => `L${b.x} ${b.y}`).join(" ")} L1160 18`} fill="none" stroke="#3d2b52" strokeWidth="2" />
      {BULBS.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y + 12} r="18" fill="url(#lamp)" />
          <rect x={b.x - 3} y={b.y} width="6" height="5" fill="#3d2b52" />
          <circle className="bulb" cx={b.x} cy={b.y + 11} r="6.5" fill={b.c} stroke="#3d2b52" strokeWidth="1.5" />
        </g>
      ))}

      {/* Mochi behind the counter */}
      <g className="char-mochi scene-pop">
        <g transform="translate(520 250)">
          <Mochi size={160} />
        </g>
      </g>

      {/* counter */}
      <rect x="0" y="412" width="1200" height="148" fill="var(--wood)" />
      <rect x="0" y="404" width="1200" height="16" rx="4" fill="var(--wood-dark)" />
      <g opacity="0.25" stroke="#3d2b52" strokeWidth="2">
        <path d="M0 470 H1200 M0 520 H1200" />
        <path d="M200 420 V470 M520 470 V520 M860 420 V470 M340 520 V560 M1000 520 V560" />
      </g>

      {/* chalkboard sign */}
      <g transform="translate(470 440)" className="scene-pop">
        <rect width="260" height="86" rx="10" fill="#33412f" stroke="#9b6a43" strokeWidth="6" />
        <text x="130" y="36" textAnchor="middle" fill="#f4efe2" fontSize="22" fontFamily="var(--font-hand)">today&apos;s special</text>
        <text x="130" y="66" textAnchor="middle" fill="#f7d98b" fontSize="24" fontFamily="var(--font-hand)">recursion cake 🍰</text>
      </g>

      {/* potted plant */}
      <g transform="translate(120 330)" className="scene-pop">
        <g className="sway">
          <path d="M30 50 C10 20 0 10 6 -10 C22 4 30 24 30 50" fill="#8db580" stroke="#3d2b52" strokeWidth="2" />
          <path d="M34 50 C50 16 64 8 70 -6 C74 18 56 36 34 50" fill="#7fae74" stroke="#3d2b52" strokeWidth="2" />
          <path d="M32 50 C30 20 36 0 30 -24 C46 -6 42 26 32 50" fill="#9cc58e" stroke="#3d2b52" strokeWidth="2" />
        </g>
        <path d="M6 48 h56 l-8 36 h-40 z" fill="#d98c6a" stroke="#3d2b52" strokeWidth="2.5" />
      </g>

      {/* Tofu on the counter */}
      <g className="char-tofu scene-pop">
        <g transform="translate(240 316)">
          <Tofu size={100} />
        </g>
      </g>

      {/* mug + steam */}
      <g transform="translate(780 348)" className="scene-pop">
        <path className="steam" d="M18 0 c-8 -10 8 -18 0 -30" fill="none" stroke="var(--ink-faint)" strokeWidth="3" strokeLinecap="round" />
        <path className="steam" d="M32 0 c-8 -10 8 -18 0 -30" fill="none" stroke="var(--ink-faint)" strokeWidth="3" strokeLinecap="round" />
        <path className="steam" d="M46 0 c-8 -10 8 -18 0 -30" fill="none" stroke="var(--ink-faint)" strokeWidth="3" strokeLinecap="round" />
        <path d="M60 22 c18 0 18 26 0 26" fill="none" stroke="#3d2b52" strokeWidth="5" />
        <path d="M60 22 c18 0 18 26 0 26" fill="none" stroke="#f4b6b6" strokeWidth="2.5" />
        <path d="M4 8 h60 v34 a14 14 0 0 1 -14 14 h-32 a14 14 0 0 1 -14 -14 z" fill="#f4b6b6" stroke="#3d2b52" strokeWidth="3" />
        <path d="M24 30 c4 -6 12 -6 12 0 c0 -6 8 -6 12 0 c-2 8 -12 12 -12 14 c0 -2 -10 -6 -12 -14z" fill="#fff" opacity="0.85" />
      </g>

      {/* books + Pip */}
      <g transform="translate(880 340)" className="scene-pop">
        <rect x="0" y="48" width="120" height="22" rx="4" fill="#a8d5e2" stroke="#3d2b52" strokeWidth="2.5" />
        <rect x="8" y="26" width="104" height="22" rx="4" fill="#f7d98b" stroke="#3d2b52" strokeWidth="2.5" />
        <rect x="-4" y="4" width="112" height="22" rx="4" fill="#c9b6e4" stroke="#3d2b52" strokeWidth="2.5" />
        <text x="54" y="20" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3d2b52">CS 1</text>
        <text x="60" y="42" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3d2b52">BIG-O</text>
        <text x="60" y="64" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3d2b52">TREES</text>
      </g>
      <g className="char-pip">
        <g transform="translate(910 262)">
          <Pip size={86} />
        </g>
      </g>
    </svg>
  );
}
