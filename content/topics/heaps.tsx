import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const heaps: Topic = {
  slug: "heaps",
  title: "Heaps & Priority Queues",
  short: "Heaps",
  emoji: "🍡",
  section: "IB",
  mascot: "mochi",
  tagline: "A heap always keeps the most important thing on top, like the ripest dango at the top of the skewer!",
  minutes: 20,
  tldr: [
    <>A <b>heap</b> is a <b>complete</b> binary tree (filled left to right, no gaps) with the <b>heap property</b>.</>,
    <><b>Min-heap:</b> every parent ≤ its children, so the <Hi>minimum is always at the root</Hi>. (A max-heap is the opposite.)</>,
    <>It&apos;s stored in an <b>array</b>, not with pointers! With the root at index 1: the kids of i are <b>2i</b> and <b>2i+1</b>, and the parent is <b>i/2</b>.</>,
    <><b>Insert:</b> put it at the end, then <b>percolate up</b>. <b>Delete-min:</b> move the last element to the root, then <b>percolate down</b>. Both O(log n).</>,
    <>Heaps power <b>priority queues</b> (the ER, where the sickest go first) and <b>heapsort</b> (O(n log n)).</>,
  ],
  picture: {
    title: "The hospital waiting room",
    scene: <EmojiRow items={[["🚑", "most urgent"], ["🤒", "next"], ["🤧", "can wait"]]} />,
    caption: "not first-come: most-important-first",
    body: (
      <>
        <p>A normal queue is first-come-first-served. But in an ER 🏥 the <b>most urgent</b> patient goes next, even if they just arrived. That&apos;s a <b>priority queue</b>, and a heap is the clever way to build one.</p>
        <p>Think of a heap like a <b>company org chart</b> where every boss is more important than their direct reports. The CEO (root) is the most important. But two coworkers on the same level? No order between them. A heap is only &ldquo;sorted&rdquo; <b>vertically</b>, not side to side.</p>
      </>
    ),
  },
  levels: [
    {
      title: "Shape + order",
      body: (
        <>
          <ol>
            <li><b>Shape:</b> complete tree. Every level is full except maybe the last, which fills <b>left to right</b>.</li>
            <li><b>Order (min-heap):</b> parent ≤ children. That&apos;s it! Siblings can be in any order.</li>
          </ol>
          <p>So the root is the smallest, but the 2nd smallest could be either child of the root.</p>
        </>
      ),
    },
    {
      title: "Heaps live in arrays",
      body: (
        <>
          <p>Because a heap is complete, you can read it level by level into an array with no gaps. Skip index 0 and the math is beautiful:</p>
          <div className="table-scroll">
            <table className="cozy mono">
              <tbody>
                <tr><td>parent(i)</td><td>i / 2</td></tr>
                <tr><td>left(i)</td><td>2 · i</td></tr>
                <tr><td>right(i)</td><td>2 · i + 1</td></tr>
              </tbody>
            </table>
          </div>
          <Callout kind="info" title="0-indexed version">
            If the root is at index 0 instead: kids are 2i+1 and 2i+2, and the parent is (i−1)/2. Check which one the question uses!
          </Callout>
        </>
      ),
    },
    {
      title: "Insert & delete-min",
      body: (
        <>
          <Code
            title="percolate up (after inserting at the end)"
            src={`
void insert(Heap *h, int val) {
    h->size++;
    int i = h->size;
    h->arr[i] = val;                          // add at the end
    while (i > 1 && h->arr[i] < h->arr[i/2]) {
        swap(&h->arr[i], &h->arr[i/2]);       // bubble up
        i = i / 2;
    }
}`}
          />
          <Code
            title="delete-min: last to root, then percolate down"
            src={`
int deleteMin(Heap *h) {
    int min = h->arr[1];
    h->arr[1] = h->arr[h->size];              // last element to root
    h->size--;
    int i = 1;
    while (2*i <= h->size) {
        int c = 2*i;                          // left child
        if (c+1 <= h->size && h->arr[c+1] < h->arr[c]) c++;   // smaller kid
        if (h->arr[i] <= h->arr[c]) break;
        swap(&h->arr[i], &h->arr[c]);
        i = c;
    }
    return min;
}`}
          />
          <p>Each loop moves one level, and there are only log n levels, so both are <b>O(log n)</b>.</p>
        </>
      ),
    },
    {
      title: "Heapify & heapsort",
      body: (
        <>
          <p><b>Building a heap from n items</b>: you <i>could</i> insert them one at a time (O(n log n)), but <b>heapify</b> is faster. Start at the last parent (index n/2), percolate down, and repeat back to the root. That&apos;s <b>O(n)</b> total, a surprising and classic result.</p>
          <p><b>Heapsort</b>: build a heap, then call delete-min n times. You get the items in sorted order in O(n log n), with no extra array needed.</p>
        </>
      ),
    },
  ],
  widgets: ["heap"],
  drills: [["Write your own min-heap","professor-drills/4-heap.c"]],
  mnemonics: [
    { hook: "Kids are 2i and 2i+1 (twins double up) 👯", body: <p>Your kids&apos; seat numbers are double yours (and one more). Your parent&apos;s seat is half yours (rounded down).</p> },
    { hook: "Bubbles rise, rocks sink 🫧🪨", body: <p>A small new value <b>bubbles up</b> (insert). A big value moved to the top <b>sinks down</b> (delete).</p> },
    { hook: "Swap with the SMALLER kid 🍡", body: <p>When sinking in a min-heap, always swap with the smaller child. Otherwise the bigger kid ends up above the smaller one.</p> },
    { hook: "Heap = Hierarchy, not a sorted list", body: <p>Only parent/child order matters. Siblings are strangers.</p> },
  ],
  missing: [
    {
      title: "Heap ≠ BST",
      body: <p>In a BST, left &lt; parent &lt; right, so you can search for anything in O(log n). In a heap, you can only quickly get the <b>min</b>. Searching for a random value is O(n). Different jobs!</p>,
    },
    {
      title: "Heap ≠ 'the heap' (memory)",
      body: <p>Confusingly, the <b>heap</b> where malloc gets memory has nothing to do with the heap data structure. Same word, totally different things. 🙃</p>,
    },
    {
      title: "Where priority queues show up",
      body: <p>Dijkstra&apos;s shortest-path (GPS 🧭), scheduling tasks in your OS, Huffman compression (zip files), and &ldquo;find the top k items&rdquo; problems.</p>,
    },
  ],
  traps: [
    <>When sinking, swapping with the <b>left</b> child by default. You must pick the <b>smaller</b> child (min-heap).</>,
    <>Forgetting to check that the right child exists (<code>2i+1 ≤ size</code>).</>,
    <>Delete-min: moving the root&apos;s <b>child</b> up instead of the <b>last element</b>.</>,
    <>Mixing up 0-indexed vs 1-indexed formulas.</>,
    <>Drawing questions: after each operation, write out the <b>whole array</b>. The FE often asks for the array, not the tree.</>,
  ],
  example: {
    title: "Worked problem: insert into a min-heap",
    prompt: <p><b>FE-style:</b> The min-heap array (1-indexed) is <code>[3, 8, 5, 12, 10, 9]</code>. Insert <b>4</b>. Show the array after.</p>,
    steps: [
      <p>Put 4 at the next spot: index <b>7</b>. Array: 3 8 5 12 10 9 <b>4</b></p>,
      <p>Parent of 7 is 7/2 = <b>3</b>, which holds 5. Is 4 &lt; 5? Yes → swap. Array: 3 8 <b>4</b> 12 10 9 5</p>,
      <p>Now 4 is at index 3. Parent is 3/2 = <b>1</b>, which holds 3. Is 4 &lt; 3? No → stop.</p>,
      <p><b>Answer: [3, 8, 4, 12, 10, 9, 5]</b> ✅ (Try it in the Dango Stand above: the starting heap is the same!)</p>,
    ],
  },
  quiz: [
    {
      q: <>In a 1-indexed heap, where are the children of index 5?</>,
      choices: ["6 and 7", "10 and 11", "9 and 10", "2"],
      answer: 1,
      why: <>2·5 = 10 and 2·5+1 = 11.</>,
    },
    {
      q: <>Min-heap <code>[2, 4, 3, 7, 5]</code>. After deleteMin, what&apos;s the array?</>,
      choices: ["[3, 4, 5, 7]", "[3, 4, 7, 5]", "[4, 5, 3, 7]", "[5, 4, 3, 7]"],
      answer: 0,
      why: <>Move 5 to the root: [5, 4, 3, 7]. Its kids are 4 and 3, the smaller is 3 → swap: [3, 4, 5, 7]. 5 is at index 3, and its kid would be at 6, which doesn&apos;t exist. Done.</>,
    },
    {
      q: <>Time to find the MAX in a min-heap of n elements?</>,
      choices: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      answer: 2,
      why: <>The max could be any leaf, and about half the nodes are leaves. You have to check them all.</>,
    },
  ],
  flashcards: [
    { front: "Min-heap property", back: "Every parent ≤ its children. Min at the root." },
    { front: "1-indexed heap: children of i? parent of i?", back: "Children 2i and 2i+1; parent i/2 (integer division)." },
    { front: "Insert into a heap", back: "Add at the end, percolate UP. O(log n)." },
    { front: "Delete-min", back: "Save the root, move the last element to the root, percolate DOWN (swap with the smaller child). O(log n)." },
    { front: "Heapify (build heap) runtime", back: "O(n)" },
    { front: "Heapsort runtime", back: "O(n log n)" },
  ],
  resources: [
    { label: "USFCA: Heap animation", url: "https://www.cs.usfca.edu/~galles/visualization/Heap.html", kind: "visual", note: "Shows the tree AND the array side by side." },
    { label: "VisuAlgo: Binary Heap", url: "https://visualgo.net/en/heap", kind: "visual" },
    { label: "Programiz: Heap data structure", url: "https://www.programiz.com/dsa/heap-data-structure", kind: "read" },
    { label: "Binary heaps explained", url: "https://www.youtube.com/results?search_query=binary+heap+insert+delete+percolate", kind: "video", note: "Look for Michael Sambol's short ones." },
    { label: "Binary heap (Wikipedia)", url: "https://en.wikipedia.org/wiki/Binary_heap", kind: "read" },
  ],
  notes: [
    { label: "Heaps", file: "Heaps.pdf" },
    { label: "Sample: heap.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/heap.c" },
  ],
};
