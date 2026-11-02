import type { Exam, Question, TreeSpec } from "@/lib/arcade/types";
import { EXAMS_URL } from "@/lib/sections";
import { loops } from "./fall2026-ab";

// May 18, 2024 Foundation Exam, every question, every rubric point.

// ───────────────────────────── Section A ─────────────────────────────

const A1_CODE = `int **arr1 = malloc(3 * sizeof(int *));
for(int i = 0; i < 3; ++i)
    arr1[i] = malloc(2 * sizeof(int));
int *arr2 = malloc(3 * 2 * sizeof(int));`;

const A1_PICTURE = `STACK              HEAP
┌──────┐
│ arr1 │──────►  [int*|int*|int*]
└──────┘            │     │     │
                    ▼     ▼     ▼
              [int|int] [int|int] [int|int]
┌──────┐
│ arr2 │──────►  [int|int|int|int|int|int]
└──────┘`;

const A1: Question = {
  id: "A1",
  pts: 5,
  category: "ALG",
  topic: "Dynamic Memory Management in C",
  title: "Two ways to store 3 × 2 ints",
  recipe: "malloc",
  story:
    "Given the C code in your inventory, answer the questions about it.\n\n**a)** Do `arr1` and `arr2` require the same number of total bytes in the heap? (yes/no)\n\n**b)** Are **all** the addresses associated with `arr1` (excluding arr1 itself on the stack) adjacent in memory? (yes/no)\n\n**c)** Are all the addresses associated with `arr2` (excluding arr2 itself on the stack) adjacent in memory? (yes/no)\n\n**d)** Complete the stack and heap picture showing the memory after all lines run. For each box in the heap, say what type is stored in it.",
  given: [{ id: "a1-code", title: "The code", kind: "code", body: A1_CODE }],
  steps: [
    {
      id: "count1",
      kind: "choice",
      title: "Count arr1's mallocs",
      prompt: "Warm-up. How many separate `malloc` calls does building `arr1` make?",
      options: [
        { t: "4: one for the array of 3 row pointers, then one per row inside the loop", ok: true, why: "Yes. 1 outer + 3 rows = 4 separate blocks, each placed wherever the heap has room." },
        { t: "1", why: "The loop runs `malloc` 3 more times, once per row." },
        { t: "3", why: "Don't forget the first line: the array of row pointers is its own malloc." },
      ],
    },
    {
      id: "a",
      kind: "choice",
      title: "(a) Same bytes?",
      pts: 1,
      prompt: "**(a) 1 pt.** Both hold 6 ints. Do `arr1` and `arr2` need the same total bytes in the heap?",
      options: [
        { t: "No", ok: true, why: "arr2 is just 6 ints. arr1 has those same 6 ints **plus** an array of 3 `int*` pointers (3 × 8 bytes on most machines). The pointers cost extra." },
        { t: "Yes", why: "Count the extra block: arr1 also stores 3 row pointers in the heap. arr2 has no pointers at all." },
      ],
    },
    {
      id: "b",
      kind: "choice",
      title: "(b) arr1 all together?",
      pts: 1,
      prompt: "**(b) 1 pt.** Are all of `arr1`'s heap addresses adjacent in memory?",
      options: [
        { t: "No", ok: true, why: "Four separate mallocs can land anywhere. Each row is contiguous inside itself, but the rows aren't next to each other." },
        { t: "Yes", why: "Each malloc picks its own spot. Nothing promises the 4 blocks sit side by side." },
      ],
    },
    {
      id: "c",
      kind: "choice",
      title: "(c) arr2 all together?",
      pts: 1,
      prompt: "**(c) 1 pt.** Are all of `arr2`'s heap addresses adjacent?",
      options: [
        { t: "Yes", ok: true, why: "One malloc returns one contiguous block, so all 6 ints sit side by side." },
        { t: "No", why: "It's a single malloc. A single block is always contiguous." },
      ],
    },
    {
      id: "stack",
      kind: "choice",
      title: "(d) The stack",
      pts: 1,
      prompt: "**(d) 1 pt.** What lives on the **stack**?",
      options: [
        { t: "The two pointer variables arr1 and arr2 (in either order), each with an arrow into the heap", ok: true, why: "Local variables live on the stack. They only hold addresses; everything malloc'd is in the heap." },
        { t: "All 6 ints of arr2", why: "Those came from malloc, so they're in the heap. The stack only has the pointer `arr2`." },
        { t: "Nothing: arr1 and arr2 are in the heap", why: "The variables themselves are locals, so they're on the stack. What they *point to* is in the heap." },
      ],
    },
    {
      id: "heap",
      kind: "choice",
      title: "(d) The heap",
      pts: 1,
      prompt: "**(d) 1 pt.** What boxes go in the **heap**?",
      options: [
        { t: "A block of 3 int* (arr1 points here), each pointing to its own block of 2 ints, plus one block of 6 ints (arr2 points here)", ok: true, why: "That's exactly the picture now in your inventory. Label every box with its type: `int*` or `int`." },
        { t: "One block of 6 ints for arr1 and one for arr2", why: "arr1 is built row by row: first 3 pointers, then 3 separate rows of 2." },
        { t: "A 3 × 2 grid of ints for arr1", why: "`int**` isn't a grid. It's an array of row *pointers*, with each row allocated separately." },
      ],
      learn: "Rubric for (d): 1 pt for the stack (arr1 and arr2, either order), 1 pt for the heap.",
      give: [{ id: "a1-pic", title: "(d) The memory picture", kind: "text", body: A1_PICTURE }],
    },
  ],
  answer: "a) No\nb) No\nc) Yes\nd)\n" + A1_PICTURE,
  takeaway: "One malloc = one contiguous block. An int** array is 1 + (number of rows) separate blocks, and the row pointers cost extra bytes.",
};

const NODE_T = `typedef struct node_s {
    int data;
    struct node_s* next;
} node_t;`;

