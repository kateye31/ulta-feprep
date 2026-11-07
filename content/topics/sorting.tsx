import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const sorting: Topic = {
  slug: "sorting",
  title: "Sorting Algorithms",
  short: "Sorting",
  emoji: "🧁",
  section: "IIB",
  mascot: "mochi",
  tagline: "Six ways to line up cupcakes by size! Some are slow and simple, some are fast and clever.",
  minutes: 30,
  tldr: [
    <><b>O(n²) sorts</b>: Bubble 🫧 (swap neighbors), Selection 🎯 (find the min, put it in front), Insertion 🃏 (slide each card into a sorted hand).</>,
    <><b>O(n log n) sorts</b>: Merge 🍰 (split in half, sort both, zipper-merge), Quick ⚡ (pick a pivot, partition, recurse) and Heap 🍡 (build a heap, remove everything).</>,
    <><b>Insertion sort swaps</b> = bigger numbers to the left of each element, added up.</>,
    <><Hi>Insertion sort</Hi> is O(n) on already-sorted data. <Hi>Quick sort</Hi> is O(n²) in its worst case (bad pivots).</>,
    <>Merge sort always takes O(n log n) but needs an extra O(n) array.</>,
    <>FE favorite: &ldquo;show the array after each pass&rdquo;. Know exactly what one pass means for each sort!</>,
  ],
  picture: {
    title: "Sorting a hand of cards 🃏",
    scene: <EmojiRow items={[["🫧", "bubble"], ["🎯", "selection"], ["🃏", "insertion"], ["🍰", "merge"], ["⚡", "quick"], ["🍡", "heap"]]} />,
    caption: "you already do one of these!",
    body: (
      <>
        <ul>
          <li><b>Insertion 🃏</b>: how you sort cards in your hand. Pick up the next card and slide it left into place.</li>
          <li><b>Selection 🎯</b>: find the smallest cupcake on the table, put it first. Find the next smallest, put it second…</li>
          <li><b>Bubble 🫧</b>: walk down the line and swap any two neighbors that are out of order. Big ones float to the end like bubbles.</li>
          <li><b>Merge 🍰</b>: split the class in half, have each half sort itself, then merge the two sorted lines by always taking the shorter person at the front.</li>
          <li><b>Quick ⚡</b>: pick one person (the pivot). Everyone shorter goes left, taller goes right. Repeat on each side.</li>
          <li><b>Heap 🍡</b>: everyone joins a line where the shortest person is always at the front. Call the front person out, again and again. They come out in order.</li>
        </ul>
      </>
    ),
  },
  levels: [
    {
      title: "The three O(n²) sorts",
      body: (
        <>
          <Code
            title="insertion sort (most common on the FE)"
            src={`
void insertionSort(int *a, int n) {
    for (int i = 1; i < n; i++) {         // a[0..i-1] is already sorted
        int key = a[i];                   // pick up the next card
        int j = i - 1;
        while (j >= 0 && a[j] > key) {    // shift bigger cards right
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;                   // drop it into the gap
    }
}`}
          />
          <Code
            title="selection sort"
            src={`
void selectionSort(int *a, int n) {
    for (int i = 0; i < n - 1; i++) {
        int minI = i;
        for (int j = i + 1; j < n; j++)
            if (a[j] < a[minI]) minI = j;
        swap(&a[i], &a[minI]);            // exactly one swap per pass
    }
}`}
          />
          <Code
            title="bubble sort"
            src={`
void bubbleSort(int *a, int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)   // last i are already in place
            if (a[j] > a[j + 1]) swap(&a[j], &a[j + 1]);
}`}
          />
          <Callout kind="info" title="Variations exist!">
            Some versions of selection sort find the <b>max</b> and swap it to the <b>end</b>. On the FE, trace the <b>code they give you</b>, not the version you memorized.
          </Callout>
        </>
      ),
    },
    {
      title: "Merge sort (divide & conquer)",
      body: (
        <>
          <p>1️⃣ Split the array in half. 2️⃣ Recursively sort each half. 3️⃣ <b>Merge</b> the two sorted halves by repeatedly taking the smaller front element.</p>
          <Code
            title="merge (the heart of it)"
            src={`
void merge(int *a, int lo, int mid, int hi) {
    int n = hi - lo + 1;
    int *tmp = malloc(n * sizeof(int));
    int i = lo, j = mid + 1, k = 0;
    while (i <= mid || j <= hi) {
        if (j > hi || (i <= mid && a[i] <= a[j]))
            tmp[k++] = a[i++];        // take from left half
        else
            tmp[k++] = a[j++];        // take from right half
    }
    for (k = 0; k < n; k++) a[lo + k] = tmp[k];
    free(tmp);
}`}
          />
          <p>Recurrence: T(n) = 2T(n/2) + n → <b>O(n log n)</b>, always. There are log n levels of splitting, and each level does n work merging.</p>
        </>
      ),
    },
    {
      title: "Quick sort (partition)",
      body: (
        <>
          <p><b>The big secret:</b> each partition puts exactly <b>one</b> number, the pivot, in its final spot. Everything smaller ends up on its left and everything bigger on its right. Then you do the same thing to each side.</p>
          <p><b>🍳 The recipe for one partition:</b></p>
          <ol>
            <li>📌 The <b>first</b> number is the pivot. Put <b>low</b> on the next number and <b>high</b> on the last.</li>
            <li>👉 Walk <b>low</b> right. It stops on a number <b>bigger</b> than the pivot, because that one is on the wrong side.</li>
            <li>👈 Walk <b>high</b> left. It stops on a number <b>≤ the pivot</b>, for the same reason.</li>
            <li>🔁 Haven&apos;t crossed? Swap those two and keep walking.</li>
            <li>🏁 Crossed? Swap the pivot with the number at <b>high</b>. Now the pivot is in its final spot.</li>
          </ol>
          <p><b>Try it on <code>5 3 8 1 9 2</code></b> (the pivot is 5):</p>
          <div className="table-scroll">
            <table className="cozy">
              <thead>
                <tr><th>low stops at</th><th>high stops at</th><th>What happens</th><th>Array now</th></tr>
              </thead>
              <tbody>
                <tr><td>8</td><td>2</td><td>Not crossed, so swap 8 and 2</td><td><code>5 3 2 1 9 8</code></td></tr>
                <tr><td>9</td><td>1</td><td>Crossed, so swap pivot 5 with 1</td><td><code>1 3 2 <b>5</b> 9 8</code></td></tr>
              </tbody>
            </table>
          </div>
          <p>5 never moves again. Now partition <code>1 3 2</code> and <code>9 8</code> the same way, and you end with <code>1 2 3 5 8 9</code>. Type those numbers into the Bake-Off below and pick ⚡ Quick to watch it.</p>
          <p><b>Why O(n log n) on average?</b> Each level of partitions touches about n numbers. Good pivots split each side roughly in half, so there are about log n levels.</p>
          <p><b>Why O(n²) at worst?</b> On a sorted array with the first number as pivot, every number lands on one side. You only remove one number per level: n + (n−1) + … + 1.</p>
          <Callout kind="info" title="Quick vs. merge">
            Both split and recurse. <b>Merge</b> does its real work <b>after</b> the recursive calls, zipping the halves together. <b>Quick</b> does its real work <b>before</b> them, partitioning around the pivot.
          </Callout>
          <Code
            title="partition, COP3502 style (pivot = first element)"
            src={`
int partition(int *a, int lo, int hi) {
    int p = lo;                 // (in class, a random pivot is swapped here first)
    lo++;
    while (lo <= hi) {
        while (lo <= hi && a[lo] <= a[p]) lo++;   // skip small ones
        while (hi >= lo && a[hi] > a[p])  hi--;   // skip big ones
        if (lo < hi) swap(&a[lo], &a[hi]);        // both stuck: swap
    }
    swap(&a[p], &a[hi]);        // put the pivot in its final place
    return hi;
}

void quickSort(int *a, int lo, int hi) {
    if (lo >= hi) return;
    int m = partition(a, lo, hi);
    quickSort(a, lo, m - 1);
    quickSort(a, m + 1, hi);
}`}
          />
          <p>A random pivot makes the worst case very unlikely.</p>
        </>
      ),
    },
    {
      title: "Heap sort (keep taking the smallest)",
      body: (
        <>
          <p><b>The big secret:</b> a min-heap always has its smallest number on top. So take the top, then the new top, and so on. The numbers come out in sorted order.</p>
          <p><b>🍳 The recipe:</b></p>
          <ol>
            <li>🏗️ <b>Build a min-heap.</b> Percolate down from the last parent (index n/2) back to the root. This is O(n).</li>
            <li>🎁 <b>Remove the top</b> and put it next in your result array.</li>
            <li>🔁 <b>Move the last element to the root</b>, then swap it down with its <b>smaller</b> kid until it fits. This is O(lg n).</li>
            <li>🔂 Repeat steps 2 and 3 until the heap is empty.</li>
          </ol>
          <p><b>Try it on <code>5 3 8 1 9 2</code>:</b></p>
          <div className="table-scroll">
            <table className="cozy">
              <thead>
                <tr><th>Step</th><th>Heap array</th><th>Result</th></tr>
              </thead>
              <tbody>
                <tr><td>Build</td><td><code>1 3 2 5 9 8</code></td><td></td></tr>
                <tr><td>Remove 1</td><td><code>2 3 8 5 9</code></td><td><code>1</code></td></tr>
                <tr><td>Remove 2</td><td><code>3 5 8 9</code></td><td><code>1 2</code></td></tr>
                <tr><td>Remove 3</td><td><code>5 9 8</code></td><td><code>1 2 3</code></td></tr>
                <tr><td>Remove 5</td><td><code>8 9</code></td><td><code>1 2 3 5</code></td></tr>
                <tr><td>Remove 8</td><td><code>9</code></td><td><code>1 2 3 5 8</code></td></tr>
                <tr><td>Remove 9</td><td>empty</td><td><code>1 2 3 5 8 9</code></td></tr>
              </tbody>
            </table>
          </div>
          <p>Notice that <code>1 3 2 5 9 8</code> is a valid heap but <b>not</b> sorted. A heap only promises that each parent is ≤ its kids. The sorting happens during the removals.</p>
          <p>Watch the tree do this in the Bake-Off below: pick 🍡 Heap.</p>
          <Code
            title="heap sort as the FE asked for it (Summer 2024 B2)"
            src={`
int* heapsort(heapStruct* h) {
    int n = size(h);
    int* res = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++)
        res[i] = removeMin(h);    // smallest left, every time
    return res;
}`}
          />
          <p><b>Why O(n log n)?</b> Build O(n) + n removals × O(lg n) each. The n lg n part is bigger, so that&apos;s the answer.</p>
        </>
      ),
    },
    {
      title: "The comparison table",
      body: (
        <div className="table-scroll">
          <table className="cozy">
            <thead>
              <tr><th>Sort</th><th>Best</th><th>Average</th><th>Worst</th><th>Extra memory</th><th>Stable?</th></tr>
            </thead>
            <tbody>
              <tr><td>🫧 Bubble</td><td>O(n)*</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>yes</td></tr>
              <tr><td>🎯 Selection</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>no</td></tr>
              <tr><td>🃏 Insertion</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>yes</td></tr>
              <tr><td>🍰 Merge</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>yes</td></tr>
              <tr><td>⚡ Quick</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n) stack</td><td>no</td></tr>
              <tr><td>🍡 Heap</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)†</td><td>no</td></tr>
            </tbody>
          </table>
          <p className="muted" style={{ fontSize: "0.85rem", marginTop: 6 }}>* only with an &ldquo;if no swaps happened, stop early&rdquo; check.<br />† the in-place version, which uses a max-heap. The removeMin version above fills a new O(n) array.</p>
        </div>
      ),
    },
  ],
  widgets: ["sorting"],
  mnemonics: [
    { hook: "A bubble pass walks the WHOLE line 🫧", body: <p>One pass isn&apos;t one swap. Keep comparing neighbors all the way to the end: <code>4 1 3 2</code> → <code>1 4 3 2</code> → <code>1 3 4 2</code> → <code>1 3 2 4</code>. So one pass gives <code>1 3 2 4</code>, not <code>1 4 3 2</code>. Bubbles float up to the end, so after pass k, the k largest values are locked in there.</p> },
    { hook: "Selection swaps TWO 🎯", body: <p>Select the smallest, then swap exactly those two spots. Nothing else moves. One pass on <code>7 3 9 1 5</code> gives <code>1 3 9 7 5</code>: the 1 and 7 trade places. It&apos;s <b>not</b> <code>1 7 3 9 5</code>, which shifts everyone over. After pass k, the first k spots hold the k smallest, in order.</p> },
    { hook: "Insertion = cards in hand 🃏", body: <p>After iteration i, the first i+1 items are sorted <i>among themselves</i> (but not necessarily in their final spots!).</p> },
    { hook: "Merge = zipper 🤐, Quick = bouncer 🕶", body: <p>Merge zips two sorted halves together. Quick&apos;s pivot is a bouncer sending small to the left and big to the right.</p> },
    { hook: "Heap sort: build O(n), n removals × lg n 🍡", body: <p>The O(n) is only the build. You still remove all n elements at O(lg n) each, so the whole sort is O(n lg n).</p> },
  ],
  missing: [
    {
      title: "What 'stable' means",
      body: <p>A stable sort keeps equal items in their original relative order. Sort students by grade, and two B students stay in alphabetical order if they started that way. It matters when sorting by multiple keys!</p>,
    },
    {
      title: "Why can't comparison sorts beat n log n?",
      body: <p>There are n! possible orderings, and each comparison is a yes/no question that at best cuts the possibilities in half. You need log₂(n!) ≈ n log n questions. So merge sort is as good as comparison sorting gets!</p>,
    },
    {
      title: "Why use insertion sort ever?",
      body: <p>On small or nearly-sorted arrays it&apos;s super fast (very little overhead). Real libraries use a hybrid: quick or merge sort for big chunks, then insertion sort when the chunks get tiny (like below ~16 items).</p>,
    },
    {
      title: "Sorting as folk dances 💃",
      body: <p>Search YouTube for &ldquo;AlgoRythmics&rdquo;: dancers perform bubble sort, quicksort and more as Hungarian and Romanian folk dances. Silly, and it genuinely helps you remember them.</p>,
    },
  ],
  traps: [
    <>Counting <b>misplaced elements</b> when asked for Insertion Sort swaps. Count how far each element travels: every bigger number to its left is one swap.</>,
    <>Calling heap sort <b>O(n)</b>. That&apos;s only building the heap. Removing all n elements makes it O(n lg n).</>,
    <>Stopping a bubble pass after the first swap. One pass walks the whole array: <code>4 1 3 2</code> becomes <code>1 3 2 4</code>, not <code>1 4 3 2</code>.</>,
    <>Shifting on a selection sort trace. It <b>swaps two</b>: <code>7 3 9 1 5</code> becomes <code>1 3 9 7 5</code> after one pass, not <code>1 7 3 9 5</code>.</>,
    <>Stopping quick sort&apos;s <b>low</b> on the wrong number. Low stops on a number <b>bigger</b> than the pivot, and high stops on one <b>≤</b> the pivot.</>,
    <>Thinking a heap is sorted. <code>1 3 2 5 9 8</code> is a valid min-heap. Only the top is guaranteed to be the smallest.</>,
    <>Calling selection sort <b>O(n)</b>. It does few swaps, but every round still scans the whole unsorted part, so it&apos;s always O(n²).</>,
    <>Confusing <b>passes</b> with <b>swaps</b> or <b>comparisons</b>. Read the question: &ldquo;after each iteration of the outer loop&rdquo; means one full pass.</>,
    <>Insertion sort: after pass i, the front is sorted relative to itself, but those aren&apos;t final positions (unlike selection sort).</>,
    <>Quick sort: partitions can be done several different ways. Trace the <b>given</b> partition code exactly.</>,
    <>Saying quick sort is O(n log n) worst case. It&apos;s O(n²) worst case!</>,
    <>Merge: forgetting to copy the leftovers from whichever half didn&apos;t run out.</>,
  ],
  example: {
    title: "Worked problem: trace insertion sort",
    prompt: <p><b>FE-style:</b> Show the array after each iteration of the outer loop of insertion sort on <code>[5, 2, 9, 1, 6]</code>.</p>,
    steps: [
      <p><b>i = 1</b> (key 2): 5 &gt; 2, so shift 5 right; drop 2 in front → <code>[2, 5, 9, 1, 6]</code></p>,
      <p><b>i = 2</b> (key 9): 5 &lt; 9, so it stays put → <code>[2, 5, 9, 1, 6]</code></p>,
      <p><b>i = 3</b> (key 1): shift 9, 5, 2 right; drop 1 at the front → <code>[1, 2, 5, 9, 6]</code></p>,
      <p><b>i = 4</b> (key 6): shift 9 right; 5 &lt; 6 so stop → <code>[1, 2, 5, 6, 9]</code> ✅</p>,
      <p>4 iterations for 5 elements (n − 1). Now type <code>5 2 9 1 6</code> into the Bake-Off with &ldquo;passes only&rdquo; on to check!</p>,
    ],
  },
  quiz: [
    {
      q: <>Which sort is O(n) on an already-sorted array (as usually written)?</>,
      choices: ["Selection sort", "Insertion sort", "Merge sort", "Quick sort (first-element pivot)"],
      answer: 1,
      why: <>Each new key is already bigger than everything before it, so the inner while loop exits immediately. Quick sort with a first-element pivot is actually its WORST case here!</>,
    },
    {
      q: <>After 2 passes of selection sort (min to front) on <code>[7, 3, 9, 1, 5]</code>, the array is:</>,
      choices: ["[1, 3, 9, 7, 5]", "[1, 3, 5, 7, 9]", "[3, 7, 9, 1, 5]", "[1, 7, 9, 3, 5]"],
      answer: 0,
      why: <>Pass 1: the min is 1, swap with 7 → [1, 3, 9, 7, 5]. Pass 2: the min of the rest is 3, already in place → [1, 3, 9, 7, 5].</>,
    },
    {
      q: <>Worst-case time of merge sort?</>,
      choices: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      answer: 1,
      why: <>Merge sort always splits evenly: log n levels × n work each.</>,
    },
    {
      q: <>What&apos;s special about the pivot right after partitioning?</>,
      choices: ["It's the median", "It's in its final sorted position", "It's at index 0", "It gets removed"],
      answer: 1,
      why: <>Everything left is ≤ and everything right is &gt;, so it never needs to move again.</>,
    },
    {
      q: <>After the <b>first partition</b> of <code>[5, 3, 8, 1, 9, 2]</code> (pivot = first element), the array is:</>,
      choices: ["[1, 2, 3, 5, 8, 9]", "[1, 3, 2, 5, 9, 8]", "[3, 1, 2, 5, 8, 9]", "[2, 3, 1, 5, 9, 8]"],
      answer: 1,
      why: <>Low stops on 8 and high on 2, so swap: 5 3 2 1 9 8. Then low stops on 9 and high on 1. They&apos;ve crossed, so swap the pivot with 1: 1 3 2 5 9 8. Only the 5 is final so far.</>,
    },
    {
      q: <>One pass of bubble sort on <code>[4, 1, 3, 2]</code> gives:</>,
      choices: ["[1, 4, 3, 2]", "[1, 3, 2, 4]", "[1, 2, 3, 4]", "[2, 1, 3, 4]"],
      answer: 1,
      why: <>A pass doesn&apos;t stop at the first swap. The 4 keeps swapping past 1, then 3, then 2: 1 4 3 2 → 1 3 4 2 → 1 3 2 4.</>,
    },
    {
      q: <>One pass of selection sort (min to front) on <code>[7, 3, 9, 1, 5]</code> gives:</>,
      choices: ["[1, 7, 3, 9, 5]", "[1, 3, 9, 7, 5]", "[3, 7, 9, 1, 5]", "[1, 3, 5, 7, 9]"],
      answer: 1,
      why: <>Selection swaps two: the min (1) trades places with the 7. Nothing else moves.</>,
    },
    {
      q: <>In heap sort with a min-heap, when do the numbers actually get into sorted order?</>,
      choices: ["When the heap is built", "As they're removed from the top, one at a time", "When the last element moves to the root", "They're never fully sorted"],
      answer: 1,
      why: <>A built heap isn't sorted. Each removal hands you the smallest number left, so the result array comes out in order.</>,
    },
    {
      q: <>How many swaps does Insertion Sort do on <code>[4, 1, 3, 2]</code>?</>,
      choices: ["2", "3", "4", "6"],
      answer: 2,
      why: <>Count the bigger numbers to the left of each element: 1 has one (4), 3 has one (4), 2 has two (4, 3). 1 + 1 + 2 = 4.</>,
    },
    {
      q: <>Why isn&apos;t heap sort O(n), when building the heap is O(n)?</>,
      choices: ["Building really takes O(n²)", "You still do n removals at O(lg n) each", "It has to merge two heaps", "It sorts the array twice"],
      answer: 1,
      why: <>Build O(n) + n removals × O(lg n) = O(n lg n).</>,
    },
  ],
  flashcards: [
    { front: "Insertion sort best/worst", back: "Best O(n) (already sorted), worst O(n²) (reverse sorted)." },
    { front: "Selection sort: swaps per pass?", back: "At most 1. Always O(n²) comparisons." },
    { front: "Merge sort recurrence & runtime", back: "T(n) = 2T(n/2) + n → O(n log n), always. Needs O(n) extra space." },
    { front: "Quick sort worst case & when", back: "O(n²): the pivot is always the min or max (e.g. sorted input with first-element pivot)." },
    { front: "What is a stable sort?", back: "Equal elements keep their original relative order." },
    { front: "Lower bound for comparison sorting", back: "Ω(n log n)" },
    { front: "One pass of bubble sort on 4 1 3 2", back: "1 3 2 4. A pass walks the whole array, so it can make many swaps." },
    { front: "One pass of selection sort on 7 3 9 1 5", back: "1 3 9 7 5. Selection swaps TWO: the min and the front spot." },
    { front: "Quick sort: where do low and high stop?", back: "Low stops on a number bigger than the pivot. High stops on one ≤ the pivot. Not crossed: swap them. Crossed: swap the pivot with high." },
    { front: "What does one partition guarantee?", back: "The pivot is in its final spot, with smaller numbers left and bigger numbers right. The sides aren't sorted yet." },
    { front: "Heap sort in one line", back: "Build a min-heap, then removeMin n times into a result array." },
    { front: "How do you count Insertion Sort swaps?", back: "For each element, count the bigger numbers to its left. Add them up." },
    { front: "Heap sort average run time, and why", back: "O(n log n). Build O(n), then n removals × O(log n) each." },
    { front: "Selection sort average run time, and why", back: "O(n²). Few swaps, but every round scans the whole unsorted part: n + (n−1) + … + 1." },
  ],
  resources: [
    { label: "VisuAlgo: Sorting", url: "https://visualgo.net/en/sorting", kind: "visual", note: "Every sort, step by step, with code highlighting." },
    { label: "Toptal: Sorting algorithm animations", url: "https://www.toptal.com/developers/sorting-algorithms", kind: "visual", note: "Watch all the sorts race on random, sorted and reversed data." },
    { label: "USFCA: Comparison sorts", url: "https://www.cs.usfca.edu/~galles/visualization/ComparisonSort.html", kind: "visual" },
    { label: "AlgoRythmics: sorting folk dances 💃", url: "https://www.youtube.com/results?search_query=algorythmics+sort+dance", kind: "video", note: "Genuinely unforgettable." },
    { label: "Khan Academy: Merge sort", url: "https://www.khanacademy.org/computing/computer-science/algorithms/merge-sort/a/overview-of-merge-sort", kind: "read" },
    { label: "Khan Academy: Quick sort", url: "https://www.khanacademy.org/computing/computer-science/algorithms/quick-sort/a/overview-of-quicksort", kind: "read" },
    { label: "CS50 Lecture 3 notes (sorting)", url: "https://cs50.harvard.edu/x/2024/notes/3/", kind: "read" },
  ],
  notes: [
    { label: "N-squared Sorts", file: "NsqrdSorts.pdf" },
    { label: "Merge Sort", file: "MergeSort.pdf" },
    { label: "Quick Sort", file: "QuickSort.pdf" },
    { label: "Sample: sort.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/sort.c" },
    { label: "Sample: quicksort.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/quicksort.c" },
  ],
};
