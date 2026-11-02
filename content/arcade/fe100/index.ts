import type { Exam, Question } from "@/lib/arcade/types";
import { FE100, LEVEL_PTS } from "../fe100-list";
import { MEMORY } from "./memory";

/** finished topics, by their position in the FE 100 list (index 0 = Dynamic Memory Management) */
const BUILT: Record<number, Question[]> = { 0: MEMORY };

const sections = FE100.flatMap((t, i) => (BUILT[i] ? [{ id: String(i + 1), name: `${t.emoji} ${t.name}`, questions: BUILT[i] }] : []));
const ready = sections.reduce((n, s) => n + s.questions.length, 0);
const next = FE100.filter((_, i) => !BUILT[i]).slice(0, 3).map((t) => t.name);

// every question's points follow its difficulty on the list
const all = FE100.flatMap((t) => t.problems);
for (const s of sections)
  for (const q of s.questions) {
    const want = LEVEL_PTS[all[+q.id - 1].level];
    if (q.pts !== want) throw new Error(`FE 100 #${q.id} is worth ${q.pts}, its level says ${want}`);
  }

export const FE_100: Exam = {
  id: "fe100",
  term: "FE 100 Crash Course",
  date: `Practice set · ${ready} of 100 ready`,
  blurb: `100 practice problems in 16 topics, each walked through step by step. Easy = 5 pts, Med. = 10, Hard = 15.${next.length ? ` Coming next: ${next.join(", ")}.` : ""}`,
  practice: true,
  sections,
};
