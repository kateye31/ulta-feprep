"use client";

import { useSyncExternalStore } from "react";

const KEY = "fe-cafe-stamps-v1";
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode: stamps just won't persist */
  }
  listeners.forEach((l) => l());
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
