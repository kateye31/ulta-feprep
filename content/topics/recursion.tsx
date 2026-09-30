import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const recursion: Topic = {
  slug: "recursion",
  title: "Recursion",
  short: "Recursion",
  emoji: "🍰",
  section: "IIB",
  mascot: "mochi",
  tagline: "Recursion is a layer cake: solve one small layer, and trust the rest of the cake to take care of itself!",
  minutes: 25,
  tldr: [
    <>A <b>recursive</b> function calls <b>itself</b> on a <b>smaller</b> version of the same problem.</>,
    <>Every recursive function needs: <Hi c="matcha">a base case</Hi> (tiny problem, answer directly) and <Hi>a recursive case</Hi> (shrink the problem, then call yourself).</>,
    <>The <b>leap of faith</b> 🧚: assume the recursive call works for the smaller problem. Your only job is to use its answer for the current layer.</>,
    <>Each call gets its own copy of its variables on the <b>call stack</b>. Too many calls → stack overflow.</>,
    <>Classics: factorial, fast exponentiation, binary search, Towers of Hanoi, and flood fill.</>,
  ],
  picture: {
    title: "The movie theater question 🎬",
    scene: <EmojiRow items={[["🧑", "me: which row?"], ["👩", "ask the row ahead"], ["👦", "…ask ahead…"], ["🧒", "front row: 1!"]]} />,
    caption: "each person adds 1 to the answer they get back",
    body: (
      <>
        <p>You&apos;re in a dark theater and want to know your row number. You ask the person in front: &ldquo;What row are you in?&rdquo; They don&apos;t know either, so they ask the person in front of <i>them</i>… until someone in the <b>front row</b> says &ldquo;1!&rdquo; (the base case).</p>
        <p>Then the answers flow back: 1 → 2 → 3 → … Each person just adds 1 to what they heard. Nobody had to count the whole theater!</p>
        <Code src={`int row(person p) {
    if (p is in front) return 1;         // base case
    return 1 + row(person in front of p); // trust the fairy 🧚
}`} />
      </>
    ),
  },
  levels: [
    {
      title: "Base case + recursive case",
      body: (
        <>
          <Code
            title="factorial: n! = n × (n-1)!"
            src={`
int fact(int n) {
    if (n == 0) return 1;          // base case: 0! = 1
    return n * fact(n - 1);        // recursive case: shrink by 1
}`}
          />
          <p>fact(4) = 4 · fact(3) = 4 · 3 · fact(2) = 4 · 3 · 2 · fact(1) = 4 · 3 · 2 · 1 · fact(0) = 24.</p>
          <Callout kind="warn" title="No base case = infinite recursion">
            Or a recursive case that doesn&apos;t shrink. Every call must move <b>toward</b> the base case.
          </Callout>
        </>
      ),
    },
    {
      title: "Tracing (how the FE tests you)",
      body: (
        <>
          <p>Where the <code>printf</code> sits changes <i>when</i> it runs: on the way <b>down</b> or on the way <b>back up</b>.</p>
          <Code
            title="same function, flipped output"
            src={`
void down(int n) {                void up(int n) {
    if (n == 0) return;               if (n == 0) return;
    printf("%d ", n);                 up(n - 1);
    down(n - 1);                      printf("%d ", n);
}                                 }
// down(3) prints: 3 2 1          // up(3) prints: 1 2 3`}
          />
          <p><b>Tip for tricky traces:</b> for functions like <code>f(n) = f(n−1) + f(n−2)</code>, build a <b>table from the bottom up</b>: f(0), f(1), f(2)… It&apos;s way faster than drawing the whole call tree.</p>
        </>
      ),
    },
    {
      title: "Fast exponentiation & binary search",
      body: (
        <>
          <p>Computing bᵉ by multiplying e times is O(e). But b¹⁰⁰ = (b⁵⁰)², so we can <b>halve</b> the exponent each time → O(log e)!</p>
          <Code
            title="fast exponentiation"
            src={`
int power(int b, int e) {
    if (e == 0) return 1;
    if (e % 2 == 0) {
        int half = power(b, e / 2);    // compute ONCE
        return half * half;
    }
    return b * power(b, e - 1);        // odd: peel one off
}`}
          />
          <Code
            title="recursive binary search"
            src={`
int binSearch(int *a, int lo, int hi, int target) {
    if (lo > hi) return -1;                        // not found
    int mid = (lo + hi) / 2;
    if (a[mid] == target) return mid;
    if (target < a[mid]) return binSearch(a, lo, mid - 1, target);
    return binSearch(a, mid + 1, hi, target);
}`}
          />
        </>
      ),
    },
    {
      title: "Towers of Hanoi & flood fill",
      body: (
        <>
          <Code
            title="Hanoi: 2ⁿ − 1 moves"
            src={`
void hanoi(int n, char from, char to, char via) {
    if (n == 0) return;
    hanoi(n - 1, from, via, to);     // park the small ones on 'via'
    printf("Move disk %d from %c to %c\\n", n, from, to);
    hanoi(n - 1, via, to, from);     // bring them onto 'to'
}`}
          />
          <Code
            title="flood fill: paint-bucket tool 🪣"
            src={`
void fill(char g[][MAX], int r, int c, int R, int C) {
    if (r < 0 || r >= R || c < 0 || c >= C) return;   // off the map
    if (g[r][c] != '.') return;                       // wall, or already filled
    g[r][c] = '*';                                    // paint it (marks visited!)
    fill(g, r + 1, c, R, C);
    fill(g, r - 1, c, R, C);
    fill(g, r, c + 1, R, C);
    fill(g, r, c - 1, R, C);
}`}
          />
          <p>Flood fill is how the paint-bucket tool works and how you count &ldquo;islands&rdquo; or &ldquo;stars&rdquo; in a grid (the countingstars.c problem from class!).</p>
        </>
      ),
    },
  ],
  widgets: ["hanoi"],
  drills: [["Recursive BST functions","professor-drills/2-bst.c"],["Recursive list length & delete","professor-drills/1-linked-list.c"]],
  mnemonics: [
    { hook: "Base case first, always 🧱", body: <p>Write the base case as the <b>first line</b> of every recursive function, before you think about anything else.</p> },
    { hook: "Trust the fairy 🧚", body: <p>Don&apos;t trace the whole thing in your head while <i>writing</i>. Assume the smaller call works. Only trace when <i>checking</i>.</p> },
    { hook: "Print before → countdown. Print after → count up 🚀", body: <p>printf before the call runs on the way down (n first). After the call, it runs on the way back up (smallest first).</p> },
    { hook: "Hanoi: move the pile, move the big one, move the pile 🗼", body: <p>Everything else is just the pile moving recursively.</p> },
  ],
  missing: [
    {
      title: "What the call stack looks like",
      body: <p>Each call gets a <b>stack frame</b> (its own n, its own locals). fact(4) pushes frames for 4, 3, 2, 1, 0, then they pop in reverse as each returns. That&apos;s why deep recursion (like 1,000,000 levels) can crash: the stack runs out of room.</p>,
    },
    {
      title: "Recursion vs loops",
      body: <p>Anything recursive can be written with a loop (plus maybe your own stack). Recursion shines when the problem is naturally self-similar: trees, divide-and-conquer, backtracking. Loops are better for simple counting.</p>,
    },
    {
      title: "The 'compute once' lesson",
      body: <p>In fast exponentiation, writing <code>power(b, e/2) * power(b, e/2)</code> makes <b>two</b> calls. That&apos;s back to O(e)! Save it in a variable. The same idea (don&apos;t recompute) leads to memoization and dynamic programming.</p>,
    },
    {
      title: "Recursion in nature and art",
      body: <p>Fractals ❄️, broccoli romanesco 🥦, ferns 🌿, a mirror facing a mirror 🪞. They&apos;re all shapes that contain smaller copies of themselves. Search &ldquo;Droste effect&rdquo; for the famous cocoa tin 🍫.</p>,
    },
  ],
  traps: [
    <>Missing or wrong base case (e.g. <code>n == 1</code> when <code>n</code> can start at 0).</>,
    <>Not <b>returning</b> the recursive call&apos;s result: writing <code>f(n-1);</code> instead of <code>return f(n-1);</code>.</>,
    <>Flood fill: forgetting to mark a cell as visited <i>before</i> recursing → infinite recursion.</>,
    <>Flood fill: checking <code>g[r][c]</code> <i>before</i> checking bounds → out-of-bounds access.</>,
    <>Trace questions: losing track of which call you&apos;re in. Use a table or an indented call list.</>,
  ],
  example: {
    title: "Worked problem: trace a recursive function",
    prompt: (
      <>
        <p><b>FE-style:</b> What does <code>f(5)</code> return?</p>
        <Code src={`int f(int n) {
    if (n <= 1) return n;
    return f(n - 1) + 2 * f(n - 2);
}`} />
      </>
    ),
    steps: [
      <p>Don&apos;t draw the full call tree (it explodes!). Build a table from the bottom up instead.</p>,
      <p>Base cases: f(0) = 0, f(1) = 1.</p>,
      <p>f(2) = f(1) + 2·f(0) = 1 + 0 = <b>1</b>. f(3) = f(2) + 2·f(1) = 1 + 2 = <b>3</b>.</p>,
      <p>f(4) = f(3) + 2·f(2) = 3 + 2 = <b>5</b>. f(5) = f(4) + 2·f(3) = 5 + 6 = <b>11</b>.</p>,
      <p><b>Answer: 11</b> ✅ (Bonus: this sequence is 0, 1, 1, 3, 5, 11, 21… the Jacobsthal numbers!)</p>,
    ],
  },
  quiz: [
    {
      q: (
        <>
          What does <code>g(4)</code> print?{" "}
          <code>void g(int n) {"{"} if (n == 0) return; g(n - 1); printf(&quot;%d &quot;, n); {"}"}</code>
        </>
      ),
      choices: ["4 3 2 1", "1 2 3 4", "4 3 2 1 0", "0 1 2 3 4"],
      answer: 1,
      why: <>The print comes <b>after</b> the recursive call, so it runs on the way back up: 1 first.</>,
    },
    {
      q: <>How many moves does Towers of Hanoi need for 5 disks?</>,
      choices: ["10", "25", "31", "32"],
      answer: 2,
      why: <>2⁵ − 1 = 31.</>,
    },
    {
      q: <>Fast exponentiation computes bⁿ in how many multiplications, roughly?</>,
      choices: ["n", "n/2", "log n", "1"],
      answer: 2,
      why: <>The exponent is halved at each even step → O(log n).</>,
    },
  ],
  flashcards: [
    { front: "Two parts of every recursive function", back: "Base case (answer directly) + recursive case (shrink & call yourself)." },
    { front: "Towers of Hanoi moves for n disks", back: "2ⁿ − 1" },
    { front: "Fast exponentiation idea", back: "b^e = (b^(e/2))² when e is even, so compute the half once and square it. O(log e)." },
    { front: "Flood fill: what must you do before recursing?", back: "Check bounds, check the cell is fillable, then MARK it (so you never revisit)." },
    { front: "What's a stack overflow?", back: "Too many nested calls, so the call stack runs out of memory (usually a missing/unreachable base case)." },
  ],
  resources: [
    { label: "Khan Academy: Recursion", url: "https://www.khanacademy.org/computing/computer-science/algorithms/recursive-algorithms/a/recursion", kind: "read", note: "Gentle intro with factorial & palindromes." },
    { label: "Khan Academy: Towers of Hanoi", url: "https://www.khanacademy.org/computing/computer-science/algorithms/towers-of-hanoi/a/towers-of-hanoi", kind: "read" },
    { label: "VisuAlgo: Recursion tree", url: "https://visualgo.net/en/recursion", kind: "visual", note: "Type any recursive function and watch the call tree grow." },
    { label: "Python Tutor, C mode", url: "https://pythontutor.com/c.html", kind: "visual", note: "See every stack frame appear and disappear." },
    { label: "Recursion for beginners", url: "https://www.youtube.com/results?search_query=recursion+for+beginners+explained", kind: "video", note: "Try CS Dojo or Reducible's recursion videos." },
    { label: "Programiz: C recursion", url: "https://www.programiz.com/c-programming/c-recursion", kind: "read" },
  ],
  notes: [
    { label: "Recursion Intro", file: "RecursionIntro.pdf" },
    { label: "Towers of Hanoi", file: "RecursionTowers.pdf" },
    { label: "Fast Exponentiation", file: "RecursionFastExp.pdf" },
    { label: "Floodfill", file: "RecursionFloodFill.pdf" },
    { label: "Sample: recursion.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/recursion.c" },
  ],
};
