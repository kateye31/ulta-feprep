import type { SlotsStep, TypeStep } from "./types";

/** how a slot answer is compared: case and spaces never matter */
export const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");

export const slotRight = (answer: string | string[], v: string) => (Array.isArray(answer) ? answer : [answer]).some((a) => norm(a) === norm(v ?? ""));

/** Exam points for a slots step, graded on the first check (like a paper exam: first answer counts). */
export function slotPoints(step: SlotsStep, values: Record<string, string>) {
  const pts = step.pts ?? 0;
  const right = step.slots.filter((s) => slotRight(s.answer, values[s.id]));
  const wrong = step.slots.length - right.length;
  switch (step.score ?? "all") {
    case "each":
      return right.reduce((t, s) => t + (s.pts ?? pts / step.slots.length), 0);
    case "floorHalf":
      return Math.min(pts, Math.floor(right.length / 2));
    case "minusEach":
      return Math.max(0, pts - wrong);
    default:
      return wrong === 0 ? pts : 0;
  }
}

/** Exam points for a typing step: full marks, minus a bit for every word Bea had to fill in. */
export function typePoints(step: TypeStep, fills: number) {
  const pts = step.pts ?? 0;
  const per = step.penalty ?? Math.max(1, Math.ceil(pts / 2));
  return Math.max(0, pts - fills * per);
}

export const fmtPts = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
