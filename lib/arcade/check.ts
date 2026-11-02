/**
 * The word-by-word checker behind every "type it yourself" step.
 *
 * Typing is split into C tokens (words, numbers, strings, operators). Whitespace never matters.
 * A word is only judged once it's *finished* (something comes after it, or the player pauses),
 * so half-typed words never get flagged. Then Bea gives a hint that fits the mistake.
 */

import type { Mood, Rule } from "./types";

export type Tok = { t: string; start: number; end: number };

const TOKEN =
  /("(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?|0x[0-9a-fA-F]+|\d+(?:\.\d+)?|[A-Za-z_]\w*|->|\+\+|--|<<=|>>=|<<|>>|<=|>=|==|!=|&&|\|\||[+\-*/%&|^]=|\S)/g;

export function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  TOKEN.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN.exec(src))) out.push({ t: m[0], start: m.index, end: m.index + m[0].length });
  return out;
}

const isWord = (t: string) => /^[A-Za-z_0-9]/.test(t);
const isStr = (t: string) => t.startsWith('"');
const strDone = (t: string) => t.length > 1 && t.endsWith('"') && !t.endsWith('\\"');

/** two tokens mean the same thing (format strings ignore their inner spaces) */
function same(a: string, b: string) {
  if (a === b) return true;
  if (isStr(a) && isStr(b)) return a.replace(/\s+/g, "") === b.replace(/\s+/g, "");
  return false;
}

/** could `typed` still grow into `want`? */
function canGrow(typed: string, want: string) {
  if (isStr(want) && isStr(typed)) return want.replace(/\s+/g, "").startsWith(typed.replace(/\s+/g, ""));
  return want.startsWith(typed);
}

const prep = (src: string, loose?: boolean) => tokenize(src).filter((k) => !(loose && k.t === ","));

export type Verdict =
  | { state: "empty" }
  | { state: "typing"; matched: number; total: number }
  | { state: "done"; total: number }
  | { state: "wrong"; at: number; typed: Tok; want: string | null; matched: number; total: number; alt: string[] };

/**
 * Compare what's typed so far with every accepted answer.
 * `settled` = the player paused or pressed Enter, so the last word counts as finished too.
 */
export function judge(text: string, answers: string[], opts: { loose?: boolean; settled?: boolean } = {}): Verdict {
  const typed = prep(text, opts.loose);
  if (!typed.length) return { state: "empty" };
  const trailingSpace = /\s$/.test(text);

  let best = { k: -1, alt: [] as string[] };
  for (const a of answers) {
    const want = prep(a, opts.loose).map((x) => x.t);
    let k = 0;
    while (k < typed.length && k < want.length && same(typed[k].t, want[k])) k++;
    if (k > best.k) best = { k, alt: want };
  }
  const { k, alt } = best;
  if (k === typed.length) return k === alt.length ? { state: "done", total: alt.length } : { state: "typing", matched: k, total: alt.length };

  // Only the last word differs and it might still be unfinished: give it the benefit of the doubt.
  if (k === typed.length - 1 && k < alt.length) {
    const last = typed[k].t;
    const finished = trailingSpace || opts.settled;
    const wait = { state: "typing" as const, matched: k, total: alt.length };
    // an unclosed string is never finished, even with spaces inside it
    if (isStr(last) && !strDone(last)) return wait;
    if (!finished) {
      if (canGrow(last, alt[k])) return wait; // a valid beginning, like "fsc" or "-" before "->"
      if (isWord(last)) return wait; // a half-typed word: judge it once it's finished
    }
  }
  return { state: "wrong", at: k, typed: typed[k], want: alt[k] ?? null, matched: k, total: alt.length, alt };
}

/** Replace the wrong word with just the correct one (never the whole answer). */
export function fillOne(text: string, v: Extract<Verdict, { state: "wrong" }>): string {
  const head = text.slice(0, v.typed.start).replace(/\s+$/, "");
  if (v.want == null) return head; // they typed extra stuff after a finished line
  const prev = head.slice(-1);
  const gap = head && /\w/.test(prev) && /^\w/.test(v.want) ? " " : head && /[,;]/.test(prev) ? " " : "";
  const next = v.alt[v.at + 1];
  const tail = next && /^\w/.test(v.want) && /^\w/.test(next) ? " " : next && v.want === "," ? " " : "";
  return head + gap + v.want + tail;
}

/** The next correct word, for the "give me the next bit" button. */
export function nextWord(text: string, answers: string[], loose?: boolean): string {
  const v = judge(text, answers, { loose, settled: true });
  if (v.state === "done") return text;
  if (v.state === "wrong") return fillOne(text, v);
  if (v.state === "empty") {
    const first = prep(answers[0], loose)[0]?.t ?? "";
    const second = prep(answers[0], loose)[1]?.t;
    return first + (second && /^\w/.test(first) && /^\w/.test(second) ? " " : "");
  }
  // typing: finish/insert the next token after the matched ones
  const typed = prep(text, loose);
  const alt = bestAlt(text, answers, loose);
  const k = v.matched;
  const fake = { state: "wrong" as const, at: k, typed: typed[k] ?? { t: "", start: text.length, end: text.length }, want: alt[k] ?? null, matched: k, total: alt.length, alt };
  return fillOne(text, fake);
}

function bestAlt(text: string, answers: string[], loose?: boolean) {
  const typed = prep(text, loose);
  let best = { k: -1, alt: [] as string[] };
  for (const a of answers) {
    const want = prep(a, loose).map((x) => x.t);
    let k = 0;
    while (k < typed.length && k < want.length && same(typed[k].t, want[k])) k++;
    if (k > best.k) best = { k, alt: want };
  }
  return best.alt;
}

