"use client";

import { useId, type ReactNode } from "react";

/**
 * Inked props for the café. A tiny displacement filter wobbles every line
 * so they sit next to the hand-drawn Open Doodles without looking machine-made.
 */
function Ink({ vb, children, label }: { vb: string; children: ReactNode; label: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox={vb} role="img" aria-label={label} style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}>
      <defs>
        <filter id={`ink${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="2.2" />
        </filter>
        <radialGradient id={`glow${id}`}>
          <stop offset="0" stopColor="#f6c97c" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f6c97c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter={`url(#ink${id})`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
      {/* glows sit outside the wobble filter */}
      <g style={{ mixBlendMode: "screen" }}>{GLOWS[label]?.(`url(#glow${id})`)}</g>
    </svg>
  );
}

const GLOWS: Record<string, (fill: string) => ReactNode> = {
  "Floor lamp": (f) => <circle cx="30" cy="34" r="44" fill={f} />,
  "Candle trio": (f) => <circle cx="40" cy="22" r="34" fill={f} />,
  "String lights": (f) => (
    <>
      {[20, 70, 120, 170, 220, 270].map((x, i) => (
        <circle key={x} cx={x + 10} cy={[22, 33, 38, 38, 33, 22][i] + 10} r="16" fill={f} />
      ))}
    </>
  ),
};

const AMBER = "#f2b766";
const LAV = "#b9a1f2";
const MINT = "#8fd9b6";
const CORAL = "#f19a8e";
const SKY = "#8cc3ee";

export const DRAW: Record<string, () => ReactNode> = {
  lamp: () => (
    <Ink vb="0 0 60 170" label="Floor lamp">
      <path d="M14 10 L46 10 L54 42 L6 42 Z" fill={AMBER} fillOpacity="0.85" />
      <path d="M30 42 L30 158" />
      <path d="M12 164 Q30 154 48 164" />
      <path d="M22 26 h16" opacity="0.5" />
    </Ink>
  ),
  candles: () => (
    <Ink vb="0 0 80 70" label="Candle trio">
      <rect x="10" y="34" width="14" height="32" rx="3" fill="#efe5d3" fillOpacity="0.9" />
      <rect x="33" y="22" width="14" height="44" rx="3" fill="#efe5d3" fillOpacity="0.9" />
      <rect x="56" y="40" width="14" height="26" rx="3" fill="#efe5d3" fillOpacity="0.9" />
      {[[17, 34], [40, 22], [63, 40]].map(([x, y]) => (
        <path key={x} d={`M${x} ${y - 3} C ${x - 5} ${y - 9}, ${x} ${y - 16}, ${x} ${y - 18} C ${x} ${y - 16}, ${x + 5} ${y - 9}, ${x} ${y - 3}`} fill={AMBER} stroke={AMBER} />
      ))}
    </Ink>
  ),
  frame: () => (
    <Ink vb="0 0 90 70" label="I love arrows frame">
      <rect x="4" y="4" width="82" height="62" rx="3" />
      <rect x="11" y="11" width="68" height="48" rx="2" fill={LAV} fillOpacity="0.18" />
      <text x="45" y="42" textAnchor="middle" fontFamily="var(--a-hand)" fontSize="20" fill="currentColor" stroke="none">
        I ♥ -&gt;
      </text>
      <path d="M45 4 L45 -8 M38 -2 L45 -8 L52 -2" opacity="0.6" />
    </Ink>
  ),
  rug: () => (
    <Ink vb="0 0 300 70" label="Round rug">
      <ellipse cx="150" cy="35" rx="140" ry="28" fill="#6c55a8" fillOpacity="0.55" />
      <ellipse cx="150" cy="35" rx="108" ry="19" strokeDasharray="6 7" opacity="0.7" />
      <ellipse cx="150" cy="35" rx="60" ry="9" opacity="0.5" />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 18 + i * 20;
        return <path key={i} d={`M${x} ${57 + Math.sin(i) * 2} l-2 7`} opacity="0.6" />;
      })}
    </Ink>
  ),
  mug: () => (
    <Ink vb="0 0 50 60" label="Steaming mug">
      <path d="M8 26 h26 v22 a8 8 0 0 1 -8 8 h-10 a8 8 0 0 1 -8 -8 Z" fill={CORAL} fillOpacity="0.8" />
      <path d="M34 31 h4 a6 6 0 0 1 0 12 h-4" />
      <path d="M16 20 c-4 -5 4 -8 0 -14 M25 20 c-4 -5 4 -8 0 -14" opacity="0.6" />
    </Ink>
  ),
  lights: () => (
    <Ink vb="0 0 300 60" label="String lights">
      <path d="M0 6 Q150 64 300 6" />
      {[20, 70, 120, 170, 220, 270].map((x, i) => {
        const y = [22, 33, 38, 38, 33, 22][i];
        return <ellipse key={x} cx={x + 10} cy={y + 10} rx="6" ry="8" fill={[AMBER, LAV, MINT, AMBER, CORAL, SKY][i]} />;
      })}
    </Ink>
  ),
  clock: () => (
    <Ink vb="0 0 70 70" label="Wall clock">
      <circle cx="35" cy="35" r="30" fill="#efe5d3" fillOpacity="0.92" />
      <path d="M35 35 L35 16 M35 35 L48 41" stroke="#2b2236" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <path key={i} d={`M${35 + Math.sin(a) * 24} ${35 - Math.cos(a) * 24} L${35 + Math.sin(a) * 27} ${35 - Math.cos(a) * 27}`} stroke="#2b2236" />;
      })}
    </Ink>
  ),
  cat: () => (
    <Ink vb="0 0 110 60" label="Sleepy cat">
      <path d="M14 50 C 8 30, 30 16, 56 18 C 82 20, 98 32, 96 50 Z" fill="#d9a46a" fillOpacity="0.85" />
      <path d="M22 30 L18 14 L32 24 M40 20 L44 8 L50 20" fill="#d9a46a" fillOpacity="0.85" />
      <path d="M26 34 q4 3 8 0 M38 32 q4 3 8 0" />
      <path d="M96 50 C 108 46, 108 30, 96 34" />
      <path d="M50 40 q10 -6 20 0 M60 46 q10 -6 20 0" opacity="0.5" />
      <text x="70" y="12" fontFamily="var(--a-hand)" fontSize="14" fill="currentColor" stroke="none" opacity="0.8">
        z z
      </text>
    </Ink>
  ),
  chalk: () => (
    <Ink vb="0 0 100 140" label="Chalkboard menu">
      <path d="M20 60 L8 136 M80 60 L92 136 M50 60 L50 136" />
      <rect x="4" y="4" width="92" height="70" rx="4" fill="#20302b" />
      <g stroke="#efe5d3" strokeWidth="1.6">
        <text x="50" y="24" textAnchor="middle" fontFamily="var(--a-hand)" fontSize="15" fill="#efe5d3" stroke="none">
          today:
        </text>
        <text x="50" y="44" textAnchor="middle" fontFamily="var(--a-hand)" fontSize="17" fill="#efe5d3" stroke="none">
          heaps ☕
        </text>
        <path d="M24 56 q26 6 52 0" />
      </g>
    </Ink>
  ),
  record: () => (
    <Ink vb="0 0 120 110" label="Record player">
      <path d="M14 56 L14 106 M106 56 L106 106" />
      <rect x="6" y="30" width="108" height="28" rx="4" fill={LAV} fillOpacity="0.35" />
      <ellipse cx="54" cy="30" rx="36" ry="9" fill="#14101c" />
      <ellipse cx="54" cy="30" rx="10" ry="3" fill={CORAL} />
      <path d="M98 22 L98 34 L74 32" />
      <path d="M30 4 q4 4 0 8 M40 -2 q4 4 0 8" opacity="0.6" />
      <text x="88" y="10" fontFamily="var(--a-hand)" fontSize="14" fill="currentColor" stroke="none">
        ♪
      </text>
    </Ink>
  ),
  shelf: () => (
    <Ink vb="0 0 120 170" label="Bookshelf">
      <rect x="6" y="20" width="108" height="146" rx="3" fill="#3a2b45" fillOpacity="0.6" />
      <path d="M6 66 h108 M6 114 h108" />
      {[
        [12, 30, 10, CORAL], [24, 26, 12, AMBER], [38, 34, 9, LAV], [49, 28, 13, MINT], [64, 32, 10, SKY], [92, 40, 8, CORAL],
        [12, 76, 14, LAV], [28, 80, 10, MINT], [40, 74, 12, AMBER], [70, 82, 10, CORAL], [82, 76, 12, SKY],
        [14, 124, 12, AMBER], [28, 128, 10, CORAL], [40, 122, 14, LAV], [86, 126, 10, MINT],
      ].map(([x, y, w, c], i) => (
        <rect key={i} x={x as number} y={y as number} width={w as number} height={(y as number) < 66 ? 66 - (y as number) : (y as number) < 114 ? 114 - (y as number) : 166 - (y as number)} fill={c as string} fillOpacity="0.8" />
      ))}
      <path d="M66 166 L66 162 M76 64 q6 -10 12 0" />
      <path d="M86 20 C 84 8, 96 2, 100 10 C 104 2, 112 10, 104 16 M96 20 L96 12" stroke={MINT} />
      <rect x="88" y="10" width="16" height="10" rx="2" fill={CORAL} fillOpacity="0.8" />
    </Ink>
  ),
};

export function DecorArt({ draw }: { draw: string }) {
  return <>{DRAW[draw]?.()}</>;
}