const A2: Question = {
  id: "A2",
  pts: 10,
  category: "DSN",
  topic: "Linked Lists",
  title: "Move the head next to the tail",
  story:
    "Complete `moveHeadNearTail`. It moves the **head node** of a singly linked list to the **second last position** (the spot just before the tail). It returns the head of the modified list. You may assume the list has **at least 3 elements**.",
  given: [
    { id: "a2-struct", title: "struct node_s", kind: "code", body: NODE_T },
    { id: "a2-pic", title: "Sample", kind: "text", body: "Before:  1 → 7 → 5 → 2 → NIL\nAfter:   7 → 5 → 1 → 2 → NIL" },
    { id: "a2-header", title: "Function header", kind: "code", body: "node_t * moveHeadNearTail(node_t * head) {\n\n}" },
  ],
  scaffold: {
    title: "moveHeadNearTail so far",
    code: "node_t * moveHeadNearTail(node_t * head) {\n    {{tmp}}\n    {{walk}}\n        {{step}}\n    {{front}}\n    {{link1}}\n    {{link2}}\n    {{ret}}\n}",
  },
  steps: [
    {
      id: "plan",
      kind: "choice",
      title: "The plan",
      prompt: "Look at the sample. Which nodes' `next` pointers have to change?",
      options: [
        { t: "Node 1's next (now points to 2, the tail) and node 5's next (now points to 1)", ok: true, why: "Yes. 1 gets spliced in between 5 and 2, and 7 becomes the new front. So we need a pointer to the second-to-last node (5)." },
        { t: "Only node 2's", why: "The tail 2 still ends the list. It's 1 and 5 whose arrows change." },
        { t: "Every node's", why: "Only two arrows move. The middle of the list (7 → 5) stays the same." },
      ],
    },
    {
      id: "tmp",
      kind: "type",
      title: "Start a walker",
      pts: 1,
      prompt: "**(1 pt).** Make a new pointer `tmp` that starts at `head`. We'll walk it to the second-to-last node.",
      answers: ["node_t* tmp = head;"],
    },
    {
      id: "walk",
      kind: "type",
      title: "Stop at second-to-last",
      pts: 2,
      prompt: "**(2 pts).** Write the `while` header (no brace, the body is one line) that keeps going until `tmp` is the **second-to-last** node: the one whose next node is the tail.\n\nHint: the tail's own `next` is NULL.",
      answers: ["while (tmp->next->next != NULL)", "while (tmp->next->next)", "while (NULL != tmp->next->next)"],
      hints: [{ when: "!=", at: "->", say: "`tmp->next != NULL` stops at the *tail*. Look one node further ahead: `tmp->next->next`." }],
    },
    {
      id: "step",
      kind: "type",
      title: "Move forward",
      pts: 1,
      prompt: "**(1 pt).** The loop body: move `tmp` forward one node.",
      answers: ["tmp = tmp->next;"],
    },
    {
      id: "order",
      kind: "choice",
      title: "Save before you cut",
      prompt: "We're about to change `head->next`. Why save `head->next` somewhere first?",
      options: [
        { t: "It's the new front of the list (7). Once head->next changes, we lose the only way to reach it", ok: true, why: "Right. Save it, then rewire, then return it." },
        { t: "We don't need to", why: "After `head->next` points at the tail, nothing points at 7 any more. The whole front of the list would be lost." },
      ],
    },
    {
      id: "front",
      kind: "type",
      title: "Save the new front",
      pts: 1,
      prompt: "**(1 pt).** Save the second node in a new pointer called `newfront`.",
      answers: ["node_t* newfront = head->next;"],
    },
    {
      id: "link1",
      kind: "type",
      title: "Old head → tail",
      pts: 2,
      prompt: "**(2 pts).** The old head now goes right before the tail. Point `head->next` at the tail. (`tmp` is second-to-last, so the tail is `tmp->next`.)",
      answers: ["head->next = tmp->next;"],
      hints: [{ when: "NULL", say: "The head doesn't become the last node. It sits *before* the tail, so it points at the tail." }],
    },
    {
      id: "link2",
      kind: "type",
      title: "Second-to-last → old head",
      pts: 2,
      prompt: "**(2 pts).** Finally, point `tmp` (the old second-to-last node) at the old head.",
      answers: ["tmp->next = head;"],
    },
    {
      id: "ret",
      kind: "type",
      title: "Return the new front",
      pts: 1,
      prompt: "**(1 pt).** Return the new front of the list.",
      answers: ["return newfront;"],
      hints: [{ when: "head", say: "head is now near the end. The list starts at the node you saved." }],
    },
  ],
  answer:
    "node_t * moveHeadNearTail(node_t * head) {\n    node_t* tmp = head;                     // 1\n    while (tmp->next->next != NULL)         // 2\n        tmp = tmp->next;                    // 1\n    node_t* newfront = head->next;          // 1\n    head->next = tmp->next;                 // 2\n    tmp->next = head;                       // 2\n    return newfront;                        // 1\n}",
  takeaway: "Walk to the node *before* where you're inserting (`->next->next`), save anything you're about to cut off, then rewire.",
};

const A3_GIVEN = `typedef struct node_s {
    int data;
    struct node_s * next;
} node_t;

typedef struct {
    node_t * top;
} stack_t;

// Initializes a stack to be empty.
void init(stack_t* s);    // (the exam prints "stact_t" here, a typo)

// Pushes data onto the stack pointed to by s.
void push(stack_t* s, int data);

// Removes and returns the integer at the top of the stack pointed to by s.
int pop(stack_t* s);

// Returns 1 if and only if the stack pointed to by s is empty. Returns 0 otherwise.
int empty(stack_t* s);`;

const A3: Question = {
  id: "A3",
  pts: 10,
  category: "DSN",
  topic: "Stacks",
  title: "The scoring game",
  story:
    "A scoring game keeps scores in LIFO order. You get a string `moves`; go through it in index order:\n\n• A digit character (0–9): record that integer.\n• The character `+`: take the last 2 recorded scores, compute their sum, and record the sum too.\n\nAfter all moves, return the **total of all recorded scores**.\n\nExample: `\"25+3++1\"`. After the first `+` the stack (bottom to top) is [2, 5, 7]. After the second `+` it's [2, 5, 7, 3, 10]. At the end it's [2, 5, 7, 3, 10, 13, 1], and you return **41**.\n\nThe string only has digits and plus signs, and a `+` only appears at index 2 or later. (A solution without the stack also gets full credit; we'll use the stack.)",
  given: [
    { id: "a3-given", title: "Structs and stack functions", kind: "code", body: A3_GIVEN },
    { id: "a3-header", title: "Function header", kind: "code", body: "int computeScore(char * moves) {\n\n}" },
  ],
  scaffold: {
    title: "computeScore so far",
    code: "int computeScore(char * moves) {\n    {{len}}\n    {{decl}}\n    {{init}}\n    {{loop}}\n        {{plus}}\n            {{pop2}}\n            {{pop1}}\n            {{push1}}\n            {{push2}}\n            {{pushsum}}\n        }\n        else\n            {{digit}}\n    }\n    {{res}}\n    {{sumloop}}\n        {{add}}\n    {{ret}}\n}",
  },
  steps: [
    {
      id: "len",
      kind: "type",
      title: "Length of moves",
      pts: 1,
      prompt: "**(1 pt for the setup: this line and the next two).** Store the length of `moves` in a new int called `len`.",
      answers: ["int len = strlen(moves);"],
      hints: [{ when: "sizeof", say: "`sizeof` on a pointer gives 8, not the string length. Use `strlen`." }],
    },
    {
      id: "decl",
      kind: "type",
      title: "Make a stack",
      pts: 0,
      prompt: "Declare a `stack_t` variable called `mys` (a plain struct on the stack, not a pointer).",
      answers: ["stack_t mys;"],
    },
    {
      id: "amp",
      kind: "choice",
      title: "Why &mys?",
      prompt: "`init`, `push` and `pop` all take a `stack_t*`. `mys` is a plain `stack_t`. How do we pass it?",
      mono: true,
      options: [
        { t: "&mys", ok: true, why: "`&` gives the address of mys, which is exactly a `stack_t*`. The functions change the real stack through it." },
        { t: "mys", why: "That passes a copy of the struct, and it's the wrong type: the functions want a pointer." },
        { t: "*mys", why: "`*` follows a pointer, but mys isn't a pointer. We want its *address*." },
      ],
    },
    { id: "init", kind: "type", title: "Empty it", pts: 0, prompt: "Initialize `mys` to be empty.", answers: ["init(&mys);"], hints: [{ when: "mys", at: "&", say: "init wants a pointer: pass `&mys`." }] },
    {
      id: "loop",
      kind: "type",
      title: "Visit each move",
      pts: 1,
      prompt: "**(1 pt).** Write the `for` header (with its opening brace) that visits every index of `moves`.",
      answers: loops(["int i=0"], ["i<len"], ["i++", "++i", "i+=1"], ["{"]),
    },
    {
      id: "plus",
      kind: "type",
      title: "Is it a plus?",
      pts: 1,
      prompt: "**(1 pt).** Write the `if` header (with its opening brace) that checks whether move `i` is the plus character.",
      answers: ["if (moves[i] == '+') {"],
      hints: [
        { when: '"+"', say: "Double quotes make a *string*. A single character uses single quotes: `'+'`." },
        { when: "=", at: "==", say: "One `=` stores. Use `==` to compare." },
      ],
    },
    {
      id: "popback",
      kind: "choice",
      title: "Pop, then put back",
      prompt: "To add the last 2 scores we pop them off. But the rules say those 2 scores stay **recorded**. What do we do after popping them?",
      options: [
        { t: "Push both back (in their original order), then push their sum on top", ok: true, why: "Yes. Pop v2 (top) and v1 (under it), push v1 then v2 back, then push v1 + v2. The sum must go on last." },
        { t: "Just push the sum", why: "Then the two old scores would be gone, and they still count toward the total." },
      ],
    },
    {
      id: "pop2",
      kind: "type",
      title: "Pop the top",
      pts: 0,
      prompt: "Pop the top score into a new int `v2`.",
      answers: ["int v2 = pop(&mys);"],
    },
    {
      id: "pop1",
      kind: "type",
      title: "Pop the next",
      pts: 1,
      prompt: "**(1 pt for both pops).** Pop the score under it into a new int `v1`.",
      answers: ["int v1 = pop(&mys);"],
    },
    { id: "push1", kind: "type", title: "Put v1 back", pts: 0, prompt: "Push `v1` back.", answers: ["push(&mys, v1);"] },
    { id: "push2", kind: "type", title: "Put v2 back", pts: 1, prompt: "**(1 pt for both pushes).** Push `v2` back.", answers: ["push(&mys, v2);"] },
    {
      id: "pushsum",
      kind: "type",
      title: "Push the sum",
      pts: 1,
      prompt: "**(1 pt).** Push their sum. (This one must come last.)",
      answers: ["push(&mys, v1+v2);", "push(&mys, v2+v1);"],
    },
    {
      id: "char0",
      kind: "choice",
      title: "From '7' to 7",
      prompt: "In the `else`, the move is a digit **character** like `'7'`. How do we turn it into the int 7?",
      mono: true,
      options: [
        { t: "moves[i] - '0'", ok: true, why: "Digit characters are stored in order ('0' is 48, '1' is 49, …). Subtracting '0' gives the digit's value." },
        { t: "moves[i]", why: "That's the character code (55 for '7'), not the number 7." },
        { t: "(int)moves[i]", why: "Casting still gives the character code, 55. Subtract '0' instead." },
      ],
    },
    {
      id: "digit",
      kind: "type",
      title: "Push the digit",
      pts: 2,
      prompt: "**(2 pts).** In the `else`: push the digit's integer value.",
      answers: ["push(&mys, moves[i]-'0');"],
      hints: [{ when: ")", at: "-", say: "That pushes the character code. Subtract `'0'` to get the number." }],
    },
    { id: "res", kind: "type", title: "Start a total", pts: 0, prompt: "After the loop: make a new int `res` starting at 0.", answers: ["int res = 0;"] },
    {
      id: "sumloop",
      kind: "type",
      title: "Empty the stack",
      pts: 1,
      prompt: "**(1 pt, part of the 2 for adding up).** Now pop everything off and add it up. Write a `while` header (no brace) that runs until the stack is empty, using the `empty` function.",
      answers: ["while (!empty(&mys))", "while (empty(&mys) == 0)"],
      hints: [{ when: "empty", at: "!", say: "Keep going while it's **not** empty: `!empty(&mys)`." }],
      learn: "The key loops `len` times instead, which also works, but popping until empty is safer: the stack has more than len items only if you count wrong, and fewer never.",
    },
    { id: "add", kind: "type", title: "Add each score", pts: 1, prompt: "**(1 pt).** The loop body: pop a score and add it to `res`.", answers: ["res += pop(&mys);", "res = res + pop(&mys);"] },
    { id: "ret", kind: "type", title: "Return", pts: 0, prompt: "Return the total.", answers: ["return res;"] },
  ],
  answer:
    "int computeScore(char * moves) {\n    int len = strlen(moves);          // 1 pt total for all init\n    stack_t mys;\n    init(&mys);\n    for (int i = 0; i < len; i++) {   // 1\n        if (moves[i] == '+') {        // 1\n            int v2 = pop(&mys);       // 1 both pops\n            int v1 = pop(&mys);\n            push(&mys, v1);           // 1 both pushes\n            push(&mys, v2);\n            push(&mys, v1+v2);        // 1, must be last\n        }\n        else\n            push(&mys, moves[i]-'0'); // 2\n    }\n    int res = 0;                      // 2 for the adding up\n    while (!empty(&mys))\n        res += pop(&mys);\n    return res;\n}\n\n(Array version: tmp[i] = moves[i] == '+' ? tmp[i-1] + tmp[i-2] : moves[i] - '0'; add each tmp[i] to res.)",
  takeaway: "Char digit to int: subtract '0'. Peeking 2 deep on a stack means pop, pop, push them back.",
};

