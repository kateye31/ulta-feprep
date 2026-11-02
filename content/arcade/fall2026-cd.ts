import type { ChoiceStep, Question } from "@/lib/arcade/types";
import { loops } from "./fall2026-ab";

// ───────────────────────────── Section C ─────────────────────────────

function bigO(id: string, title: string, prompt: string, options: [string, string, boolean?][]): ChoiceStep {
  return { id, kind: "choice", title, pts: 1, prompt, mono: true, options: options.map(([t, why, ok]) => ({ t, why, ok })) };
}

export const C1: Question = {
  id: "C1",
  pts: 10,
  category: "ANL",
  topic: "Algorithm Analysis",
  title: "Ten worst cases",
  story: "What is the **worst case** run-time of each of the following algorithms/operations? Give your answers in Big-Oh form, using the appropriate variables in each question. (1 pt each, the answer has to be completely correct.)",
  given: [{ id: "c1-ladder", title: "The Big-O ladder", kind: "text", body: "O(1) < O(lg n) < O(n) < O(n lg n) < O(n²) < O(2ⁿ) < O(n·2ⁿ)\n\nworst case = the unluckiest possible input" }],
  steps: [
    bigO("a", "(a) Linked list: insert at front", "Inserting 1 item into the **front** of a linked list storing n items.", [
      ["O(1)", "Make a node, point it at the old head, done. No walking.", true],
      ["O(n)", "Nothing here walks the list. The front is right there."],
      ["O(lg n)", "There's no halving going on. It's just a couple of pointer changes."],
    ]),
    bigO("b", "(b) Linked list: insert at back", "Inserting 1 item into the **back** of a linked list storing n items, where there is only direct access to the **front** node.", [
      ["O(1)", "That'd need a tail pointer, and we only have the front."],
      ["O(n)", "You have to walk past all n nodes to find the end.", true],
      ["O(n²)", "One walk down the list is enough: n steps, once."],
    ]),
    bigO("c", "(c) Min heap: peek at the min", "**Returning** the minimum value in a minheap storing n items.", [
      ["O(1)", "The minimum always lives at the root, A[1]. Just look!", true],
      ["O(lg n)", "That's for *deleting* it. Just returning it is instant."],
      ["O(n)", "No searching needed: the heap keeps the min at the top."],
    ]),
    bigO("d", "(d) Min heap: delete the min", "**Deleting** the minimum value in a minheap storing n items.", [
      ["O(1)", "After removing the root, the replacement has to sink back down."],
      ["O(lg n)", "The last element moves to the root and percolates down the tree's height: lg n.", true],
      ["O(n)", "Percolating down only follows one path (the height), not the whole heap."],
    ]),
    bigO("e", "(e) Quick Sort", "Sorting an array of n items using **Quick Sort** (worst case!).", [
      ["O(n lg n)", "That's Quick Sort's *average*. The worst case is when every pivot is terrible."],
      ["O(n²)", "Bad pivots (e.g. already sorted input) split n into 0 and n−1 every time: n + (n−1) + … = O(n²).", true],
      ["O(n)", "Even a perfect partition step is O(n) per level, and there are levels."],
    ]),
    bigO("f", "(f) Merge Sort", "Sorting an array of n items using **Merge Sort**.", [
      ["O(n lg n)", "Merge sort always splits evenly: lg n levels × n work per level, even in the worst case.", true],
      ["O(n²)", "Merge sort has no bad case. It always halves."],
      ["O(lg n)", "You at least have to look at every item, so it's at least O(n)."],
    ]),
    bigO("g", "(g) realloc every time", "Starting with an empty array, appending n items one by one, **reallocating before each addition** so the array is always exactly full.", [
      ["O(n)", "Each realloc may copy everything so far: 1 + 2 + 3 + … + n."],
      ["O(n²)", "Copying 1 + 2 + … + n elements = n(n+1)/2 = O(n²). (That's why real dynamic arrays double in size!)", true],
      ["O(n lg n)", "That'd be closer if the array *doubled*. Growing by one each time copies way more."],
    ]),
    bigO("h", "(h) Print every subset", "Printing out each subset of a set with n items, when printing a subset of k items takes O(k).", [
      ["O(2ⁿ)", "There are 2ⁿ subsets, but each takes up to n time to print."],
      ["O(n·2ⁿ)", "2ⁿ subsets × up to n items each = O(n·2ⁿ).", true],
      ["O(n²)", "The number of subsets doubles with every item: exponential, not polynomial."],
    ]),
    bigO("i", "(i) Floodfill a grid", "Running a **floodfill** on a grid with r rows and c columns.", [
      ["O(rc)", "Each of the r·c cells gets visited (at most) once.", true],
      ["O(r + c)", "That's just one row plus one column. The fill can spread over the whole grid."],
      ["O(n)", "Use the question's variables! Here they're r and c."],
    ]),
    bigO("j", "(j) Trie lookup", "Searching for a word with **d letters** in a trie storing n words.", [
      ["O(d)", "One step per letter, no matter how many words are stored. That's the whole point of a trie.", true],
      ["O(n)", "A trie never looks at the other words. It just follows the letters."],
      ["O(d lg n)", "No comparisons between words. Each letter is one direct jump."],
    ]),
  ],
  answer: "(a) O(1)   (b) O(n)   (c) O(1)   (d) O(lg n)   (e) O(n²)\n(f) O(n lg n)   (g) O(n²)   (h) O(n·2ⁿ)   (i) O(rc)   (j) O(d)",
  takeaway: "Say what the worst input looks like out loud, then count the work. Use the question's own variable names.",
};

