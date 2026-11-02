/**
 * Turns Night Shift progress into the numbers behind /analytics.
 * Every question is filed under its recipe (lib/recipes.ts), so "topic" means the same thing
 * across real exams and the FE 100 set, and each topic links straight to its recipe.
 */

import { tokenize } from "@/lib/arcade/check";
import { stepKey, type StepRec } from "@/lib/arcade/store";
import type { Exam } from "@/lib/arcade/types";
import { recipeFor, type Recipe } from "@/lib/recipes";
import { ymd } from "@/lib/studylog";

export type SectionId = "A" | "B" | "C" | "D";
export const SECTION_NAMES: Record<SectionId, string> = { A: "Basic data structures", B: "Advanced data structures", C: "Algorithm analysis", D: "Algorithms" };

export type TopicStat = {
  recipe: Recipe;
  steps: number;
  done: number;
  /** points available on the steps you've finished */
  tried: number;
  earned: number;
  /** wrong picks + wrong words + words Bea filled in */
  slips: number;
};
export type ExamStat = { id: string; term: string; questions: { id: string; state: "done" | "started" | "todo" }[] };
export type Slip = { typed: string; want: string; n: number };

export type Analytics = {
  sections: Record<SectionId, { steps: number; done: number }>;
  topics: TopicStat[];
  exams: ExamStat[];
  slips: Slip[];
  days: { day: string; steps: number }[];
  totals: { steps: number; done: number; tried: number; earned: number; finished: number; questions: number };
};

export function analyze(exams: Exam[], recs: Record<string, StepRec>, dayCount = 14): Analytics {
  const sections = { A: { steps: 0, done: 0 }, B: { steps: 0, done: 0 }, C: { steps: 0, done: 0 }, D: { steps: 0, done: 0 } };
  const topics = new Map<string, TopicStat>();
  const slips = new Map<string, Slip>();
  const perDay = new Map<string, number>();
  const totals = { steps: 0, done: 0, tried: 0, earned: 0, finished: 0, questions: 0 };
  const examStats: ExamStat[] = [];

  for (const e of exams) {
    const es: ExamStat = { id: e.id, term: e.term, questions: [] };
    for (const sec of e.sections)
      for (const q of sec.questions) {
        const recipe = recipeFor(q);
        const sid = (recipe?.section ?? sec.id) as SectionId;
        const t = recipe && (topics.get(recipe.id) ?? { recipe, steps: 0, done: 0, tried: 0, earned: 0, slips: 0 });
        let qDone = 0;
        for (const s of q.steps) {
          const r = recs[stepKey(e.id, q.id, s.id)];
          const wrongWords = Object.values(r?.miss ?? {}).reduce((n, w) => n + w.length, 0);
          sections[sid].steps++;
          totals.steps++;
          if (t) t.steps++;
          if (t && r) t.slips += (r.tries ?? 0) + (r.fills ?? 0) + wrongWords;
          if (s.kind === "type" && r?.miss) {
            const want = tokenize(s.answers[0]).filter((k) => !(s.loose && k.t === ","));
            for (const [at, typed] of Object.entries(r.miss))
              for (const w of typed) {
                const k = `${w}\u0000${want[+at]?.t ?? "(end)"}`;
                const cur = slips.get(k) ?? { typed: w, want: want[+at]?.t ?? "(nothing)", n: 0 };
                cur.n++;
                slips.set(k, cur);
              }
          }
          if (!r?.done) continue;
          qDone++;
          sections[sid].done++;
          totals.done++;
          totals.tried += s.pts ?? 0;
          totals.earned += r.pts ?? 0;
          if (t) {
            t.done++;
            t.tried += s.pts ?? 0;
            t.earned += r.pts ?? 0;
          }
          if (r.t) perDay.set(ymd(new Date(r.t)), (perDay.get(ymd(new Date(r.t))) ?? 0) + 1);
        }
        if (t) topics.set(t.recipe.id, t);
        totals.questions++;
        const state = qDone === q.steps.length ? "done" : qDone ? "started" : "todo";
        if (state === "done") totals.finished++;
        es.questions.push({ id: q.id, state });
      }
    examStats.push(es);
  }

  const days: { day: string; steps: number }[] = [];
  const d = new Date();
  d.setDate(d.getDate() - (dayCount - 1));
  for (let i = 0; i < dayCount; i++, d.setDate(d.getDate() + 1)) days.push({ day: ymd(d), steps: perDay.get(ymd(d)) ?? 0 });

  return {
    sections,
    topics: [...topics.values()],
    exams: examStats,
    slips: [...slips.values()].sort((a, b) => b.n - a.n),
    days,
    totals,
  };
}

/** topics you lose the most on: points dropped first, then slips per finished step */
export function weakest(topics: TopicStat[], n = 5) {
  return topics
    .filter((t) => t.done > 0 && (t.tried - t.earned > 0 || t.slips > 0))
    .sort((a, b) => b.tried - b.earned - (a.tried - a.earned) || b.slips / b.done - a.slips / a.done)
    .slice(0, n);
}