// ───────────────────────────── Section B ─────────────────────────────

const B1_START: TreeSpec = {
  nodes: [
    { id: "13", x: 50, y: 8, v: "13" },
    { id: "4", x: 28, y: 30, v: "4" },
    { id: "25", x: 72, y: 30, v: "25" },
    { id: "3", x: 16, y: 52, v: "3" },
    { id: "8", x: 40, y: 52, v: "8" },
    { id: "20", x: 62, y: 52, v: "20" },
    { id: "30", x: 86, y: 52, v: "30" },
    { id: "2", x: 8, y: 74, v: "2" },
    { id: "5", x: 34, y: 74, v: "5" },
    { id: "22", x: 70, y: 74, v: "22" },
  ],
  edges: [["13", "4"], ["13", "25"], ["4", "3"], ["4", "8"], ["25", "20"], ["25", "30"], ["3", "2"], ["8", "5"], ["20", "22"]],
};

const B1_AFTER: TreeSpec = {
  nodes: [
    { id: "root", x: 50, y: 8, slot: "root" },
    { id: "L", x: 28, y: 30, slot: "L" },
    { id: "R", x: 72, y: 30, slot: "R" },
    { id: "LL", x: 16, y: 52, slot: "LL" },
    { id: "LR", x: 40, y: 52, slot: "LR" },
    { id: "RL", x: 62, y: 52, slot: "RL" },
    { id: "RR", x: 86, y: 52, slot: "RR" },
    { id: "LLL", x: 8, y: 74, slot: "LLL" },
    { id: "RLR", x: 70, y: 74, slot: "RLR" },
  ],
  edges: [["root", "L"], ["root", "R"], ["L", "LL"], ["L", "LR"], ["R", "RL"], ["R", "RR"], ["LL", "LLL"], ["RL", "RLR"]],
};

const B1_FULL: TreeSpec = {
  nodes: [
    { id: "r", x: 50, y: 10, slot: "r" },
    { id: "l", x: 28, y: 42, slot: "l" },
    { id: "g", x: 72, y: 42, slot: "g" },
    { id: "ll", x: 16, y: 74, slot: "ll" },
    { id: "lr", x: 40, y: 74, slot: "lr" },
    { id: "gl", x: 60, y: 74, slot: "gl" },
    { id: "gr", x: 84, y: 74, slot: "gr" },
  ],
  edges: [["r", "l"], ["r", "g"], ["l", "ll"], ["l", "lr"], ["g", "gl"], ["g", "gr"]],
};

