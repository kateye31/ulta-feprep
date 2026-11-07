import type { Exam, Question } from "@/lib/arcade/types";
import { EXAMS_URL } from "@/lib/sections";
import { loops } from "./fall2026-ab";

// May 16, 2026 Foundation Exam, every question, every rubric point.

// ───────────────────────────── Section A ─────────────────────────────

export const A1: Question = {
  id: "A1",
  pts: 10,
  category: "DSN",
  topic: "Dynamic Memory Management in C",
  title: "Mario's odd-star log",
  story:
    "In Super Mario Galaxy, Mario follows a route of planets, and each planet has a known number of Power Stars that Mario can collect. You are given an array `route` of length `routeLen` that stores planet identifiers, and an implemented helper function `getStarsOnPlanet(int planetId)` that returns the number of Power Stars on a given planet.\n\nWrite the function `buildOddStarLog` that **dynamically allocates an integer array** containing the number of Power Stars for each planet in route whose star count is **odd**, in the same order they appear in the route.\n\nThe function must store a **sentinel value -1** immediately after the last valid array element, set `*outSize` to the number of valid elements stored (not including the sentinel), and return a pointer to the allocated array. If dynamic memory allocation fails, the function must return `NULL` and set `*outSize` to 0. You may assume that route and outSize are not NULL and that routeLen > 0.",
  given: [
    { id: "a1-helper", title: "Helper (already written)", kind: "code", body: "int getStarsOnPlanet(int planetId); // helper function implemented" },
    { id: "a1-header", title: "Function header", kind: "code", body: "int* buildOddStarLog(int* route, int routeLen, int* outSize) {\n\n}" },
    { id: "a1-example", title: "Example (not on the exam)", kind: "text", body: "route stars:  4   7   2   9   5\nodd ones:         7       9   5\n\nreturned array:  [ 7 | 9 | 5 | -1 ]\n*outSize = 3   (the -1 doesn't count)" },
  ],
  scaffold: {
    title: "buildOddStarLog so far",
    code: "int* buildOddStarLog(int* route, int routeLen, int* outSize) {\n    {{cnt}}\n    {{countloop}}\n        {{oddcheck}}\n            {{cntinc}}\n\n    {{malloc}}\n    {{nullcheck}}\n        {{nullbody}}\n    }\n\n    {{k}}\n    {{copyloop}}\n        {{s}}\n        {{copy}}\n    }\n    {{sentinel}}\n    {{outsize}}\n    {{ret}}\n}",
  },
  steps: [
    {
      id: "outsize-what",
      kind: "choice",
      title: "What is int *outSize?",
      prompt: "Read the header. Why is the last parameter `int* outSize` a **pointer** instead of a plain `int`?",
      options: [
        { t: "So the function can hand back a second answer: it writes the count into the caller's variable through the pointer", ok: true, why: "A function can only `return` one thing (here, the array). Writing to `*outSize` is how the count gets back to the caller." },
        { t: "Because it's an array of sizes", why: "It's one int living in the caller's code. The star lets us write into it." },
        { t: "Because C doesn't allow int parameters", why: "Plain int parameters are fine, but they're copies. Changing a copy wouldn't reach the caller." },
      ],
    },
    {
      id: "why-count",
      kind: "choice",
      title: "Why count first?",
      prompt: "We have to malloc the array **before** filling it, but we don't know how many planets are odd. What's the plan?",
      options: [
        { t: "Loop once to count the odd ones, malloc exactly that many + 1 (for the -1), then loop again to copy", ok: true, why: "Two passes: count, then fill. That's what the answer key does." },
        { t: "malloc routeLen ints and hope for the best", why: "That works in C, but it wastes space, and you'd still need the count for `*outSize`. Counting first is cleaner." },
        { t: "malloc 1 int and add more later without realloc", why: "Writing past a malloc'd block is a bug. You need the size first, or realloc." },
      ],
    },
    {
      id: "plus-one",
      kind: "choice",
      title: "Room for the sentinel",
      prompt: "If 3 planets have an odd star count, how many ints should the array hold?",
      options: [
        { t: "4: three stars plus the -1 sentinel at the end", ok: true, why: "The sentinel needs its own slot right after the last real value." },
        { t: "3", why: "Then there's no room for the -1 the question requires." },
      ],
    },
    {
      id: "cnt",
      kind: "type",
      title: "Make a counter",
      pts: 0,
      prompt: "Warm-up (no points). Make an int counter called `cnt` that starts at 0.",
      answers: ["int cnt = 0;"],
    },
    {
      id: "countloop",
      kind: "type",
      title: "Loop through route",
      pts: 1,
      prompt: "**(1 pt).** Write the `for` header that visits every index of `route`, using `i`.",
      answers: loops(["int i=0"], ["i<routeLen"], ["i++", "++i", "i+=1"]),
      hints: [{ when: "n", at: "routeLen", say: "The length has a name in the header: `routeLen`." }],
    },
    {
      id: "oddcheck",
      kind: "type",
      title: "Is it odd?",
      pts: 1,
      prompt: "**(1 pt).** Write the `if` header that checks whether planet `route[i]` has an **odd** number of stars. Use the helper.",
      answers: ["if (getStarsOnPlanet(route[i]) % 2 == 1)", "if (getStarsOnPlanet(route[i]) % 2 != 0)", "if (getStarsOnPlanet(route[i]) % 2)"],
      hints: [
        { when: "route", at: "getStarsOnPlanet", say: "`route[i]` is a planet **id**, not its star count. Pass it to `getStarsOnPlanet` first." },
        { when: "/", at: "%", say: "Odd means the remainder after dividing by 2 is 1. That's `%`, not `/`." },
      ],
    },
    {
      id: "cntinc",
      kind: "type",
      title: "Count it",
      pts: 0,
      prompt: "Warm-up (no points). It's odd. Add one to `cnt`.",
      answers: ["cnt++;", "++cnt;", "cnt += 1;", "cnt = cnt + 1;"],
    },
    {
      id: "malloc",
      kind: "type",
      title: "Allocate the array",
      pts: 1,
      prompt: "**(1 pt).** Allocate room for `cnt` ints **plus one** for the sentinel. Store it in a new pointer called `a`.",
      answers: ["int* a = malloc((cnt + 1) * sizeof(int));", "int* a = malloc(sizeof(int) * (cnt + 1));", "int* a = calloc(cnt + 1, sizeof(int));"],
      hints: [
        { when: "cnt", at: "(", say: "Wrap `cnt + 1` in parentheses so the multiply covers both." },
        { when: ")", at: "+", say: "Don't forget the slot for the -1: `cnt + 1`." },
      ],
    },
    {
      id: "nullcheck",
      kind: "type",
      title: "Did malloc fail?",
      pts: 1,
      prompt: "**(1 pt).** malloc returns `NULL` when it fails. Write the `if` header (with its opening brace) that checks for that.",
      answers: ["if (a == NULL) {", "if (!a) {", "if (NULL == a) {"],
      hints: [{ when: "=", at: "==", say: "Compare with `==`. A single `=` would overwrite `a`." }],
    },
    {
      id: "nullbody",
      kind: "type",
      title: "Handle the failure",
      pts: 1,
      prompt: "**(1 pt).** The question says: on failure, set `*outSize` to 0 and return NULL. Write both lines.",
      answers: ["*outSize = 0;\nreturn NULL;"],
      hints: [{ when: "outSize", at: "*outSize", say: "`outSize` is the pointer. To write into the caller's int, use `*outSize`." }],
    },
    {
      id: "k",
      kind: "type",
      title: "A write index",
      pts: 0,
      prompt: "Warm-up (no points). We need a separate index into `a` that only moves when we store something. Make an int called `k`, starting at 0.",
      answers: ["int k = 0;"],
    },
    {
      id: "copyloop",
      kind: "type",
      title: "Loop again",
      pts: 0,
      prompt: "Warm-up (no points, the loop already earned its point). Write the same `for` header again, with an opening brace.",
      answers: loops(["int i=0"], ["i<routeLen"], ["i++", "++i", "i+=1"], ["{"]),
    },
    {
      id: "s",
      kind: "type",
      title: "Grab the stars once",
      pts: 0,
      prompt: "Warm-up (no points). Store this planet's star count in a new int called `s`, so we only call the helper once.",
      answers: ["int s = getStarsOnPlanet(route[i]);"],
    },
    {
      id: "copy",
      kind: "type",
      title: "Copy the odd ones",
      pts: 2,
      prompt: "**(2 pts).** If `s` is odd, store it at `a[k]` and move `k` forward. One line: `if (...) ...;`",
      answers: ["if (s % 2 == 1) a[k++] = s;", "if (s % 2 != 0) a[k++] = s;", "if (s % 2) a[k++] = s;"],
      hints: [
        { when: "a[i]", say: "`i` walks the route. `a` only fills its next free slot, which is `k`." },
        { when: "a[k]", at: "a[k++]", say: "After storing, `k` has to move to the next slot. `a[k++] = s;` does both." },
      ],
    },
    {
      id: "sentinel",
      kind: "type",
      title: "Drop the sentinel",
      pts: 2,
      prompt: "**(2 pts).** After the loop, `k` is the first empty slot. Put the sentinel there.",
      answers: ["a[k] = -1;"],
      hints: [{ when: "cnt", say: "`a[cnt]` happens to be the same slot here, but `k` is the index you've been tracking. Use it." }],
    },
    {
      id: "outsize",
      kind: "type",
      title: "Report the size",
      pts: 0,
      prompt: "Warm-up (no points, but required). Write the count of real values into the caller's int.",
      answers: ["*outSize = k;", "*outSize = cnt;"],
      hints: [{ when: "+", say: "The sentinel doesn't count. Just `k`." }],
    },
    {
      id: "ret",
      kind: "type",
      title: "Return the array",
      pts: 1,
      prompt: "**(1 pt).** Hand back the array.",
      answers: ["return a;"],
    },
  ],
  answer:
    "int* buildOddStarLog(int* route, int routeLen, int* outSize) {\n    int cnt = 0;\n    for (int i = 0; i < routeLen; i++)\n        if (getStarsOnPlanet(route[i]) % 2 == 1)\n            cnt++;\n    int* a = malloc((cnt + 1) * sizeof(int));\n    if (a == NULL) {\n        *outSize = 0;\n        return NULL;\n    }\n    int k = 0;\n    for (int i = 0; i < routeLen; i++) {\n        int s = getStarsOnPlanet(route[i]);\n        if (s % 2 == 1)\n            a[k++] = s;\n    }\n    a[k] = -1;\n    *outSize = k;\n    return a;\n}\n\nRubric: 2 allocate + return · 2 NULL case · 1 loop · 1 odd check · 2 copy + index · 2 sentinel",
  takeaway: "Unknown size? Count first, malloc exactly (plus 1 for a sentinel), then fill with a separate index.",
};