export const C2: Question = {
  id: "C2",
  pts: 10,
  category: "ANL",
  topic: "Algorithm Analysis (timing)",
  title: "How long for 10⁷?",
  story: "An algorithm that processes an array of size n runs in **O(n lg²n)** time. (Note: lg²n = (lg n) × (lg n).) For an array of size n = 10⁶, the algorithm runs in **108 milliseconds**. How many **seconds** will the algorithm be expected to take when processing an array of size 10⁷?",
  given: [{ id: "c2-facts", title: "The facts", kind: "text", body: "Runtime: O(n lg²n)\nn = 10⁶  →  108 ms\nn = 10⁷  →  ? SECONDS\n\nlg(10ᵏ) = k · lg 10" }],
  steps: [
    {
      id: "setup",
      kind: "choice",
      title: "Set up the equation",
      pts: 1,
      prompt: "Step one on every timing problem: write the runtime with an unknown constant. Which is right?",
      options: [
        { t: "T(n) = c · n lg²n", ok: true, why: "Big-O hides a constant, so we bring it back as c and solve for it." },
        { t: "T(n) = n lg²n", why: "Without a constant, n = 10⁶ wouldn't give exactly 108 ms. We need c." },
        { t: "T(n) = 108 · n lg²n", why: "108 is the *time* for one specific n, not the constant." },
      ],
    },
    {
      id: "solve-c",
      kind: "slots",
      title: "Solve for c",
      pts: 2,
      score: "all",
      prompt: "Plug in n = 10⁶. Since lg(10⁶) = 6 · lg 10, fill the box:",
      layout: "row",
      slots: [{ id: "six", label: "c = 108 ms ÷ ( 10⁶ · (", answer: "6", after: "· lg 10)² )", w: 3 }],
    },
    {
      id: "div36",
      kind: "slots",
      title: "Simplify",
      pts: 1,
      prompt: "(6 · lg 10)² = 36 (lg 10)². So simplify the fraction:",
      layout: "row",
      slots: [{ id: "three", label: "108 ÷ 36 =", answer: "3", w: 3, after: "  so  c = 3 ms ÷ (10⁶ · (lg 10)²)" }],
    },
    {
      id: "plug",
      kind: "choice",
      title: "Plug in 10⁷",
      pts: 1,
      prompt: "Now what do we compute?",
      options: [
        { t: "T(10⁷) = c · 10⁷ · (lg 10⁷)²", ok: true, why: "Same formula, new n." },
        { t: "T(10⁷) = 108 · 10", why: "That would be true for O(n), but lg²n grows too." },
      ],
    },
    {
      id: "reduce",
      kind: "slots",
      title: "Reduce lg²(10⁷)",
      pts: 2,
      score: "all",
      prompt: "Rewrite the log so it cancels with the (lg 10)² inside c:",
      layout: "row",
      slots: [
        { id: "seven", label: "(lg 10⁷)² = (", answer: "7", after: "· lg 10)²", w: 3 },
        { id: "fortynine", label: " =", answer: "49", after: "(lg 10)²", w: 4 },
      ],
      learn: "Now the (lg 10)² on top cancels the (lg 10)² inside c. That's the whole trick.",
    },
    {
      id: "ms",
      kind: "slots",
      title: "Milliseconds",
      pts: 2,
      prompt: "T(10⁷) = (3 ms ÷ 10⁶) · 10⁷ · 49 = 3 · 10 · 49 =",
      layout: "row",
      slots: [{ id: "ms", label: "", answer: ["1470", "1,470"], after: "ms", w: 6 }],
    },
    {
      id: "sec",
      kind: "slots",
      title: "Convert!",
      pts: 1,
      prompt: "The question asked for **seconds**. Don't lose the last point!",
      layout: "row",
      slots: [{ id: "s", label: "1470 ms =", answer: ["1.47", "1.470"], after: "seconds", w: 6 }],
    },
  ],
  answer: "T(n) = c·n·lg²n\nc = 108 / (10⁶ · (6 lg10)²) = 3 / (10⁶ (lg10)²)\nT(10⁷) = 3/(10⁶ (lg10)²) · 10⁷ · (7 lg10)² = 3 · 10 · 49 = 1470 ms = 1.47 seconds",
  takeaway: "Write T(n) = c·f(n), solve c, plug in. Write logs as k·lg 10 so they cancel. Convert units at the end!",
};

