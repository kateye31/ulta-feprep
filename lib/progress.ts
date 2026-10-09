"use client";

import { useSyncExternalStore } from "react";
import { KEYS, persist, readLocal, ready } from "./persist";

const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const raw = readLocal(KEYS.stamps);
    cache = raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  persist(KEYS.stamps, JSON.stringify(next));
  listeners.forEach((l) => l());
}

// once the save file has been merged in, re-read
if (typeof window !== "undefined") {
  ready().then(() => {
    cache = null;
    listeners.forEach((l) => l());
  });
}

const EMPTY: string[] = [];

export function useStamps() {
  const stamps = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => EMPTY,
  );
  return {
    stamps,
    has: (slug: string) => stamps.includes(slug),
    toggle: (slug: string) => {
      const cur = read();
      write(cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]);
    },
    reset: () => write([]),
  };
}
