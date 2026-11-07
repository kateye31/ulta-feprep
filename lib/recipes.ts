import type { Question } from "@/lib/arcade/types";

/**
 * Recipes: the same numbered steps every time for one kind of FE question, like a math procedure.
 * Step text supports `code` and **bold**. `ex` is an optional line of C (or math) to fill in.
 */
export type Recipe = {
  id: string;
  emoji: string;
  name: string;
  section: "A" | "B" | "C" | "D";
  /** how to recognize this kind of question */
  spot: string;
  steps: { e: string; t: string; ex?: string }[];
  /** the slip that costs the most points */
  trap: string;
  /** problem-of-the-day topic ids that use this recipe */
  potd?: string[];
};

export const RECIPES: Recipe[] = [
  // ── Section A ──
  {
    id: "malloc",
    emoji: "🧠",
    name: "Dynamic memory (malloc / realloc / free)",
    section: "A",
    spot: "Allocate, fill, grow, or free a struct, string, or array.",
    steps: [
      { e: "📥", t: "Draw every pointer as a box with an arrow. What lives **inside** the struct, what lives **somewhere else**?" },
      { e: "🔢", t: "Count the blocks. Each `char *` name, each row, each struct = its own block." },
      { e: "📏", t: "Size = how many × `sizeof(` what ONE slot holds `)`.", ex: "malloc(sizeof(int *) * n)   // n row pointers\nmalloc(sizeof(int) * len)   // len ints" },
      { e: "📝", t: "Strings: room for the letters **+ 1** for `'\\0'`. Copy with `strcpy`, never `=`." },
      { e: "🔁", t: "Growing? `realloc` the old pointer and store it back.", ex: "p = realloc(p, sizeof(item_t) * (count + 1));" },
      { e: "🧹", t: "Freeing? Inside first, struct last. One `free` per `malloc`." },
    ],
    trap: "`sizeof(int *)` vs `sizeof(int)`, and `->` for pointers vs `.` for plain structs.",
    potd: ["dynamic-memory"],
  },
  {
    id: "list-code",
    emoji: "🚃",
    name: "Writing linked list code",
    section: "A",
    spot: "Insert, delete, or walk through a linked list.",
    steps: [
      { e: "📥", t: "Draw a 3-node list on paper. Circle the **return type**." },
      { e: "🛑", t: "Empty list: what happens if `head == NULL`?" },
      { e: "🧱", t: "New node? malloc it, set `data`, set `next` (and `prev`).", ex: "node_t *n = malloc(sizeof(node_t));" },
      { e: "🔗", t: "List the arrows that change. Hook up the new node **before** you break an old arrow." },
      { e: "🚶", t: "Walking: `cur->next != NULL` stops **on** the last node. `cur != NULL` walks off the end.", ex: "while (cur->next != NULL) cur = cur->next;" },
      { e: "📤", t: "Return the head (it may be a new one)." },
    ],
    trap: "Reading `->next` from a NULL pointer, or losing the rest of the list.",
    potd: ["linked-lists"],
  },
  {
    id: "list-trace",
    emoji: "🧵",
    name: "Tracing a mystery list function",
    section: "A",
    spot: "\"Show the list after calling mystery(head).\"",
    steps: [
      { e: "📥", t: "Write the list as boxes: `5 → 2 → 1 → 8 → 7`." },
      { e: "🏷️", t: "Write each pointer variable's name **under** the box it points to." },
      { e: "🔁", t: "Run **one** loop pass, line by line. Move the labels, change values or arrows." },
      { e: "🔂", t: "Run a second pass. Now say the pattern in words (\"swaps pairs\", \"front goes to back\")." },
      { e: "🛑", t: "Check the stop condition for the last node or two." },
    ],
    trap: "Mixing up values moving (`data` changes) with nodes moving (`next` changes).",
  },
  {
    id: "postfix",
    emoji: "📚",
    name: "Infix → postfix with a stack",
    section: "A",
    spot: "Convert an expression and show the stack at points A, B, C.",
    steps: [
      { e: "🔢", t: "Number → straight to the output." },
      { e: "🫸", t: "`(` → push it." },
      { e: "➕", t: "Operator → pop while the top is **equal or higher** (`* /` beat `+ -`) and isn't `(`. Then push." },
      { e: "🫷", t: "`)` → pop to output until `(`. Throw both parentheses away." },
      { e: "📸", t: "At each letter, copy the stack **bottom → top**." },
      { e: "🏁", t: "End → pop everything. Count: numbers + operators should match the boxes." },
    ],
    trap: "Pushing `-` on top of `+`. Equal precedence pops first.",
    potd: ["stacks"],
  },
  {
    id: "queue",
    emoji: "🎟️",
    name: "Queues",
    section: "A",
    spot: "Enqueue / dequeue code or a trace of a line of people.",
    steps: [
      { e: "📥", t: "Front leaves, back joins. Write the queue left (front) → right (back)." },
      { e: "🔎", t: "`dequeue` **removes** and returns. `front`/`peek` only looks." },
      { e: "🔁", t: "Trace one round at a time; write the queue after each round." },
      { e: "🛑", t: "Loop until the stop condition (often `size > 1`)." },
    ],
    trap: "Using `front` where you needed `dequeue`: the person never leaves the line.",
    potd: ["queues"],
  },

  // ── Section B ──
  {
    id: "tree-code",
    emoji: "🌳",
    name: "Writing tree code (recursion)",
    section: "B",
    spot: "Write a function taking `node *root` that returns a count, sum, max, or yes/no.",
    steps: [
      { e: "📥", t: "Write what you have: input `root`, the output type, the goal in plain words." },
      { e: "🛑", t: "Empty tree: what's the answer?", ex: "if (root == NULL) return 0;" },
      { e: "🧺", t: "Make an answer box.", ex: "int sum = 0;" },
      { e: "👀", t: "Look at **ONE** node: does it count? Words → code: empty `== NULL`, there `!= NULL`, and `&&`, or `||`." },
      { e: "👈👉", t: "Ask the kids. Trust them.", ex: "sum += f(root->left);\nsum += f(root->right);" },
      { e: "📤", t: "Return the box.", ex: "return sum;" },
    ],
    trap: "Touching `root->left` before checking `root == NULL`.",
    potd: ["binary-trees"],
  },
  {
    id: "tree-trace",
    emoji: "🔍",
    name: "Tracing a tree function",
    section: "B",
    spot: "\"What does this print?\" for a function on a tree.",
    steps: [
      { e: "📥", t: "Where is the `printf`? Before the calls = preorder, between = inorder, after = postorder." },
      { e: "↔️", t: "Which side is called **first**? Write the rule as 3 words, like \"right, me, left\"." },
      { e: "🌳", t: "Start at the root and apply the rule. Going down? Write the node on a to-do list." },
      { e: "↩️", t: "NULL: return right away and go back up to the last node on your list." },
      { e: "🔢", t: "Count outputs = number of nodes." },
    ],
    trap: "Assuming left-first. Read which call comes first.",
  },
  {
    id: "heap",
    emoji: "🏔️",
    name: "Heaps",
    section: "B",
    spot: "A heap as an array or tree: insert, delete, percolate, heapify, or \"is this valid?\".",
    steps: [
      { e: "📥", t: "Write the index rules. Root at 1: kids `2i`, `2i+1`, parent `i/2`." },
      { e: "🌲", t: "Sketch the array as a tree, filling each level left → right." },
      { e: "⬆️", t: "Insert: put it at the end, swap up while smaller than its parent (minheap)." },
      { e: "⬇️", t: "Delete min: last item → root, swap down with the **smaller** kid." },
      { e: "🏗️", t: "Heapify: percolate down from index `n/2` back to 1." },
      { e: "✅", t: "Valid heap = parent ≤ kids **and** complete shape (no gaps)." },
      { e: "📤", t: "Heap sort: build it, then `removeMin` n times into a new array. They come out sorted.", ex: "res[i] = removeMin(h);" },
    ],
    trap: "Answering with the index when they asked for the data (or the other way around).",
    potd: ["heaps"],
  },
  {
    id: "avl",
    emoji: "🌲",
    name: "AVL trees",
    section: "B",
    spot: "Insert into or delete from an AVL tree and draw the result.",
    steps: [
      { e: "📥", t: "Do the plain BST insert or delete first." },
      { e: "⬆️", t: "Walk back up from the change. At each node compare left height vs right height." },
      { e: "🚨", t: "The first node that's off by **2** is the problem node." },
      { e: "🧭", t: "From the problem node, take 2 steps toward the change. Same direction → single rotation. Zig-zag → double." },
      { e: "🔺", t: "The **middle** value of those 3 nodes goes on top; the other two become its kids." },
      { e: "🧩", t: "Re-hang the leftover subtrees in BST order." },
      { e: "✅", t: "Check BST order and balance. Deleting? Keep walking up: it can rotate again." },
    ],
    trap: "Not a valid BST or AVL at the end = automatic 0. Always check.",
    potd: ["avl-trees"],
  },
  {
    id: "hash",
    emoji: "#️⃣",
    name: "Hash tables",
    section: "B",
    spot: "Insert keys into a table, or write a hash function.",
    steps: [
      { e: "📥", t: "Write the table size and the hash rule." },
      { e: "🧮", t: "Index = hash `%` size." },
      { e: "💥", t: "Taken? Linear probing: try the next slot (wrap around). Quadratic: +1, +4, +9…" },
      { e: "🔁", t: "Hash function code: keep everything under `% m` every step. No `pow`.", ex: "res = (res + pow27 * (s[i] - 'a' + 1)) % m;\npow27 = (pow27 * 27) % m;" },
    ],
    trap: "Forgetting to wrap around to index 0.",
    potd: ["hash-tables"],
  },
  {
    id: "trie",
    emoji: "🔤",
    name: "Tries",
    section: "B",
    spot: "Insert, search, or print words in a trie.",
    steps: [
      { e: "📥", t: "Each node has `children[26]` and an `isWord` flag." },
      { e: "🔡", t: "Letter → index: `c - 'a'`. Index → letter: `'a' + i`." },
      { e: "🛑", t: "Base case: NULL node, or you've built the full length." },
      { e: "🔁", t: "Loop `i` from 0 to 25, write the letter at depth `k`, recurse with `k + 1`." },
    ],
    trap: "Writing the letter at `buffer[i]` instead of `buffer[k]`.",
    potd: ["tries"],
  },

  // ── Section C ──
  {
    id: "bigo-list",
    emoji: "📋",
    name: "Big-O list (worst case)",
    section: "C",
    spot: "\"Give the worst case run time of each operation.\"",
    steps: [
      { e: "📥", t: "Underline the data structure and the operation." },
      { e: "😈", t: "Picture the **worst** input (sorted data into a BST turns it into a line)." },
      { e: "🧮", t: "How many items get touched?" },
      { e: "✍️", t: "Answer with the question's own letters (n, k, b…)." },
      { e: "🗂️", t: "Classics: BST O(n) · AVL O(lg n) · heap insert/delete O(lg n) · heapify O(n) · heap/merge sort O(n lg n) · quick sort worst O(n²)." },
      { e: "🧁", t: "Sorts on **average**: insertion & selection O(n²) · merge, heap & quick O(n lg n). Heap sort: build O(n), then n removals × lg n." },
    ],
    trap: "Giving the average case. They asked for the worst.",
    potd: ["big-o"],
  },
  {
    id: "code-runtime",
    emoji: "⏱️",
    name: "Big-O of a piece of code",
    section: "C",
    spot: "\"What is the run time of this function?\"",
    steps: [
      { e: "🔁", t: "For each loop: how many times does it run? `+1`/`-1` steps → n. `×2`/`÷2` → lg n." },
      { e: "🪆", t: "Loops inside loops → **multiply**." },
      { e: "➡️", t: "Loops one after another → **add**, keep the biggest." },
      { e: "🧩", t: "Watch the variable each loop uses. A loop over `m` is O(m), not O(n)." },
      { e: "🔄", t: "Recursive? Write a recurrence: (# calls) × T(smaller size) + work outside the calls." },
    ],
    trap: "A `while` loop that changes a different variable than you think.",
  },
  {
    id: "scaling",
    emoji: "⏳",
    name: "Timing problems",
    section: "C",
    spot: "\"It took X ms for n = …. How long for n = …?\"",
    steps: [
      { e: "📥", t: "Write T(n) = c · f(n).", ex: "T(n) = c · n³" },
      { e: "🔌", t: "Plug in the known run.", ex: "c · 400³ = 125" },
      { e: "➗", t: "Solve for c. Leave it as a fraction.", ex: "c = 125 / 400³" },
      { e: "🔌", t: "Plug in the new n.", ex: "T(640) = (125 / 400³) · 640³" },
      { e: "🍰", t: "Simplify the ratio **first**, then raise it to the power.", ex: "125 · (8/5)³ = 512" },
      { e: "✅", t: "Units: answer in what they asked (ms, seconds, days)." },
    ],
    trap: "Multiplying out huge numbers instead of simplifying the ratio.",
    potd: ["timing-problems"],
  },
  {
    id: "recurrence",
    emoji: "🔁",
    name: "Recurrences (iteration)",
    section: "C",
    spot: "Solve T(n) = … with a base case, or set one up from code.",
    steps: [
      { e: "📥", t: "Write T(n) and the base case." },
      { e: "🔁", t: "Substitute T(n−1) (or T(n/2)) once. Simplify." },
      { e: "🔁", t: "Do it again. Write k = 1, 2, 3 rows." },
      { e: "🧩", t: "Write the pattern after **k** steps." },
      { e: "🎯", t: "Pick k to land on the base case.", ex: "n − k = 1  →  k = n − 1" },
      { e: "🧮", t: "Plug in and simplify." },
    ],
    trap: "Not simplifying each row, so the pattern stays hidden.",
    potd: ["recurrences"],
  },
  {
    id: "summation",
    emoji: "➕",
    name: "Summations",
    section: "C",
    spot: "Find a closed form for Σ (or a double Σ).",
    steps: [
      { e: "📥", t: "Double sum? Solve the **inner** one first." },
      { e: "✂️", t: "Split sums of + and −. Pull constants out front." },
      { e: "📖", t: "Formulas: Σ1 = n · Σi = n(n+1)/2 · Σi² = n(n+1)(2n+1)/6 · Σi³ = (n(n+1)/2)²" },
      { e: "🔌", t: "Top limit is 2n? Replace **every** n in the formula with 2n." },
      { e: "🧲", t: "Factor out the shared piece, like n(n+1), before expanding anything." },
      { e: "✅", t: "Check with n = 1: your answer should equal the first term." },
    ],
    trap: "Expanding everything and drowning in algebra.",
    potd: ["summations"],
  },

  // ── Section D ──
  {
    id: "recursive-code",
    emoji: "🪆",
    name: "Recursion & backtracking code",
    section: "D",
    spot: "Count, print, or try every arrangement (permutations, subsets, grids).",
    steps: [
      { e: "📥", t: "What does each parameter mean? (`k` = next spot to fill)" },
      { e: "🛑", t: "Base case: all spots filled → count it or print it.", ex: "if (k == n) return 1;" },
      { e: "🔁", t: "Loop over every choice." },
      { e: "🚫", t: "Skip choices that break a rule (`used`? too far?).", ex: "if (used[i]) continue;" },
      { e: "✅", t: "Choose: mark it used, place it.", ex: "used[i] = 1; perm[k] = i;" },
      { e: "🪆", t: "Recurse on the next spot and add the result.", ex: "res += f(..., k + 1);" },
      { e: "↩️", t: "Un-choose: unmark it.", ex: "used[i] = 0;" },
      { e: "📤", t: "Return the total." },
    ],
    trap: "Forgetting to unmark, or passing `k++` instead of `k + 1`.",
    potd: ["recursion", "backtracking"],
  },
  {
    id: "sorting",
    emoji: "🧺",
    name: "Sorting traces",
    section: "D",
    spot: "Show the array after each iteration of a sort.",
    steps: [
      { e: "📥", t: "Name the sort and what **one** iteration does." },
      { e: "🫧", t: "Bubble: one pass walks the **whole** array, swapping neighbors. It's not just one swap. The biggest bubbles to the end.", ex: "4 1 3 2  →  1 3 2 4   (not 1 4 3 2)" },
      { e: "🎯", t: "Selection: find the max (or min), then **swap those two**. Nothing else moves.", ex: "7 3 9 1 5  →  1 3 9 7 5   (not 1 7 3 9 5)" },
      { e: "🃏", t: "Insertion: take the next item, slide it left into place." },
      { e: "⚡", t: "Quick: low stops on a number **bigger** than the pivot, high on one **≤** it. Not crossed: swap them. Crossed: swap the pivot with high.", ex: "5 3 8 1 9 2  →  1 3 2 5 9 8" },
      { e: "📝", t: "One row per iteration. A row can stay the same; still write it." },
    ],
    trap: "Doing Bubble Sort moves on a Selection Sort question.",
    potd: ["sorting"],
  },
  {
    id: "sort-swaps",
    emoji: "🃏",
    name: "Counting Insertion Sort swaps",
    section: "D",
    spot: "\"How many swaps will Insertion Sort do on this array?\"",
    steps: [
      { e: "👉", t: "Go left to right, starting at the **2nd** element." },
      { e: "🔢", t: "For each element, count the **bigger numbers to its left**. That's how many swaps it costs.", ex: "21 in 35 25 15 29 39 22 19 6 21\n→ 35, 25, 29, 39, 22 are bigger = 5 swaps" },
      { e: "➕", t: "Add up the counts.", ex: "1 + 2 + 1 + 0 + 4 + 5 + 7 + 5 = 25" },
      { e: "😈", t: "Most possible? Reverse order: every pair swaps, so `n(n−1)/2`. Already sorted: 0." },
    ],
    trap: "Counting misplaced elements. A swap count is how far each element travels, not how many are out of place.",
  },
  {
    id: "bitwise",
    emoji: "💡",
    name: "Bitwise operators",
    section: "D",
    spot: "Test, set, or count bits, or loop over subsets with a mask.",
    steps: [
      { e: "📥", t: "Write the number in binary. Bit 0 is on the **right**." },
      { e: "🔎", t: "Is bit i on?", ex: "if ((x & (1 << i)) != 0)" },
      { e: "🛠️", t: "Set: `x | (1 << i)` · clear: `x & ~(1 << i)` · flip: `x ^ (1 << i)`" },
      { e: "🔁", t: "Every bit: `i < 8 * sizeof(int)`. Every subset of n: `mask < (1 << n)`." },
    ],
    trap: "`&&` (logical) instead of `&` (bitwise).",
    potd: ["bitwise"],
  },
  {
    id: "base-conversion",
    emoji: "🔢",
    name: "Base conversion",
    section: "D",
    spot: "Convert between binary, hex, decimal, or base b.",
    steps: [
      { e: "🧱", t: "Binary → hex: groups of 4 from the **right**, pad the left with 0s." },
      { e: "➗", t: "Decimal → base b: divide by b, write remainders, read them **bottom up**." },
      { e: "✖️", t: "Base b → decimal: each digit × b^position, add them up." },
    ],
    trap: "Grouping bits from the left.",
    potd: ["base-conversion"],
  },
];