export const C3: Question = {
  id: "C3",
  pts: 5,
  category: "ANL",
  topic: "Recurrence Relations",
  title: "Unroll it once",
  story: "Consider the recurrence  **T(n) = 2T(3n/4) + T(n/4) + n**.\n\nUsing the iteration technique, rewrite it in the form\n\n**T(n) = aT(9n/16) + bT(3n/16) + cT(n/16) + dn**\n\nby plugging into each recursive term on the right-hand side **once**. Find a, b, c and d.",
  given: [{ id: "c3-rec", title: "The recurrence", kind: "text", body: "T(n) = 2T(3n/4) + T(n/4) + n\n\ngoal: T(n) = aT(9n/16) + bT(3n/16) + cT(n/16) + dn" }],
  steps: [
    {
      id: "how",
      kind: "choice",
      title: "How do we 'plug in'?",
      prompt: "To expand T(3n/4) using the recurrence, we…",
      options: [
        { t: "Replace every n in the recurrence with 3n/4", ok: true, why: "T(3n/4) = 2T(3·(3n/4)/4) + T((3n/4)/4) + 3n/4." },
        { t: "Multiply the whole recurrence by 3/4", why: "Not quite. The n *inside* each T( ) changes too, not just the outside." },
      ],
    },
    {
      id: "exp1",
      kind: "slots",
      title: "Expand T(3n/4)",
      prompt: "Fill in T(3n/4):",
      layout: "row",
      slots: [
        { id: "k", label: "T(3n/4) =", answer: "2", w: 3 },
        { id: "x", label: "T(", answer: ["9n/16"], after: ")", w: 6 },
        { id: "y", label: "+ T(", answer: ["3n/16"], after: ")", w: 6 },
        { id: "z", label: "+", answer: ["3n/4"], w: 6 },
      ],
    },
    {
      id: "exp2",
      kind: "slots",
      title: "Expand T(n/4)",
      prompt: "Fill in T(n/4):",
      layout: "row",
      slots: [
        { id: "x", label: "T(n/4) = 2T(", answer: ["3n/16"], after: ")", w: 6 },
        { id: "y", label: "+ T(", answer: ["n/16"], after: ")", w: 6 },
        { id: "z", label: "+", answer: ["n/4"], w: 6 },
      ],
    },
    {
      id: "abcd",
      kind: "slots",
      title: "Collect the terms",
      pts: 5,
      score: "each",
      prompt: "Substitute both in: T(n) = **2**·[2T(9n/16) + T(3n/16) + 3n/4] + [2T(3n/16) + T(n/16) + n/4] + n.\n\nCollect like terms. (a, b and c are 1 pt each, d is 2 pts.)",
      layout: "row",
      slots: [
        { id: "a", label: "a =", answer: "4", pts: 1, w: 3 },
        { id: "b", label: "b =", answer: "4", pts: 1, w: 3 },
        { id: "c", label: "c =", answer: "1", pts: 1, w: 3 },
        { id: "d", label: "d =", answer: ["11/4", "2.75"], pts: 2, w: 6 },
      ],
      learn: "d = 2·(3/4) + 1/4 + 1 = 3/2 + 1/4 + 1 = 11/4. Don't forget the original + n!",
    },
  ],
  answer: "T(n) = 4T(9n/16) + 4T(3n/16) + T(n/16) + 11n/4\na = 4, b = 4, c = 1, d = 11/4",
  takeaway: "Plug in = replace n everywhere. Distribute the coefficient in front, and keep the original + n.",
};

