"use client";

/**
 * Everything the Exam Arcade remembers: step progress, decorations, notes, tutor chats.
 * Saved through lib/persist → data/fe-cafe-save.json, so it survives restarts, new ports and new browsers.
 */

import { useSyncExternalStore } from "react";
import { KEYS, persist, readLocal, ready } from "@/lib/persist";
import type { Exam, Question, Step } from "./types";

export type StepRec = {
  done?: boolean;
  /** exam points earned (rubric) */
  pts?: number;
  /** words Bea filled in */
  fills?: number;
  /** wrong attempts (choices / checks) */
  tries?: number;
  /** in-progress typing, so a refresh never loses it */
  text?: string;
  picked?: number[];
  slots?: Record<string, string>;
  /** how many times each word position was missed (typing steps) */
  miss?: Record<string, string[]>;
  t?: number;
};

export type Placed = { x: number; y: number; flip?: boolean; hidden?: boolean };
export type ArcadeSave = {
  steps: Record<string, StepRec>;
  owned: string[];
  placed: Record<string, Placed>;
  last?: { exam: string; q: string };
  /** beans kept from questions you chose to redo */
  bonus?: number;
};
export type Note = { text: string; t: number };
export type ChatMsg = { role: "user" | "assistant"; content: string };
export type Chat = { msgs: ChatMsg[]; t: number };

export function makeStore<T>(key: string, empty: T) {
  const listeners = new Set<() => void>();
  let cache: T | null = null;
  const read = (): T => {
    if (cache) return cache;
    try {
      const raw = readLocal(key);
      cache = raw ? ({ ...empty, ...JSON.parse(raw) } as T) : empty;
    } catch {
      cache = empty;
    }
    return cache;
  };
  const write = (next: T) => {
    cache = next;
    persist(key, JSON.stringify(next));
    listeners.forEach((l) => l());
  };
  if (typeof window !== "undefined")
    ready().then(() => {
      cache = null;
      listeners.forEach((l) => l());
    });
  const sub = (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  };
  const use = () => useSyncExternalStore(sub, read, () => empty);
  return { read, write, use };
}

const EMPTY_SAVE: ArcadeSave = { steps: {}, owned: [], placed: {} };
export const saveStore = makeStore<ArcadeSave>(KEYS.arcade, EMPTY_SAVE);
export const notesStore = makeStore<Record<string, Note>>(KEYS.arcadeNotes, {});
export const chatStore = makeStore<Record<string, Chat>>(KEYS.arcadeChat, {});

export const stepKey = (exam: string, q: string, step: string) => `${exam}/${q}/${step}`;

export function patchStep(key: string, patch: Partial<StepRec>) {
  const s = saveStore.read();
  saveStore.write({ ...s, steps: { ...s.steps, [key]: { ...s.steps[key], ...patch, t: Date.now() } } });
}

export function setNote(id: string, text: string) {
  notesStore.write({ ...notesStore.read(), [id]: { text, t: Date.now() } });
}

export function setChat(id: string, msgs: ChatMsg[]) {
  chatStore.write({ ...chatStore.read(), [id]: { msgs, t: Date.now() } });
}

// ───────────── coffee beans (the decorating currency) ─────────────

/** Beans for one finished step: a little for showing up, more for real exam points. */
export function beansFor(step: Step, rec: StepRec | undefined) {
  if (!rec?.done) return 0;
  const base = step.kind === "info" ? 1 : step.kind === "choice" ? 3 : 5;
  const clean = !rec.fills && !rec.tries ? 2 : 0;
  return base + clean + Math.round((rec.pts ?? 0) * 3);
}

export function questionStats(exam: Exam, q: Question, steps: Record<string, StepRec>) {
  let pts = 0;
  let done = 0;
  let beans = 0;
  for (const s of q.steps) {
    const r = steps[stepKey(exam.id, q.id, s.id)];
    if (r?.done) {
      done++;
      pts += r.pts ?? 0;
      beans += beansFor(s, r);
    }
  }
  const finished = done === q.steps.length;
  if (finished) beans += 15;
  return { pts: Math.round(pts * 10) / 10, done, total: q.steps.length, finished, beans };
}

export function examStats(exam: Exam, steps: Record<string, StepRec>) {
  let pts = 0;
  let max = 0;
  let beans = 0;
  let finished = 0;
  let count = 0;
  for (const sec of exam.sections)
    for (const q of sec.questions) {
      const st = questionStats(exam, q, steps);
      pts += st.pts;
      max += q.pts;
      beans += st.beans;
      count++;
      if (st.finished) finished++;
    }
  return { pts: Math.round(pts * 10) / 10, max, beans, finished, count };
}