const HOUSE = `typedef struct node_s {
    char house[20];
    int points;
    struct node_s* nextptr;
} node_s;`;

const A2: Question = {
  id: "A2",
  pts: 10,
  category: "DSN",
  topic: "Linked Lists",
  title: "Hogwarts house points",
  story:
    "In the Harry Potter series, students at Hogwarts belong to one of four houses. Suppose each student entering the Great Hall is recorded in a singly linked list, where each node stores the student's house and the number of house points they received.\n\nWrite a function that takes in a pointer to the linked list of students, `head`, as well as a string storing a house name, `houseName`, and **returns the sum of the house points** scored by all of the students in the list belonging to the house with the name `houseName`.",
  given: [
    { id: "a2-struct", title: "The struct: node_s", kind: "code", body: HOUSE },
    { id: "a2-header", title: "Function header", kind: "code", body: "int getHousePoints(node_s* head, char* houseName) {\n\n}" },
    { id: "a2-example", title: "Example (not on the exam)", kind: "text", body: "head → [Gryffindor, 10] → [Slytherin, 5] → [Gryffindor, 20] → NULL\n\ngetHousePoints(head, \"Gryffindor\")  returns 30" },
  ],
  scaffold: { title: "getHousePoints so far", code: "int getHousePoints(node_s* head, char* houseName) {\n    {{res}}\n    {{loop}}\n        {{match}}\n            {{add}}\n        {{step}}\n    }\n    {{ret}}\n}" },
  steps: [
    {
      id: "house-field",
      kind: "choice",
      title: "What is char house[20]?",
      prompt: "In the struct, what exactly is `char house[20]`?",
      options: [
        { t: "An array of 20 chars inside the node, holding the house name as a string", ok: true, why: "The letters live right inside the node. No malloc needed." },
        { t: "A pointer to a string somewhere else", why: "That would be `char *house`. With `[20]` the letters are stored inside the struct." },
      ],
    },
    {
      id: "string-eq",
      kind: "choice",
      title: "Comparing strings",
      prompt: "Why can't we write `if (head->house == houseName)`?",
      options: [
        { t: "== compares the two addresses, not the letters. Use strcmp, which returns 0 when the strings match", ok: true, why: "This is the 3-point idea of the question. `strcmp(a, b) == 0` means \"same letters\"." },
        { t: "It works fine", why: "Two different arrays holding \"Gryffindor\" have different addresses, so `==` says they're different." },
        { t: "Because strings can't be compared in C", why: "They can, with `strcmp` from string.h." },
      ],
    },
    {
      id: "res",
      kind: "type",
      title: "Start a total",
      pts: 1,
      prompt: "**(1 pt).** Make an int called `res` to hold the running total.",
      answers: ["int res = 0;"],
      hints: [{ when: ";", at: "=", say: "Give it a starting value of 0. An uninitialized int is garbage." }],
    },
    {
      id: "loop",
      kind: "type",
      title: "Walk the list",
      pts: 1,
      prompt: "**(1 pt).** Write the `while` header (with its opening brace) that keeps going until we fall off the end of the list. (It's fine to move `head` itself: it's our own copy.)",
      answers: ["while (head != NULL) {", "while (head) {", "while (NULL != head) {"],
      hints: [{ when: "->", say: "Check `head` itself. `head->nextptr != NULL` would skip the last student." }],
    },
    {
      id: "match",
      kind: "type",
      title: "Same house?",
      pts: 4,
      prompt: "**(4 pts).** Write the `if` header that's true when this student's house matches `houseName`.\n\n*(The key lists 3 pts here, but its own breakdown only adds to 9 for a 10-point question. We give this line the missing point.)*",
      answers: ["if (strcmp(head->house, houseName) == 0)", "if (strcmp(houseName, head->house) == 0)", "if (!strcmp(head->house, houseName))"],
      hints: [
        { when: "==", at: "strcmp", say: "`==` on two strings compares addresses. Use `strcmp(..., ...) == 0`." },
        { when: ".", at: "->", say: "`head` is a pointer: `head->house`." },
        { when: "1", at: "0", say: "`strcmp` returns **0** when the strings are equal." },
      ],
    },
    {
      id: "add",
      kind: "type",
      title: "Add the points",
      pts: 2,
      prompt: "**(2 pts).** It's a match. Add this student's points to `res`.",
      answers: ["res += head->points;", "res = res + head->points;"],
    },
    {
      id: "step",
      kind: "type",
      title: "Move to the next student",
      pts: 1,
      prompt: "**(1 pt).** Move `head` to the next node. (This line is outside the if: we move every time.)",
      answers: ["head = head->nextptr;"],
      hints: [{ when: "next", at: "nextptr", say: "Look at the struct in your inventory: the field is called `nextptr`." }],
    },
    {
      id: "ret",
      kind: "type",
      title: "Return the total",
      pts: 1,
      prompt: "**(1 pt).** After the loop, return the total.",
      answers: ["return res;"],
    },
  ],
  answer:
    "int getHousePoints(node_s* head, char* houseName) {\n    int res = 0;                                  // 1\n    while (head != NULL) {                        // 1\n        if (strcmp(head->house, houseName) == 0)  // 3 (4 here)\n            res += head->points;                  // 2\n        head = head->nextptr;                     // 1\n    }\n    return res;                                   // 1\n}",
  takeaway: "Strings are compared with strcmp(...) == 0, never ==. Walk a list with while (head != NULL).",
};

