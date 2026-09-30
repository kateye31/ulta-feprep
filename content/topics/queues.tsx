import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const queues: Topic = {
  slug: "queues",
  title: "Queues",
  short: "Queues",
  emoji: "🧋",
  section: "IA",
  mascot: "pip",
  tagline: "A queue is the line for boba! First person in line gets served first. No cutting!",
  minutes: 15,
  tldr: [
    <>A <b>queue</b> is <Hi>FIFO</Hi>: First In, First Out. Join at the <b>back</b>, leave from the <b>front</b>.</>,
    <>Operations: <code>enqueue</code> (join the back), <code>dequeue</code> (serve the front), <code>peek</code>, <code>isEmpty</code>. All <b>O(1)</b> when done right.</>,
    <><b>Linked-list queue:</b> keep <code>front</code> AND <code>back</code> pointers. Add at back, remove at front.</>,
    <><b>Array queue:</b> keep <code>front</code> and <code>numElements</code>, and <b>wrap around</b> with <code>%</code>. That&apos;s a <i>circular array</i>.</>,
    <>Used for: printers, waiting lines, BFS (exploring a maze level by level), and keyboard buffers.</>,
  ],
  picture: {
    title: "The boba line",
    scene: <div style={{ fontSize: "2.2rem" }}>🧋⬅🐰🦊🐻🐼⬅🚶</div>,
    caption: "served ← front … back ← join",
    body: (
      <>
        <p>People join the <b>back</b> of the line and get served from the <b>front</b>. Whoever has waited longest goes next. Totally fair!</p>
        <p><b>Stack vs Queue in one image:</b> a stack is a pile of plates (take from the top 🥞). A queue is a line of people (take from the front 🧋).</p>
        <p><b>The circular array trick:</b> imagine a <b>sushi conveyor belt</b> 🍣 with 6 plates. You don&apos;t move all the sushi when someone takes one. You just move the &ldquo;front&rdquo; marker forward, and when you reach the end, you wrap back to plate 0.</p>
      </>
    ),
  },
  levels: [
    {
      title: "FIFO basics",
      body: (
        <>
          <p>Enqueue 1, 2, 3 then dequeue three times → <b>1, 2, 3</b>. Same order in and out (a stack would reverse it).</p>
          <EmojiRow items={[["🚶", "enqueue → back"], ["🧍🧍🧍", "waiting"], ["🧋", "dequeue ← front"]]} />
        </>
      ),
    },
    {
      title: "Linked-list queue",
      body: (
        <>
          <Code
            title="queue with front & back pointers"
            src={`
typedef struct {
    node *front, *back;
} Queue;

void enqueue(Queue *q, int x) {
    node *n = malloc(sizeof(node));
    n->data = x;
    n->next = NULL;
    if (q->back == NULL) q->front = q->back = n;  // was empty
    else { q->back->next = n; q->back = n; }       // hook on, move back
}

int dequeue(Queue *q) {
    if (q->front == NULL) return -1;          // empty
    node *old = q->front;
    int val = old->data;
    q->front = old->next;
    if (q->front == NULL) q->back = NULL;     // became empty!
    free(old);
    return val;
}`}
          />
          <Callout kind="warn" title="The sneaky last line">
            When you dequeue the last person, <code>back</code> must also become NULL. Otherwise it points at freed memory 👻.
          </Callout>
        </>
      ),
    },
    {
      title: "Circular array queue (the COP3502 way)",
      body: (
        <>
          <p>Store <code>front</code> (index of the first item) and <code>numElements</code>. The back is computed: <Hi>(front + numElements) % capacity</Hi> is where the next item goes.</p>
          <Code
            title="array queue"
            src={`
typedef struct {
    int *elements;
    int front;
    int numElements;
    int capacity;
} Queue;

int enqueue(Queue *q, int x) {
    if (q->numElements == q->capacity) return 0;   // full
    q->elements[(q->front + q->numElements) % q->capacity] = x;
    q->numElements++;
    return 1;
}

int dequeue(Queue *q) {
    if (q->numElements == 0) return -1;            // empty
    int val = q->elements[q->front];
    q->front = (q->front + 1) % q->capacity;       // wrap around!
    q->numElements--;
    return val;
}`}
          />
          <p>Why not shift everything left after each dequeue? That&apos;s O(n) every time. Moving an index is O(1).</p>
        </>
      ),
    },
  ],
  widgets: ["queue"],
  drills: [["Redo: Summer 26 Q3 (ring queue)","exam-redo/sum26-q3-ring-queue.c"]],
  mnemonics: [
    { hook: "FIFO = First In, First Out(the door) 🚪", body: <p>Like a boba line: first to arrive, first to leave with a drink.</p> },
    { hook: "% is a clock 🕐", body: <p>Modulo wraps around like a clock: after 11 comes 0 (for capacity 12). <code>(front + 1) % cap</code> is the clock hand ticking.</p> },
    { hook: "Stack = Stash, Queue = Queue-up 🧍", body: <p>You stash plates in a pile. You queue up in a line.</p> },
  ],
  missing: [
    {
      title: "Queues power BFS",
      body: <p><b>Breadth-first search</b> explores a maze (or grid, or graph) in rings: first everything 1 step away, then 2 steps, and so on. It works by putting neighbors into a queue. That&apos;s how the &ldquo;Corn Maze&rdquo; problem in class finds the <b>shortest</b> path!</p>,
    },
    {
      title: "Deque & priority queue (cousins)",
      body: <p>A <b>deque</b> (&ldquo;deck&rdquo;) allows adding and removing at both ends. A <b>priority queue</b> serves the most important item first, not the oldest. It&apos;s built with a <b>heap</b> (see the Heaps topic 🍡).</p>,
    },
    {
      title: "Where's the back pointer in an array queue?",
      body: <p>The index of the <i>last</i> item is <code>(front + numElements − 1) % cap</code>. The next open slot is <code>(front + numElements) % cap</code>. FE questions love asking you to compute these after a sequence of operations.</p>,
    },
  ],
  traps: [
    <>Forgetting to wrap with <code>% capacity</code> when computing the back index.</>,
    <>Linked-list queue: not setting <code>back = NULL</code> when the queue becomes empty.</>,
    <>Mixing up which end is which: enqueue at the <b>back</b>, dequeue from the <b>front</b>.</>,
    <>Tracing questions: the array still &ldquo;contains&rdquo; old dequeued values. Only the indices <code>front … front + numElements − 1</code> (wrapped) count.</>,
  ],
  example: {
    title: "Worked problem: trace a circular queue",
    prompt: <p><b>FE-style:</b> A queue has capacity 5, front = 3, numElements = 2, holding 8 (index 3) and 6 (index 4). Do: enqueue(1), enqueue(9), dequeue(), enqueue(4). What are front and numElements, and where is 4 stored?</p>,
    steps: [
      <p>enqueue(1): goes to (3 + 2) % 5 = <b>0</b>. numElements = 3.</p>,
      <p>enqueue(9): goes to (3 + 3) % 5 = <b>1</b>. numElements = 4.</p>,
      <p>dequeue(): removes elements[3] = 8. front = (3 + 1) % 5 = <b>4</b>. numElements = 3.</p>,
      <p>enqueue(4): goes to (4 + 3) % 5 = <b>2</b>. numElements = 4.</p>,
      <p><b>Answer:</b> front = 4, numElements = 4, and 4 is at index 2. The queue in order: 6, 1, 9, 4 ✅</p>,
    ],
  },
  quiz: [
    {
      q: <>Enqueue A, B, C. Dequeue once. Enqueue D. Dequeue once. Who&apos;s at the front?</>,
      choices: ["A", "B", "C", "D"],
      answer: 2,
      why: <>[A,B,C] → remove A → [B,C] → [B,C,D] → remove B → [C,D]. Front = C.</>,
    },
    {
      q: <>Capacity 8, front = 6, numElements = 4. Where does the next enqueue go?</>,
      choices: ["index 10", "index 2", "index 1", "The queue is full"],
      answer: 1,
      why: <>(6 + 4) % 8 = 10 % 8 = 2.</>,
    },
    {
      q: <>Best data structure for &ldquo;print jobs in the order they were sent&rdquo;?</>,
      choices: ["Stack", "Queue", "Binary search tree", "Hash table"],
      answer: 1,
      why: <>First sent, first printed → FIFO → queue.</>,
    },
  ],
  flashcards: [
    { front: "FIFO stands for…", back: "First In, First Out (queue)." },
    { front: "Array queue: index where the next element goes?", back: "(front + numElements) % capacity" },
    { front: "Array queue: after dequeue, front becomes…", back: "(front + 1) % capacity" },
    { front: "Linked-list queue: which pointers do you keep?", back: "front (for dequeue) and back (for enqueue). Both O(1)." },
    { front: "Which search uses a queue?", back: "Breadth-first search (BFS): shortest path in unweighted mazes/grids." },
  ],
  resources: [
    { label: "USFCA: Queue (array) animation", url: "https://www.cs.usfca.edu/~galles/visualization/QueueArray.html", kind: "visual", note: "Watch the head/tail indices wrap around." },
    { label: "USFCA: Queue (linked list)", url: "https://www.cs.usfca.edu/~galles/visualization/QueueLL.html", kind: "visual" },
    { label: "VisuAlgo: Queue", url: "https://visualgo.net/en/list", kind: "visual", note: "Choose 'Queue' at the top." },
    { label: "Programiz: Circular Queue", url: "https://www.programiz.com/dsa/circular-queue", kind: "read" },
    { label: "Circular queue explained", url: "https://www.youtube.com/results?search_query=circular+queue+array+implementation", kind: "video" },
  ],
  notes: [
    { label: "Queues", file: "Queues.pdf" },
    { label: "Sample: queue.c (array)", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/queue.c" },
    { label: "Sample: queuell.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/queuell.c" },
  ],
};
