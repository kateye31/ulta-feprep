// Usage: node --import ./scripts/alias.mjs scripts/check-recipes.ts — lists the recipe each Night Shift question shows
import { ARCADE_EXAMS } from "../content/arcade";
import { recipeFor } from "../lib/recipes";
let missing = 0;
for (const e of ARCADE_EXAMS) for (const s of e.sections) for (const q of s.questions) {
  const r = recipeFor(q);
  if (!r) missing++;
  console.log(`${e.id.padEnd(11)} ${q.id} ${q.category} ${q.topic.padEnd(32)} → ${r?.id ?? "✗ none"}`);
}
console.log(missing ? `${missing} without a recipe` : "every question has a recipe");
