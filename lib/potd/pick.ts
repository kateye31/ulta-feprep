import { POTD_BANK } from "@/content/potd";
import type { Potd } from "./types";

/**
 * Today's problem: the same for the whole day, different every day, and weighted toward the
 * student's weak spots (heaps, trees, runtime, writing linked-list and memory code).
 */
const WEAK = new Set(["heaps", "binary-trees", "big-o", "linked-lists", "dynamic-memory"]);

/** deterministic shuffle so the order is stable between visits */
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

let order: Potd[] | null = null;
function rotation() {
  if (order) return order;
  // weak-spot problems appear twice per cycle
  const pool = POTD_BANK.flatMap((p) => (WEAK.has(p.topic) ? [p, p] : [p]));
  const rand = mulberry(2027);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  // never the same problem two days in a row
  order = pool.filter((p, i) => i === 0 || pool[i - 1].id !== p.id);
  return order;
}

const dayNumber = (ymd: string) => Math.floor(new Date(ymd + "T12:00:00").getTime() / 86400000);

export function problemFor(ymd: string): Potd {
  const r = rotation();
  return r[((dayNumber(ymd) % r.length) + r.length) % r.length];
}

/** a different random problem for "one more", avoiding today's */
export function anotherProblem(exclude: string[]): Potd {
  const left = POTD_BANK.filter((p) => !exclude.includes(p.id));
  const from = left.length ? left : POTD_BANK;
  return from[Math.floor(Math.random() * from.length)];
}

export const getProblem = (id: string) => POTD_BANK.find((p) => p.id === id);