// ───────────────────────────── Section D ─────────────────────────────

export const D1: Question = {
  id: "D1",
  pts: 5,
  category: "DSN",
  topic: "Recursive Coding",
  title: "Derangements",
  story:
    "A **derangement** of a list is a reordering where no item stays in its original position. Dₙ, the number of derangements of n items, is defined recursively:\n\nD₀ = 1,  D₁ = 0\nDₙ = (n − 1)(Dₙ₋₁ + Dₙ₋₂),  n ≥ 2\n\nWrite a recursive function that takes a non-negative integer n and **returns Dₙ**. (0 ≤ n ≤ 12, so no overflow.)",
  given: [
    { id: "d1-def", title: "The definition", kind: "text", body: "D₀ = 1\nD₁ = 0\nDₙ = (n − 1)(Dₙ₋₁ + Dₙ₋₂)   for n ≥ 2" },
    { id: "d1-header", title: "Function header", kind: "code", body: "int derangements(int n) {\n\n}" },
  ],
  scaffold: { title: "derangements so far", code: "int derangements(int n) {\n    {{base0}}\n    {{base1}}\n    {{rec}}\n}" },
  steps: [
    {
      id: "trace",
      kind: "slots",
      title: "Warm up by hand",
      prompt: "Use the formula to compute a few values (this is how you'd check your code):",
      layout: "row",
      slots: [
        { id: "d2", label: "D₂ = 1·(D₁ + D₀) =", answer: "1", w: 3 },
        { id: "d3", label: "D₃ = 2·(D₂ + D₁) =", answer: "2", w: 3 },
        { id: "d4", label: "D₄ = 3·(D₃ + D₂) =", answer: "9", w: 3 },
      ],
    },
    {
      id: "bases",
      kind: "choice",
      title: "How many base cases?",
      prompt: "Why do we need **two** base cases here?",
      options: [
        { t: "Dₙ calls BOTH n−1 and n−2, so the recursion can land on 0 or on 1", ok: true, why: "If we only stopped at 0, then derangements(1) would call derangements(-1). Oops!" },
        { t: "We only need one: n == 0", why: "derangements(1) would call derangements(−1), which recurses forever." },
      ],
    },
    {
      id: "base0",
      kind: "type",
      title: "Base case D₀",
      pts: 1,
      prompt: "Write the first base case: D₀ = 1.",
      answers: ["if (n == 0) return 1;", "if (n == 0) { return 1; }", "if (0 == n) return 1;", "if (!n) return 1;"],
      hints: [{ when: "=", at: "==", say: "One `=` stores a value. To *ask* if n is 0, use `==`." }],
    },
    {
      id: "base1",
      kind: "type",
      title: "Base case D₁",
      pts: 1,
      prompt: "Second base case: D₁ = 0.",
      answers: ["if (n == 1) return 0;", "if (n == 1) { return 0; }", "if (1 == n) return 0;"],
      hints: [{ when: "1", at: "0", say: "Check the definition card: what does D₁ equal?" }],
    },
    {
      id: "rec",
      kind: "type",
      title: "The recursive case",
      pts: 3,
      penalty: 1,
      prompt: "Now translate Dₙ = (n − 1)(Dₙ₋₁ + Dₙ₋₂) into one `return` line. Remember, the D's are *calls* to `derangements`.",
      answers: [
        "return (n - 1) * (derangements(n - 1) + derangements(n - 2));",
        "return (n - 1) * (derangements(n - 2) + derangements(n - 1));",
        "return (derangements(n - 1) + derangements(n - 2)) * (n - 1);",
        "return (n - 1) * derangements(n - 1) + (n - 1) * derangements(n - 2);",
      ],
      hints: [
        { when: ["D", "Dn", "D_n"], say: "`D` isn't a C function! Dₙ is what *our* function computes, so call it by name." },
        { when: "derangement", at: "derangements", say: "Check the exact function name in the header: it ends with an s." },
        { when: "n", at: "(", say: "Careful: `n - 1 * (...)` multiplies first! You need parentheses around n − 1." },
      ],
    },
  ],
  answer: "int derangements(int n) {\n    if (n == 0) return 1;      // 1 pt\n    if (n == 1) return 0;      // 1 pt\n    return (n-1) * (derangements(n-1) + derangements(n-2));   // 3 pts\n}",
  takeaway: "Every value the recursion can land on needs a base case. Parenthesize (n − 1)!",
};

