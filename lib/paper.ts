"use client";

/**
 * Paper Practice: questions printed and done by hand, then graded with the answer key.
 * A "cold" score is a first try at a question you'd never played, which is the honest
 * "am I getting better?" number. Redo scores are kept too, but charted apart.
 */

import { makeStore } from "@/lib/arcade/store";
import { KEYS } from "@/lib/persist";
import type { Exam, Question } from "@/lib/arcade/types";

export type PaperRec = {
  exam: string;
  q: string;
  /** recipe id, so scores line up with the topics on /analytics */
  recipe?: string;
  pts: number;
  score: number;
  /** first time you'd ever seen this question */
  cold: boolean;
  /** YYYY-MM-DD */
  day: string;
  t: number;
};

/** keyed `${exam}/${q}@${day}`, so the same question on two days is two entries */
export const paperStore = makeStore<Record<string, PaperRec>>(KEYS.paper, {});

export const paperKey = (exam: string, q: string, day: string) => `${exam}/${q}@${day}`;

export type Pick = { exam: Exam; section: string; q: Question };

export const pickId = (p: { exam: Exam; q: Question }) => `${p.exam.id}/${p.q.id}`;

export function allPicks(exams: Exam[]): Pick[] {
  return exams.flatMap((exam) => exam.sections.flatMap((s) => s.questions.map((q) => ({ exam, section: s.id, q }))));
}

/** Night Shift wording → paper wording */
export const forPaper = (s: string) =>
  s
    .replace(/\(in your inventory\)/g, "(below)")
    .replace(/from your inventory/g, "from below")
    .replace(/in your inventory/g, "below");

/** a shuffle that takes its own seed, so the same "deal" survives a refresh */
export function shuffle<T>(list: T[], seed: number): T[] {
  const a = [...list];
  let x = seed || 1;
  const rnd = () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
