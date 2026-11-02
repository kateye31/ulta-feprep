"use client";

import { useEffect, useState } from "react";
import type { Mood } from "@/lib/arcade/types";

/**
 * Hand-drawn art from Open Doodles & Open Peeps (Pablo Stanley, CC0), saved in public/art.
 * Each SVG is fetched once and inlined so its lines can follow the text color (currentColor).
 */

const cache = new Map<string, Promise<string>>();
let uid = 0;

function load(name: string) {
  let p = cache.get(name);
  if (!p) {
    p = fetch(`/art/${name}.svg`).then((r) => (r.ok ? r.text() : ""));
    cache.set(name, p);
  }
  return p;
}

/** ids inside an SVG must be unique on the page, or two copies fight over masks */
function scope(svg: string) {
  const tag = `a${++uid}`;
  return svg.replace(/id="([^"]+)"/g, `id="$1-${tag}"`).replace(/url\(#([^)]+)\)/g, `url(#$1-${tag})`);
}

export function Art({ name, className, style, label }: { name: string; className?: string; style?: React.CSSProperties; label?: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let live = true;
    load(name).then((s) => live && setSvg(scope(s)));
    return () => {
      live = false;
    };
  }, [name]);
  return (
    <span
      className={`art ${className ?? ""}`}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export type Who = "bea" | "juni";

/** A character portrait in a cream cameo frame. Bea = the barista who gives hints, Juni = the tutor. */
export function Peep({ who, mood = "happy", size = 76, ring }: { who: Who; mood?: Mood; size?: number; ring?: string }) {
  const file = who === "bea" ? "bea" : "hoot";
  return (
    <span className="cameo" style={{ width: size, height: size, ["--c" as string]: ring ?? (who === "bea" ? "var(--a-amber)" : "var(--a-lav)") }}>
      <Art name={`peep-${file}-${mood}`} label={who === "bea" ? "Bea the barista" : "Juni the tutor"} />
    </span>
  );
}
