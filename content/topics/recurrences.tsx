import type { Topic } from "@/lib/types";
import { Callout, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const recurrences: Topic = {
  slug: "recurrences",
  title: "Recurrence Relations",
  short: "Recurrences",
  emoji: "🪆",
  section: "IIA",
  mascot: "tofu",
  tagline: "A recurrence describes a recursive function's runtime using itself. Unroll it like nesting dolls!",
  minutes: 22,
  tldr: [
    <>A <b>recurrence</b> is an equation that defines T(n) using T of something smaller, like <code>T(n) = T(n−1) + 1</code>, plus a <b>base case</b> like <code>T(1) = 1</code>.</>,
    <>It comes straight from recursive code: <b>(number of recursive calls) × T(smaller size) + (other work in the function)</b>.</>,
    <><b>Iteration method</b>: plug the recurrence into itself 2–3 times, spot the pattern with a <b>k</b>, then pick k so you hit the base case.</>,
    <>Memorize the famous ones: <Hi>T(n/2)+1 → log n</Hi> · <Hi>2T(n/2)+n → n log n</Hi> · <Hi>T(n−1)+n → n²</Hi> · <Hi>2T(n−1)+1 → 2ⁿ</Hi></>,
    <>Master Theorem (bonus): T(n) = aT(n/b) + nᵈ → compare a with bᵈ.</>,
  ],
  picture: {
    title: "Russian nesting dolls 🪆",
    scene: <div style={{ fontSize: "2.4rem" }}>🪆→🪆→🪆→🫘</div>,
    caption: "open, open, open… base case!",
    body: (
      <>
        <p>T(n) is a doll. Open it and inside you find some work (the &ldquo;+ n&rdquo; part) and a smaller doll, T(n−1). Keep opening until you reach the tiny solid bean: the <b>base case</b>.</p>
        <p>The total work = all the little bits of work you found in every doll, added up. That&apos;s why summations and recurrences are best friends!</p>
      </>
    ),
  },
  levels: [
    {
      title: "Code → recurrence",
      body: (
        <>
          <Code
            title="read the recursion's shape"
            src={`
int sum(int *a, int n) {            // T(n)
    if (n == 0) return 0;           // base case: T(0) = 1
    return a[n-1] + sum(a, n - 1);  // 1 call on size n-1, plus O(1) work
}
// → T(n) = T(n-1) + 1

void mergeSort(int *a, int lo, int hi) {   // T(n)
    if (lo >= hi) return;
    int mid = (lo + hi) / 2;
    mergeSort(a, lo, mid);          // T(n/2)
    mergeSort(a, mid + 1, hi);      // T(n/2)
    merge(a, lo, mid, hi);          // O(n) work
}
// → T(n) = 2T(n/2) + n`}
          />
        </>
      ),
    },
    {
      title: "The iteration method (unrolling)",
      body: (
        <>
          <p><b>Solve T(n) = T(n−1) + n, T(1) = 1.</b></p>
          <ol>
            <li>T(n) = T(n−1) + n</li>
            <li>= [T(n−2) + (n−1)] + n</li>
            <li>= T(n−3) + (n−2) + (n−1) + n</li>
            <li>Pattern after k steps: T(n−k) + (n−k+1) + … + n</li>
            <li>Base case when n − k = 1 → k = n − 1: T(1) + 2 + 3 + … + n = 1 + 2 + … + n = <b>n(n+1)/2 → O(n²)</b></li>
          </ol>
        </>
      ),
    },
    {
      title: "Divide-by-2 recurrences",
      body: (
        <>
          <p><b>Solve T(n) = 2T(n/2) + n, T(1) = 1</b> (merge sort).</p>
          <ol>
            <li>T(n) = 2T(n/2) + n</li>
            <li>= 2[2T(n/4) + n/2] + n = 4T(n/4) + 2n</li>
            <li>= 4[2T(n/8) + n/4] + 2n = 8T(n/8) + 3n</li>
            <li>After k steps: <b>2ᵏ T(n/2ᵏ) + k·n</b></li>
            <li>Base case: n/2ᵏ = 1 → 2ᵏ = n → k = log₂n. So T(n) = n·T(1) + n log₂n = <b>n + n log n → O(n log n)</b></li>
          </ol>
          <Callout kind="tip" title="Key move">
            When you see n/2ᵏ, set it to 1: that gives <b>k = log₂ n</b> and <b>2ᵏ = n</b>. Substitute both!
          </Callout>
        </>
      ),
    },
    {
      title: "Bonus: the Master Theorem",
      body: (
        <>
          <p>For <b>T(n) = a·T(n/b) + O(nᵈ)</b>, compare <b>a</b> with <b>bᵈ</b>:</p>
          <ul>
            <li>a &lt; bᵈ → <b>O(nᵈ)</b> (the top-level work dominates)</li>
            <li>a = bᵈ → <b>O(nᵈ log n)</b> (every level does equal work)</li>
            <li>a &gt; bᵈ → <b>O(n^(log_b a))</b> (the leaves dominate)</li>
          </ul>
          <p>Merge sort: a = 2, b = 2, d = 1 → 2 = 2¹ → O(n log n) ✅. Binary search: a = 1, b = 2, d = 0 → 1 = 2⁰ → O(log n) ✅.</p>
          <Callout kind="warn" title="On the FE">
            They usually ask you to solve by <b>iteration</b> and show your work. Use the Master Theorem to <b>check</b> your answer, not replace the work.
          </Callout>
        </>
      ),
    },
  ],
  widgets: ["recurrence"],
  mnemonics: [
    { hook: "Calls × T(size) + extra work 🧾", body: <p>Count the recursive calls (a), the size each one gets (n/b or n−1), and the non-recursive work. That IS the recurrence.</p> },
    { hook: "Unroll 3 times, then k 🧶", body: <p>Three expansions is enough to see the pattern. Then write the general k-th step.</p> },
    { hook: "n/2ᵏ = 1 → k = log n", body: <p>The magic substitution for any halving recurrence.</p> },
    { hook: "Halve → log. Minus one → n. Two calls on n−1 → 2ⁿ", body: <p>A quick gut check for which family you&apos;re in.</p> },
  ],
  missing: [
    {
      title: "Recurrence trees (another way to see it)",
      body: <p>Draw each call as a box with its extra work inside. Add up each row, then add up the rows. For 2T(n/2) + n, each row adds to n and there are log n rows → n log n. The widget above does exactly this!</p>,
    },
    {
      title: "Why the base case barely matters for Big-O",
      body: <p>T(1) = 1 or T(1) = 5 only changes a constant. But it matters when the FE asks for an <b>exact</b> closed form, so keep it in!</p>,
    },
    {
      title: "The Fibonacci trap",
      body: <p>Naive recursive Fibonacci has T(n) = T(n−1) + T(n−2) + 1, which is exponential (about 1.6ⁿ). The same values get recomputed again and again. Memoization fixes it (a preview of dynamic programming in CS2!).</p>,
    },
  ],
  traps: [
    <>Writing T(n) = T(n/2) + 1 for a function that makes <b>two</b> recursive calls. Count the calls!</>,
    <>Stopping after unrolling without doing the <b>k-substitution</b> and base case. That part is where the points are.</>,
    <>Arithmetic in the k-th step: 2ᵏ·T(n/2ᵏ) + k·n, not 2ᵏ·n.</>,
    <>Forgetting the base case value when the question wants an exact answer (like 2n − 1 rather than just O(n)).</>,
  ],
  example: {
    title: "Worked problem: T(n) = T(n/2) + n",
    prompt: <p><b>FE-style:</b> Solve <span className="mono">T(n) = T(n/2) + n</span>, <span className="mono">T(1) = 1</span>, using iteration. Assume n is a power of 2.</p>,
    steps: [
      <p>T(n) = T(n/2) + n</p>,
      <p>= T(n/4) + n/2 + n</p>,
      <p>= T(n/8) + n/4 + n/2 + n</p>,
      <p>After k steps: T(n/2ᵏ) + n(1 + ½ + ¼ + … + 1/2ᵏ⁻¹) = T(n/2ᵏ) + n·(2 − 2/2ᵏ)</p>,
      <p>Let n/2ᵏ = 1 → 2ᵏ = n: T(1) + n(2 − 2/n) = 1 + 2n − 2 = <b>2n − 1 → O(n)</b> ✅ Check: T(2) = T(1) + 2 = 3 = 2·2 − 1 ✓</p>,
    ],
  },
  quiz: [
    {
      q: <>Which recurrence describes binary search?</>,
      choices: ["T(n) = 2T(n/2) + 1", "T(n) = T(n/2) + 1", "T(n) = T(n−1) + 1", "T(n) = T(n/2) + n"],
      answer: 1,
      why: <>One recursive call on half the array, plus constant work.</>,
    },
    {
      q: <>T(n) = 2T(n−1) + 1, T(0) = 0. What is T(n)?</>,
      choices: ["2n", "n²", "2ⁿ − 1", "n log n"],
      answer: 2,
      why: <>That&apos;s Towers of Hanoi! 1 + 2 + 4 + … + 2ⁿ⁻¹ = 2ⁿ − 1.</>,
    },
    {
      q: <>For T(n) = 4T(n/2) + n, the Master Theorem gives…</>,
      choices: ["O(n)", "O(n log n)", "O(n²)", "O(4ⁿ)"],
      answer: 2,
      why: <>a = 4, bᵈ = 2¹ = 2, so a &gt; bᵈ → O(n^(log₂4)) = O(n²).</>,
    },
  ],
  flashcards: [
    { front: "T(n) = T(n/2) + 1", back: "O(log n) (binary search)" },
    { front: "T(n) = 2T(n/2) + n", back: "O(n log n) (merge sort)" },
    { front: "T(n) = T(n−1) + n", back: "O(n²): sum 1..n" },
    { front: "T(n) = 2T(n−1) + 1", back: "O(2ⁿ): Towers of Hanoi, exactly 2ⁿ − 1" },
    { front: "T(n) = T(n−1) + 1", back: "O(n)" },
    { front: "Iteration method substitution for halving", back: "Set n/2ᵏ = 1 → k = log₂ n, 2ᵏ = n" },
  ],
  resources: [
    { label: "Programiz: Master Theorem", url: "https://www.programiz.com/dsa/master-theorem", kind: "read" },
    { label: "Master theorem (Wikipedia)", url: "https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)", kind: "read" },
    { label: "Abdul Bari: Recurrence relations", url: "https://www.youtube.com/results?search_query=abdul+bari+recurrence+relation+substitution", kind: "video", note: "His series walks through tons of examples by substitution." },
    { label: "MIT 6.006 (free course)", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", kind: "read", note: "The deep-dive version, if you're curious." },
  ],
  notes: [{ label: "Recurrence Relations (Iteration)", file: "RecRelIter.pdf" }],
};