const B1: Question = {
  id: "B1",
  pts: 5,
  category: "ALG",
  topic: "Binary Trees",
  title: "Tall trees, short trees, and deleting the root",
  recipe: "tree-trace",
  story:
    "**a) (1 pt)** Draw a binary search tree with **5 nodes** (storing positive integers) that has the **maximum** possible height.\n\n**b) (1 pt)** Draw another binary search tree with **7 nodes** (storing positive integers) that has the **minimum** possible height.\n\n**c) (3 pts)** Re-draw the binary search tree in your inventory after **deleting the root node**.",
  given: [{ id: "b1-tree", title: "(c) The tree", kind: "tree", tree: B1_START }],
  steps: [
    {
      id: "a",
      kind: "choice",
      title: "(a) As tall as possible",
      pts: 1,
      prompt: "**(a) 1 pt.** Which of these is a valid BST with 5 nodes and the **maximum** possible height?",
      mono: true,
      options: [
        { t: "5 → left 1 → right 4 → left 3 → left 2   (one node per level)", ok: true, why: "Every node has one child, so 5 nodes make 5 levels: the tallest possible. And it's a valid BST: each step left goes smaller, each step right goes bigger, and 2, 3, 4 all sit between 1 and 5." },
        { t: "3 at the root, 1 and 5 under it, 2 and 4 at the bottom", why: "That's nicely balanced, which makes it *short*. Max height means a straight chain." },
        { t: "1 → left 2 → left 3 → left 4 → left 5", why: "Tall, but not a BST: in a left subtree everything must be *smaller* than the parent." },
      ],
    },
    {
      id: "b",
      kind: "slots",
      title: "(b) As short as possible",
      pts: 1,
      score: "all",
      prompt: "**(b) 1 pt.** 7 nodes fit perfectly into 3 levels (1 + 2 + 4). Using the numbers **1 to 7**, fill in the BST.",
      layout: "tree",
      tree: B1_FULL,
      slots: [
        { id: "r", answer: "4" },
        { id: "l", answer: "2" },
        { id: "g", answer: "6" },
        { id: "ll", answer: "1" },
        { id: "lr", answer: "3" },
        { id: "gl", answer: "5" },
        { id: "gr", answer: "7" },
      ],
      learn: "Only one *shape* works (the full tree). Any positive numbers in that shape that obey the BST rule get the point: the middle value at the root, and so on down.",
    },
    {
      id: "two-kids",
      kind: "choice",
      title: "(c) Deleting a node with 2 children",
      prompt: "The root 13 has two children. What replaces it?",
      options: [
        { t: "Its in-order predecessor (largest in the left subtree) or successor (smallest in the right subtree). Both are correct", ok: true, why: "Either keeps the BST order. We'll use the predecessor here. The successor answer (20 on top) gets full credit too." },
        { t: "Its left child, 4", why: "Then 4 would need three children (3, 8 and 25's side). Use the predecessor or successor instead." },
        { t: "Any leaf", why: "It has to be a value that fits between both subtrees: the largest on the left or the smallest on the right." },
      ],
    },
    {
      id: "pred",
      kind: "choice",
      title: "(c) Find the predecessor",
      prompt: "Go left once (to 4), then right as far as you can. What's the largest value in the left subtree?",
      options: [
        { t: "8", ok: true, why: "4 → right is 8, and 8 has no right child. 8 moves up to the root." },
        { t: "5", why: "5 is under 8 on the *left*, so it's smaller than 8." },
        { t: "4", why: "4 has a right child (8), so keep going right." },
      ],
    },
    {
      id: "orphan",
      kind: "choice",
      title: "(c) 8's old child",
      prompt: "8 had a left child, 5. When 8 moves up to the root, where does 5 go?",
      options: [
        { t: "It takes 8's old spot: the right child of 4", ok: true, why: "Removing 8 from the left subtree is a one-child delete, so its child slides up into its place." },
        { t: "It moves up to the root with 8", why: "8 already has 4 and 25 as children at the root. 5 slides into 8's old spot instead." },
      ],
    },
    {
      id: "c",
      kind: "slots",
      title: "(c) Draw the tree",
      pts: 3,
      score: "each",
      prompt: "**(c) 3 pts.** Fill in the tree after deleting 13 (using the predecessor).",
      layout: "tree",
      tree: B1_AFTER,
      slots: [
        { id: "root", answer: "8", pts: 1 },
        { id: "L", answer: "4", pts: 1 / 4 },
        { id: "LL", answer: "3", pts: 1 / 4 },
        { id: "LR", answer: "5", pts: 1 / 4 },
        { id: "LLL", answer: "2", pts: 1 / 4 },
        { id: "R", answer: "25", pts: 1 / 4 },
        { id: "RL", answer: "20", pts: 1 / 4 },
        { id: "RR", answer: "30", pts: 1 / 4 },
        { id: "RLR", answer: "22", pts: 1 / 4 },
      ],
      learn: "Rubric: 1 pt root, 1 pt the untouched side, 1 pt the adjusted side. Not a valid BST = 0/3. With the successor instead: 20 on top, 25 → left 22, and 4's side unchanged.",
    },
  ],
  answer:
    "a) Any 5-node chain that's a valid BST, e.g. 5 → 1 → 4 → 3 → 2\nb)        4\n        /   \\\n       2     6\n      / \\   / \\\n     1   3 5   7\nc)        8                  (or)        20\n        /    \\                         /    \\\n       4      25                      4      25\n      / \\    /  \\                    / \\    /  \\\n     3   5  20   30                 3   8  22   30\n    /         \\                    /   /\n   2           22                 2   5",
  takeaway: "Max height = a chain. Min height = fill each level. Deleting a node with 2 kids: swap in the largest on the left (or smallest on the right).",
};

const HEAP = `typedef struct heap {
    int* elements;  // points to the array of heap elements
    int capacity;   // total size of the array
    int size;       // actual number of elements in the heap
} heapStruct;

int removeMin(heapStruct *h); // removes the smallest item from the heap pointed to by h
int size(heapStruct* h);      // returns the number of elements in the heap pointed to by h`;

const HEAP_RT: [string, string, string[]][] = [
  ["heapify", "Building a binary heap from an unordered array of size n using heapify.", ["O(n)"]],
  ["insert", "Inserting an item into a binary heap with n items.", ["O(lg n)", "O(log n)", "O(lgn)", "O(logn)"]],
  ["delmin", "Deleting the minimum item from a binary heap with n items.", ["O(lg n)", "O(log n)", "O(lgn)", "O(logn)"]],
  ["sort", "Heapsort of n items.", ["O(n lg n)", "O(nlgn)", "O(n log n)", "O(nlogn)"]],
];

const B2: Question = {
  id: "B2",
  pts: 10,
  category: "DSN",
  topic: "Heaps",
  title: "Heapsort with removeMin",
  story:
    "**a) (6 pts)** Using the minheap struct and functions in your inventory, write `heapsort`. It takes a pointer to a heap and returns its values in a **sorted** int array. At the end, the heap pointed to by `h` will be empty.\n\n**b) (4 pts)** Give the worst-case run time, when efficiently implemented, of four heap operations.",
  given: [
    { id: "b2-struct", title: "struct heap and helpers", kind: "code", body: HEAP },
    { id: "b2-header", title: "Function header", kind: "code", body: "int* heapsort(heapStruct* h) {\n\n}" },
  ],
  scaffold: { title: "heapsort so far", code: "int* heapsort(heapStruct* h) {\n    {{n}}\n    {{alloc}}\n    {{loop}}\n        {{take}}\n    {{ret}}\n}" },
  steps: [
    {
      id: "why-n",
      kind: "choice",
      title: "Why save the size?",
      prompt: "Why store `size(h)` in a variable *before* the loop, instead of writing `i < size(h)` in the loop?",
      options: [
        { t: "Every removeMin shrinks the heap, so size(h) keeps dropping and the loop would stop halfway", ok: true, why: "Exactly. With `i < size(h)`, i goes up while the size goes down, and they meet in the middle." },
        { t: "It's just faster", why: "It's actually about correctness: the size changes during the loop." },
      ],
    },
    { id: "n", kind: "type", title: "How many?", pts: 1, prompt: "**(1 pt).** Store the heap's size in a new int `n`.", answers: ["int n = size(h);", "int n = h->size;"] },
    {
      id: "alloc",
      kind: "type",
      title: "Result array",
      pts: 1,
      prompt: "**(1 pt).** Allocate an int array of `n` slots. Call it `res`.",
      answers: ["int* res = malloc(n*sizeof(int));", "int* res = malloc(sizeof(int)*n);", "int* res = calloc(n, sizeof(int));", "int* res = (int*)malloc(n*sizeof(int));"],
    },
    { id: "loop", kind: "type", title: "n times", pts: 1, prompt: "**(1 pt).** Write the `for` header (no brace) that runs `n` times.", answers: loops(["int i=0"], ["i<n"], ["i++", "++i", "i+=1"]) },
    {
      id: "take",
      kind: "type",
      title: "Smallest goes next",
      pts: 2,
      prompt: "**(2 pts).** Each time, remove the smallest item from the heap and put it in slot `i`.",
      answers: ["res[i] = removeMin(h);"],
      hints: [{ when: "&", say: "`h` is already a pointer. Pass it straight in: `removeMin(h)`." }],
      learn: "A minheap hands back items smallest-first, so filling res from index 0 up gives ascending order.",
    },
    { id: "ret", kind: "type", title: "Return", pts: 1, prompt: "**(1 pt).** Return the sorted array.", answers: ["return res;"] },
    ...HEAP_RT.map(([id, prompt, answers]) => ({
      id,
      kind: "type" as const,
      title: `(b) ${prompt.split(" ").slice(0, 4).join(" ")}…`,
      pts: 1,
      prompt: `**(b) 1 pt.** ${prompt}`,
      answers,
      placeholder: "O(...)",
      hints: [{ when: "n", at: "lg", say: "Inserting walks one path from the bottom to the top, and a heap's height is about lg n." }],
    })),
  ],
  answer:
    "int* heapsort(heapStruct* h) {\n    int n = size(h);                  // 1\n    int* res = malloc(n*sizeof(int)); // 1\n    for (int i=0; i<n; i++)           // 1\n        res[i] = removeMin(h);        // 2\n    return res;                       // 1\n}\n\nb) heapify O(n) · insert O(lg n) · delete-min O(lg n) · heapsort O(n lg n)",
  takeaway: "Grab the size before a loop that shrinks it. Heapify is O(n), but n inserts or n delete-mins cost O(n lg n).",
};

