/**
 * Offline Juni: a tutor that needs no API key and no internet.
 * It reads the question you're on (step, your typing, the official explanations), matches what you
 * asked against a library of C / Foundation Exam concepts, and works out bit math live.
 */

import { hintFor, judge, MEANS, tokenize } from "./check";
import type { Question, Step } from "./types";

type Concept = { keys: RegExp; title: string; say: string; analogy?: string };

const CONCEPTS: Concept[] = [
  {
    keys: /\bkey\b|answer key|correct answers/i,
    title: "the key",
    say: "`key` is just ONE int, but read it as a row of on/off switches (bits). Bit i is question i: 1 = True, 0 = False. So the whole answer key for up to 31 questions fits in one number. Example: key = 11 = `1011` in binary (read right to left) → Q0 True, Q1 True, Q2 False, Q3 True.",
    analogy: "Picture a row of light switches, one per question. Up = True, down = False. `key` is the teacher's row of switches.",
  },
  {
    keys: /studAnswers|array\s*\[\s*i\s*\]|\[i\]|\bi\s*\^|\bi\b.*\bfirst\b/i,
    title: "studAnswers[i] vs i",
    say: "`i` is only *which student* (0 = the first student). You never XOR `i` itself. `studAnswers[i]` is that student's whole set of answers, packed into bits just like `key`. So the line is `studAnswers[i] ^ key`: this student's switches compared with the teacher's switches.",
  },
  {
    keys: /\bxor\b|\^|exclusive/i,
    title: "XOR (^)",
    say: "`a ^ b` compares two numbers bit by bit: the result has a 1 wherever the bits are DIFFERENT and a 0 wherever they're the same. `1001 ^ 1011 = 0010`, so only bit 1 differs.",
    analogy: "XOR is a 'spot the difference' game: lay the two rows of switches next to each other and mark every spot that doesn't match.",
  },
  {
    keys: /\bbits?\b|binary|bitwise|\bmask\b/i,
    title: "bits",
    analogy: "Bits are a row of light switches, and each switch is worth double the one to its right: 1, 2, 4, 8…",
    say: "Every int is stored as bits. Bit j is worth 2ʲ: bit 0 = 1, bit 1 = 2, bit 2 = 4, bit 3 = 8. 11 = 8 + 2 + 1 = `1011`. Read binary right to left: the rightmost digit is bit 0.",
  },
  {
    keys: /<<|shift|1\s*<<\s*j/i,
    title: "1 << j",
    say: "`1 << j` slides a single 1 over to position j: `1 << 0 = 0001`, `1 << 2 = 0100`. It's a *mask* with only bit j turned on, which is how you look at one bit at a time.",
  },
  {
    keys: /&(?!&)|\band\b.*\bbit|bitwise and|check.*bit|test.*bit/i,
    title: "testing one bit with &",
    say: "`res & (1 << j)` keeps only bit j of res (everything else becomes 0). If the result isn't 0, bit j was 1. In this question, a 1 bit in `res` means 'wrong answer on question j'.",
  },
  {
    keys: /pointer|address/i,
    title: "pointers",
    say: "A pointer holds an *address*: where something lives, not the thing itself. `node_t* p` means 'p tells you where a node is'. `*p` goes to that spot, and `p->x` reads field x of the thing p points at.",
    analogy: "A pointer is a sticky note with a locker number on it. The note isn't the stuff, it tells you which locker to open.",
  },
  {
    keys: /->|arrow|\bdot\b|\.\s*vs/i,
    title: "-> vs .",
    say: "Use `.` when you have the struct itself (`a[i].name`). Use `->` when you have a *pointer* to a struct (`p->name`, which is just shorthand for `(*p).name`).",
  },
  {
    keys: /malloc|calloc|allocat|heap memory|sizeof/i,
    title: "malloc / calloc",
    analogy: "malloc is booking a hotel room: you get back the room number (the address). calloc books it AND has housekeeping clean it first (zeros).",
    say: "`malloc(bytes)` asks for a block of memory and hands back its address (not cleared). `calloc(count, size)` does the same but zeroes it. Pattern: `type* p = malloc(sizeof(type));`. The type on the left matches the sizeof on the right.",
  },
  {
    keys: /\bfree\b|double free|leak/i,
    title: "free",
    analogy: "free is checking out of the hotel room. Check out exactly once: twice confuses the front desk (double free), never keeps the room forever (leak).",
    say: "Rule: one `free` for every `malloc`/`calloc`. Free inside-out (fields that were allocated, then the struct). If two pointers share one block, free it ONCE: freeing it twice is a double free, and never freeing it is a leak.",
  },
  {
    keys: /\bnull\b|empty list/i,
    title: "NULL",
    say: "`NULL` means 'points to nothing'. Before you write `p->anything`, make sure p can't be NULL (e.g. an empty list), or the program crashes.",
  },
  {
    keys: /linked list|\bnode\b|\bnext\b|\bprev\b|head|front/i,
    title: "linked lists",
    say: "Each node holds data plus a pointer to the next node (doubly linked: also to the previous one). Inserting at the front: make the node, point it at the old front, fix the old front's `prev`, return the new node.",
    analogy: "A linked list is a train: each car is hooked to the next one. To add a car at the front you hook the new car onto the old first car.",
  },
  {
    keys: /recurs|base case|calls itself/i,
    title: "recursion",
    say: "A recursive function solves a small case directly (the base case) and otherwise calls itself on a smaller input. Every value the recursion can land on needs a base case, so if f(n) calls f(n−1) AND f(n−2), you need two.",
    analogy: "Like Russian nesting dolls: open one, there's a smaller one inside, until you hit the tiny solid doll (the base case).",
  },
  {
    // "on the heap" (malloc memory) isn't about heaps
    keys: /percolat|heapify|min ?heap|max ?heap|\bheaps?\b(?![^.]*\bnode\b)(?!\s+memory)/i,
    title: "heaps",
    say: "A min heap keeps every parent ≤ its children, so the smallest value is at the root. In a 1-indexed array, the children of i are 2i and 2i+1. percolateDown swaps a value with its SMALLER child until it fits. Heapify = percolateDown from n/2 back to 1.",
    analogy: "A heap is a company org chart where every boss is 'smaller' (more urgent) than the people under them.",
  },
  {
    keys: /\bbst\b|binary search tree|subtree|traversal|pre-?order|in-?order|post-?order/i,
    title: "binary trees",
    analogy: "A BST is a sorting hat at every node: smaller things go left, bigger things go right, all the way down.",
    say: "BST rule: EVERYTHING in a node's left subtree is smaller, everything in its right subtree is bigger (not just the direct children). Pre-order = root, left, right. In-order = left, root, right. Post-order = left, right, root.",
  },
  {
    keys: /avl|rotation|rebalanc|balance|height/i,
    title: "AVL trees",
    analogy: "An AVL tree is like a hanging mobile: if one side gets more than one level heavier, it tips, so you rotate a few pieces until it hangs level again.",
    say: "An AVL node is unbalanced when its subtree heights differ by more than 1. Straight line (left-left / right-right) → one rotation. Zig-zag (left-right / right-left) → double rotation, and the middle value rises to the top. Each node stores its HEIGHT.",
  },
  {
    keys: /postfix|infix|stack|precedence|operator/i,
    title: "infix → postfix",
    say: "Numbers go straight to the output. `(` gets pushed. `)` pops to the output until the matching `(`. An operator first pops anything on top with greater or equal precedence, then gets pushed. At the end, pop everything.",
    analogy: "The stack is a waiting room for operators: they wait there until someone more important (or a `)`) makes them leave.",
  },
  {
    keys: /big.?o|run.?time|o\(|worst case|complexity/i,
    title: "Big-O",
    analogy: "Big-O is about how the line grows, not how long it is today. One barista (O(n)) is fine at 5 customers, but at 500 the growth is what matters.",
    say: "Big-O counts how the work grows with the input in the worst case. Ask: what's the unluckiest input, and how many steps does it force? One loop over n = O(n), halving each time = O(lg n), a loop inside a loop = O(n²).",
  },
  {
    keys: /timing|seconds|milliseconds|\bms\b|constant c|lg\s*10/i,
    title: "timing problems",
    analogy: "It's recipe scaling: figure out how long one 'unit' takes (that's c), then scale up to the new size.",
    say: "Write T(n) = c·f(n). Plug in the known n and time to solve for c. Then plug in the new n. Write logs as k·lg 10 so they cancel, and convert units at the very end.",
  },
  {
    keys: /recurrence|iteration|plug in|t\(n\)/i,
    title: "recurrences",
    analogy: "Unrolling a recurrence is opening a nesting doll one layer: replace each T(...) with what it equals, then count what you see.",
    say: "Iteration means: replace each T(something) using the recurrence itself (swap every n for that something), then collect like terms. Don't forget to multiply through by the coefficient in front, and keep the original + n.",
  },
  {
    keys: /quick ?sort|partition|pivot|merge ?sort|sort/i,
    title: "sorting",
    analogy: "Quick sort is organizing a bookshelf: pick one book, put smaller ones on its left and bigger ones on its right, then do the same to each side.",
    say: "Quick sort: partition around a pivot (smaller left, bigger right, pivot in its final spot), then recursively sort the left part and the right part. Average O(n lg n), worst O(n²). Merge sort always splits in half: O(n lg n) every time.",
  },
  {
    keys: /scanf|fscanf|format|%d|%s/i,
    title: "format strings",
    say: "`scanf` reads from the keyboard, `fscanf` from a FILE. Both need a format string in quotes that announces each value: `%d` int, `%s` string, `%c` char, `%f` float. Ints need an address: `&x`. Strings (char arrays) don't.",
  },
  {
    keys: /\bfor\b.*loop|loop|\bfor\s*\(/i,
    title: "for loops",
    say: "`for (start; keep-going-while; step)`. Counting up through n things: `for (int i = 0; i < n; i++)`. Counting down to 1: `for (int i = n; i >= 1; i--)`.",
  },
];

const BIT_OPS: Record<string, (a: number, b: number) => number> = {
  "^": (a, b) => a ^ b,
  "&": (a, b) => a & b,
  "|": (a, b) => a | b,
  "<<": (a, b) => a << b,
  ">>": (a, b) => a >> b,
};

const bin = (n: number, w: number) => (n >>> 0).toString(2).padStart(w, "0");

/** "what is 9 ^ 11" → a little worked bit table */
function bitMath(msg: string): string | null {
  const m = msg.match(/(0b[01]+|\d+)\s*(\^|&|\||<<|>>)\s*(0b[01]+|\d+)/);
  if (m) {
    const num = (s: string) => (s.startsWith("0b") ? parseInt(s.slice(2), 2) : parseInt(s, 10));
    const a = num(m[1]);
    const b = num(m[3]);
    const op = m[2];
    if (a > 1e6 || b > 31 * 1e5) return null;
    const r = BIT_OPS[op](a, b);
    if (op === "<<" || op === ">>") return `Let's work it out: \`${a}\` = \`${bin(a, 4)}\`. Shifting ${op === "<<" ? "left" : "right"} by ${b} gives \`${bin(r, 4)}\` = **${r}**.`;
    const w = Math.max(4, bin(Math.max(a, b, r), 1).length);
    const what = op === "^" ? "1 where the bits differ" : op === "&" ? "1 only where both are 1" : "1 where either is 1";
    return `Let's work it out bit by bit (${what}):\n\`${bin(a, w)}\`  (${a})\n\`${bin(b, w)}\`  (${b})\n\`${bin(r, w)}\`  = **${r}**`;
  }
  const d = msg.match(/(\d+)\s+(?:in|to)\s+binary/i);
  if (d) {
    const n = parseInt(d[1], 10);
    const parts = [];
    for (let j = 0; 1 << j <= n && j < 31; j++) if (n & (1 << j)) parts.push(1 << j);
    return `${n} in binary is \`${bin(n, 4)}\` (${parts.reverse().join(" + ") || 0}). Read it right to left: the rightmost digit is bit 0.`;
  }
  return null;
}

function correctOf(step: Step) {
  if (step.kind === "choice") return step.options.find((o) => o.ok)?.t ?? "";
  if (step.kind === "type") return step.answers[0];
  if (step.kind === "slots") return step.slots.map((s) => `${s.label ?? s.id} ${Array.isArray(s.answer) ? s.answer[0] : s.answer || "(empty)"}`).join(", ");
  return "";
}

/** Describe what kind of thing comes next, without giving it away. */
function kindOf(tok: string) {
  if (/^"/.test(tok)) return "a format string in double quotes";
  if (/^\d/.test(tok)) return "a number";
  if (MEANS[tok]) return `a C word or symbol that ${MEANS[tok]}`;
  if (/^\w/.test(tok)) return "a name (a variable or function from your inventory)";
  return "a symbol";
}

export function offlineReply(q: Question, step: Step | undefined, typed: string, message: string, picked: number[] = []): string {
  const msg = message.toLowerCase();
  const out: string[] = [];

  const math = bitMath(message);
  if (math) out.push(math);

  // straight-up "show me the answer"
  if (step && /just tell|show (me )?(the )?answer|give (me )?(the )?answer|what('?s| is) the answer/.test(msg)) {
    out.push(`Okay, here's this step's answer: \`${correctOf(step)}\`.`);
    if (step.learn) out.push(step.learn);
    out.push("Now cover it up and type it once from memory. That's the part that sticks.");
    return out.join("\n\n");
  }

  // "why is my answer wrong?"
  if (step && /wrong|mistake|error|incorrect|why (isn'?t|not|doesn'?t)|not working/.test(msg)) {
    if (step.kind === "type") {
      if (!typed.trim()) out.push("You haven't typed anything for this step yet. Try a first guess, even a messy one, and I'll point at the exact spot that's off.");
      else {
        const v = judge(typed, step.answers, { loose: step.loose, settled: true });
        if (v.state === "done") out.push("Actually, what you typed is correct! 🎉");
        else if (v.state === "wrong") {
          const good = typed.slice(0, v.typed.start).trim();
          out.push(`${good ? `Everything up to \`${good}\` is right. ` : ""}The first spot that's off is \`${v.typed.t}\`.`);
          out.push(hintFor(v, step.hints, step.nudge).say);
        } else if (v.state === "typing") {
          const next = tokenize(step.answers[0])[v.matched]?.t;
          out.push(`Nothing's wrong so far: all ${v.matched} pieces are right. You're just not finished.${next ? ` The next piece is ${kindOf(next)}.` : ""}`);
        }
      }
    } else if (step.kind === "choice") {
      const misses = picked.map((i) => step.options[i]).filter((o) => o && !o.ok);
      if (misses.length) out.push(...misses.map((o) => `About "${o.t}": ${o.why}`));
      else out.push("You haven't picked a wrong option on this step. Pick one and I'll explain why it does or doesn't work.");
    } else out.push("Press **Check** and the red boxes are the ones to fix. Re-read the prompt for exactly what each box wants.");
  }

  // concepts mentioned in the question
  const hits = CONCEPTS.filter((c) => c.keys.test(message));
  const wantsAnalogy = /analog|like what|real.?life|imagine|metaphor|picture it/.test(msg);
  const wantsTrap = /trap|careful|watch out|lose points|common mistake/.test(msg);

  for (const c of hits.slice(0, 3)) out.push(wantsAnalogy && c.analogy ? c.analogy + " " + c.say : c.say);

  // vague message ("explain", "i don't get it"): explain from the step itself
  if (!hits.length && !math && out.length === 0) {
    // what this step is really about: its answer first, then its prompt, then the question's topic
    const clean = (s: string) => s.replace(/\*\*/g, "");
    const layers = [step?.kind === "type" ? step.answers[0] : "", clean(step?.prompt ?? ""), q.topic, clean(q.story)];
    const ctxHits: Concept[] = [];
    for (const l of layers) for (const c of CONCEPTS) if (c.keys.test(l) && !ctxHits.includes(c)) ctxHits.push(c);
    if (wantsAnalogy) {
      const a = ctxHits.find((c) => c.analogy);
      out.push(a ? a.analogy! : "Think of it like a recipe: each line of code is one small instruction, in order. Ask yourself what single thing this line has to do.");
    } else if (wantsTrap) {
      out.push(`The trap here: ${q.takeaway}`);
      const rule = step?.kind === "type" ? step.hints?.[0] : undefined;
      if (rule) out.push(`A mistake I see a lot on this step: ${rule.say}`);
    } else {
      if (step) out.push(`This step is asking: ${step.prompt.replace(/\*\*/g, "").replace(/\n+/g, " ")}`);
      if (ctxHits[0]) out.push(`The idea you need: ${ctxHits[0].say}`);
      if (step?.kind === "type" && step.nudge) out.push(`Hint: ${step.nudge}`);
    }
  } else if (wantsTrap) out.push(`The trap here: ${q.takeaway}`);

  if (!out.length) out.push(`I'm not sure I caught that. Try naming the part that confuses you (like "XOR", "the key", "malloc", or "->"), or ask me to explain this step.`);
  return out.join("\n\n");
}