const QUEUE_CODE = `struct queue *q = malloc(sizeof(struct queue));
initialize(&q);
for (int i=0; i<2; i++) {
    for (int j=0; j<9; j++)
        enqueue(q, i*9+j);
    for (int j=0; j<8; j++)
        printf("%d\\n", dequeue(q));
}
for (int i=3; i<9; i++) {
    for (int j=0; j<8; j++)
        enqueue(q, i*9+j);
    for (int j=0; j<8; j++)
        printf("%d\\n", dequeue(q));
}
enqueue(q, 200);              // 1st answer (operation #131)
printf("%d\\n", dequeue(q));   // 2nd answer (#132)
printf("%d\\n", dequeue(q));   // 3rd answer (#133)
enqueue(q, 201);              // 4th answer (#134)
printf("%d\\n", dequeue(q));   // 5th answer (#135)`;

const A3: Question = {
  id: "A3",
  pts: 5,
  category: "ALG",
  topic: "Queues",
  title: "Where does the queue write?",
  story:
    "Assume an **efficient array implementation** of a queue with a fixed array size of **10**, where the first element added to the queue goes into index 0. Below is a segment of code for 135 enqueue and dequeue operations on a queue `q`. (Code unnecessary to answer the question is omitted.)\n\n**List the indexes into the array which the last 5 operations use.** For enqueues, list the index where the element is added; for dequeues, list the index the element is returned from.",
  given: [
    { id: "a3-code", title: "The code segment", kind: "code", body: QUEUE_CODE },
    { id: "a3-rule", title: "Circular queue rules", kind: "text", body: "array size 10, indexes 0..9, wraps around\n\ndequeue reads from:  front, then front = (front + 1) % 10\nenqueue writes to:   (front + size) % 10" },
  ],
  steps: [
    {
      id: "circular",
      kind: "choice",
      title: "Efficient means circular",
      prompt: "\"Efficient array implementation\" means dequeue is O(1). What happens to the front index after a dequeue?",
      options: [
        { t: "It moves forward one spot and wraps from 9 back to 0", ok: true, why: "Nothing slides down. The front just moves, and indexes wrap around with % 10." },
        { t: "Every element shifts left one spot", why: "That's O(n) per dequeue, not efficient. The front index moves instead." },
      ],
    },
    {
      id: "count-enq",
      kind: "choice",
      title: "Count the enqueues",
      prompt: "Before the last 5 lines, how many enqueues happen? (First loop: 2 rounds of 9. Second loop: i = 3..8, so 6 rounds of 8.)",
      options: [
        { t: "2·9 + 6·8 = 66", ok: true, why: "So the 66 elements went into slots 0, 1, 2, … wrapping every 10." },
        { t: "2·9 + 7·8 = 74", why: "`i=3; i<9` runs for 3, 4, 5, 6, 7, 8. That's 6 rounds." },
        { t: "135", why: "135 counts every operation, enqueues and dequeues together." },
      ],
    },
    {
      id: "count-deq",
      kind: "choice",
      title: "Count the dequeues",
      prompt: "And how many dequeues before the last 5 lines?",
      options: [
        { t: "2·8 + 6·8 = 64", ok: true, why: "66 in, 64 out: 2 elements are still waiting." },
        { t: "66", why: "The first loop dequeues 8 per round, not 9. One element stays behind each round." },
      ],
    },
    {
      id: "front",
      kind: "choice",
      title: "Where's the front?",
      prompt: "After 64 dequeues, the front index is 64 % 10. With 2 elements waiting, which slots hold them?",
      options: [
        { t: "Front is 4; the two waiting elements are in slots 4 and 5", ok: true, why: "So the next enqueue writes to (4 + 2) % 10 = 6." },
        { t: "Front is 6", why: "6 is where the next enqueue goes (66 % 10). The front is 64 % 10 = 4." },
      ],
    },
    {
      id: "answer",
      kind: "slots",
      title: "The last five indexes",
      pts: 5,
      score: "all",
      prompt: "**(5 pts, all or nothing).** Fill in the index used by each of operations #131 to #135.",
      layout: "array",
      index: ["#131 enq 200", "#132 deq", "#133 deq", "#134 enq 201", "#135 deq"],
      slots: ["6", "4", "5", "7", "6"].map((a, i) => ({ id: "q" + i, answer: a })),
      learn: "Enqueue at 6. Dequeue from 4, then 5. Enqueue at 7. Dequeue from 6. (The key gives 2/5 for the right x, x−2, x−1, x+1, x pattern with the wrong x.)",
    },
  ],
  answer: "#131: 6   #132: 4   #133: 5   #134: 7   #135: 6",
  takeaway: "Circular queue: front = dequeues % size, next enqueue = (front + count) % size. Count operations instead of simulating all of them.",
};

// ───────────────────────────── Section B ─────────────────────────────

const SIZE_NODE = `typedef struct node {
    int data;
    int size;   // stores subtree size
    struct node* left;
    struct node* right;
} node;`;

const SIZE_PIC = `          50  (size 5)
        /    \
  (3)  30      70  (1)
      /  \
(1) 20    40 (1)

A leaf always has size 1.`;

const B1: Question = {
  id: "B1",
  pts: 10,
  category: "DSN",
  topic: "Binary Trees",
  title: "Update subtree sizes",
  story:
    "The **subtree size** of a node in a Binary Search Tree (BST) is defined as the total number of nodes in the subtree rooted at that node, **including the node itself**.\n\nWrite a recursive function `updateSubtreeSize(node* root)` that updates the `size` field of every node in the BST so that it correctly reflects the number of nodes in its subtree, and **returns this size**. You are not allowed to write any helper function.",
  given: [
    { id: "b1-struct", title: "The struct: node", kind: "code", body: SIZE_NODE },
    { id: "b1-header", title: "Function header", kind: "code", body: "int updateSubtreeSize(node* root) {\n\n}" },
  ],
  scaffold: { title: "updateSubtreeSize so far", code: "int updateSubtreeSize(node* root) {\n    {{base}}\n    {{left}}\n    {{right}}\n    {{store}}\n    {{ret}}\n}" },
  steps: [
    {
      id: "size-field",
      kind: "choice",
      title: "What is the size field?",
      prompt: "Look at the struct. What should `root->size` hold after your function runs?",
      give: [{ id: "b1-example", title: "Example (not on the exam)", kind: "text", body: SIZE_PIC }],
      options: [
        { t: "How many nodes are in the subtree starting at that node, counting itself", ok: true, why: "In the example, 30 has itself + 20 + 40 = 3. A leaf always has size 1." },
        { t: "How many children the node has (0, 1, or 2)", why: "Size counts **every** node below, not just direct children. 50's size is 5." },
        { t: "The node's depth", why: "Depth counts down from the root. Size counts the nodes underneath." },
      ],
    },
    {
      id: "formula",
      kind: "choice",
      title: "The recursive idea",
      prompt: "If you already knew the size of the left subtree and the size of the right subtree, what's this node's size?",
      options: [
        { t: "left size + right size + 1 (the 1 is the node itself)", ok: true, why: "That's the whole function. Ask the kids for their sizes, add 1." },
        { t: "left size + right size", why: "That forgets to count the node itself. A leaf would get size 0." },
        { t: "max(left size, right size) + 1", why: "That's the formula for **height**. Size adds both sides." },
      ],
    },
    {
      id: "base",
      kind: "type",
      title: "Base case",
      pts: 2,
      prompt: "**(2 pts).** An empty tree has 0 nodes. Write the base case on one line.",
      answers: ["if (root == NULL) return 0;", "if (!root) return 0;", "if (NULL == root) return 0;"],
      hints: [{ when: "1", at: "0", say: "An empty tree has **no** nodes, so 0. The +1 happens for real nodes later." }],
    },
    {
      id: "left",
      kind: "type",
      title: "Ask the left kid",
      pts: 2,
      prompt: "**(2 pts).** Recurse on the left subtree. This both fixes the sizes down there **and** returns the left size. Store it in a new int called `leftSize`.",
      answers: ["int leftSize = updateSubtreeSize(root->left);"],
      hints: [
        { when: "size", at: "updateSubtreeSize", say: "Don't read `root->left->size` directly: it might be wrong (or NULL). Call the function so it gets fixed." },
        { when: "root", at: "root->left", say: "Passing `root` again would recurse forever. Go down to `root->left`." },
      ],
    },
    {
      id: "right",
      kind: "type",
      title: "Ask the right kid",
      pts: 2,
      prompt: "**(2 pts).** Same for the right side. Store it in a new int called `rightSize`.",
      answers: ["int rightSize = updateSubtreeSize(root->right);"],
    },
    {
      id: "store",
      kind: "type",
      title: "Store this node's size",
      pts: 2,
      prompt: "**(2 pts).** Write this node's size into its `size` field.",
      answers: ["root->size = leftSize + rightSize + 1;", "root->size = 1 + leftSize + rightSize;", "root->size = leftSize + 1 + rightSize;"],
      hints: [
        { when: ";", at: "+", say: "Don't forget to count the node itself: `+ 1`." },
        { when: "size", at: "root->size", say: "Store it **in the node**: `root->size = ...`." },
      ],
    },
    {
      id: "ret",
      kind: "type",
      title: "Return it",
      pts: 2,
      prompt: "**(2 pts).** Return this node's size so its parent can use it.",
      answers: ["return root->size;", "return leftSize + rightSize + 1;"],
    },
  ],
  answer:
    "int updateSubtreeSize(node* root) {\n    if (root == NULL) return 0;                        // 2\n    int leftSize = updateSubtreeSize(root->left);      // 2\n    int rightSize = updateSubtreeSize(root->right);    // 2\n    root->size = leftSize + rightSize + 1;             // 2\n    return root->size;                                 // 2\n}",
  takeaway: "Tree recipe again: empty tree → 0, ask both kids, combine with + 1, store, return.",
};

