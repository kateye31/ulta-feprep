"use client";

import { useEffect, useState } from "react";

/**
 * Public-domain artworks (museum open-access collections, credited in public/art/pd/credits.json),
 * "printed" in one spot ink on cream stock with an SVG duotone filter, so prints from different
 * centuries and places sit in the same riso zine.
 */

export type Credit = { file: string; title: string; artist: string; date: string; museum: string; url: string; license: string; tags: string[]; mood?: string };

let creditsP: Promise<Credit[]> | null = null;
export function loadCredits(): Promise<Credit[]> {
  if (!creditsP)
    creditsP = fetch("/art/pd/credits.json")
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []);
  return creditsP;
}

/** stable choice: the same seed always gets the same artwork */
function pick(list: Credit[], tags: string[], seed: string) {
  const want = list.filter((c) => c.tags?.some((t) => tags.includes(t)));
  const from = want.length ? want : list;
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return from[Math.abs(h) % from.length];
}

const INKS = {
  cherry: [0x9e, 0x1f, 0x24],
  plum: [0x2b, 0x1a, 0x24],
  cornflower: [0x3b, 0x6c, 0xb8],
  leaf: [0x3f, 0x76, 0x2a],
} as const;
const CREAM = [0xfd, 0xf3, 0xdc];

export type Ink = keyof typeof INKS;

/** one shared set of duotone filters, rendered once near the root of any page that prints art */
export function RisoFilters() {
  const t = (a: number, b: number) => `${(a / 255).toFixed(3)} ${(b / 255).toFixed(3)}`;
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      {/* uneven rubber-stamp edges for stamped marks */}
      <filter id="riso-rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="3" />
      </filter>
      {(Object.keys(INKS) as Ink[]).map((k) => {
        const [r, g, b] = INKS[k];
        return (
          <filter id={`riso-${k}`} key={k} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.30 0.59 0.11 0 0  0.30 0.59 0.11 0 0  0.30 0.59 0.11 0 0  0 0 0 1 0" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.35" intercept="-0.12" />
              <feFuncG type="linear" slope="1.35" intercept="-0.12" />
              <feFuncB type="linear" slope="1.35" intercept="-0.12" />
            </feComponentTransfer>
            <feComponentTransfer>
              <feFuncR type="table" tableValues={t(r, CREAM[0])} />
              <feFuncG type="table" tableValues={t(g, CREAM[1])} />
              <feFuncB type="table" tableValues={t(b, CREAM[2])} />
            </feComponentTransfer>
          </filter>
        );
      })}
    </svg>
  );
}

export function RisoArt({ tags, seed, ink = "cherry", className, credit = true }: { tags: string[]; seed: string; ink?: Ink; className?: string; credit?: boolean }) {
  const [c, setC] = useState<Credit | null>(null);
  const key = tags.join(",");
  useEffect(() => {
    let live = true;
    loadCredits().then((list) => live && list.length && setC(pick(list, key.split(","), seed)));
    return () => {
      live = false;
    };
  }, [key, seed]);

  return (
    <figure className={`riso-art ${className ?? ""}`}>
      {c && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/art/pd/${c.file}`} alt={`${c.title}, ${c.artist}`} loading="lazy" style={{ filter: `url(#riso-${ink})` }} />
      )}
      {c && credit && (
        <figcaption>
          <a href={c.url} target="_blank" rel="noreferrer" title={`${c.title} · ${c.artist}, ${c.date} · ${c.museum} · ${c.license}`}>
            {c.artist.split("\n")[0].split(",")[0]}
          </a>
        </figcaption>
      )}
    </figure>
  );
}
