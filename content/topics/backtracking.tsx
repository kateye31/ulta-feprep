import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const backtracking: Topic = {
  slug: "backtracking",
  title: "Permutations & Backtracking",
  short: "Backtracking",
  emoji: "🧭",
  section: "IIB",
  mascot: "tofu",
  tagline: "Backtracking is exploring a maze with a ball of yarn: try a path, and if it's a dead end, walk back and try the next one.",
  minutes: 25,
  tldr: [
    <><b>Brute force</b> = try <i>every</i> possibility. <b>Backtracking</b> = brute force that <Hi>gives up early</Hi> on paths that can&apos;t work (pruning ✂️).</>,
    <>The pattern: <b>choose</b> → <b>explore</b> (recurse) → <b>un-choose</b> (undo). The undo is what makes it backtracking!</>,
    <><b>Permutations</b> (every ordering) use a <code>used[]</code> array. There are <b>n!</b> of them.</>,
    <><b>Subsets / combinations</b>: for each item, choose &ldquo;in&rdquo; or &ldquo;out&rdquo;. There are <b>2ⁿ</b> of them.</>,
    <>Classics: N-Queens 👑, Sudoku, mazes, and &ldquo;odometer&rdquo; brute force.</>,
  ],
  picture: {
    title: "A maze with a ball of yarn 🧶",
    scene: <EmojiRow items={[["🚪", "choose a path"], ["🧶", "leave yarn"], ["🧱", "dead end!"], ["↩️", "follow yarn back"]]} />,
    caption: "try → hit wall → undo → try the next",
    body: (
      <>
        <p>In a maze, at each fork you <b>pick a path</b> and unroll yarn behind you. Hit a dead end? <b>Wind the yarn back</b> to the last fork and try the next path. That&apos;s exactly the choose → explore → un-choose loop.</p>
        <p>Or <b>trying outfits</b> 👗: pick a shirt, then try pants with it. None match? Take off the shirt (undo) and try the next shirt. And if a shirt clashes with <i>everything</i>, you skip it without trying all the pants (pruning!).</p>
      </>
    ),
  },
  levels: [
    {
      title: "Brute force: the odometer",
      body: (
        <>
          <p>To try every 3-digit combo lock (000–999), think of a car&apos;s <b>odometer</b>: the last digit spins fastest. Recursively: fill position k with each digit, then recurse on k + 1.</p>
          <Code
            title="every sequence of length n from digits 0..base-1"
            src={`
void odometer(int *digits, int k, int n, int base) {
    if (k == n) { print(digits, n); return; }   // filled every slot
    for (int d = 0; d < base; d++) {
        digits[k] = d;                           // choose
        odometer(digits, k + 1, n, base);        // explore
    }                                            // (overwritten next loop, no undo needed)
}`}
          />
          <p>This makes baseⁿ sequences. It&apos;s &ldquo;brute force&rdquo;: no pruning at all.</p>
        </>
      ),
    },
    {
      title: "Permutations with used[]",
      body: (
        <>
          <Code
            title="all orderings of 0..n-1"
            src={`
void perm(int *arr, int *used, int k, int n) {
    if (k == n) { print(arr, n); return; }
    for (int i = 0; i < n; i++) {
        if (used[i]) continue;      // already placed? skip
        used[i] = 1;                // CHOOSE
        arr[k] = i;
        perm(arr, used, k + 1, n);  // EXPLORE
        used[i] = 0;                // UN-CHOOSE (backtrack!)
    }
}`}
          />
          <p>For n = 3 it prints, in order: 012, 021, 102, 120, 201, 210. That&apos;s 3! = 6 orderings.</p>
          <Callout kind="warn" title="Forget used[i] = 0 and…">
            After the first permutation, everything is marked used forever and you only get <b>one</b> output!
          </Callout>
        </>
      ),
    },
    {
      title: "Pruning: N-Queens",
      body: (
        <>
          <p>Place one queen per row. Before placing in column c, check whether any earlier queen attacks it. If one does, <b>skip it</b>, and you never explore any of the boards below that choice. That&apos;s pruning ✂️.</p>
          <Code
            title="N-Queens"
            src={`
int cols[MAX];   // cols[r] = column of the queen in row r

int safe(int r, int c) {
    for (int i = 0; i < r; i++)
        if (cols[i] == c || abs(cols[i] - c) == r - i)   // same col or diagonal
            return 0;
    return 1;
}

int solve(int r, int n) {                   // returns # of solutions
    if (r == n) return 1;
    int count = 0;
    for (int c = 0; c < n; c++) {
        if (!safe(r, c)) continue;          // PRUNE
        cols[r] = c;                        // choose
        count += solve(r + 1, n);           // explore
    }                                       // (cols[r] is overwritten = undo)
    return count;
}`}
          />
          <p>8 queens: brute force would check 8⁸ ≈ 16.7 million boards. Backtracking only visits a couple thousand nodes!</p>
        </>
      ),
    },
    {
      title: "The universal template",
      body: (
        <>
          <Code
            title="backtracking, in general"
            src={`
void solve(state, k) {
    if (done(state, k)) { record(state); return; }
    for (each choice c at step k) {
        if (!valid(state, c)) continue;    // prune
        apply(state, c);                   // choose
        solve(state, k + 1);               // explore
        undo(state, c);                    // un-choose
    }
}`}
          />
          <p>Sudoku: the choices are the digits 1–9 for the next empty cell, and valid means no repeat in the row, column or box. Mazes: the choices are 4 directions, and valid means not a wall and not visited.</p>
        </>
      ),
    },
  ],
  widgets: ["nqueens"],
  mnemonics: [
    { hook: "Choose, Explore, Un-choose 🔁", body: <p>The three-beat rhythm of every backtracking function. Clap it out!</p> },
    { hook: "n! orderings, 2ⁿ subsets 🎲", body: <p>Permutations of 5 = 120. Subsets of 5 = 32. Factorial grows faster!</p> },
    { hook: "Prune early, prune often ✂️🌿", body: <p>The earlier you reject a bad partial answer, the more of the tree you skip.</p> },
    { hook: "Yarn = the call stack 🧶", body: <p>Returning from a recursive call IS walking back along the yarn.</p> },
  ],
  missing: [
    {
      title: "Permutations vs combinations",
      body: <p><b>Order matters</b> → permutation (race podium: 1st, 2nd, 3rd). <b>Order doesn&apos;t matter</b> → combination (pizza toppings 🍕). P(n, k) = n!/(n−k)!, C(n, k) = n!/(k!(n−k)!).</p>,
    },
    {
      title: "Why the undo matters",
      body: <p>Recursion shares data structures (like <code>used[]</code> or the board) across calls. When a call returns, the state has to look exactly like it did before that call&apos;s choice. Otherwise sibling branches see garbage.</p>,
    },
    {
      title: "Backtracking is still exponential",
      body: <p>Pruning helps a lot in practice, but the worst case is still exponential. That&apos;s fine for small n (≤ ~10 for permutations, ≤ ~20 for subsets). Beyond that, you need smarter algorithms (dynamic programming, in CS2!).</p>,
    },
  ],
  traps: [
    <>Forgetting to <b>undo</b> (e.g. <code>used[i] = 0</code>), so only one answer gets printed.</>,
    <>Wrong base case: checking <code>k == n - 1</code> instead of <code>k == n</code> (off by one → missing the last slot).</>,
    <>Diagonal check in N-Queens: <code>abs(c1 - c2) == abs(r1 - r2)</code>. Don&apos;t forget abs!</>,
    <>FE fill-in-the-blank questions: the blanks are usually the base case, the <code>used</code> check, the recursive call&apos;s <b>k + 1</b>, and the undo line.</>,
    <>Counting questions: the number of <code>print</code> calls = the number of complete solutions, not the number of recursive calls.</>,
  ],
  example: {
    title: "Worked problem: fill in the blanks",
    prompt: (
      <>
        <p><b>FE-style:</b> This prints every subset of <code>{"{1..n}"}</code> whose sum is exactly <code>target</code>. Fill in the blanks.</p>
        <Code src={`void go(int *in, int k, int n, int sum, int target) {
    if (sum > target) return;          // (A) pruning
    if (k == ____) {                   // (B)
        if (sum == target) print(in, n);
        return;
    }
    in[k] = 1;
    go(in, k + 1, n, ______, target);  // (C) take item k+1
    in[k] = ____;                      // (D)
    go(in, k + 1, n, sum, target);     // skip item k+1
}`} />
      </>
    ),
    steps: [
      <p>(A) is already a prune: if the sum is already too big, adding more positive numbers can&apos;t help. ✂️</p>,
      <p>(B): we&apos;ve decided every item when <b>k == n</b>.</p>,
      <p>(C): taking item number k+1 adds its value: <b>sum + (k + 1)</b>.</p>,
      <p>(D): <b>0</b>. Undo the choice so the &ldquo;skip&rdquo; branch sees item k as out.</p>,
      <p>Total leaves explored: at most 2ⁿ (fewer thanks to pruning). ✅</p>,
    ],
  },
  quiz: [
    { q: <>How many permutations does <code>perm(arr, used, 0, 5)</code> print?</>, choices: ["5", "25", "32", "120"], answer: 3, why: <>5! = 120.</> },
    {
      q: <>What happens if you delete <code>used[i] = 0;</code> from perm()?</>,
      choices: ["Infinite loop", "Only the first permutation prints", "It prints duplicates", "Nothing changes"],
      answer: 1,
      why: <>Nothing is ever freed up again, so after the first full path no other branch can place anything.</>,
    },
    { q: <>What makes backtracking faster than plain brute force?</>, choices: ["Memoization", "Pruning invalid partial solutions early", "Sorting first", "Using a heap"], answer: 1, why: <>Rejecting a partial answer skips its entire subtree of completions.</> },
  ],
  flashcards: [
    { front: "Backtracking's 3 steps", back: "Choose → Explore (recurse) → Un-choose (undo)" },
    { front: "Number of permutations of n items", back: "n!" },
    { front: "Number of subsets of n items", back: "2ⁿ" },
    { front: "What is pruning?", back: "Stopping a branch early when the partial solution can't possibly lead to a valid answer." },
    { front: "N-Queens diagonal attack test", back: "|c1 − c2| == |r1 − r2|" },
  ],
  resources: [
    { label: "Eight queens puzzle (Wikipedia)", url: "https://en.wikipedia.org/wiki/Eight_queens_puzzle", kind: "read", note: "Has an animation of the backtracking search." },
    { label: "Backtracking explained", url: "https://www.youtube.com/results?search_query=backtracking+explained+n+queens+permutations", kind: "video", note: "Look for Abdul Bari's N-Queens video." },
    { label: "Programiz: Backtracking", url: "https://www.programiz.com/dsa/backtracking-algorithm", kind: "read" },
    { label: "VisuAlgo: Recursion tree", url: "https://visualgo.net/en/recursion", kind: "visual", note: "Watch the branching and returning happen." },
    { label: "COP3502 Sudoku backtracking demo", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/Backtracking/sudoku.html", kind: "visual" },
  ],
  notes: [
    { label: "Permutations", file: "RecursionPermutations.pdf" },
    { label: "Brute Force", file: "BruteForce.pdf" },
    { label: "Backtracking", file: "Backtracking.pdf" },
    { label: "Sample: eightqueens.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/eightqueens.c" },
  ],
};