const WHAT = `int whatdoesitdo(int* array, int low, int high) {
    int* a1 = calloc(high-low+1, sizeof(int));
    int* a2 = calloc(high-low+1, sizeof(int));
    int i = 0, j = 0, save = array[low];
    for (int idx=low+1; idx<=high; idx++) {
        if (array[idx] < array[low])
            a1[i++] = array[idx];
        else
            a2[j++] = array[idx];
    }
    for (int idx=low; idx<low+i; idx++)
        array[idx] = a1[idx-low];
    array[low+i] = save;
    for (int idx=low+i+1; idx<=high; idx++)
        array[idx] = a2[idx-low-i-1];
    free(a1); free(a2);
    return low+i;
}`;

export const D2: Question = {
  id: "D2",
  pts: 10,
  category: "ALG",
  topic: "Sorting",
  title: "What does it do?",
  story:
    "You're given a helper for a well-known sort, written differently than usually taught. **Use it to write a function that sorts an array of n integers in O(n lg n) time in the average case.** `sort` sorts `array` from index `low` through `high`, inclusive, in non-decreasing order.",
  given: [
    { id: "d2-helper", title: "The mystery helper", kind: "code", body: WHAT },
    { id: "d2-header", title: "Function header", kind: "code", body: "// Sorts array[low..high], inclusive, in non-decreasing order.\nvoid sort(int* array, int low, int high) {\n\n}" },
  ],
  scaffold: { title: "sort so far", code: "void sort(int* array, int low, int high) {\n    {{base}}\n    {{mid}}\n    {{left}}\n    {{right}}\n}" },
  steps: [
    {
      id: "trace",
      kind: "slots",
      title: "Trace the mystery",
      prompt: "Run `whatdoesitdo` by hand on `array = {5, 8, 1, 7, 3}`, `low = 0`, `high = 4`. (`save` = 5. Smaller values go to a1 in order, the rest go to a2.) What's the array afterwards, and what does it return?",
      layout: "array",
      index: ["[0]", "[1]", "[2]", "[3]", "[4]", "returns"],
      slots: [
        { id: "x0", answer: "1" },
        { id: "x1", answer: "3" },
        { id: "x2", answer: "5" },
        { id: "x3", answer: "8" },
        { id: "x4", answer: "7" },
        { id: "r", answer: "2" },
      ],
      learn: "Everything smaller than 5 ended up on its left, everything else on its right, and it returned where 5 landed.",
    },
    {
      id: "what",
      kind: "choice",
      title: "So what does it do?",
      prompt: "In one sentence, `whatdoesitdo`…",
      options: [
        { t: "Partitions around array[low] and returns the pivot's final index", ok: true, why: "It's a (stable, not-in-place) partition. The pivot is now in its final sorted spot." },
        { t: "Merges two sorted halves", why: "Nothing here assumes sorted halves. It splits around one value." },
        { t: "Fully sorts the array", why: "Only the pivot is guaranteed in place. 8 and 7 are still out of order." },
      ],
    },
    {
      id: "which",
      kind: "choice",
      title: "Name that sort",
      prompt: "A partition helper + O(n lg n) *average* case means we're writing…",
      options: [
        { t: "Quick Sort", ok: true, why: "Partition, then recursively sort the left part and the right part." },
        { t: "Merge Sort", why: "Merge sort's helper is a *merge*. And its O(n lg n) isn't just 'average'." },
        { t: "Insertion Sort", why: "That's O(n²) on average." },
      ],
    },
    {
      id: "basecase",
      kind: "choice",
      title: "When do we stop?",
      prompt: "When is there nothing to sort?",
      options: [
        { t: "When low >= high (zero or one element)", ok: true, why: "A range of 0 or 1 items is already sorted." },
        { t: "When low == 0", why: "low is just where the range starts. The range could still be big." },
        { t: "When high == n", why: "There's no n in this function. Use low and high." },
      ],
    },
    {
      id: "base",
      kind: "type",
      title: "Base case",
      pts: 2,
      prompt: "Write the base case line.",
      answers: ["if (low >= high) return;", "if (high <= low) return;", "if (low >= high) { return; }"],
      hints: [
        { when: "0", at: "return", say: "`sort` is `void`, so it can't return a value. Just `return;`." },
        { when: ">", at: ">=", say: "What about a range with exactly one element (low == high)?" },
      ],
    },
    {
      id: "mid",
      kind: "type",
      title: "Partition",
      pts: 4,
      penalty: 1,
      prompt: "Call the helper and **save** where the pivot landed in a variable called `mid`.",
      answers: ["int mid = whatdoesitdo(array, low, high);"],
      hints: [
        { when: "partition", say: "Use the helper we were *given*. What's its exact name?" },
        { when: "0", at: "low", say: "Partition the range we're sorting: low to high, not the whole array." },
        { when: "n", at: "high", say: "There's no n here. The range ends at `high`." },
      ],
    },
    {
      id: "left",
      kind: "type",
      title: "Sort the left part",
      pts: 2,
      prompt: "Recursively sort everything **left** of the pivot.",
      answers: ["sort(array, low, mid - 1);"],
      hints: [{ when: "mid", at: "-", say: "The pivot is already in place, so stop *just before* it." }],
    },
    {
      id: "right",
      kind: "type",
      title: "Sort the right part",
      pts: 2,
      prompt: "And everything **right** of the pivot.",
      answers: ["sort(array, mid + 1, high);"],
      hints: [{ when: "mid", at: "+", say: "Start *just after* the pivot." }],
    },
  ],
  answer: "void sort(int* array, int low, int high) {\n    if (low >= high) return;                      // 2 pts\n    int mid = whatdoesitdo(array, low, high);     // 4 pts\n    sort(array, low, mid-1);                      // 2 pts\n    sort(array, mid+1, high);                     // 2 pts\n}",
  takeaway: "Trace a mystery function on a tiny array first. Quick sort = base case, partition, recurse left, recurse right.",
};