// ───────────────────────── hints ─────────────────────────

/** What a C word means, in plain words. Used to "translate" what the player typed. */
export const MEANS: Record<string, string> = {
  free: "gives memory back to the system",
  malloc: "asks for a block of memory (it's NOT cleared)",
  calloc: "asks for memory AND fills it with zeros",
  realloc: "resizes a block you already own",
  scanf: "reads from the keyboard (standard input)",
  fscanf: "reads from a FILE",
  printf: "prints to the screen",
  fprintf: "prints into a FILE",
  fopen: "opens a file and hands you a FILE*",
  fclose: "closes a file",
  sizeof: "asks how many bytes a type uses",
  NULL: "the 'points nowhere' pointer",
  return: "ends the function and hands a value back",
  if: "runs code only when a condition is true",
  else: "the 'otherwise' branch",
  for: "a counting loop: for (start; keep-going-while; step)",
  while: "a loop that repeats while a condition is true",
  int: "a whole-number type",
  char: "a single-character type",
  void: "'nothing'",
  struct: "a bundle of named fields",
  "->": "follows a POINTER to reach a field (p->x is (*p).x)",
  ".": "reaches a field of a struct you have directly (not a pointer)",
  "*": "multiply, or 'pointer to' in a declaration, or 'go to the thing it points at'",
  "&": "'address of' (or bitwise AND between two numbers)",
  "^": "bitwise XOR: 1 where the bits are DIFFERENT",
  "|": "bitwise OR",
  "<<": "shift bits left (1 << j is 2 to the j)",
  ">>": "shift bits right",
  "=": "stores a value (assignment)",
  "==": "asks 'are these equal?'",
  "!=": "asks 'are these different?'",
  "++": "add one",
  "--": "subtract one",
  ";": "ends a statement",
  "{": "opens a block",
  "}": "closes a block",
};

function lev(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

function matches(p: string | string[] | RegExp, s: string) {
  if (p instanceof RegExp) return p.test(s);
  if (Array.isArray(p)) return p.includes(s);
  return p === s;
}

const code = (s: string) => "`" + s + "`";
const mean = (s: string) => (MEANS[s] ? ` (${code(s)} ${MEANS[s]})` : "");

/** Pick what Bea says about a wrong word. Never gives the answer away, just points at the idea. */
export function hintFor(v: Extract<Verdict, { state: "wrong" }>, rules: Rule[] = [], nudge?: string): { say: string; mood: Mood } {
  const w = v.typed.t;
  const want = v.want;

  for (const r of rules) if (matches(r.when, w) && (!r.at || (want != null && matches(r.at, want)))) return { say: r.say, mood: r.mood ?? "think" };

  if (want == null) return { say: `That line's already complete before ${code(w)}. Delete the extra bit at the end.`, mood: "calm" };
  if (w.toLowerCase() === want.toLowerCase()) return { say: `So close! C is case-sensitive, so check your capital letters.`, mood: "cheeky" };
  if (want === ";") return { say: `Every C statement ends with a semicolon. What should sit right here?`, mood: "explain" };
  if (isStr(want) && !isStr(w))
    return {
      say: `Think about what you're typing: ${code(w)} isn't something C can read like that. Reading functions need a *format string* in double quotes, and each value is announced with a % code: ${code("%d")} = int, ${code("%s")} = string, ${code("%c")} = char, ${code("%f")} = float.`,
      mood: "explain",
    };
  if (isStr(want) && isStr(w)) return { say: `Right idea, a format string! Now check each % code. What *type* is each value you're reading, in order?`, mood: "think" };
  if (want === "->" && w === ".") return { say: `You're holding a *pointer* here, not the struct itself. A dot reaches into a struct; what reaches *through* a pointer?`, mood: "explain" };
  if (want === "." && w === "->") return { say: `Here you have the struct itself (not a pointer), so the arrow isn't right. What's the other way to reach a field?`, mood: "explain" };
  if (want === "==" && w === "=") return { say: `One ${code("=")} *stores* a value. Here we want to *ask* whether two things are equal.`, mood: "explain" };
  if (want === "=" && w === "==") return { say: `${code("==")} only *asks* a question. Here we want to *store* a value.`, mood: "explain" };
  if (isWord(want) && isWord(w) && want.endsWith(w) && want !== w)
    return { say: `Close! It's not ${code(w)}${mean(w)}. It's missing something in front.`, mood: "think" };
  if (isWord(want) && isWord(w) && want.startsWith(w)) return { say: `Almost: that word isn't finished yet.`, mood: "cheeky" };
  if (want === "*" && isWord(w)) return { say: `Something's missing before ${code(w)}. Is this thing a plain value, or a *pointer*?`, mood: "think" };
  if (want === "&" ) return { say: `This spot needs an *address* (where to store the value), not the value itself. Which symbol means 'address of'?`, mood: "explain" };
  if (/^\d/.test(want) && /^\d/.test(w)) return { say: `Different number. Re-check that bit of math (or peek at your inventory).`, mood: "think" };
  if (isWord(want) && isWord(w) && w.length >= 3 && lev(w, want) <= 2) return { say: `So close, check the spelling of ${code(w)}.`, mood: "cheeky" };
  if (want === "(" || want === ")" ) return { say: `Count your parentheses: something about the brackets is off here.`, mood: "think" };
  return {
    say: `Think about what you typed: ${code(w)}${mean(w)}. That's not what fits here.${nudge ? " " + nudge : " Re-read the question and your inventory."}`,
    mood: "think",
  };
}