const HEAP_CODE = `typedef struct HeapStruct {
    MysteryStruct** heaparray; // Stores pointers to each MysteryStruct in heap.
    int capacity;  // max elements the heap can store. Length of heaparray is capacity+1.
    int curSize;   // current number of elements in the heap.
} HeapStruct;

// Returns a negative integer if the struct pointed to by ptrA comes
// before the struct pointed to by ptrB, a positive integer if the
// struct pointed to by ptrA comes after the struct pointed to by ptrB,
// and 0 otherwise.
int compare(MysteryStruct* ptrA, MysteryStruct* ptrB);`;

const B2: Question = {
  id: "B2",
  pts: 10,
  category: "DSN",
  topic: "Heaps",
  title: "Recursive percolateUp",
  story:
    "Consider an implementation of a heap of elements of the type `MysteryStruct`. Using the `HeapStruct` definition, write the `percolateUp` function **recursively**.\n\nNotes: this function is called when inserting a new item into the heap, the root of the heap is stored at **index 1**, not index 0, and the heap is a **minimum heap**. You may assume that `curSize` has already been updated (do NOT change it) and that the `index` initially passed in is within the bounds of the array. You have access to the `compare` function.\n\n*(An iterative solution is worth at most 5 of the 10 points.)*",
  given: [
    { id: "b2-struct", title: "HeapStruct and compare", kind: "code", body: HEAP_CODE },
    { id: "b2-header", title: "Function header", kind: "code", body: "// Recursively percolates up the item stored at index in the heap pointed to by heapPtr.\nvoid percolateUp(HeapStruct* heapPtr, int index) {\n\n}" },
  ],
  scaffold: { title: "percolateUp so far", code: "void percolateUp(HeapStruct* heapPtr, int index) {\n    {{root}}\n    {{order}}\n    {{swap}}\n    {{recur}}\n}" },
  steps: [
    {
      id: "slot",
      kind: "choice",
      title: "What's in one slot?",
      prompt: "`MysteryStruct** heaparray`: what does one slot, like `heapPtr->heaparray[3]`, hold?",
      options: [
        { t: "A pointer to a MysteryStruct (an address)", ok: true, why: "Two stars = an array of pointers. So swapping two slots just swaps two addresses. That's cheap, and it's all we need." },
        { t: "A whole MysteryStruct", why: "That would be `MysteryStruct* heaparray`. With two stars, each slot holds a pointer." },
        { t: "An int", why: "We don't even know what's inside a MysteryStruct. That's why we're given `compare`." },
      ],
    },
    {
      id: "compare-sign",
      kind: "choice",
      title: "Reading compare",
      prompt: "In a **min** heap, the item at `index` should move up when it comes **before** its parent. What does `compare(item, parent)` return in that case?",
      options: [
        { t: "A negative number", ok: true, why: "Negative = ptrA comes first. So if compare(item, parent) is **≥ 0**, the item is already in a fine spot and we stop." },
        { t: "A positive number", why: "Positive means ptrA comes **after** ptrB. That's the \"leave it alone\" case." },
        { t: "0", why: "0 means a tie. Ties don't need a swap." },
      ],
    },
    {
      id: "root",
      kind: "type",
      title: "Base case 1: at the root",
      pts: 2,
      prompt: "**(2 pts).** The root (index 1) has no parent. Stop there. One line.",
      answers: ["if (index == 1) return;", "if (index <= 1) return;"],
      hints: [{ when: "0", at: "1", say: "This heap's root lives at index **1**." }],
    },
    {
      id: "order",
      kind: "type",
      title: "Base case 2: already in order",
      pts: 3,
      prompt: "**(3 pts).** Stop if the item at `index` does **not** come before its parent (at `index/2`). Use `compare`. One line.",
      answers: [
        "if (compare(heapPtr->heaparray[index], heapPtr->heaparray[index/2]) >= 0) return;",
        "if (compare(heapPtr->heaparray[index], heapPtr->heaparray[index/2]) > 0) return;",
        "if (compare(heapPtr->heaparray[index/2], heapPtr->heaparray[index]) <= 0) return;",
      ],
      hints: [
        { when: "heaparray", at: "heapPtr", say: "`heaparray` lives inside the struct: `heapPtr->heaparray[...]`." },
        { when: "<", at: ">=", say: "We **stop** when the item does not come first, so `>= 0`." },
        { when: "index*2", say: "`index*2` is a child. The parent is `index/2`." },
      ],
    },
    {
      id: "swap",
      kind: "type",
      title: "Swap with the parent",
      pts: 3,
      prompt: "**(3 pts).** Swap the two pointers at `index` and `index/2`. Use a temporary pointer called `tmp`. Three lines.",
      answers: [
        "MysteryStruct* tmp = heapPtr->heaparray[index];\nheapPtr->heaparray[index] = heapPtr->heaparray[index/2];\nheapPtr->heaparray[index/2] = tmp;",
        "MysteryStruct* tmp = heapPtr->heaparray[index/2];\nheapPtr->heaparray[index/2] = heapPtr->heaparray[index];\nheapPtr->heaparray[index] = tmp;",
      ],
      hints: [
        { when: "int", at: "MysteryStruct", say: "Each slot holds a `MysteryStruct*`, so `tmp` must be that type too." },
        { when: "MysteryStruct", at: "*", say: "`tmp` holds a pointer, not a whole struct: `MysteryStruct* tmp`." },
      ],
    },
    {
      id: "recur",
      kind: "type",
      title: "Keep climbing",
      pts: 2,
      prompt: "**(2 pts).** The item now sits at the parent's index. Recurse from there.",
      answers: ["percolateUp(heapPtr, index/2);"],
      hints: [{ when: "index", at: "index/2", say: "The item moved to `index/2`. Continue from that spot." }],
    },
  ],
  answer:
    "void percolateUp(HeapStruct* heapPtr, int index) {\n    if (index == 1) return;                                        // 2\n    if (compare(heapPtr->heaparray[index],\n                heapPtr->heaparray[index/2]) >= 0) return;         // 3\n    MysteryStruct* tmp = heapPtr->heaparray[index];                // 3 (swap)\n    heapPtr->heaparray[index] = heapPtr->heaparray[index/2];\n    heapPtr->heaparray[index/2] = tmp;\n    percolateUp(heapPtr, index/2);                                 // 2\n}",
  takeaway: "percolateUp: stop at the root, stop if already in order, else swap with index/2 and recurse.",
};

