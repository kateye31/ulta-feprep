import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const linkedLists: Topic = {
  slug: "linked-lists",
  title: "Linked Lists",
  short: "Linked Lists",
  emoji: "🚂",
  section: "IA",
  mascot: "pip",
  tagline: "A linked list is a little train! Each car holds one thing and a hook to the next car.",
  minutes: 22,
  tldr: [
    <>A linked list is a chain of <b>nodes</b>. Each node = <b>data</b> + a <b>pointer to the next node</b>.</>,
    <>You only hold onto the <Hi>head</Hi> (first node). To reach anything else, you walk from the head. The last node points to <code>NULL</code>.</>,
    <>Adding/removing at the front is <b>O(1)</b>. Finding something or going to the end is <b>O(n)</b>.</>,
    <>Unlike arrays, nodes are scattered in memory, so there&apos;s no <code>list[5]</code> jumping. But inserting doesn&apos;t shift anything.</>,
    <>The #1 rule: <b>never lose your grip on the rest of the train</b>. Hook the new node up BEFORE you unhook the old link.</>,
  ],
  picture: {
    title: "A train, a treasure hunt, a conga line",
    scene: <div style={{ fontSize: "2.4rem", letterSpacing: 2 }}>🚂🚃🚃🚃<span style={{ fontSize: "1.2rem", verticalAlign: "middle" }}> ➜ NULL</span></div>,
    caption: "head is the engine",
    body: (
      <>
        <p><b>A train:</b> the engine is <code>head</code>. Each car carries cargo (data) and has a hook (next pointer) to the car behind. The last car&apos;s hook holds nothing (<code>NULL</code>).</p>
        <p><b>A treasure hunt:</b> each clue (node) has a prize and tells you where the next clue is hidden. You can&apos;t skip to clue #5. You have to follow 1 → 2 → 3 → 4 → 5.</p>
        <p><b>Arrays vs lists:</b> an array is a row of numbered lockers side by side (jump right to #5!). A list is clues scattered all over town. Adding a new clue in the middle is easy though: just rewrite one note.</p>
      </>
    ),
  },
  levels: [
    {
      title: "The node",
      body: (
        <>
          <Code
            title="a node is a struct that points to its own type"
            src={`
typedef struct node {
    int data;
    struct node *next;   // hook to the next car
} node;`}
          />
          <p>That self-reference (<code>struct node *next</code> inside <code>struct node</code>) is what makes a chain. Each node is created with <code>malloc(sizeof(node))</code>.</p>
          <EmojiRow items={[["📦", "data"], ["🪝", "next"]]} />
        </>
      ),
    },
    {
      title: "Walking the list (traversal)",
      body: (
        <>
          <p>Almost every list function uses this exact loop. Memorize its shape:</p>
          <Code
            title="the walk"
            src={`
node *temp = head;          // start at the engine
while (temp != NULL) {      // until we fall off the end
    printf("%d ", temp->data);
    temp = temp->next;      // step to the next car
}`}
          />
          <p>Need to stop at the <b>last</b> node instead? Use <code>while (temp-&gt;next != NULL)</code>. Need the node <b>before</b> some target? Check <code>temp-&gt;next-&gt;data</code> while standing one step behind.</p>
        </>
      ),
    },
    {
      title: "Insert & delete (with the head-change problem)",
      body: (
        <>
          <p>If a function might change <b>which node is first</b>, it has to tell the caller. The COP3502 way: <b>return the new head</b>.</p>
          <Code
            title="insert at front / in order"
            src={`
node* insertFront(node *head, int val) {
    node *n = malloc(sizeof(node));
    n->data = val;
    n->next = head;          // 1. hook new car to the train
    return n;                // 2. new car is the new head
}

node* insertInOrder(node *head, int val) {
    node *n = malloc(sizeof(node));
    n->data = val;
    n->next = NULL;
    if (head == NULL || val < head->data) {   // new front!
        n->next = head;
        return n;
    }
    node *temp = head;
    while (temp->next != NULL && temp->next->data < val)
        temp = temp->next;
    n->next = temp->next;    // 1. new node grabs the rest FIRST
    temp->next = n;          // 2. then temp hooks to new node
    return head;
}`}
          />
          <Callout kind="warn" title="Order of those two lines matters!">
            If you do <code>temp-&gt;next = n</code> first, you&apos;ve overwritten the only pointer to the rest of the list. It&apos;s gone. 🚃💨
          </Callout>
        </>
      ),
    },
    {
      title: "FE level: recursion, deletion & variations",
      body: (
        <>
          <p>FE questions often ask for a short function, sometimes recursive. A list is naturally recursive: <i>a list is either empty, or a node followed by a (smaller) list</i>.</p>
          <Code
            title="classic FE-style functions"
            src={`
// count nodes recursively
int length(node *head) {
    if (head == NULL) return 0;
    return 1 + length(head->next);
}

// delete first node holding val; return new head
node* delete(node *head, int val) {
    if (head == NULL) return NULL;
    if (head->data == val) {
        node *rest = head->next;   // save before freeing!
        free(head);
        return rest;
    }
    head->next = delete(head->next, val);
    return head;
}`}
          />
          <ul>
            <li><b>Doubly linked:</b> each node also has <code>prev</code>. Insert/delete must fix <b>4</b> pointers (and check for NULL neighbors).</li>
            <li><b>Circular:</b> the last node points back to the first. Loops stop when you get back to the start, not at NULL. Often you store a pointer to the <i>last</i> node, since <code>last-&gt;next</code> is the front!</li>
          </ul>
        </>
      ),
    },
  ],
  widgets: ["linkedlist"],
  drills: [["Write your own linked list","professor-drills/1-linked-list.c"],["Redo: Summer 26 Q2 (house points)","exam-redo/sum26-q2-house-points.c"]],
  mnemonics: [
    { hook: "Grab before you let go 🐒", body: <p>Like a monkey swinging on vines: grab the next vine (<code>n-&gt;next = temp-&gt;next</code>) BEFORE letting go of the old one (<code>temp-&gt;next = n</code>).</p> },
    { hook: "Check NULL at the door 🚪", body: <p>Before you write <code>temp-&gt;next-&gt;data</code>, make sure <code>temp-&gt;next</code> isn&apos;t NULL. Every arrow <code>-&gt;</code> is a door that might open onto nothing.</p> },
    { hook: "Head can change → return it 🎩", body: <p>Any function that might insert or delete at the front should return the (possibly new) head. Call it like <code>head = insert(head, 5);</code></p> },
    { hook: "Save, then free 💾🗑", body: <p>Before freeing a node, save its <code>next</code>. After <code>free</code>, you can&apos;t read it anymore.</p> },
  ],
  missing: [
    {
      title: "Why not just use an array?",
      body: <p>Arrays need one big contiguous chunk and a fixed size, and inserting in the middle means shifting everything over (O(n) moves). Lists grow one node at a time, and inserting is just re-hooking two pointers. The tradeoff: no random access, plus extra memory for every pointer.</p>,
    },
    {
      title: "The -> arrow, decoded",
      body: <p><code>temp-&gt;next</code> means <code>(*temp).next</code>: go to the node <code>temp</code> points at, then read its <code>next</code> field. Chains like <code>temp-&gt;next-&gt;data</code> hop two cars forward.</p>,
    },
    {
      title: "Where lists show up in real life",
      body: <p>Music playlists (next song), your browser&apos;s back/forward (a doubly linked list!), undo history, and inside other data structures: stacks, queues and hash-table chains are all built from linked lists.</p>,
    },
    {
      title: "Big-O cheat line",
      body: (
        <ul>
          <li>Insert/delete at head: O(1)</li>
          <li>Insert at tail: O(n), or O(1) if you keep a <code>tail</code> pointer</li>
          <li>Search / access k-th element: O(n)</li>
        </ul>
      ),
    },
  ],
  traps: [
    <>Forgetting the <b>empty list</b> case (<code>head == NULL</code>). Graders test it mentally every time!</>,
    <>Forgetting the <b>new-head</b> case (inserting before the first node, or deleting the first node).</>,
    <>Writing <code>temp-&gt;next-&gt;data</code> without first checking <code>temp-&gt;next != NULL</code> → segfault.</>,
    <>Reading <code>node-&gt;next</code> after <code>free(node)</code>. Save it first.</>,
    <>Not returning the head, or calling <code>insert(head, x);</code> without <code>head = </code> in front.</>,
    <>Circular lists: using <code>while (temp != NULL)</code> loops forever. Stop when you get back to the start.</>,
  ],
  example: {
    title: "Worked problem: sum of every other node",
    prompt: <p><b>FE-style:</b> Write a <b>recursive</b> function <code>int sumAlt(node *head)</code> that returns the sum of the 1st, 3rd, 5th, … nodes. For <code>3 → 8 → 2 → 7 → 5</code> it returns 3 + 2 + 5 = 10.</p>,
    steps: [
      <p><b>Base case(s) first.</b> Empty list? Return 0. 🌱</p>,
      <p>Otherwise, <b>take this node</b> (<code>head-&gt;data</code>) and <b>skip the next one</b>.</p>,
      <p>But careful: if <code>head-&gt;next</code> is NULL, then <code>head-&gt;next-&gt;next</code> would crash! So check for it: <code>if (head-&gt;next == NULL) return head-&gt;data;</code></p>,
      <><p>Put it together:</p><Code src={`int sumAlt(node *head) {
    if (head == NULL) return 0;
    if (head->next == NULL) return head->data;
    return head->data + sumAlt(head->next->next);
}`} /></>,
      <p>Trace it: sumAlt(3) = 3 + sumAlt(2) = 3 + 2 + sumAlt(5) = 3 + 2 + 5 = <b>10</b> ✅</p>,
    ],
  },
  quiz: [
    {
      q: <>What&apos;s the runtime to insert at the <b>front</b> of a singly linked list with n nodes?</>,
      choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      answer: 0,
      why: <>Just make a node, point it at the old head, and return it. No walking!</>,
    },
    {
      q: <>You want to insert <code>n</code> after <code>temp</code>. Which order is correct?</>,
      choices: [
        <code key="a">temp-&gt;next = n; n-&gt;next = temp-&gt;next;</code>,
        <code key="b">n-&gt;next = temp-&gt;next; temp-&gt;next = n;</code>,
        "Either order works",
      ],
      answer: 1,
      why: <>With the first order, <code>n-&gt;next</code> ends up pointing at itself and the rest of the list is lost.</>,
    },
    {
      q: <>In a <b>circular</b> singly linked list, what does the last node&apos;s <code>next</code> point to?</>,
      choices: ["NULL", "Itself", "The first node", "The second node"],
      answer: 2,
      why: <>It loops back to the front. That&apos;s why many implementations just store a pointer to the <i>last</i> node.</>,
    },
  ],
  flashcards: [
    { front: "What two things does a linked-list node hold?", back: "Data + a pointer to the next node." },
    { front: "How do you know you're at the end of a singly linked list?", back: "The node's next pointer is NULL." },
    { front: "Why do insert/delete functions return a node*?", back: "Because the head might change (inserting/deleting at the front)." },
    { front: "How many pointers change when inserting into a doubly linked list's middle?", back: "4: new->prev, new->next, prev->next, next->prev." },
    { front: "Access the k-th element of a linked list: Big-O?", back: "O(k), which is O(n) in the worst case. You have to walk there." },
  ],
  resources: [
    { label: "VisuAlgo: Linked List", url: "https://visualgo.net/en/list", kind: "visual", note: "Animated inserts/deletes for singly, doubly and circular lists." },
    { label: "CS50 Lecture 5 notes: Data Structures", url: "https://cs50.harvard.edu/x/2024/notes/5/", kind: "read", note: "Builds linked lists from scratch in C with great diagrams." },
    { label: "Programiz: Linked List", url: "https://www.programiz.com/dsa/linked-list", kind: "read" },
    { label: "Linked lists in C, explained", url: "https://www.youtube.com/results?search_query=linked+list+in+c+tutorial+visual", kind: "video", note: "Try the CS50 shorts or mycodeschool's linked-list series." },
    { label: "Python Tutor, C mode", url: "https://pythontutor.com/c.html", kind: "visual", note: "Paste your insert function and watch the arrows move." },
    { label: "feprep.net practice", url: "https://feprep.net/dashboard", kind: "practice", note: "Tons of FE-style linked list questions." },
  ],
  notes: [
    { label: "Linked Lists 1", file: "LinkedList-1.pdf" },
    { label: "Linked List Variations", file: "LinkedList-2.pdf" },
    { label: "Sample: linkedlist3.c (add in order)", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/linkedlist3.c" },
    { label: "Sample: doublelinklist.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/doublelinklist.c" },
  ],
};