const TRIE = `typedef struct trieNode {
    int isWord;
    struct trieNode* children[26];
} trieNode;

int num5LetterWrapper(trieNode* root) {
    return num5Rec(root, 0);
}`;

const B3: Question = {
  id: "B3",
  pts: 10,
  category: "DSN",
  topic: "Tries",
  title: "Count the five-letter words",
  story:
    "As a Wordle fan, you want to know how many **five-letter words** are in a dictionary stored in a trie. Write the **recursive** function `num5Rec`. It takes a pointer to a trie node and an integer `k`, the **depth** of that node in the trie, and returns the number of five-letter words stored in that subtrie. The wrapper in your inventory makes the first call on the root.",
  given: [
    { id: "b3-struct", title: "struct trieNode and the wrapper", kind: "code", body: TRIE },
    { id: "b3-header", title: "Function header", kind: "code", body: "int num5Rec(trieNode* root, int k) {\n\n}" },
  ],
  scaffold: { title: "num5Rec so far", code: "int num5Rec(trieNode* root, int k) {\n    {{null}}\n    {{five}}\n    {{res}}\n    {{loop}}\n        {{add}}\n    {{ret}}\n}" },
  steps: [
    {
      id: "depth",
      kind: "choice",
      title: "Depth = letters so far",
      prompt: "The root is at depth 0. A node at depth `k` stands for a word of how many letters?",
      options: [
        { t: "k letters: each step down the trie adds one letter", ok: true, why: "So a node at depth 5 ends a five-letter word *if* its isWord is 1." },
        { t: "k + 1 letters", why: "The root (depth 0) is the empty word. Depth 1 is one letter, so depth k is k letters." },
      ],
    },
    { id: "null", kind: "type", title: "No node", pts: 2, prompt: "**(2 pts).** Base case: if `root` is NULL, there are no words here. Return 0, all on one line.", answers: ["if (root == NULL) return 0;", "if (!root) return 0;"] },
    {
      id: "stop",
      kind: "choice",
      title: "Stop at depth 5",
      prompt: "Once we reach depth 5, why don't we keep searching the children?",
      options: [
        { t: "Anything deeper has more than 5 letters, so it can't count", ok: true, why: "Right. At depth 5 the only question is whether *this* node ends a word." },
        { t: "There are never children below depth 5", why: "Longer words like \"plants\" go deeper. We just don't care about them." },
      ],
    },
    {
      id: "five",
      kind: "type",
      title: "Depth 5",
      pts: 2,
      prompt: "**(2 pts).** If `k` is 5, return whether this node ends a word (1 or 0). One line.",
      answers: ["if (k == 5) return root->isWord;"],
      hints: [{ when: "1", at: "root", say: "Not every depth-5 node is a word. Return its `isWord` flag." }],
    },
    { id: "res", kind: "type", title: "Start counting", pts: 1, prompt: "**(1 pt).** Make a new int `res` starting at 0.", answers: ["int res = 0;"] },
    { id: "loop", kind: "type", title: "Every child", pts: 1, prompt: "**(1 pt).** Write the `for` header (no brace) that visits all 26 children.", answers: loops(["int i=0"], ["i<26"], ["i++", "++i", "i+=1"]) },
    {
      id: "add",
      kind: "type",
      title: "Recurse one deeper",
      pts: 3,
      prompt: "**(3 pts).** Add the count from child `i`, which sits one level deeper.",
      answers: ["res += num5Rec(root->children[i], k+1);", "res = res + num5Rec(root->children[i], k+1);"],
      hints: [
        { when: "k", at: "k+1", say: "The child is one level deeper, so pass `k+1`." },
        { when: "k++", say: "`k++` changes k for every later child too. Pass `k+1` instead." },
      ],
    },
    { id: "ret", kind: "type", title: "Return", pts: 1, prompt: "**(1 pt).** Return the total.", answers: ["return res;"] },
  ],
  answer:
    "int num5Rec(trieNode* root, int k) {\n    if (root == NULL) return 0;              // 2\n    if (k == 5) return root->isWord;         // 2\n    int res = 0;                             // 1\n    for (int i=0; i<26; i++)                 // 1\n        res += num5Rec(root->children[i], k+1); // 3\n    return res;                              // 1\n}",
  takeaway: "Trie depth = word length. Count words of length L by stopping at depth L and returning isWord.",
};

// ───────────────────────────── Section C ─────────────────────────────

const MYSTERY = `int mystery(int* list, int n) {
    int i = 0, j = 1;
    if (n < 2) return 0;
    while (j < n) {
        while (i < j && list[i] < list[j]) i++;
        j++;
    }
    return i;
}`;

const C1: Question = {
  id: "C1",
  pts: 5,
  category: "ANL",
  topic: "Algorithm Analysis",
  title: "The loop that never resets",
  recipe: "code-runtime",
  story: "What is the **worst-case** Big-O run time of `mystery`, in terms of `n`? (The array `list` has length n.) For full credit, explain your reasoning in words **and** get the right answer.",
  given: [{ id: "c1-code", title: "mystery", kind: "code", body: MYSTERY }],
  steps: [
    {
      id: "trap",
      kind: "choice",
      title: "Nested loops = n²?",
      prompt: "There's a loop inside a loop. Does that automatically mean O(n²)?",
      options: [
        { t: "No: count how many times the inner loop body can run in total, over the whole function", ok: true, why: "Nested loops are only n² when the inner loop restarts each time. Watch what happens to `i`." },
        { t: "Yes, always", why: "Not always. If the inner variable never resets, its total work is capped." },
      ],
    },
    {
      id: "outer",
      kind: "choice",
      title: "The outer loop",
      pts: 1,
      prompt: "**(1 pt).** How many times does the outer loop run?",
      options: [
        { t: "n − 1 times: j goes from 1 up to n − 1, once per pass", ok: true, why: "j starts at 1 and goes up by 1 every pass, so at most n times. That's O(n)." },
        { t: "It depends on list[i]", why: "j++ happens every pass no matter what the list holds." },
        { t: "n² times", why: "j only goes up by 1 each pass, from 1 to n." },
      ],
    },
    {
      id: "inner",
      kind: "choice",
      title: "The inner loop, in total",
      pts: 3,
      prompt: "**(3 pts).** `i` is never reset to 0. It only ever goes up, and it stops at `j` (which is at most n). How many times can `i++` run **in total**, across every pass of the outer loop?",
      options: [
        { t: "At most n times total, because i only increases and can never pass n", ok: true, why: "That's the key argument. The inner loop does at most n increments over the whole run, so it adds O(n) total, not O(n) per pass." },
        { t: "Up to n times per outer pass, so n² total", why: "That would need i to restart each pass. It doesn't: it keeps its value." },
        { t: "Once per outer pass", why: "It can run several times in one pass. But the *total* is still capped at n." },
      ],
    },
    {
      id: "answer",
      kind: "type",
      title: "Run time",
      pts: 1,
      prompt: "**(1 pt).** Outer loop O(n) + inner loop O(n) total. What's the run time?",
      answers: ["O(n)"],
      placeholder: "O(...)",
      hints: [{ when: "n^2", say: "The inner loop's work isn't per pass. It's n total over the whole function." }],
    },
  ],
  answer:
    "REASON: i never exceeds j, and j never exceeds n. The outer loop runs n − 1 times. i is never reset, so the inner loop's i++ runs at most n times in total over the whole function. Everything else is O(1) per step.\nRUN-TIME: O(n)",
  takeaway: "Before multiplying nested loops, check whether the inner variable resets. If it only climbs, add instead of multiply.",
};

