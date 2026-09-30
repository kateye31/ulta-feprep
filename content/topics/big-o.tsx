import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const bigO: Topic = {
  slug: "big-o",
  title: "Big-O & Code Analysis",
  short: "Big-O",
  emoji: "🏁",
  section: "IIA",
  mascot: "tofu",
  tagline: "Big-O isn't about seconds. It's about how the work GROWS when the input grows. Hoo!",
  minutes: 22,
  tldr: [
    <>Big-O describes how an algorithm&apos;s work <b>grows</b> as the input size <b>n</b> grows. It ignores constants and small stuff.</>,
    <>The growth ladder: <Hi c="matcha">1 &lt; log n &lt; n &lt; n log n</Hi> &lt; <Hi>n² &lt; n³</Hi> &lt; <Hi c="blush">2ⁿ &lt; n!</Hi></>,
    <><b>Sequential</b> code → <b>add</b> (keep the biggest). <b>Nested</b> loops → <b>multiply</b>.</>,
    <>A loop where i <b>doubles or halves</b> runs <b>log n</b> times.</>,
    <>FE trap: a variable that <b>never resets</b> (like <code>j</code> in a two-pointer sweep) makes &ldquo;nested&rdquo; loops just O(n) total!</>,
  ],
  picture: {
    title: "Planning a party 🎉",
    scene: <EmojiRow items={[["📨", "O(n): invite everyone"], ["🤝", "O(n²): everyone shakes hands"], ["📖", "O(log n): phonebook"]]} />,
    caption: "how does the work grow with the guest list?",
    body: (
      <>
        <ul>
          <li><b>O(1)</b>: turning on the lights 💡. Same effort for 5 guests or 500.</li>
          <li><b>O(log n)</b>: finding a name in a sorted phonebook 📖 by flipping to the middle, then the middle of the half…</li>
          <li><b>O(n)</b>: handing each guest a party hat 🎩.</li>
          <li><b>O(n²)</b>: every guest shakes hands with every other guest 🤝. Double the guests → 4× the handshakes!</li>
          <li><b>O(2ⁿ)</b>: trying every possible combo of who sits at the VIP table 😱.</li>
        </ul>
      </>
    ),
  },
  levels: [
    {
      title: "What Big-O means",
      body: (
        <>
          <p>We count <b>basic steps</b> (comparisons, assignments, additions) as a function of n, then keep only the <b>fastest-growing term</b> and drop constants:</p>
          <p className="mono">3n² + 100n + 7 → O(n²)</p>
          <p>Why drop them? When n is a million, n² is a trillion. The 100n (a hundred million) is basically a rounding error. Big-O is about the <b>shape</b> of the growth curve.</p>
        </>
      ),
    },
    {
      title: "Reading loops",
      body: (
        <>
          <Code
            title="the loop patterns you'll see on every FE"
            src={`
for (i = 0; i < n; i++)            // n times              → O(n)
    sum++;

for (i = 0; i < n; i++)            // nested: n · n         → O(n²)
    for (j = 0; j < n; j++)
        sum++;

for (i = 1; i < n; i *= 2)         // 1,2,4,8,...           → O(log n)
    sum++;

for (i = 0; i < n; i++)            // inner runs i times:   → O(n²)
    for (j = 0; j < i; j++)        // 0+1+2+...+(n-1) = n(n-1)/2
        sum++;

for (i = 0; i < n; i++)            // n · log n             → O(n log n)
    for (j = 1; j < n; j *= 2)
        sum++;`}
          />
        </>
      ),
    },
    {
      title: "The sneaky ones (FE favorites)",
      body: (
        <>
          <Code
            title="looks like O(n²)... isn't!"
            src={`
int j = 0;
for (int i = 0; i < n; i++) {
    while (j < n && arr[j] < arr[i])   // j is NEVER reset to 0
        j++;
}
// j moves forward at most n times TOTAL across all i.
// Total work: n (for i) + n (for j) = O(n)`}
          />
          <Code
            title="looks like O(n)... isn't!"
            src={`
for (int i = 0; i < n; i++) {
    int k = i;
    while (k > 0)          // halves k each time: log(i) steps
        k /= 2;
}
// Sum of log(i) for i = 1..n  →  O(n log n)`}
          />
          <Callout kind="tip" title="The trick">
            Don&apos;t just count how many loops are nested. Ask: <b>how many times, in total, does the innermost line run?</b>
          </Callout>
        </>
      ),
    },
    {
      title: "The formal definition (and its cousins)",
      body: (
        <>
          <p><b>f(n) = O(g(n))</b> means: there are constants <b>c &gt; 0</b> and <b>n₀</b> such that <b>f(n) ≤ c·g(n)</b> for all n ≥ n₀. In words: eventually, g (times some constant) stays above f forever. It&apos;s an <b>upper bound</b>.</p>
          <ul>
            <li><b>Ω (Omega)</b>: a lower bound (f grows at least as fast as g).</li>
            <li><b>Θ (Theta)</b>: a tight bound (both O and Ω). When people say &ldquo;Big-O&rdquo; casually, they usually mean Θ.</li>
          </ul>
          <p>Example: 3n + 5 = O(n), because 3n + 5 ≤ 4n for all n ≥ 5 (c = 4, n₀ = 5).</p>
        </>
      ),
    },
  ],
  widgets: ["bigo"],
  drills: [["Runtime lab: code that counts its own steps","professor-drills/5-runtime-lab.c"]],
  mnemonics: [
    { hook: "Nested = multiply, next-to = add ✖️➕", body: <p>Loops inside loops multiply. Loops one after another add (and the biggest wins).</p> },
    { hook: "Doubling or halving? Think log 🪵", body: <p>If the loop variable is multiplied or divided each time, it&apos;s a log. log₂(1,000,000) ≈ 20!</p> },
    { hook: "1, log, n, n-log, n², n³, 2ⁿ, n! 🐇→🪨", body: <p>Say it as a chant: &ldquo;one, log, en, en-log-en, square, cube, two-to-the, factorial&rdquo;.</p> },
    { hook: "Never reset? Never nested 🧶", body: <p>If the inner loop&apos;s variable never goes back to the start, its total work is added, not multiplied.</p> },
  ],
  missing: [
    {
      title: "What's a logarithm again?",
      body: <p><b>log₂ n</b> answers: &ldquo;2 to what power gives n?&rdquo;, or &ldquo;how many times can I halve n before reaching 1?&rdquo;. log₂ 8 = 3, log₂ 1024 = 10, log₂ 1,000,000 ≈ 20. In Big-O the base doesn&apos;t matter (log₂ vs log₁₀ only differ by a constant).</p>,
    },
    {
      title: "Best, worst, average case",
      body: <p>Insertion sort on already-sorted data is O(n) (best case), but O(n²) on reversed data (worst). The FE usually asks for the <b>worst case</b> unless it says otherwise.</p>,
    },
    {
      title: "Big-O of the data structures you know",
      body: (
        <div className="table-scroll">
          <table className="cozy">
            <tbody>
              <tr><td>Array access by index</td><td>O(1)</td></tr>
              <tr><td>Binary search (sorted array)</td><td>O(log n)</td></tr>
              <tr><td>Linked list search</td><td>O(n)</td></tr>
              <tr><td>Balanced BST / AVL search</td><td>O(log n)</td></tr>
              <tr><td>Heap insert / delete-min</td><td>O(log n)</td></tr>
              <tr><td>Hash table lookup (avg)</td><td>O(1)</td></tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      title: "Space complexity exists too",
      body: <p>Big-O can measure <b>memory</b> as well as time. Merge sort uses O(n) extra memory, while heapsort uses O(1) extra. Recursion also uses stack memory: one frame per active call!</p>,
    },
  ],
  traps: [
    <>Assuming two nested loops always means O(n²). Check whether the inner variable resets!</>,
    <>Loops with <code>i *= 2</code> or <code>i /= 2</code> are log n, not n.</>,
    <>When the inner loop depends on the outer (<code>j &lt; i</code>), write the sum, and don&apos;t guess.</>,
    <>If the question has two inputs (n and m), keep both! O(n·m) is not O(n²).</>,
    <>Function calls inside loops count too. <code>strlen(s)</code> in a loop condition is O(n) <b>every</b> iteration!</>,
  ],
  example: {
    title: "Worked problem: analyze this code",
    prompt: (
      <>
        <p><b>FE-style:</b> What&apos;s the Big-O runtime, in terms of n?</p>
        <Code src={`int f(int n) {
    int count = 0;
    for (int i = n; i > 0; i /= 2)
        for (int j = 0; j < i; j++)
            count++;
    return count;
}`} />
      </>
    ),
    steps: [
      <p>Don&apos;t multiply blindly! The inner loop runs <b>i</b> times, and i changes: n, n/2, n/4, …, 1.</p>,
      <p>So the total count = n + n/2 + n/4 + … + 1.</p>,
      <p>That&apos;s a geometric series. It adds up to less than <b>2n</b> (like the pizza puzzle: ½ + ¼ + ⅛ + … never passes 1 whole pizza 🍕).</p>,
      <p><b>Answer: O(n)</b> 🎉 Even though it looks like O(n log n) at first glance!</p>,
    ],
  },
  quiz: [
    {
      q: <>Runtime of: <code>for (i = 0; i &lt; n; i++) for (j = 0; j &lt; 100; j++) x++;</code></>,
      choices: ["O(1)", "O(n)", "O(n²)", "O(100n²)"],
      answer: 1,
      why: <>The inner loop is a constant 100, so it&apos;s 100n = O(n).</>,
    },
    {
      q: <>Runtime of: <code>for (i = 1; i &lt; n; i *= 3) x++;</code></>,
      choices: ["O(n)", "O(n/3)", "O(log n)", "O(1)"],
      answer: 2,
      why: <>i goes 1, 3, 9, 27… → log₃ n steps = O(log n).</>,
    },
    {
      q: <>Which grows fastest?</>,
      choices: ["n³", "2ⁿ", "n log n", "n¹⁰⁰"],
      answer: 1,
      why: <>Any exponential eventually beats any polynomial, even n¹⁰⁰ (it just takes a big n).</>,
    },
    {
      q: <>Two separate (not nested) loops, one O(n) and one O(n²). Total?</>,
      choices: ["O(n³)", "O(n²)", "O(n)", "O(n + n²) and you can't simplify"],
      answer: 1,
      why: <>Sequential → add → n + n² → keep the biggest → O(n²).</>,
    },
  ],
  flashcards: [
    { front: "Order these: n log n, 2ⁿ, log n, n², n", back: "log n < n < n log n < n² < 2ⁿ" },
    { front: "Loop with i *= 2 up to n runs how many times?", back: "About log₂ n" },
    { front: "Σ of inner loop j < i for i = 0..n-1", back: "n(n-1)/2 → O(n²)" },
    { front: "Formal definition of f(n) = O(g(n))", back: "∃ c > 0, n₀ such that f(n) ≤ c·g(n) for all n ≥ n₀." },
    { front: "Nested loops where the inner var never resets", back: "Usually O(n) total: the inner work is shared across all outer iterations." },
  ],
  resources: [
    { label: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/", kind: "read", note: "The famous color-coded chart of every data structure & sort." },
    { label: "Khan Academy: Asymptotic notation", url: "https://www.khanacademy.org/computing/computer-science/algorithms/asymptotic-notation/a/asymptotic-notation", kind: "read", note: "Gentle, with interactive graphs." },
    { label: "CS50 Lecture 3 notes: Algorithms", url: "https://cs50.harvard.edu/x/2024/notes/3/", kind: "read" },
    { label: "Big-O explained simply", url: "https://www.youtube.com/results?search_query=big+o+notation+explained+simply", kind: "video", note: "Try CS Dojo's or HackerRank's version." },
    { label: "Programiz: Asymptotic notations", url: "https://www.programiz.com/dsa/asymptotic-notations", kind: "read" },
    { label: "FE past exams: Section II-A", url: "https://www.cs.ucf.edu/registration/exm/", kind: "practice", note: "Code-analysis questions show up every exam." },
  ],
  notes: [
    { label: "Intro to Algorithms", file: "IntroAlgorithms-01.pdf" },
    { label: "Algorithm Analysis 1", file: "AlgorithmAnalysis-1.pdf" },
    { label: "Algorithm Analysis 2", file: "AlgorithmAnalysis-2.pdf" },
    { label: "Algorithm Analysis 3", file: "AlgorithmAnalysis-3.pdf" },
  ],
};