const TRIE_CODE = `struct trie {
    int count;              // count of the word ending at this node
    struct trie* next[26];
};

struct trie* del(struct trie* r, char word[], int k) {
    if (r == NULL)
        return NULL;
    if (word[k] == '\\0') {
        r->count = r->count - 1;
        if (isEmpty(r) && r->count == 0) {
            free(r);
        }
        return r;
    }
    int nextIdx = word[k] - 'a';
    r->next[nextIdx] = del(r->next[nextIdx], word, k+1);
    if (isEmpty(r) && r->count == 0) {
        free(r);
    }
    return r;
}`;

const B3: Question = {
  id: "B3",
  pts: 5,
  category: "DSN",
  topic: "Tries",
  title: "Fix the trie delete",
  story:
    "The `del()` function takes the root of a trie, a word to delete, and `k = 0`. It removes **one occurrence** of the word from the trie and deletes any unnecessary nodes along the way. It calls `isEmpty()`, which returns 1 if a node has no children and 0 otherwise.\n\nBut there are bugs. For the trie in your inventory, deleting \"box\" once correctly frees all its memory. If we try to delete \"box\" **again**, the program crashes due to invalid memory access.\n\nIdentify the bugs and fix them. *Hint: you only need to change two places.*",
  given: [
    { id: "b3-code", title: "struct trie and del()", kind: "code", body: TRIE_CODE },
    { id: "b3-trie", title: "The trie (count at each node)", kind: "text", body: "(root:0)\n ├─a→ (1)  ─p→ (0) ─p→ (5)      \"a\" ×1, \"app\" ×5\n └─b→ (0)  ─o→ (0) ─x→ (1)      \"box\" ×1" },
  ],
  scaffold: {
    title: "The two fixes",
    code: "if (word[k] == '\\0') {\n    r->count = r->count - 1;\n    if (isEmpty(r) && r->count == 0) {\n        free(r);\n        {{fix1}}\n    }\n    return r;\n}\n...\nif (isEmpty(r) && r->count == 0) {\n    free(r);\n    {{fix2}}\n}\nreturn r;",
  },
  steps: [
    {
      id: "free-what",
      kind: "choice",
      title: "What does free(r) do to r?",
      prompt: "After `free(r);`, what is stored in the variable `r`?",
      options: [
        { t: "The same old address. The memory is gone, but r still points at it (a dangling pointer)", ok: true, why: "free gives the memory back. It does **not** change r. So `return r;` hands the dead address back up." },
        { t: "NULL: free clears it automatically", why: "free can't change your variable. It only receives a copy of the address." },
      ],
    },
    {
      id: "second-delete",
      kind: "choice",
      title: "Why the second delete crashes",
      prompt: "The parent does `r->next[nextIdx] = del(...)`. After the first delete of \"box\", what does the root's `next['b' - 'a']` hold?",
      options: [
        { t: "The address of a node that was already freed, so the second delete reads freed memory and crashes", ok: true, why: "The `r == NULL` check can't catch it, because the pointer isn't NULL. It just points at garbage." },
        { t: "NULL, so the second delete stops right away", why: "That's what **should** happen, and it's what the fix makes happen." },
      ],
    },
    {
      id: "fix1",
      kind: "type",
      title: "Fix 1: the end of the word",
      pts: 3,
      prompt: "**(3 pts).** In the end-of-word branch, right after `free(r);`, add the line that makes `return r;` hand back NULL.",
      answers: ["r = NULL;"],
      hints: [
        { when: "free", say: "It's already freed. Freeing twice is its own crash. Just clear the pointer." },
        { when: "return", say: "There's already a `return r;` below. Fix what `r` holds first." },
      ],
    },
    {
      id: "fix2",
      kind: "type",
      title: "Fix 2: the parents",
      pts: 2,
      prompt: "**(2 pts).** The same bug happens at the bottom of the function, where parent nodes get freed. Add the same fix after that `free(r);`.",
      answers: ["r = NULL;"],
    },
  ],
  answer:
    "Add  r = NULL;  right after BOTH  free(r);  lines:\n\n    free(r);\n    r = NULL;   // 3 pts (end-of-word branch)\n...\n    free(r);\n    r = NULL;   // 2 pts (bottom of the function)",
  takeaway: "free() never clears your pointer. If someone keeps that pointer, set it to NULL after freeing.",
};

// ───────────────────────────── Section C ─────────────────────────────

const C1_CODE = `int min(int a, int b) { return a < b ? a : b; }

int** f(int* array, int k) {
    int** res = calloc(k+1, sizeof(int*));
    for (int i=0; i<k+1; i++) {
        int sz = (1<<(k-i));
        res[i] = calloc(sz, sizeof(int));
        if (i == 0) {
            for (int j=0; j<sz; j++) res[i][j] = array[j];
        }
        else {
            for (int j=0; j<sz; j++)
                res[i][j] = min(res[i-1][2*j], res[i-1][2*j+1]);
        }
    }
    return res;
}`;

const C1: Question = {
  id: "C1",
  pts: 10,
  category: "ANL",
  topic: "Algorithm Analysis",
  title: "Shrinking rows",
  story:
    "The function takes in an integer array and an integer `k`. The array has size **n = 2^k** exactly. The function returns an array of arrays.\n\n**(a) (8 pts)** With proof, determine the Big-Oh run time (tight bound) of `f` in terms of n.\n\n**(b) (2 pts)** If k = 4, what are the lengths of res[0], res[1], res[2], …?",
  given: [{ id: "c1-code", title: "The code", kind: "code", body: C1_CODE }],
  recipe: "code-runtime",
  steps: [
    {
      id: "k-log",
      kind: "choice",
      title: "k in terms of n",
      prompt: "n = 2^k. So what is k?",
      options: [
        { t: "k = lg n", ok: true, why: "By the definition of log: 2^k = n means k = log₂ n. So the outer loop runs lg n + 1 times." },
        { t: "k = n/2", why: "That would be n = 2k. Here it's 2 **to the power** k." },
      ],
    },
    {
      id: "inner",
      kind: "choice",
      title: "How long is each inner loop?",
      pts: 4,
      prompt: "**(4 pts).** Both branches loop `sz = 1 << (k-i)` times. As i goes 0, 1, 2, …, k, how many times does the inner loop run?",
      options: [
        { t: "2^k, 2^(k−1), 2^(k−2), …, 2, 1: halving powers of 2", ok: true, why: "`1 << (k-i)` is 2^(k−i). So the work is n, n/2, n/4, … , 1." },
        { t: "n every time, so lg n · n total", why: "Only the first row is n long. Each row is half the one before. (O(n lg n) only earns 4/10 on the exam.)" },
        { t: "k every time", why: "`sz` doesn't depend on k alone. It's 2^(k−i)." },
      ],
    },
    {
      id: "sum",
      kind: "type",
      title: "Add them up",
      pts: 2,
      prompt: "**(2 pts).** The total work is 2^0 + 2^1 + … + 2^k (same numbers, reversed). What does that sum equal? Use `^`.",
      answers: ["2^(k+1)-1", "2*2^k-1"],
      placeholder: "2^(...)-1",
      hints: [{ when: "2^k", at: "2^(k+1)", say: "Powers of 2 add up to one less than the **next** power: 1+2+4 = 7 = 2³−1." }],
    },
    {
      id: "sub",
      kind: "type",
      title: "Swap in n",
      pts: 1,
      prompt: "**(1 pt).** 2^(k+1) = 2 · 2^k = 2n. Rewrite 2^(k+1) − 1 in terms of n.",
      answers: ["2n-1", "2*n-1"],
    },
    {
      id: "bigo",
      kind: "type",
      title: "Big-Oh",
      pts: 1,
      prompt: "**(1 pt).** So what's the tight Big-Oh bound?",
      answers: ["O(n)"],
      hints: [{ when: "lg", say: "The halving rows add up to about 2n, so the lg n disappears." }],
    },
    {
      id: "sizes",
      kind: "slots",
      title: "(b) Row lengths for k = 4",
      pts: 2,
      score: "all",
      prompt: "**(b) 2 pts.** If k = 4, fill in the length of each row.",
      layout: "array",
      index: ["res[0]", "res[1]", "res[2]", "res[3]", "res[4]"],
      slots: ["16", "8", "4", "2", "1"].map((a, i) => ({ id: "len" + i, answer: a })),
      learn: "2^4 = 16, then halve each time. (The key gives 1 pt for powers of 2 in a different order.)",
    },
  ],
  answer:
    "(a) The inner loop runs sz = 2^(k−i) times for i = 0..k: 2^k + 2^(k−1) + … + 1\n    = Σ (i=0..k) 2^i = 2^(k+1) − 1 = 2n − 1 = O(n)\n\n(b) 16, 8, 4, 2, 1",
  takeaway: "Rows that halve each time add up to about 2n, not n lg n. Add up the actual work per iteration.",
};