const C2: Question = {
  id: "C2",
  pts: 10,
  category: "ANL",
  topic: "Algorithm Analysis",
  title: "Shannon's secret c",
  recipe: "scaling",
  story:
    "An algorithm that processes a list of size n takes **O(√n · lg n)** time. On Shannon's computer, a list of size **n = 2¹⁶** takes **c** milliseconds. (She won't tell you c.) In terms of c, how long should a list of size **2²⁰** take? Your answer should look like **kc**, where k is a positive real number.",
  given: [{ id: "c2-setup", title: "What we know", kind: "text", body: "T(n) = d · √n · lg n      (d = some constant)\nT(2^16) = c ms\nFind: T(2^20) in terms of c\n\nPower facts:  √(2^a) = 2^(a/2)     lg(2^a) = a" }],
  steps: [
    {
      id: "root",
      kind: "choice",
      title: "Square root of a power of 2",
      prompt: "What's √(2¹⁶)?",
      options: [
        { t: "2⁸: a square root halves the exponent", ok: true, why: "2⁸ · 2⁸ = 2¹⁶. (That's 256.)" },
        { t: "2⁴", why: "That's the fourth root. A square root halves the exponent: 16/2 = 8." },
        { t: "8", why: "Close: the *exponent* is 8. The value is 2⁸." },
      ],
    },
    {
      id: "plug16",
      kind: "slots",
      title: "Plug in 2¹⁶",
      pts: 1,
      score: "all",
      prompt: "**(1 pt).** Plug n = 2¹⁶ into the formula.",
      layout: "row",
      slots: [
        { id: "r", label: "c = T(2^16) = d ·", answer: ["2^8", "256"], w: 5 },
        { id: "l", label: "·", answer: "16", w: 4 },
      ],
    },
    {
      id: "simp16",
      kind: "slots",
      title: "Simplify",
      pts: 3,
      score: "all",
      prompt: "**(3 pts).** 16 is itself a power of 2 (2⁴). Combine 2⁸ · 2⁴ into one power of 2.",
      layout: "row",
      slots: [{ id: "e", label: "c = d · 2^", answer: "12", w: 4 }],
      learn: "Multiplying powers of the same base adds the exponents: 2⁸ · 2⁴ = 2¹².",
    },
    {
      id: "plug20",
      kind: "slots",
      title: "Plug in 2²⁰",
      pts: 1,
      score: "all",
      prompt: "**(1 pt).** Now plug n = 2²⁰ in.",
      layout: "row",
      slots: [
        { id: "r", label: "T(2^20) = d ·", answer: ["2^10", "1024"], w: 5 },
        { id: "l", label: "·", answer: "20", w: 4 },
      ],
    },
    {
      id: "simp20",
      kind: "slots",
      title: "Make it look like c",
      pts: 3,
      score: "all",
      prompt: "**(3 pts).** 20 isn't a power of 2, but 20 = 5 · 4 = 5 · 2². Rewrite 2¹⁰ · 20 so a `d · 2¹²` appears.",
      layout: "row",
      slots: [
        { id: "k", label: "T(2^20) = d · 2^10 · 20 =", answer: "5", w: 3 },
        { id: "e", label: "· d · 2^", answer: "12", w: 4 },
      ],
    },
    {
      id: "final",
      kind: "type",
      title: "In terms of c",
      pts: 2,
      prompt: "**(2 pts).** d · 2¹² is exactly c. So how many milliseconds is T(2²⁰)?",
      answers: ["5c", "5*c", "5 c", "5c ms"],
      hints: [
        { when: "16c", say: "That's linear scaling (2⁴ times bigger). Here √n only doubles twice and lg n goes 16 → 20." },
        { when: "4c", say: "√n grows 4× (2⁸ → 2¹⁰), but lg n also grows from 16 to 20: another 20/16 = 5/4. Multiply them." },
      ],
    },
  ],
  answer:
    "c = T(2^16) = d·√(2^16)·lg(2^16) = d·2^8·16 = d·2^12\nT(2^20) = d·√(2^20)·lg(2^20) = d·2^10·20 = 5·d·2^12 = 5c\n\nShortcut: T(2^20)/T(2^16) = (2^10 · 20)/(2^8 · 16) = 4 · 5/4 = 5, so 5c.",
  takeaway: "With powers of 2: √ halves the exponent, lg just reads the exponent off. Then divide the two runs so the constant cancels.",
};

const C3: Question = {
  id: "C3",
  pts: 10,
  category: "ANL",
  topic: "Recurrence Relations",
  title: "2T(n/2) + n³ by iteration",
  recipe: "recurrence",
  story: "Using the **iteration technique**, find the Big-Oh solution to the recurrence below, in terms of n.",
  given: [
    { id: "c3-rec", title: "The recurrence", kind: "text", body: "T(n) = 2T(n/2) + n³,  for n > 1\nT(1) = 1" },
    { id: "c3-tip", title: "Typing tip", kind: "text", body: "Type powers with ^, like n^3/4\nGeometric series: 1 + r + r² + … ≤ 1/(1 − r) when r < 1" },
  ],
  steps: [
    {
      id: "t2",
      kind: "type",
      title: "What's T(n/2)?",
      pts: 1,
      prompt: "**Iteration 1 (1 pt).** Replace n with n/2 in the recurrence. T(n/2) = 2T(n/4) + **?**",
      answers: ["(n/2)^3", "n^3/8", "(n^3)/8"],
      hints: [{ when: "n^3", say: "Every n becomes n/2, including the n³: it becomes (n/2)³." }],
    },
    {
      id: "it2",
      kind: "type",
      title: "Iteration 2",
      pts: 2,
      prompt: "**Iteration 2 (2 pts).** Substitute it in: T(n) = 2[2T(n/4) + n³/8] + n³ = 4T(n/4) + **?**",
      answers: ["n^3/4+n^3", "n^3+n^3/4", "(5/4)n^3", "5n^3/4", "(5n^3)/4"],
      hints: [{ when: "n^3/8", say: "Don't forget the 2 out front: 2 · n³/8 = n³/4." }],
    },
    {
      id: "it3",
      kind: "type",
      title: "Iteration 3",
      pts: 2,
      prompt: "**Iteration 3 (2 pts).** Once more: T(n) = 8T(n/8) + **?** (Keep the terms separate so the pattern shows.)",
      answers: ["n^3/16+n^3/4+n^3", "n^3+n^3/4+n^3/16", "(21/16)n^3", "21n^3/16", "(21n^3)/16"],
      hints: [{ when: "n^3/8", say: "4 · T(n/4) brings 4 · (n/4)³ = 4n³/64 = n³/16." }],
    },
    {
      id: "pattern",
      kind: "choice",
      title: "Spot the pattern",
      prompt: "The extra terms are n³ · (1 + 1/4 + 1/16 + …). Each one is the previous times what?",
      options: [
        { t: "1/4", ok: true, why: "Each level has twice as many calls (×2) on inputs half as big, cubed (÷8). 2/8 = 1/4." },
        { t: "1/2", why: "The input halves, but it's *cubed*: (1/2)³ = 1/8, times 2 calls = 1/4." },
        { t: "1/8", why: "That's just the cube. Don't forget there are twice as many calls each level." },
      ],
    },
    {
      id: "general",
      kind: "slots",
      title: "After k iterations",
      pts: 2,
      score: "each",
      prompt: "**Guess the general form (2 pts).** After k iterations:",
      layout: "row",
      slots: [
        { id: "a", label: "T(n) =", answer: ["2^k"], w: 4 },
        { id: "b", label: "· T(n /", answer: ["2^k"], w: 4 },
        { id: "c", label: ") + n³ · Σ (1/", answer: ["4"], after: ")^i   for i = 0 … k−1", w: 3 },
      ],
    },
    {
      id: "sub",
      kind: "slots",
      title: "Hit the base case",
      pts: 1,
      score: "all",
      prompt: "**(1 pt).** We reach T(1) when n/2ᵏ = 1. So 2ᵏ = ?",
      layout: "row",
      slots: [{ id: "n", label: "2^k =", answer: "n", w: 3 }],
    },
    {
      id: "bound",
      kind: "choice",
      title: "How big is the sum?",
      prompt: "The sum 1 + 1/4 + 1/16 + … never gets past what?",
      options: [
        { t: "4/3, because 1/(1 − 1/4) = 4/3", ok: true, why: "So the whole extra part is at most (4/3)n³. The first term n · T(1) = n is tiny next to it." },
        { t: "It grows with k, like log n", why: "The terms shrink fast (each a quarter of the last), so the sum stays below a constant." },
      ],
    },
    {
      id: "final",
      kind: "type",
      title: "Big-Oh",
      pts: 2,
      prompt: "**(2 pts).** T(n) = n · T(1) + n³ · (4/3)(1 − 1/n²) = n + (4/3)n³ − (4/3)n. What's the Big-Oh?",
      answers: ["O(n^3)"],
      placeholder: "O(...)",
      hints: [{ when: "n^3lgn", say: "The sum is bounded by a constant, so there's no extra log factor." }],
    },
  ],
  answer:
    "T(n) = 2T(n/2) + n³\n     = 4T(n/4) + n³/4 + n³\n     = 8T(n/8) + n³/16 + n³/4 + n³\nAfter k:  T(n) = 2^k T(n/2^k) + n³ Σ(i=0..k−1) (1/4)^i\nLet 2^k = n:  T(n) = n·T(1) + n³ · (1 − (1/4)^k)/(1 − 1/4) = n + (4/3)n³(1 − 1/n²) = O(n³)",
  takeaway: "When the extra work shrinks by a constant factor each level, the top level dominates: here O(n³).",
};

