"use client";

/**
 * The study log behind Today and the Calendar: what happened each day.
 * Saved through lib/persist → data/fe-cafe-save.json like everything else.
 */

import { KEYS } from "@/lib/persist";
import { makeStore, saveStore } from "@/lib/arcade/store";

export type PotdResult = { id: string; ok: boolean; tries: number; revealed?: boolean };
export type Day = {
  /** today's problem: the result, once answered */
  potd?: PotdResult;
  /** extra problems solved that day */
  extra?: number;
  /** focus minutes finished */
  focus?: number;
  /** "I studied today" marked by hand */
  marked?: boolean;
  t?: number;
};
export type StudyLog = {
  days: Record<string, Day>;
  /** YouTube video the focus card plays */
  video?: string;
  /** focus length in minutes */
  focusLen?: number;
};

export const logStore = makeStore<StudyLog>(KEYS.studylog, { days: {} });

/** local calendar day as YYYY-MM-DD */
export function ymd(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function patchDay(day: string, patch: Partial<Day>) {
  const s = logStore.read();
  logStore.write({ ...s, days: { ...s.days, [day]: { ...s.days[day], ...patch, t: Date.now() } } });
}

export function setLogField(patch: Partial<Omit<StudyLog, "days">>) {
  logStore.write({ ...logStore.read(), ...patch });
}

/** every day with any study activity: the log plus arcade steps finished that day */
export function activeDays(log: StudyLog, arcadeSteps = saveStore.read().steps): Set<string> {
  const out = new Set<string>();
  for (const [k, v] of Object.entries(log.days)) if (v.potd || v.extra || v.focus || v.marked) out.add(k);
  for (const r of Object.values(arcadeSteps)) if (r.done && r.t) out.add(ymd(new Date(r.t)));
  return out;
}

/** consecutive study days ending today (or yesterday, so the streak survives until tonight) */
export function streak(days: Set<string>) {
  const d = new Date();
  if (!days.has(ymd(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(ymd(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/** whole days from today until an exam date string (YYYY-MM-DD), or null */
export function daysUntil(date: string | null | undefined) {
  if (!date) return null;
  const target = new Date(date + "T00:00:00");
  const today = new Date(ymd() + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}