const C2: Question = {
  id: "C2",
  pts: 5,
  category: "ANL",
  topic: "Algorithm Analysis",
  title: "Scaling an O(2ⁿ) algorithm",
  story: "An O(2ⁿ) algorithm took **625 milliseconds** to run on a data set with **n = 22**. How long would it take, in **seconds**, on a data set with **n = 26**?",
  given: [{ id: "c2-setup", title: "What we know", kind: "text", body: "T(n) = c · 2^n\nT(22) = 625 ms\nFind: T(26), in SECONDS" }],
  steps: [
    {
      id: "setup",
      kind: "type",
      title: "Set up for c",
      pts: 1,
      prompt: "**(1 pt).** Plug n = 22 into T(n) = c · 2^n. Write the equation.",
      answers: ["c*2^22=625", "c2^22=625", "c(2^22)=625", "625=c*2^22", "T(22)=c*2^22=625"],
    },
    {
      id: "c",
      kind: "type",
      title: "Solve for c",
      pts: 1,
      prompt: "**(1 pt).** Solve for c. Leave it as a fraction.",
      answers: ["c=625/2^22", "625/2^22", "c=625/(2^22)"],
    },
    {
      id: "plug",
      kind: "type",
      title: "Plug in 26",
      pts: 1,
      prompt: "**(1 pt).** Write T(26) using that c.",
      answers: ["T(26)=625/2^22*2^26", "(625/2^22)*2^26", "625/2^22*2^26", "T(26)=(625/2^22)*2^26", "625*2^4", "T(26)=625*2^4"],
    },
    {
      id: "ms",
      kind: "type",
      title: "Milliseconds",
      pts: 1,
      prompt: "**(1 pt).** 2^26 / 2^22 = 2^4 = 16. So how many **milliseconds**?",
      answers: ["10000", "10000ms", "10,000", "10^4"],
      hints: [{ when: "625", say: "Multiply 625 by 16." }],
    },
    {
      id: "sec",
      kind: "type",
      title: "Seconds",
      pts: 1,
      prompt: "**(1 pt).** The question asks for **seconds**. Convert.",
      answers: ["10", "10s", "10 seconds"],
      hints: [{ when: "10000", say: "That's milliseconds. 1000 ms = 1 second." }],
    },
  ],
  answer: "c · 2^22 = 625  →  c = 625 / 2^22\nT(26) = (625 / 2^22) · 2^26 = 625 · 2^4 = 10,000 ms = 10 seconds",
  takeaway: "Exponential timing: the ratio is 2^(difference in n). And always check the units they asked for.",
};

const C3: Question = {
  id: "C3",
  pts: 10,
  category: "ANL",
  topic: "Summations",
  title: "A sum in polynomial form",
  story: "Determine the following summation in terms of n, in **polynomial form** (like f(n) = 3n³ − 2n² + 17n + 5).",
  given: [
    { id: "c3-sum", title: "The summation", kind: "text", body: " 2n\n  Σ  (3i³ + 3i² + i)\n i=1" },
    { id: "c3-formulas", title: "Formulas you know (top limit m)", kind: "text", body: "Σ i   = m(m+1)/2\nΣ i²  = m(m+1)(2m+1)/6\nΣ i³  = m²(m+1)²/4\n\nHere m = 2n." },
  ],
  steps: [
    {
      id: "split",
      kind: "type",
      title: "Split the sum",
      pts: 1,
      prompt: "**(1 pt).** Split into three sums and pull the constants out front. Write `sum(i^3)` for Σ i³, and so on.",
      answers: ["3sum(i^3)+3sum(i^2)+sum(i)", "3*sum(i^3)+3*sum(i^2)+sum(i)"],
    },
    {
      id: "cube",
      kind: "type",
      title: "Plug in Σ i³",
      pts: 1,
      prompt: "**(1 pt).** Use the i³ formula with m = 2n. What is Σ i³ (i = 1 to 2n)?",
      answers: ["(2n)^2(2n+1)^2/4", "4n^2(2n+1)^2/4", "n^2(2n+1)^2"],
      hints: [{ when: "(n+1)", say: "Every m becomes 2n, including the one in (m+1): it's (2n+1)." }],
    },
    {
      id: "sq",
      kind: "type",
      title: "Plug in Σ i²",
      pts: 1,
      prompt: "**(1 pt).** What is Σ i² (i = 1 to 2n)?",
      answers: ["2n(2n+1)(4n+1)/6", "(2n)(2n+1)(4n+1)/6", "n(2n+1)(4n+1)/3"],
      hints: [{ when: "(2n+1)/6", say: "2m + 1 with m = 2n is 4n + 1." }],
    },
    {
      id: "lin",
      kind: "type",
      title: "Plug in Σ i",
      pts: 1,
      prompt: "**(1 pt).** What is Σ i (i = 1 to 2n)?",
      answers: ["2n(2n+1)/2", "(2n)(2n+1)/2", "n(2n+1)"],
    },
    {
      id: "clear",
      kind: "type",
      title: "Clear the fractions",
      pts: 2,
      prompt: "**(2 pts).** Multiply each piece by its constant (3, 3, 1) and cancel every fraction. Write the three terms added together, still factored.",
      answers: ["3n^2(2n+1)^2+n(2n+1)(4n+1)+n(2n+1)"],
      hints: [{ when: "/", say: "All the denominators cancel: 3 · 4n²/4 = 3n², 3 · 2n/6 = n, and 2n/2 = n." }],
    },
    {
      id: "expand",
      kind: "type",
      title: "Multiply out",
      pts: 2,
      prompt: "**(2 pts).** Multiply out each term. Write all the pieces, before combining like terms.",
      answers: ["12n^4+12n^3+3n^2+8n^3+6n^2+n+2n^2+n"],
      hints: [{ when: "4n^2", say: "(2n+1)² = 4n² + 4n + 1. Then multiply by 3n²." }],
    },
    {
      id: "final",
      kind: "type",
      title: "Gather terms",
      pts: 2,
      prompt: "**(2 pts).** Combine like terms into one polynomial.",
      answers: ["12n^4+20n^3+11n^2+2n"],
      hints: [{ when: "12n^4+12n^3", say: "There are two n³ terms: 12n³ + 8n³." }],
    },
  ],
  answer:
    "Σ = 3·(2n)²(2n+1)²/4 + 3·2n(2n+1)(4n+1)/6 + 2n(2n+1)/2\n  = 3n²(2n+1)² + n(2n+1)(4n+1) + n(2n+1)\n  = (12n⁴ + 12n³ + 3n²) + (8n³ + 6n² + n) + (2n² + n)\n  = 12n⁴ + 20n³ + 11n² + 2n\n\nCheck n = 1: (3+3+1) + (24+12+2) = 45 = 12+20+11+2 ✓",
  takeaway: "Split, plug in with m = 2n everywhere, clear fractions, expand, gather. Check your answer with n = 1.",
};