// ───────────────────────────── Section D ─────────────────────────────

const TTT = `#define EMPTY 0
#define X 1
#define O 2

int XWin(int ** board);  // returns 1 if I have won and 0 otherwise
int XLose(int ** board); // returns 1 if I have lost and 0 otherwise
int tied(int ** board);  // returns 1 if the board is in a tied state`;

const D1: Question = {
  id: "D1",
  pts: 10,
  category: "DSN",
  topic: "Recursive Coding",
  title: "Can X still win at tic-tac-toe?",
  story:
    "Write a **recursive** function that determines whether player X, who goes first, can win a game of tic-tac-toe on a 3 × 3 int board. Functions without recursion get **0 points**.\n\n`board` stores EMPTY (0), X (1) or O (2). The three helpers report the board **as it is right now**, from X's point of view. `myTurn` is 1 when it's X's turn and 0 when it's O's. You'll place and unplace X's and O's.\n\nO plays **pessimistically**: if there is **any** sequence of moves by both players from the current board that ends with X winning, return 1.",
  given: [
    { id: "d1-helpers", title: "Constants and helpers", kind: "code", body: TTT },
    { id: "d1-header", title: "Function header", kind: "code", body: "int canXWin(int ** board, int myTurn) {\n\n}" },
  ],
  scaffold: {
    title: "canXWin so far",
    code: "int canXWin(int ** board, int myTurn) {\n    {{over}}\n    {{won}}\n    {{rows}}\n        {{cols}}\n            {{empty}}\n                {{place}}\n                {{recur}}\n                {{undo}}\n            }\n        }\n    }\n    {{none}}\n}",
  },
  steps: [
    {
      id: "shape",
      kind: "choice",
      title: "The shape of it",
      prompt: "This is backtracking. What's the plan?",
      options: [
        { t: "If the game is over, report it. Otherwise try every empty square: place a piece, recurse with the other player's turn, then remove the piece", ok: true, why: "That's the classic try → recurse → undo loop. Because O is pessimistic, *any* path to an X win means return 1." },
        { t: "Place X in the first empty square and check XWin", why: "That looks one move ahead. We need to explore every sequence of future moves, which is what recursion does." },
      ],
    },
    {
      id: "over",
      kind: "type",
      title: "Lost or tied",
      pts: 2,
      prompt: "**(2 pts: 1 for the tie case, 1 for the lose case).** If the board is tied **or** X has lost, X can't win from here. Return 0, one line.",
      answers: ["if (tied(board) || XLose(board)) return 0;", "if (XLose(board) || tied(board)) return 0;"],
      hints: [{ when: "|", at: "||", say: "For 'or' between two conditions use `||` (logical OR), not `|`." }],
    },
    { id: "won", kind: "type", title: "Already won", pts: 1, prompt: "**(1 pt).** If X has already won, return 1.", answers: ["if (XWin(board)) return 1;", "if (XWin(board) == 1) return 1;"] },
    {
      id: "rows",
      kind: "type",
      title: "Every row",
      pts: 1,
      prompt: "**(1 pt for trying every square: this loop and the next).** Write the `for` header (with its opening brace) over the 3 rows, using `i`.",
      answers: loops(["int i=0"], ["i<3"], ["i++", "++i", "i+=1"], ["{"]),
    },
    { id: "cols", kind: "type", title: "Every column", pts: 0, prompt: "Inside it, the `for` header (with its opening brace) over the 3 columns, using `j`.", answers: loops(["int j=0"], ["j<3"], ["j++", "++j", "j+=1"], ["{"]) },
    {
      id: "empty",
      kind: "type",
      title: "Is the square free?",
      pts: 1,
      prompt: "**(1 pt).** Write the `if` header (with its opening brace) that checks square `[i][j]` is empty.",
      answers: ["if (board[i][j] == EMPTY) {", "if (board[i][j] == 0) {"],
      hints: [{ when: "=", at: "==", say: "Compare with `==`. A single `=` would overwrite the square." }],
    },
    {
      id: "ternary",
      kind: "choice",
      title: "Whose piece?",
      prompt: "We place X if `myTurn` is 1, otherwise O. C has a one-line way to pick between two values: `cond ? a : b`. What does `myTurn ? X : O` give when myTurn is 0?",
      mono: true,
      options: [
        { t: "O", ok: true, why: "0 counts as false, so you get the value after the colon. It's a tiny if/else that gives back a value." },
        { t: "X", why: "0 is false in C, so it picks the second value: O." },
        { t: "0", why: "It picks between X and O, so you get O (which happens to be 2)." },
      ],
    },
    {
      id: "place",
      kind: "type",
      title: "Place the piece",
      pts: 2,
      prompt: "**(2 pts: 1 for setting the square, 1 for the right piece).** Place the current player's piece on `[i][j]`.",
      answers: ["board[i][j] = myTurn ? X : O;", "board[i][j] = (myTurn ? X : O);", "board[i][j] = myTurn == 1 ? X : O;", "board[i][j] = (myTurn == 1) ? X : O;"],
      hints: [{ when: "X", at: "myTurn", say: "It isn't always X: it depends on whose turn it is. Use `myTurn ? X : O`." }],
    },
    {
      id: "recur",
      kind: "type",
      title: "Recurse",
      pts: 1,
      prompt: "**(1 pt).** Recurse with the **other** player's turn. If X can win from there, return 1 right away. One line.",
      answers: ["if (canXWin(board, !myTurn)) return 1;", "if (canXWin(board, 1-myTurn)) return 1;", "if (canXWin(board, !myTurn) == 1) return 1;"],
      hints: [{ when: "myTurn", at: "!", say: "Flip the turn: `!myTurn` turns 1 into 0 and 0 into 1." }],
      learn: "Returning 1 right away leaves a piece on the board. That's fine here: we already have our answer. (A careful version would undo first.)",
    },
    { id: "undo", kind: "type", title: "Undo", pts: 1, prompt: "**(1 pt).** That move didn't lead to a win. Take the piece back.", answers: ["board[i][j] = EMPTY;", "board[i][j] = 0;"] },
    { id: "none", kind: "type", title: "No way to win", pts: 1, prompt: "**(1 pt).** After both loops (every move tried, no win found), return 0.", answers: ["return 0;"] },
  ],
  answer:
    "int canXWin(int ** board, int myTurn) {\n    if (tied(board) || XLose(board)) return 0;   // tie 1, lose 1\n    if (XWin(board)) return 1;                   // win 1\n    for (int i = 0; i < 3; i++) {                // all spots 1\n        for (int j = 0; j < 3; j++) {\n            if (board[i][j] == EMPTY) {          // 1\n                board[i][j] = myTurn ? X : O;    // 2\n                if (canXWin(board, !myTurn)) return 1; // 1\n                board[i][j] = EMPTY;             // undo 1\n            }\n        }\n    }\n    return 0;                                    // 1\n}",
  takeaway: "Game search = check if the game is over, then for each legal move: make it, recurse with the turn flipped, undo it.",
};