export const getRecipe = (id: string) => RECIPES.find((r) => r.id === id);

/** the recipe for a Night Shift question: its own `recipe` id, else picked from topic and category */
export function recipeFor(q: Question): Recipe | undefined {
  if (q.recipe) return getRecipe(q.recipe);
  const t = q.topic.toLowerCase();
  const pick = (id: string) => getRecipe(id);
  if (t.includes("memory")) return pick("malloc");
  if (t.includes("linked")) return pick(q.category === "DSN" ? "list-code" : "list-trace");
  if (t.includes("stack")) return pick("postfix");
  if (t.includes("queue")) return pick("queue");
  if (t.includes("avl")) return pick("avl");
  if (t.includes("heap")) return pick("heap");
  if (t.includes("hash")) return pick("hash");
  if (t.includes("trie")) return pick("trie");
  if (t.includes("tree")) return pick(q.category === "DSN" ? "tree-code" : "tree-trace");
  if (t.includes("recurrence")) return pick("recurrence");
  if (t.includes("summation")) return pick("summation");
  if (t.includes("analysis") || t.includes("big")) {
    if (t.includes("timing") || /second|millisecond|minute|took /i.test(q.story)) return pick("scaling");
    if (/worst case/i.test(q.story)) return pick("bigo-list");
    return pick("code-runtime");
  }
  if (t.includes("recursi") || t.includes("backtrack")) return pick("recursive-code");
  if (t.includes("sort")) return pick("sorting");
  if (t.includes("bit")) return pick("bitwise");
  if (t.includes("base")) return pick("base-conversion");
  return undefined;
}

export const recipeForTopic = (potdTopic: string) => RECIPES.find((r) => r.potd?.includes(potdTopic));
