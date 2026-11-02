// Usage: node --import ./scripts/alias.mjs scripts/verify-potd.ts
import { POTD_BANK } from "../content/potd";
const TOPICS = ["dynamic-memory","linked-lists","stacks","queues","binary-trees","avl-trees","heaps","hash-tables","tries","big-o","timing-problems","summations","recurrences","recursion","sorting","bitwise","backtracking","base-conversion"];
let bad = 0;
const fail = (m: string) => { bad++; console.log("✗", m); };
const ids = new Set<string>();
const per: Record<string, number> = {};
for (const p of POTD_BANK) {
  if (ids.has(p.id)) fail(`duplicate id ${p.id}`);
  ids.add(p.id);
  if (!TOPICS.includes(p.topic)) fail(`${p.id}: unknown topic ${p.topic}`);
  per[p.topic] = (per[p.topic] ?? 0) + 1;
  if (p.kind === "choice") { if (!p.choices || p.choices.filter((c) => c.ok).length !== 1) fail(`${p.id}: choice needs exactly one ok option`); }
  else if (!p.answers?.length) fail(`${p.id}: ${p.kind} needs answers`);
  for (const f of ["title", "prompt", "hint", "explain", "miss"] as const) if (!p[f]?.trim()) fail(`${p.id}: empty ${f}`);
  if (p.prompt.split(/\s+/).length > 110) fail(`${p.id}: prompt too long (${p.prompt.split(/\s+/).length} words)`);
  if (p.code?.includes("```")) fail(`${p.id}: code must not contain markdown fences`);
}
console.log(per);
console.log(`${POTD_BANK.length} problems, ${bad ? bad + " problem(s)" : "all checks pass"}`);
process.exit(bad ? 1 : 0);