const D2: Question = {
  id: "D2",
  pts: 10,
  category: "ALG",
  topic: "Sorting",
  title: "Duplicates and worst cases",
  story:
    "**(a) 1 pt** Which of the sorting algorithms listed in (d) could run into problems if the array can contain **duplicates**? (Four of them run the same with or without duplicates; one, in its original form, is definitely affected.)\n\n**(b) 2 pts** What problem could happen?\n\n**(c) 2 pts** Pick one algorithm that *isn't* affected and explain why it runs the same with or without duplicates.\n\n**(d) 5 pts** Give the worst-case run time of Quick, Bubble, Insertion, Merge and Selection sort on an array of n **distinct** values, in Big-Oh.",
  given: [],
  steps: [
    {
      id: "a",
      kind: "choice",
      title: "(a) Which one?",
      pts: 1,
      prompt: "**(a) 1 pt.** Which sort is affected by duplicates?",
      options: [
        { t: "Quick Sort", ok: true, why: "Its speed depends on how evenly the partition splits the array, and equal values can wreck the split." },
        { t: "Merge Sort", why: "Merge Sort always splits in half and merges the same amount, whatever the values." },
        { t: "Selection Sort", why: "Selection Sort's loops run the same number of times no matter the values." },
      ],
    },
    {
      id: "b",
      kind: "choice",
      title: "(b) The problem",
      pts: 2,
      prompt: "**(b) 2 pts.** What goes wrong?",
      options: [
        { t: "If every value is the same, the partition element always lands at one end, so each call recurses on n − 1 items: O(n²)", ok: true, why: "Lopsided splits at every level give n + (n−1) + (n−2) + … = O(n²)." },
        { t: "It sorts the duplicates in the wrong order", why: "The output is still sorted. The problem is the *run time*." },
        { t: "It crashes", why: "It still finishes. It just gets as slow as O(n²)." },
      ],
    },
    {
      id: "c",
      kind: "choice",
      title: "(c) One that doesn't care",
      pts: 2,
      prompt: "**(c) 2 pts.** Which is a correct reason one of the others is unaffected?",
      options: [
        { t: "Merge Sort always splits in half and the merge does the same comparisons and copies whatever the values, so duplicates change nothing", ok: true, why: "Full credit. Bubble or Selection (fixed loop counts no matter the values) and Insertion (equal values stop the inner loop right away) work too." },
        { t: "Bubble Sort skips duplicates", why: "It doesn't skip anything. It's unaffected because it always makes the same number of loop passes." },
        { t: "Insertion Sort removes duplicates first", why: "It never removes anything. Equal values simply stop its inner loop immediately." },
      ],
    },
    ...(
      [
        ["quick", "Quick", ["O(n^2)", "O(n²)"]],
        ["bubble", "Bubble", ["O(n^2)", "O(n²)"]],
        ["insertion", "Insertion", ["O(n^2)", "O(n²)"]],
        ["merge", "Merge", ["O(n lg n)", "O(nlgn)", "O(n log n)", "O(nlogn)"]],
        ["selection", "Selection", ["O(n^2)", "O(n²)"]],
      ] as const
    ).map(([id, name, answers]) => ({
      id,
      kind: "type" as const,
      title: `(d) ${name} Sort`,
      pts: 1,
      prompt: `**(d) 1 pt.** Worst case of **${name} Sort** on n distinct values. No leading constants.`,
      answers: [...answers],
      placeholder: "O(...)",
      hints: [{ when: ["1", "2"], at: "n", say: "No constants inside the O. Just the growth, like O(n^2)." }],
    })),
  ],
  answer:
    "a) Quick Sort\nb) With all values equal, the partition element ends up at one end every time, so each call recurses on n − 1 items: O(n²).\nc) e.g. Merge Sort: it always splits in half and merges the same amount regardless of values.\nd) Quick O(n²) · Bubble O(n²) · Insertion O(n²) · Merge O(n lg n) · Selection O(n²)",
  takeaway: "Only Merge Sort (of these five) is O(n lg n) worst case. Quick Sort's worst case comes from lopsided partitions, and duplicates cause them.",
};

const D3: Question = {
  id: "D3",
  pts: 5,
  category: "ALG",
  topic: "Base Conversion",
  title: "277 in base 8 to base 16",
  story: "Convert **277** in base 8 to base 16. Show your work.",
  given: [{ id: "d3-tip", title: "Octal and hex digits", kind: "text", body: "Each octal digit = 3 bits (2³ = 8)\nEach hex digit = 4 bits (2⁴ = 16)\n\n10 = A, 11 = B, 12 = C, 13 = D, 14 = E, 15 = F" }],
  steps: [
    {
      id: "why3",
      kind: "choice",
      title: "Go through binary",
      prompt: "Why is binary a handy middle step from base 8 to base 16?",
      options: [
        { t: "8 and 16 are both powers of 2, so each octal digit is exactly 3 bits and each hex digit exactly 4 bits", ok: true, why: "No division needed: expand to bits, regroup, read off." },
        { t: "You have to go through base 10", why: "You *can* (277₈ = 191₁₀), but binary is quicker and has fewer places to slip." },
      ],
    },
    {
      id: "bits",
      kind: "slots",
      title: "Each digit → 3 bits",
      pts: 3,
      score: "each",
      prompt: "**(3 pts: converting to binary correctly).** Write each octal digit as 3 bits.",
      layout: "row",
      slots: [
        { id: "a", label: "2 →", answer: "010", w: 4, pts: 1 },
        { id: "b", label: "7 →", answer: "111", w: 4, pts: 1 },
        { id: "c", label: "7 →", answer: "111", w: 4, pts: 1 },
      ],
    },
    {
      id: "regroup",
      kind: "slots",
      title: "Regroup by 4 from the right",
      pts: 0,
      score: "all",
      prompt: "Now `010 111 111` regrouped into 4s **from the right**: 0 | ____ | ____",
      layout: "row",
      slots: [
        { id: "a", label: "0 |", answer: "1011", w: 5 },
        { id: "b", label: "|", answer: "1111", w: 5 },
      ],
    },
    {
      id: "hex",
      kind: "type",
      title: "Read off hex",
      pts: 2,
      prompt: "**(2 pts).** 1011 = 11 and 1111 = 15. What's the answer in base 16? (Drop the leading 0.)",
      answers: ["BF", "bf", "0xBF"],
      hints: [{ when: "1115", say: "Each group becomes ONE hex digit: 11 is B, 15 is F." }],
    },
  ],
  answer: "277₈ → 010 111 111 → 0 1011 1111 → BF₁₆\n(Check: 2·64 + 7·8 + 7 = 191 = 11·16 + 15 = BF.)",
  takeaway: "Base 8 ↔ 16: go through binary. 3 bits per octal digit, regroup into 4 from the right.",
};

export const SUMMER_2024: Exam = {
  id: "summer2024",
  term: "Summer 2024",
  date: "May 18, 2024",
  blurb: "int** vs one block, moving the head near the tail, a stack scoring game, heapsort, Wordle in a trie, and a tic-tac-toe search.",
  questionsPdf: `${EXAMS_URL}sum2024/FE-May24.pdf`,
  solutionsPdf: `${EXAMS_URL}sum2024/FE-May24-Sol.pdf`,
  sections: [
    { id: "A", name: "Basic Data Structures", questions: [A1, A2, A3] },
    { id: "B", name: "Advanced Data Structures", questions: [B1, B2, B3] },
    { id: "C", name: "Algorithm Analysis", questions: [C1, C2, C3] },
    { id: "D", name: "Algorithms", questions: [D1, D2, D3] },
  ],
};