// ───────────────────────────── Section D ─────────────────────────────

const D1: Question = {
  id: "D1",
  pts: 10,
  category: "DSN",
  topic: "Recursive Coding",
  title: "Print a number triangle",
  story:
    "You'll write two recursive functions. COP 3223 is famous for having students print triangular designs. This one is n rows long, and the i-th row prints the first i positive integers in order.\n\n`printSeq(int n)` prints the integers from 1 to n, with each integer **except 1** preceded by a space. (It does NOT print a newline.)\n\n`printTriangle(int n)` prints a triangle of n rows. It must **call printSeq AND be recursive**. You may assume the initial n passed to both is positive.",
  given: [
    { id: "d1-pic", title: "The design for n = 4", kind: "text", body: "1\n1 2\n1 2 3\n1 2 3 4" },
    { id: "d1-headers", title: "Function headers", kind: "code", body: "void printSeq(int n) {\n\n}\n\nvoid printTriangle(int n) {\n\n}" },
  ],
  scaffold: {
    title: "Both functions so far",
    code: "void printSeq(int n) {\n    {{seqbase}}\n    {{seqrec}}\n    {{seqprint}}\n}\n\nvoid printTriangle(int n) {\n    {{tribase}}\n    {{trirec}}\n    {{tripseq}}\n    {{trinl}}\n}",
  },
  steps: [
    {
      id: "order",
      kind: "choice",
      title: "Recurse first or print first?",
      prompt: "`printSeq(4)` must print `1 2 3 4`. If it calls `printSeq(3)` (which prints `1 2 3`), when should it print the 4?",
      options: [
        { t: "After the recursive call, so the small numbers come out first", ok: true, why: "Recurse first, then print: the output builds up from 1. Printing first would give 4 3 2 1." },
        { t: "Before the recursive call", why: "Then 4 prints first, and the sequence comes out backwards." },
      ],
    },
    {
      id: "space",
      kind: "choice",
      title: "Where do the spaces go?",
      prompt: "Every number except 1 has a space **before** it. Which part of printSeq should print 1 with no space?",
      options: [
        { t: "The base case: when n == 1, print just \"1\"", ok: true, why: "Then every other number prints as `\" %d\"`, with the space in front. No trailing space, ever." },
        { t: "Print every number as \"%d \" and ignore the extra space", why: "That leaves a trailing space after the last number. The question is specific about the spacing." },
      ],
    },
    {
      id: "seqbase",
      kind: "type",
      title: "printSeq base case",
      pts: 3,
      prompt: "**(3 pts).** When n is 1, print `1` (no space) and stop. Write the whole `if` block with braces.",
      answers: ["if (n == 1) {\nprintf(\"1\");\nreturn;\n}", "if (n == 1) {\nprintf(\"%d\", 1);\nreturn;\n}"],
      hints: [
        { when: "\" 1\"", say: "No space before the 1. The first number has nothing in front of it." },
        { when: "\\n", say: "printSeq never prints a newline. That's printTriangle's job." },
      ],
    },
    {
      id: "seqrec",
      kind: "type",
      title: "Print 1 to n−1 first",
      pts: 1,
      prompt: "**(1 pt).** Let recursion print `1 2 … n−1`.",
      answers: ["printSeq(n-1);"],
    },
    {
      id: "seqprint",
      kind: "type",
      title: "Then print n",
      pts: 1,
      prompt: "**(1 pt).** Now print n, with a space in front of it.",
      answers: ["printf(\" %d\", n);"],
      hints: [{ when: "\"%d \"", say: "The space goes **before** the number: `\" %d\"`." }],
    },
    {
      id: "tribase",
      kind: "type",
      title: "printTriangle base case",
      pts: 1,
      prompt: "**(1 pt).** A triangle with 0 rows prints nothing. Write the base case.",
      answers: ["if (n == 0) return;", "if (n <= 0) return;", "if (n < 1) return;"],
    },
    {
      id: "trirec",
      kind: "type",
      title: "Print the smaller triangle first",
      pts: 2,
      prompt: "**(2 pts).** Rows 1 to n−1 come first. Let recursion print them.",
      answers: ["printTriangle(n-1);"],
      hints: [{ when: "printSeq", at: "printTriangle", say: "First the smaller **triangle** (n−1 rows), then this row." }],
    },
    {
      id: "tripseq",
      kind: "type",
      title: "Print row n",
      pts: 1,
      prompt: "**(1 pt).** Now print the last row, `1 2 … n`, using the other function.",
      answers: ["printSeq(n);"],
    },
    {
      id: "trinl",
      kind: "type",
      title: "End the row",
      pts: 1,
      prompt: "**(1 pt).** Finish the row with a newline.",
      answers: ["printf(\"\\n\");"],
    },
  ],
  answer:
    "void printSeq(int n) {\n    if (n == 1) {            // 3 (base case + spacing)\n        printf(\"1\");\n        return;\n    }\n    printSeq(n-1);           // 1\n    printf(\" %d\", n);        // 1\n}\n\nvoid printTriangle(int n) {\n    if (n == 0) return;      // 1\n    printTriangle(n-1);      // 2\n    printSeq(n);             // 1\n    printf(\"\\n\");           // 1\n}",
  takeaway: "Recurse first, then print, and the output comes out in increasing order.",
};

const D2: Question = {
  id: "D2",
  pts: 5,
  category: "ALG",
  topic: "Sorting",
  title: "Counting Insertion Sort swaps",
  recipe: "sort-swaps",
  story:
    "A **swap** here means the values at two different array indexes are exchanged.\n\n**(a) (2 pts)** How many swaps does Insertion Sort perform on the array in your inventory?\n\n**(b) (2 pts)** Give an example array (8 values) for which that answer is as large as possible.\n\n**(c) (1 pt)** How many swaps would Insertion Sort take on your array from (b)?",
  given: [{ id: "d2-array", title: "The array for part (a)", kind: "table", table: { head: ["index", "0", "1", "2", "3", "4", "5", "6", "7"], rows: [["value", "12", "3", "7", "5", "15", "10", "19", "9"]] } }],
  steps: [
    {
      id: "inversions",
      kind: "choice",
      title: "The big secret",
      prompt: "Insertion Sort swaps each new item leftward past every bigger item before it. So the number of swaps equals…",
      options: [
        { t: "The number of out-of-order pairs (a bigger number somewhere before a smaller one)", ok: true, why: "Each swap fixes exactly one out-of-order pair. Count the pairs and you've counted the swaps, without tracing the whole sort." },
        { t: "The number of elements, n", why: "A sorted array takes 0 swaps, so it can't always be n." },
      ],
    },
    {
      id: "a",
      kind: "type",
      title: "(a) Count the swaps",
      pts: 2,
      prompt: "**(a) 2 pts.** Count the out-of-order pairs. For each number, count the smaller numbers to its **right**. (12 has 5: 3, 7, 5, 10, 9.)",
      answers: ["10"],
      hints: [
        { when: "9", say: "Close (and worth 1 pt on the exam). Recount: 12→5, 3→0, 7→1, 5→0, 15→2, 10→1, 19→1, 9→0." },
        { when: "11", say: "Close (and worth 1 pt on the exam). Recount: 12→5, 3→0, 7→1, 5→0, 15→2, 10→1, 19→1, 9→0." },
      ],
      learn: "12→5, 7→1, 15→2, 10→1, 19→1. Total 10.",
    },
    {
      id: "b",
      kind: "choice",
      title: "(b) The worst array",
      pts: 2,
      prompt: "**(b) 2 pts.** Which kind of array makes Insertion Sort do the most swaps?",
      options: [
        { t: "Reverse sorted, like 100 90 80 70 60 50 40 30", ok: true, why: "Every pair is out of order, so every pair costs a swap. Any strictly decreasing array gets full credit." },
        { t: "Already sorted, like 30 40 50 60 70 80 90 100", why: "That's the **best** case: 0 swaps." },
        { t: "All the same number", why: "Equal values never swap. That's 0 swaps too." },
      ],
    },
    {
      id: "c",
      kind: "type",
      title: "(c) How many for that array?",
      pts: 1,
      prompt: "**(c) 1 pt.** With 8 values in reverse order, every pair is out of order. How many pairs are there? (8 · 7 / 2)",
      answers: ["28"],
      hints: [{ when: "56", say: "8 · 7 counts each pair twice. Divide by 2." }],
    },
  ],
  answer: "(a) 10\n(b) any strictly decreasing array, e.g. 100 90 80 70 60 50 40 30\n(c) 28  (= 8·7/2)",
  takeaway: "Insertion Sort swaps = number of out-of-order pairs. Worst case is reverse order: n(n−1)/2.",
};