export const D3: Question = {
  id: "D3",
  pts: 10,
  category: "DSN",
  topic: "Bitwise Operators",
  title: "Grade the True/False test",
  story:
    "A True/False test of k questions (k < 32) is stored in one integer: if the answer to question i is True, **bit i** (value 2ⁱ) is 1, otherwise 0.\n\nComplete `scoreTests`: `studAnswers[i]` holds student i's answers, `n` is the number of students, `key` holds the correct answers, and `k` is the number of questions. Store each student's number of correct answers in `studScores` and return it. **You must use bitwise operators in a way that shortens your code.**",
  given: [
    { id: "d3-header", title: "Given code", kind: "code", body: "int* scoreTests(int* studAnswers, int n, int key, int k) {\n    int* studScores = calloc(n, sizeof(int));\n\n    return studScores;\n}" },
    { id: "d3-ops", title: "Bitwise cheat card", kind: "text", body: "a & b   1 where BOTH are 1\na | b   1 where EITHER is 1\na ^ b   1 where they're DIFFERENT\n1 << j  just bit j turned on (= 2ʲ)" },
  ],
  scaffold: {
    title: "scoreTests so far",
    code: "int* scoreTests(int* studAnswers, int n, int key, int k) {\n    int* studScores = calloc(n, sizeof(int));\n    {{outer}}\n        {{start}}\n        {{xor}}\n        {{inner}}\n            {{test}}\n                {{dec}}\n    }\n    return studScores;\n}",
  },
  steps: [
    {
      id: "xor-idea",
      kind: "choice",
      title: "The big idea",
      prompt: "What does `studAnswers[i] ^ key` give you?",
      options: [
        { t: "A 1 in every bit where the student's answer is WRONG", ok: true, why: "XOR is 1 exactly where the bits differ, which means the student disagrees with the key. So: count the 1s = count the mistakes." },
        { t: "A 1 in every bit where the student is RIGHT", why: "Where they match, XOR gives 0. That's the opposite!" },
        { t: "The student's score", why: "It gives a *pattern* of bits. We still have to count them." },
      ],
    },
    {
      id: "trace",
      kind: "slots",
      title: "Try one by hand",
      prompt: "k = 4. key = **1011**, student = **1001** (binary). Fill in:",
      layout: "row",
      slots: [
        { id: "x", label: "student ^ key =", answer: ["0010", "10"], w: 6 },
        { id: "w", label: "wrong answers =", answer: "1", w: 3 },
        { id: "s", label: "score =", answer: "3", w: 3 },
      ],
    },
    {
      id: "bitj",
      kind: "choice",
      title: "Test bit j",
      prompt: "How do you check whether bit **j** of `res` is 1?",
      mono: true,
      options: [
        { t: "res & (1 << j)", ok: true, why: "1 << j is a mask with only bit j on. AND keeps just that bit: nonzero means it was 1." },
        { t: "res | (1 << j)", why: "OR *turns bit j on*. It doesn't test it." },
        { t: "res & j", why: "j is a position, not a mask. You need 1 << j to turn the position into a mask." },
      ],
    },
    {
      id: "outer",
      kind: "type",
      title: "Loop over students",
      pts: 1,
      prompt: "Write the outer loop over all n students (use `i`, and open a `{`).",
      answers: loops(["int i = 0", "int i=0"], ["i < n"], ["i++", "++i"], [" {"]),
      hints: [{ when: "k", at: "n", say: "k is the number of *questions*. How many *students* are there?" }],
    },
    {
      id: "start",
      kind: "type",
      title: "Start at full marks",
      pts: 1,
      prompt: "Our plan: start each student at a perfect score, then subtract one per wrong answer. Set student i's score to full marks.",
      answers: ["studScores[i] = k;"],
      hints: [{ when: "n", at: "k", say: "A perfect score is the number of *questions*." }],
    },
    {
      id: "xor",
      kind: "type",
      title: "Find the mistakes",
      pts: 3,
      penalty: 1,
      prompt: "Store the 'which ones are wrong' bit pattern in an int called `res`.",
      answers: ["int res = studAnswers[i] ^ key;", "int res = key ^ studAnswers[i];"],
      hints: [
        { when: "&", at: "^", say: "AND finds where both are 1. We want where they're *different*. Check the cheat card." },
        { when: "|", at: "^", say: "OR isn't it. Which operator is 1 exactly where the bits differ?" },
        { when: "studAnswers", at: "studAnswers", say: "Close! Which student? Index into the array." },
      ],
    },
    {
      id: "inner",
      kind: "type",
      title: "Loop over questions",
      pts: 1,
      prompt: "Loop over every question bit with `j`.",
      answers: loops(["int j = 0", "int j=0"], ["j < k"], ["j++", "++j"], ["", " {"]),
      hints: [{ when: "n", at: "k", say: "This loop is over the k *questions*, not the students." }],
    },
    {
      id: "test",
      kind: "type",
      title: "Is bit j wrong?",
      pts: 2,
      prompt: "Write the `if` that checks whether bit j of `res` is 1.",
      answers: ["if (res & (1 << j))", "if ((res >> j) & 1)", "if ((res & (1 << j)) != 0)", "if (res & (1 << j)) {", "if ((res >> j) & 1) {"],
      hints: [{ when: "j", at: "(", say: "`res & j` treats j as a mask. Shift a 1 over to position j first." }],
    },
    {
      id: "dec",
      kind: "type",
      title: "Take a point off",
      pts: 2,
      prompt: "That answer was wrong, so take one point off student i.",
      answers: ["studScores[i]--;", "studScores[i] -= 1;", "studScores[i] = studScores[i] - 1;", "--studScores[i];"],
      hints: [{ when: "++", say: "A set bit in res means a *wrong* answer. Subtract!" }],
    },
  ],
  answer:
    "for (int i=0; i<n; i++) {                  // 1 pt\n    studScores[i] = k;\n    int res = studAnswers[i]^key;          // 3 pts\n    for (int j=0; j<k; j++)                // 1 pt\n        if (res & (1<<j))                  // 2 pts\n            studScores[i]--;\n}\n// 3 pts: the counting mechanism (start at k, subtract per wrong answer)",
  takeaway: "XOR = 'where do these differ?'. Mask bit j with (1 << j). Count the 1 bits.",
};
