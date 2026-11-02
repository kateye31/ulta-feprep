// Usage: node --import ./scripts/alias.mjs scripts/verify-exam.ts content/arcade/<file>.ts
// Checks every exported Exam: step points add up to each question's rubric points, choice steps have
// exactly one right option, every accepted typed answer passes the live checker, slots line up.
import { pathToFileURL } from "node:url";
import path from "node:path";
import { judge } from "../lib/arcade/check";
import type { Exam } from "../lib/arcade/types";

const file = process.argv[2];
if (!file) throw new Error("pass the exam module path");
const mod = await import(pathToFileURL(path.resolve(file)).href);
const exams = Object.values(mod).filter((v: any) => v && Array.isArray(v.sections)) as Exam[];
if (!exams.length) throw new Error("no exported Exam found in " + file);
let bad = 0;
// names any C student knows without being told
const KNOWN = new Set("sqrt pow if else for while do return int char double float long void struct typedef sizeof NULL malloc calloc realloc free strcpy strcat strlen strcmp printf scanf fscanf fopen fclose abs const unsigned break continue true false i j k n m x y a b c d e lg log max min sum O T".split(" "));
const words = (s: string) => s.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
const fail = (m: string) => { bad++; console.log("✗", m); };
for (const e of exams) {
  let total = 0;
  for (const sec of e.sections) for (const q of sec.questions) {
    total += q.pts;
    const sum = q.steps.reduce((t, s) => t + (s.pts ?? 0), 0);
    if (Math.abs(sum - q.pts) > 1e-6) fail(`${e.id} ${q.id}: steps add to ${sum}, question is ${q.pts}`);
    const ids = new Set<string>();
    // every name the player has been shown so far: the story, the inventory, the scaffold, earlier prompts and answers
    const seen = new Set<string>([...words(q.story), ...q.given.flatMap((g) => words((g.body ?? "") + " " + g.title + " " + JSON.stringify(g.table ?? "") + " " + JSON.stringify(g.tree ?? ""))), ...words(q.scaffold?.code.replace(/\{\{[\w-]+\}\}/g, "") ?? "")]);
    for (const s of q.steps) {
      if (ids.has(s.id)) fail(`${q.id}: duplicate step id ${s.id}`);
      ids.add(s.id);
      if (s.kind === "choice" && s.options.filter((o) => o.ok).length !== 1) fail(`${q.id}/${s.id}: needs exactly one correct option`);
      for (const g of s.give ?? []) for (const w of words((g.body ?? "") + " " + g.title)) seen.add(w);
      for (const w of words(s.prompt)) seen.add(w);
      if (s.kind === "choice") for (const o of s.options) for (const w of words(o.t)) seen.add(w);
      if (s.kind === "type") {
        const fresh = [...new Set(words(s.answers[0]).filter((w) => !seen.has(w) && !KNOWN.has(w) && !/^[0-9A-F]+$/.test(w)))];
        if (fresh.length) fail(`${q.id}/${s.id}: answer uses names the player was never shown: ${fresh.join(", ")}`);
        for (const a of s.answers) for (const w of words(a)) seen.add(w);
      }
      if (s.kind === "type") for (const a of s.answers) if (judge(a, s.answers, { loose: s.loose, settled: true }).state !== "done") fail(`${q.id}/${s.id}: answer doesn't pass the checker: ${a}`);
      if (s.kind === "slots") {
        if (s.score === "each") { const sp = s.slots.reduce((t, x) => t + (x.pts ?? (s.pts ?? 0) / s.slots.length), 0); if (Math.abs(sp - (s.pts ?? 0)) > 1e-6) fail(`${q.id}/${s.id}: slot pts ${sp} ≠ ${s.pts}`); }
        if (s.layout === "tree") for (const x of s.slots) if (!s.tree?.nodes.some((n) => n.slot === x.id)) fail(`${q.id}/${s.id}: slot ${x.id} not in tree`);
        if (s.layout === "stacks") for (const x of s.slots) if (!s.stacks?.some(([, ids]) => ids.includes(x.id))) fail(`${q.id}/${s.id}: slot ${x.id} not in a stack`);
      }
    }
    for (const m of q.scaffold?.code.matchAll(/\{\{([\w-]+)\}\}/g) ?? []) { const st = q.steps.find((s) => s.id === m[1]); if (!st || st.kind !== "type") fail(`${q.id}: scaffold slot {{${m[1]}}} isn't a typing step`); }
    console.log(`  ${q.id.padEnd(3)} ${String(q.pts).padStart(2)} pts · ${q.steps.length} steps · ${q.steps.filter((s) => s.kind === "type").length} typed`);
  }
  console.log(`${e.term}: ${total} pts total`);
}
console.log(bad ? `${bad} problem(s)` : "all checks pass");
process.exit(bad ? 1 : 0);