const D3: Question = {
  id: "D3",
  pts: 10,
  category: "DSN",
  topic: "Bitwise Operators",
  title: "Which bits are on?",
  story:
    "Write a function that takes in a positive integer n (≤ 2³¹ − 1) and returns a **dynamically allocated array** storing the bit locations that are turned on in n's binary representation, from smallest to largest.\n\nFor example, if n = 37, return an array of size 3 storing {0, 2, 5}, since 2⁵ + 2² + 2⁰ = 37.\n\nThe array's size isn't known before the call, so the function takes a pointer `ptrSize`. Before returning, store the array's size in the integer `ptrSize` points to. (You may NOT assume that integer starts at any particular value.)",
  given: [
    { id: "d3-header", title: "Function header", kind: "code", body: "int* bitsOn(int n, int* ptrSize) {\n\n}" },
    { id: "d3-37", title: "37 in binary", kind: "text", body: "bit:   5 4 3 2 1 0\n37 =   1 0 0 1 0 1\n\non: bits 0, 2, 5  →  {0, 2, 5}, *ptrSize = 3" },
  ],
  scaffold: { title: "bitsOn so far", code: "int* bitsOn(int n, int* ptrSize) {\n    {{alloc}}\n    {{idx}}\n    {{loop}}\n        {{test}}\n            {{store}}\n    {{shrink}}\n    {{size}}\n    {{ret}}\n}" },
  steps: [
    {
      id: "max-bits",
      kind: "choice",
      title: "How big can the answer get?",
      prompt: "n ≤ 2³¹ − 1, so it uses bits 0 to 30. What's the most bit locations we could ever store?",
      options: [
        { t: "31, so allocate 31 ints up front, then shrink to the real size at the end", ok: true, why: "Allocate the worst case, fill it, then `realloc` down to exactly `idx` ints." },
        { t: "32", why: "Bit 31 would be the sign bit. n is positive and at most 2³¹ − 1, so bits 0 to 30: 31 spots." },
      ],
    },
    {
      id: "alloc",
      kind: "type",
      title: "Allocate the worst case",
      pts: 2,
      prompt: "**(2 pts).** Allocate room for 31 ints in a new pointer called `res`.",
      answers: ["int* res = calloc(31, sizeof(int));", "int* res = malloc(31 * sizeof(int));", "int* res = malloc(sizeof(int) * 31);"],
    },
    {
      id: "idx",
      kind: "type",
      title: "A write index",
      pts: 1,
      prompt: "**(1 pt).** Make an int called `idx`, starting at 0, for the next free slot in `res`.",
      answers: ["int idx = 0;"],
    },
    {
      id: "loop",
      kind: "type",
      title: "Loop over the bits",
      pts: 1,
      prompt: "**(1 pt).** Write the `for` header that visits bit positions 0 through 30, smallest first, using `i`.",
      answers: loops(["int i=0"], ["i<31", "i<=30"], ["i++", "++i", "i+=1"]),
      hints: [{ when: "i--", say: "Smallest to largest, so count **up** from 0." }],
    },
    {
      id: "test",
      kind: "type",
      title: "Is bit i on?",
      pts: 2,
      prompt: "**(2 pts).** Write the `if` header that checks whether bit `i` of `n` is on.",
      answers: ["if (n & (1 << i))", "if ((n & (1 << i)) != 0)", "if ((n >> i) & 1)"],
      hints: [
        { when: "&&", at: "&", say: "`&&` is logical AND. To look at one bit use bitwise AND, a single `&`." },
        { when: "i", at: "1", say: "Build a mask with one 1 in position i: `1 << i`." },
      ],
    },
    {
      id: "store",
      kind: "type",
      title: "Store the location",
      pts: 2,
      prompt: "**(2 pts).** It's on. Store the bit **location** `i` at `res[idx]` and move `idx` forward. One line.",
      answers: ["res[idx++] = i;"],
      hints: [
        { when: "1 <<", say: "Store the **location** i, not the value 2^i." },
        { when: "res[i]", say: "`i` is the bit position. The next free slot in `res` is `idx`." },
      ],
    },
    {
      id: "shrink",
      kind: "type",
      title: "Shrink to fit",
      pts: 1,
      prompt: "**(1 pt).** Shrink `res` to exactly `idx` ints with `realloc`.",
      answers: ["res = realloc(res, idx * sizeof(int));", "res = realloc(res, sizeof(int) * idx);"],
      hints: [{ when: "realloc", at: "res =", say: "realloc may move the block. Store its result back in `res`." }],
    },
    {
      id: "size",
      kind: "type",
      title: "Report the size",
      pts: 1,
      prompt: "**(1 pt).** Store the size in the integer `ptrSize` points to.",
      answers: ["*ptrSize = idx;"],
      hints: [{ when: "ptrSize", at: "*ptrSize", say: "`ptrSize` is the pointer. Write through it: `*ptrSize`." }],
    },
    {
      id: "ret",
      kind: "type",
      title: "Return the array",
      pts: 0,
      prompt: "Last line (no points on its own): return the array.",
      answers: ["return res;"],
    },
  ],
  answer:
    "int* bitsOn(int n, int* ptrSize) {\n    int* res = calloc(31, sizeof(int));\n    int idx = 0;\n    for (int i = 0; i < 31; i++)\n        if (n & (1 << i))\n            res[idx++] = i;\n    res = realloc(res, idx * sizeof(int));\n    *ptrSize = idx;\n    return res;\n}\n\n(The key scatters its 10 points across these lines; this game maps them as shown in each step.)",
  takeaway: "Test bit i with n & (1 << i). Unknown result size? Allocate the max, fill with an index, realloc down, report the size through a pointer.",
};

export const SUMMER_2026: Exam = {
  id: "summer2026",
  term: "Summer 2026",
  date: "May 16, 2026",
  blurb: "Odd stars, Hogwarts house points, circular queues, subtree sizes, a buggy trie, halving rows, and set bits.",
  questionsPdf: `${EXAMS_URL}sum2026/FE-May26.pdf`,
  solutionsPdf: `${EXAMS_URL}sum2026/FE-May26-Sol.pdf`,
  sections: [
    { id: "A", name: "Basic Data Structures", questions: [A1, A2, A3] },
    { id: "B", name: "Advanced Data Structures", questions: [B1, B2, B3] },
    { id: "C", name: "Algorithm Analysis", questions: [C1, C2, C3] },
    { id: "D", name: "Algorithms", questions: [D1, D2, D3] },
  ],
};
