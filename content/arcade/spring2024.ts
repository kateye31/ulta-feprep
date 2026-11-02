import type { Exam, Question, TreeSpec } from "@/lib/arcade/types";
import { EXAMS_URL } from "@/lib/sections";
import { loops } from "./fall2026-ab";

// January 13, 2024 Foundation Exam, every question, every rubric point.

// ───────────────────────────── Section A ─────────────────────────────

const TRI_PICTURE = `Row 0:  1   2   3   4   5      <- base
Row 1:    3   5   7   9
Row 2:      8  12  16
Row 3:       20  28
Row 4:         48

trisum[row][i] = trisum[row - 1][i] + trisum[row - 1][i + 1]`;

export const A1: Question = {
  id: "A1",
  pts: 10,
  category: "DSN",
  topic: "Dynamic Memory Management in C",
  title: "The triangular sum",
  story:
    "Start with a dynamic int array `base` of `n` numbers. Build a **triangle**: every row is one shorter than the row above it, and each value is the sum of the two values just above it.\n\nComplete `triangularSum` so it builds this triangle as a **dynamic 2D array** using the **EXACT** amount of memory needed (no more, no less), then returns it. Row 0 is a copy of `base`.",
  given: [
    { id: "a1-pic", title: "The triangle (n = 5)", kind: "text", body: TRI_PICTURE },
    { id: "a1-header", title: "Function header", kind: "code", body: "int ** triangularSum(int * base, int n) {\n\n}" },
  ],
  scaffold: {
    title: "triangularSum so far",
    code: "int ** triangularSum(int * base, int n) {\n    {{outer}}\n    {{row0}}\n    {{copyloop}}\n        {{copy}}\n\n    {{rowloop}}\n        {{rowmalloc}}\n        {{iloop}}\n            {{sum}}\n    }\n    {{ret}}\n}",
  },
  steps: [
    {
      id: "ret-type",
      kind: "choice",
      title: "What is int **?",
      prompt: "Start with the header. The function returns `int **`. What is that, exactly?",
      options: [
        { t: "A pointer to pointers: an array whose slots each hold the address of one row of ints", ok: true, why: "Yes! The outer array holds row *addresses*. Each row is its own little `int` array somewhere on the heap." },
        { t: "A 2D array where all the ints sit in one big block", why: "That's `int grid[5][5]`, which is fixed and static. `int **` is an array of row pointers, and each row is allocated separately." },
        { t: "A pointer to a single int", why: "That's `int *`. Two stars means a pointer to *pointers*." },
      ],
    },
    {
      id: "how-many-rows",
      kind: "choice",
      title: "How many rows?",
      prompt: "Look at the picture in your inventory. With `n = 5` there are rows 0 through 4. In general, how many rows does the triangle have?",
      options: [
        { t: "n rows", ok: true, why: "Each row loses one number, so going from n numbers down to 1 takes n rows." },
        { t: "n - 1 rows", why: "Count them in the picture: rows 0, 1, 2, 3, 4. That's 5 rows when n = 5." },
        { t: "n * n rows", why: "That's the size of a full square grid. A triangle has n rows that get shorter." },
      ],
    },
    {
      id: "row-length",
      kind: "choice",
      title: "How long is row r?",
      prompt: "Row 0 has 5 numbers, row 1 has 4, row 2 has 3… How many ints does **row `row`** need?",
      options: [
        { t: "n - row", ok: true, why: "Row 0 gets n, row 1 gets n − 1, and so on. This is the \"EXACT amount\" the question insists on." },
        { t: "n", why: "That wastes space on every row after the first, and the question says EXACT, no more." },
        { t: "row + 1", why: "That's a triangle growing downward. Ours shrinks: row 0 is the longest." },
      ],
    },
    {
      id: "outer",
      kind: "type",
      title: "Allocate the row pointers",
      pts: 2,
      prompt: "**Line 1 (2 pts).** Allocate the outer array: `n` slots, each holding a *row pointer*. Store it in `int ** trisum`.",
      answers: [
        "int ** trisum = malloc(sizeof(int *) * n);",
        "int ** trisum = malloc(n * sizeof(int *));",
        "int ** trisum = (int **)malloc(sizeof(int *) * n);",
        "int ** trisum = calloc(n, sizeof(int *));",
      ],
      hints: [
        { when: "int", at: "*", say: "Careful: each slot holds a **pointer** to a row, not an int. On most machines a pointer is 8 bytes and an int is 4. Measure `int *`." },
        { when: "*", at: ")", say: "One star inside `sizeof` here, `sizeof(int *)`. Each slot holds one `int *`." },
        { when: "realloc", say: "There's nothing to resize yet. This is a fresh allocation." },
      ],
      nudge: "Outer array = n slots × size of one row pointer.",
    },
    {
      id: "row0",
      kind: "type",
      title: "Allocate row 0",
      pts: 1,
      prompt: "**Line 2 (1 pt).** Row 0 is a copy of `base`, so it needs `n` ints. Allocate it.",
      answers: ["trisum[0] = malloc(sizeof(int) * n);", "trisum[0] = malloc(n * sizeof(int));", "trisum[0] = calloc(n, sizeof(int));"],
      hints: [
        { when: "*", at: ")", say: "Row 0 holds actual ints now, not pointers. `sizeof(int)` with no star." },
        { when: "base", say: "Don't just point at base. The function gets its own copy, so allocate fresh memory first." },
      ],
    },
    {
      id: "copyloop",
      kind: "type",
      title: "Loop over base",
      pts: 0,
      prompt: "Warm-up (no points on its own). Write the `for` header that visits every index of `base`.",
      answers: loops(["int i=0"], ["i<n"], ["i++", "++i", "i+=1"]),
      hints: [{ when: "<=", at: "<", say: "Indices go 0 to n−1. With `<=` you'd read one past the end." }],
    },
    {
      id: "copy",
      kind: "type",
      title: "Copy base into row 0",
      pts: 1,
      prompt: "**Line 3 (1 pt).** Inside that loop, copy one value from `base` into row 0.",
      answers: ["trisum[0][i] = base[i];"],
      hints: [
        { when: "base", at: "trisum", say: "Flip it: the destination (row 0 of trisum) goes on the left of `=`." },
        { when: "trisum[i]", say: "`trisum[i]` is a whole row. You want row 0, slot i: `trisum[0][i]`." },
      ],
    },
    {
      id: "rowloop",
      kind: "type",
      title: "Loop over the other rows",
      pts: 1,
      prompt: "**Line 4 (1 pt).** Row 0 is done. Write the `for` header that walks the remaining rows, using a variable named `row`.",
      answers: loops(["int row=1"], ["row<n"], ["row++", "++row", "row+=1"], ["", "{"]),
      hints: [
        { when: "0", at: "1", say: "Row 0 is already built. Start at row 1." },
        { when: "<=", at: "<", say: "There are n rows, numbered 0 to n−1. `row <= n` would build one row too many." },
      ],
    },
    {
      id: "rowmalloc",
      kind: "type",
      title: "Allocate this row",
      pts: 2,
      prompt: "**Line 5 (2 pts).** Allocate row `row` with exactly the right number of ints. (You figured out the length a few steps ago.)",
      answers: ["trisum[row] = malloc(sizeof(int) * (n - row));", "trisum[row] = malloc((n - row) * sizeof(int));", "trisum[row] = calloc(n - row, sizeof(int));"],
      hints: [
        { when: "n", at: "(", say: "Row `row` holds `n - row` ints. Wrap it in parentheses so the multiply covers the whole thing." },
        { when: ")", at: "-", say: "Not n, but `n - row`. The question says EXACT space, and each row is one shorter than the last." },
        { when: "*", at: ")", say: "This row holds ints, so it's `sizeof(int)` with no star." },
      ],
    },
    {
      id: "iloop",
      kind: "type",
      title: "Loop across the row",
      pts: 1,
      prompt: "**Line 6 (1 pt).** Write the `for` header that visits every slot `i` in this row.",
      answers: loops(["int i=0"], ["i<n-row"], ["i++", "++i", "i+=1"], ["", "{"]),
      hints: [{ when: ";", at: "-", say: "This row only has `n - row` slots, so stop at `i < n - row`." }],
    },
    {
      id: "sum",
      kind: "type",
      title: "Fill one slot",
      pts: 1,
      prompt: "**Line 7 (1 pt).** Each slot is the sum of the two values just above it. Use the formula from your inventory.",
      answers: ["trisum[row][i] = trisum[row-1][i] + trisum[row-1][i+1];", "trisum[row][i] = trisum[row-1][i+1] + trisum[row-1][i];"],
      hints: [
        { when: "row", at: "row-1", say: "The two parents live in the row **above**, `row - 1`." },
        { when: "+", at: "]", say: "The second parent is one slot to the right: index `i + 1`." },
      ],
    },
    {
      id: "ret",
      kind: "type",
      title: "Hand it back",
      pts: 1,
      prompt: "**Line 8 (1 pt).** All rows built. What does the function return?",
      answers: ["return trisum;"],
      hints: [
        { when: "*", say: "`trisum` is already the `int **` we promised. No star or ampersand needed." },
        { when: "base", say: "We return the triangle we built, not the input." },
      ],
    },
  ],
  answer:
    "int ** triangularSum(int * base, int n) {\n    int ** trisum = malloc(sizeof(int *) * n);   // 2\n    trisum[0] = malloc(sizeof(int) * n);         // 1\n    for (int i=0; i<n; i++)\n        trisum[0][i] = base[i];                  // 1\n    for (int row = 1; row < n; ++row) {          // 1\n        trisum[row] = malloc(sizeof(int) * (n - row));   // 2\n        for (int i = 0; i < n - row; ++i)        // 1\n            trisum[row][i] = trisum[row-1][i] + trisum[row-1][i+1];   // 1\n    }\n    return trisum;                               // 1\n}",
  takeaway: "Dynamic 2D array: malloc the row pointers with sizeof(int *), then malloc each row with sizeof(int) times exactly its length.",
};

const WDYD = `typedef struct node_s {
    int data;
    struct node_s * nextptr;
} node_t;

void whatDoYouDo(node_t * head) {
    node_t * temp = head;
    node_t * temp2 = head->nextptr;
    int a;
    while (temp->nextptr != NULL) {
        a = temp->data;
        temp->data = temp2->data;
        temp2->data = a;
        temp = temp->nextptr;
        if (temp->nextptr != NULL) {
            temp = temp->nextptr;
            temp2 = temp->nextptr;
        }
    }
}`;

const A2: Question = {
  id: "A2",
  pts: 5,
  category: "ALG",
  topic: "Linked Lists",
  title: "whatDoYouDo?",
  story: "We call `whatDoYouDo(head)` on the list **head → 5 → 2 → 1 → 8 → 7**. Show the list after the function finishes.",
  given: [
    { id: "a2-code", title: "The struct and function", kind: "code", body: WDYD },
    { id: "a2-list", title: "The starting list", kind: "text", body: "head → 5 → 2 → 1 → 8 → 7" },
  ],
  steps: [
    {
      id: "three-lines",
      kind: "choice",
      title: "The three lines with a",
      prompt: "Look at the three lines that use `a`:\n\n`a = temp->data; temp->data = temp2->data; temp2->data = a;`\n\nWhat do they do?",
      options: [
        { t: "Swap the data in temp's node and temp2's node", ok: true, why: "Classic three-line swap: stash one value, overwrite, restore. The nodes stay put; only the numbers trade places." },
        { t: "Move temp's node to after temp2", why: "No `nextptr` changes happen in those lines. Only `data` moves." },
        { t: "Copy temp2's data into temp, losing temp's value", why: "`a` saved temp's value first, and it lands in temp2. Nothing is lost." },
      ],
    },
    {
      id: "pairs",
      kind: "choice",
      title: "How do temp and temp2 move?",
      prompt: "After a swap, `temp` steps forward **twice** and `temp2` lands right after it. So which pairs get swapped?",
      options: [
        { t: "Pairs: (1st, 2nd), then (3rd, 4th), then (5th, 6th)…", ok: true, why: "It swaps neighbors two at a time. With an odd number of nodes, the last one has no partner." },
        { t: "Every neighbor: (1st, 2nd), (2nd, 3rd), (3rd, 4th)…", why: "That would need temp to move one step. Here temp jumps two nodes per loop." },
        { t: "The first and last nodes", why: "temp never jumps to the end. It walks forward in pairs." },
      ],
    },
    {
      id: "trace1",
      kind: "choice",
      title: "Trace the first pass",
      prompt: "First pass: temp is at 5, temp2 is at 2. They swap. What does the list look like now?",
      options: [
        { t: "2 → 5 → 1 → 8 → 7", ok: true, why: "Then temp moves to the 3rd node (1) and temp2 to the 4th (8)." },
        { t: "5 → 2 → 1 → 8 → 7", why: "The swap really happens. 5 and 2 trade values." },
        { t: "2 → 1 → 5 → 8 → 7", why: "Only the two values swap places. Nothing slides further down." },
      ],
    },
    {
      id: "last",
      kind: "choice",
      title: "What about the 7?",
      prompt: "Second pass swaps 1 and 8. Then temp moves to the last node (7) and `temp2 = temp->nextptr` becomes NULL. Does the loop run again?",
      options: [
        { t: "No. temp->nextptr is NULL, so the loop stops and 7 stays put", ok: true, why: "Good thing, too: running again would try to read `temp2->data` from NULL." },
        { t: "Yes, and 7 swaps with 8", why: "The loop checks `temp->nextptr != NULL` first. For the last node it's NULL, so it stops." },
      ],
    },
    {
      id: "result",
      kind: "slots",
      title: "Fill in the final list",
      pts: 5,
      prompt: "**(5 pts, 1 per slot).** Fill in the list after the function finishes.",
      layout: "row",
      score: "each",
      sep: " → ",
      slots: ["2", "5", "8", "1", "7"].map((a, i) => ({ id: "n" + i, answer: a, pts: 1, w: 3, ...(i === 0 ? { label: "head →" } : {}) })),
      learn: "Pairs swap: (5,2) → (2,5), (1,8) → (8,1), and 7 has no partner.",
    },
  ],
  answer: "head → 2 → 5 → 8 → 1 → 7",
  takeaway: "When pointers jump two at a time, the function works on pairs. Trace the first two passes and the pattern shows itself.",
};

const A3_EXPR = `3 + 1 - 7 * (4 / 2 + 5) * 8 - 7 / (5 - 3 + (5 + 7) / (3 * 2))

A: after the first * and before the (
B: after the - inside (5 - 3, before the 3
C: after the / and before the final (3 * 2)`;

const A3: Question = {
  id: "A3",
  pts: 10,
  category: "ALG",
  topic: "Stacks",
  title: "Infix to postfix",
  story: "Convert the infix expression to postfix using a stack. Show the stack at the three marked points **A**, **B**, and **C**, then write the full postfix expression (14 numbers, 13 operators).",
  given: [{ id: "a3-expr", title: "Expression and checkpoints", kind: "text", body: A3_EXPR }],
  steps: [
    {
      id: "numbers",
      kind: "choice",
      title: "Numbers",
      prompt: "You read a number. Where does it go?",
      options: [
        { t: "Straight to the output", ok: true, why: "Numbers never touch the stack. That's why they come out in the same order they went in." },
        { t: "Onto the stack", why: "Only operators and `(` wait on the stack. Numbers go straight out." },
      ],
    },
    {
      id: "precedence",
      kind: "choice",
      title: "Equal precedence",
      prompt: "Start: `3 + 1 -`. When the `-` arrives, `+` is on the stack. What happens?",
      options: [
        { t: "Pop + to the output first, then push -", ok: true, why: "+ and - have equal precedence, so the older one leaves first. Output so far: `3 1 +`." },
        { t: "Push - on top of +", why: "Only push on top of something with **lower** precedence. Equal precedence pops." },
      ],
    },
    {
      id: "stackA",
      kind: "slots",
      title: "Stack at A",
      pts: 2,
      score: "minusEach",
      prompt: "**Stack A (2 pts).** Continue through `3 + 1 - 7 *`. Fill the stack from bottom to top. Leave extra boxes empty.",
      layout: "stacks",
      stacks: [["A", ["a1", "a2", "a3", "a4", "a5"]]],
      slots: [
        { id: "a1", answer: "-" },
        { id: "a2", answer: "*" },
        { id: "a3", answer: "" },
        { id: "a4", answer: "" },
        { id: "a5", answer: "" },
      ],
      learn: "`*` outranks `-`, so it goes right on top. Output so far: `3 1 + 7`.",
    },
    {
      id: "inner",
      kind: "choice",
      title: "The first parentheses",
      prompt: "Next comes `(4 / 2 + 5) * 8 -`. When the `)` arrives, what gets popped?",
      options: [
        { t: "Everything down to the (, then the ( is thrown away", ok: true, why: "Inside, `/` was popped by `+`, so at the `)` only `+` is left above the `(`. Output grows by `4 2 / 5 +`." },
        { t: "The whole stack", why: "A `)` only pops down to its matching `(`. The `- *` underneath stays." },
      ],
      learn: "Then `* 8` pops the old `*` and pushes the new one, and the next `-` pops `*` and `-`. Output: `3 1 + 7 4 2 / 5 + * 8 * -`.",
    },
    {
      id: "stackB",
      kind: "slots",
      title: "Stack at B",
      pts: 2,
      score: "minusEach",
      prompt: "**Stack B (2 pts).** Continue through `- 7 / (5 -`. Fill the stack from bottom to top.",
      layout: "stacks",
      stacks: [["B", ["b1", "b2", "b3", "b4", "b5"]]],
      slots: [
        { id: "b1", answer: "-" },
        { id: "b2", answer: "/" },
        { id: "b3", answer: "(" },
        { id: "b4", answer: "-" },
        { id: "b5", answer: "" },
      ],
      learn: "A `(` always gets pushed, and anything after it stacks on top no matter its precedence.",
    },
    {
      id: "stackC",
      kind: "slots",
      title: "Stack at C",
      pts: 2,
      score: "minusEach",
      prompt: "**Stack C (2 pts).** Continue through `3 + (5 + 7) /`. Fill the stack from bottom to top.",
      layout: "stacks",
      stacks: [["C", ["c1", "c2", "c3", "c4", "c5"]]],
      slots: [
        { id: "c1", answer: "-" },
        { id: "c2", answer: "/" },
        { id: "c3", answer: "(" },
        { id: "c4", answer: "+" },
        { id: "c5", answer: "/" },
      ],
      learn: "The `+` after 3 popped the `-` inside the parentheses. `(5 + 7)` came and went. Then `/` outranks `+`, so it sits on top.",
    },
    {
      id: "postfix",
      kind: "type",
      title: "The whole postfix",
      pts: 4,
      penalty: 1,
      prompt: "**(4 pts).** Type the full postfix expression, with spaces between items. (14 numbers, 13 operators.)",
      answers: ["3 1 + 7 4 2 / 5 + * 8 * - 7 5 3 - 5 7 + 3 2 * / + / -"],
      nudge: "Use your three stack snapshots as checkpoints, and empty the stack at the end.",
      hints: [{ when: ["(", ")"], say: "Parentheses never appear in postfix. They only decide when things get popped." }],
    },
  ],
  answer: "Stack A (bottom→top): -  *\nStack B: -  /  (  -\nStack C: -  /  (  +  /\n\nPostfix: 3 1 + 7 4 2 / 5 + * 8 * - 7 5 3 - 5 7 + 3 2 * / + / -",
  takeaway: "Numbers out, ( in, ) pops to (, and equal or higher precedence pops before you push.",
};

// ───────────────────────────── Section B ─────────────────────────────

const NODE = `typedef struct node {
    int data;
    struct node *left;
    struct node *right;
} node;`;

const B1_TREE: TreeSpec = {
  nodes: [
    { id: "13", x: 50, y: 10, v: "13" },
    { id: "4", x: 28, y: 32, v: "4" },
    { id: "25", x: 72, y: 32, v: "25" },
    { id: "3", x: 16, y: 54, v: "3" },
    { id: "8", x: 38, y: 54, v: "8" },
    { id: "20", x: 64, y: 54, v: "20" },
    { id: "30", x: 84, y: 54, v: "30" },
    { id: "2", x: 8, y: 76, v: "2" },
    { id: "5", x: 32, y: 76, v: "5" },
    { id: "22", x: 70, y: 76, v: "22" },
  ],
  edges: [["13", "4"], ["13", "25"], ["4", "3"], ["4", "8"], ["25", "20"], ["25", "30"], ["3", "2"], ["8", "5"], ["20", "22"]],
  mark: ["3", "8", "20"],
};

const B1: Question = {
  id: "B1",
  pts: 10,
  category: "DSN",
  topic: "Binary Trees",
  title: "Sum the single parents",
  story:
    "Write `sumSingleParents()`: given the root of a binary tree, return the **sum of the values in nodes that have exactly one child**.\n\nFor the tree in your inventory it returns 31 (= 3 + 8 + 20). You must use a **single** function, with no helper functions.",
  given: [
    { id: "b1-struct", title: "The struct: node", kind: "code", body: NODE },
    { id: "b1-tree", title: "Example tree (answer: 31)", kind: "tree", tree: B1_TREE },
    { id: "b1-header", title: "Function header", kind: "code", body: "int sumSingleParents(node *root) {\n\n}" },
  ],
  scaffold: { title: "sumSingleParents so far", code: "int sumSingleParents(node *root) {\n    {{base}}\n    {{init}}\n    {{cond}}\n        {{add}}\n    {{left}}\n    {{right}}\n    {{ret}}\n}" },
  steps: [
    {
      id: "who",
      kind: "choice",
      title: "Who counts?",
      prompt: "In the example tree, why does 13 **not** count, but 3 does?",
      options: [
        { t: "13 has two children; 3 has exactly one (just 2)", ok: true, why: "One child means one side is NULL and the other isn't. Leaves (no children) don't count either." },
        { t: "13 is the root, and the root never counts", why: "If the root had only one child, it would count. 13 is skipped because it has two." },
        { t: "3 is smaller", why: "Values don't matter, only how many children a node has." },
      ],
    },
    {
      id: "plan",
      kind: "choice",
      title: "The recursive plan",
      prompt: "What's the recursive idea?",
      options: [
        { t: "Add this node's value if it has one child, plus the answer for the left subtree, plus the answer for the right subtree", ok: true, why: "That sentence is the function. Trust the recursion to handle each subtree." },
        { t: "Only check the root's two children", why: "Single parents can be anywhere in the tree, so we have to visit every node." },
      ],
    },
    {
      id: "base",
      kind: "type",
      title: "Base case",
      pts: 1,
      prompt: "**(1 pt).** An empty tree has no single parents. Write the base case on one line.",
      answers: ["if (root == NULL) return 0;", "if (!root) return 0;", "if (NULL == root) return 0;"],
      hints: [
        { when: "NULL", at: "0", say: "The function returns an `int`, the sum. Nothing to add means 0." },
        { when: "=", at: "==", say: "One `=` assigns. To compare you need `==`." },
      ],
    },
    {
      id: "init",
      kind: "type",
      title: "Start a total",
      pts: 1,
      prompt: "**(1 pt).** Create a running total called `sum`.",
      answers: ["int sum = 0;"],
      hints: [{ when: ";", at: "=", say: "Give it a starting value. An uninitialized int holds garbage." }],
    },
    {
      id: "cond",
      kind: "type",
      title: "Exactly one child?",
      pts: 2,
      prompt: "**(2 pts).** Write the `if` header that's true when this node has **exactly one** child. (Left is NULL and right isn't, OR left isn't and right is.)",
      answers: [
        "if ((root->left == NULL && root->right != NULL) || (root->left != NULL && root->right == NULL))",
        "if ((root->left != NULL && root->right == NULL) || (root->left == NULL && root->right != NULL))",
        "if ((root->left == NULL) != (root->right == NULL))",
        "if ((root->left == NULL) ^ (root->right == NULL))",
      ],
      hints: [
        { when: ".", at: "->", say: "`root` is a pointer, so reach its fields with `->`." },
        { when: "&&", at: "||", say: "The two cases can't both be true at once, so join them with `||` (OR)." },
        { when: "||", at: "&&", say: "Inside each case, *both* parts must hold: left NULL **and** right not NULL. That's `&&`." },
      ],
      nudge: "Two cases in parentheses, joined by ||. Each case uses &&.",
    },
    {
      id: "add",
      kind: "type",
      title: "Count this node",
      pts: 1,
      prompt: "**(1 pt).** It's a single parent. Add its value to the total.",
      answers: ["sum += root->data;", "sum = sum + root->data;"],
      hints: [{ when: "=", at: "+=", say: "Plain `=` replaces the total. Add to it with `+=`." }],
    },
    {
      id: "left",
      kind: "type",
      title: "Recurse left",
      pts: 2,
      prompt: "**(2 pts).** Add in everything from the left subtree.",
      answers: ["sum += sumSingleParents(root->left);", "sum = sum + sumSingleParents(root->left);"],
      hints: [
        { when: "root", at: "root->left", say: "Passing `root` again would recurse forever. Go down to `root->left`." },
        { when: "data", say: "Don't reach into the child's data yourself. Let the recursive call handle the whole subtree." },
      ],
    },
    {
      id: "right",
      kind: "type",
      title: "Recurse right",
      pts: 2,
      prompt: "**(2 pts).** And everything from the right subtree.",
      answers: ["sum += sumSingleParents(root->right);", "sum = sum + sumSingleParents(root->right);"],
    },
    {
      id: "ret",
      kind: "type",
      title: "Return the total",
      pts: 1,
      prompt: "**(1 pt).** Hand back the total.",
      answers: ["return sum;"],
    },
  ],
  answer:
    "int sumSingleParents(node *root) {\n    if (root == NULL) return 0;                         // 1\n    int sum = 0;                                        // 1\n    if ((root->left == NULL && root->right != NULL) ||  // 2\n        (root->left != NULL && root->right == NULL))\n        sum += root->data;                              // 1\n    sum += sumSingleParents(root->left);                // 2\n    sum += sumSingleParents(root->right);               // 2\n    return sum;                                         // 1\n}",
  takeaway: "Tree sums: base case 0, check this node, then add both recursive calls. Watch for NULL before you follow a pointer.",
};

const HEAP_TABLE = { head: ["index", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], rows: [["data", "7", "11", "13", "16", "18", "19", "24", "21", "20", "35"]] };

const B2_TREE: TreeSpec = {
  nodes: [
    { id: "11", x: 50, y: 10, v: "11" },
    { id: "21", x: 28, y: 30, v: "21" },
    { id: "31", x: 72, y: 30, v: "31" },
    { id: "51", x: 16, y: 52, v: "51" },
    { id: "41", x: 38, y: 52, v: "41" },
    { id: "65", x: 62, y: 52, v: "65" },
    { id: "48", x: 86, y: 52, v: "48" },
    { id: "101", x: 8, y: 74, v: "101" },
    { id: "90", x: 24, y: 74, v: "90" },
    { id: "71", x: 56, y: 74, v: "71" },
  ],
  edges: [["11", "21"], ["11", "31"], ["21", "51"], ["21", "41"], ["31", "65"], ["31", "48"], ["51", "101"], ["51", "90"], ["65", "71"]],
};

const B2: Question = {
  id: "B2",
  pts: 10,
  category: "ALG",
  topic: "Heaps",
  title: "Heap reading, checking, and percolateUp",
  story:
    "Three parts.\n\n**(a)** A heap is stored in an array starting at index 1. Answer with the **data**, not the index.\n\n**(b)** Is the pictured tree a valid minheap? Justify.\n\n**(c)** Write `percolateUp` for a minheap stored in the global array `int heaparray[100]`. A `swap(int* ptrA, int* ptrB)` function is provided.",
  given: [
    { id: "b2-array", title: "Part (a): the heap array", kind: "table", table: HEAP_TABLE },
    { id: "b2-rules", title: "Index rules (root at 1)", kind: "text", body: "left child of i  = 2i\nright child of i = 2i + 1\nparent of i      = i / 2   (integer division)" },
  ],
  scaffold: { title: "percolateUp so far", code: "void percolateUp(int idx) {\n    {{notroot}}\n        {{compare}}\n            {{swap}}\n            {{recur}}\n        }\n    }\n}" },
  steps: [
    {
      id: "left13",
      kind: "type",
      title: "(a) Left child of 13",
      pts: 1,
      prompt: "**(a-i) 1 pt.** 13 is at index 3. Its left child is at index 2·3 = 6. Who is the left child of 13?",
      answers: ["19"],
      hints: [{ when: "6", say: "That's the index. The question wants the **data** stored there." }],
    },
    {
      id: "right16",
      kind: "type",
      title: "(a) Right child of 16",
      pts: 1,
      prompt: "**(a-ii) 1 pt.** Who is the right child of 16?",
      answers: ["20"],
      hints: [
        { when: "9", say: "That's the index (2·4 + 1). What value sits at index 9?" },
        { when: "21", say: "21 is at index 8, the **left** child. Right child is 2i + 1." },
      ],
    },
    {
      id: "parent24",
      kind: "type",
      title: "(a) Parent of 24",
      pts: 1,
      prompt: "**(a-iii) 1 pt.** Who is the parent of 24?",
      answers: ["13"],
      hints: [{ when: "3", say: "7 / 2 = 3 is the index. Give the data at index 3." }],
    },
    {
      id: "valid",
      kind: "choice",
      title: "(b) Valid minheap?",
      pts: 2,
      prompt: "**(b) 2 pts.** Look at this tree. Every parent is smaller than its children. Is it a valid minheap?",
      give: [{ id: "b2-tree", title: "Part (b): the tree", kind: "tree", tree: B2_TREE }],
      options: [
        { t: "No: it isn't a complete tree. 41 has no children but 65 (to its right) has one, so the bottom level isn't filled left to right", ok: true, why: "A heap needs BOTH rules: heap order and a complete shape. This tree fails the shape rule." },
        { t: "Yes: every parent is smaller than its children", why: "That's only half the definition. A heap must also be **complete**: every level full, and the bottom level filled from the left with no gaps." },
        { t: "No: 48 is smaller than 65", why: "Siblings and cousins can be in any order. Heap order only compares a parent to its own children." },
      ],
      learn: "On the exam, \"yes/no\" alone earns nothing. Name the rule that breaks and point at where.",
    },
    {
      id: "perc-idea",
      kind: "choice",
      title: "(c) What does percolate up do?",
      prompt: "In a **min**heap, when should the item at `idx` move up?",
      options: [
        { t: "When it's smaller than its parent: swap them, then keep going from the parent's spot", ok: true, why: "Small things rise to the top of a minheap. Stop when the parent is smaller or you reach the root." },
        { t: "When it's bigger than its parent", why: "That's a maxheap. In a minheap the small values float up." },
        { t: "Always swap with the smaller child", why: "That's percolate **down**. Up compares with the parent." },
      ],
    },
    {
      id: "notroot",
      kind: "type",
      title: "Not at the root yet",
      pts: 1,
      prompt: "**(1 pt).** The root (index 1) has no parent. Write the `if` header (with its opening brace) that checks we're not at the root.",
      answers: ["if (idx > 1) {", "if (idx != 1) {", "if (idx >= 2) {"],
      hints: [{ when: "0", say: "The root lives at index **1** in this heap, not 0." }],
    },
    {
      id: "compare",
      kind: "type",
      title: "Parent bigger?",
      pts: 1,
      prompt: "**(1 pt).** Write the `if` header (with its opening brace) that's true when the parent is bigger than the item at `idx`.",
      answers: [
        "if (heaparray[idx/2] > heaparray[idx]) {",

        "if (heaparray[idx] < heaparray[idx/2]) {",

      ],
      hints: [
        { when: "2*idx", say: "`2*idx` is a child. The parent is `idx/2`." },
        { when: "idx-1", say: "The parent isn't the previous index. It's `idx/2`." },
      ],
    },
    {
      id: "swap",
      kind: "type",
      title: "Swap them",
      pts: 2,
      prompt: "**(2 pts).** Swap the item with its parent using the provided `swap`. Remember: it takes two **pointers**.",
      answers: ["swap(&heaparray[idx], &heaparray[idx/2]);", "swap(&heaparray[idx/2], &heaparray[idx]);", "swap(heaparray + idx, heaparray + idx/2);", "swap(heaparray + idx/2, heaparray + idx);"],
      hints: [{ when: "heaparray", at: "&", say: "`swap` wants addresses (`int*`). Put `&` in front of each array element." }],
    },
    {
      id: "recur",
      kind: "type",
      title: "Keep climbing",
      pts: 1,
      prompt: "**(1 pt).** The item now sits at the parent's index. Keep percolating from there.",
      answers: ["percolateUp(idx/2);"],
      hints: [{ when: "idx", at: "idx/2", say: "Calling with the same `idx` would just look at the old spot. The item moved to `idx/2`." }],
    },
  ],
  answer:
    "(a) left child of 13: 19   right child of 16: 20   parent of 24: 13\n\n(b) Not a valid minheap: it isn't a complete binary tree. 41 has no children\n    but 65 has one, so the bottom level isn't filled left to right.\n\n(c) void percolateUp(int idx) {\n        if (idx > 1) {                                   // 1\n            if (heaparray[idx/2] > heaparray[idx]) {     // 1\n                swap(&heaparray[idx], &heaparray[idx/2]); // 2\n                percolateUp(idx/2);                      // 1\n            }\n        }\n    }",
  takeaway: "Heap = heap order + complete shape. Root at 1 means children 2i and 2i+1, parent i/2.",
};

const AVL_START: TreeSpec = {
  nodes: [
    { id: "50", x: 56, y: 10, v: "50" },
    { id: "25", x: 32, y: 32, v: "25" },
    { id: "80", x: 78, y: 32, v: "80" },
    { id: "12", x: 18, y: 54, v: "12" },
    { id: "37", x: 46, y: 54, v: "37" },
    { id: "90", x: 90, y: 54, v: "90" },
    { id: "18", x: 26, y: 76, v: "18" },
    { id: "36", x: 38, y: 76, v: "36" },
    { id: "45", x: 56, y: 76, v: "45" },
  ],
  edges: [["50", "25"], ["50", "80"], ["25", "12"], ["25", "37"], ["80", "90"], ["12", "18"], ["37", "36"], ["37", "45"]],
};

const AVL_INSERTED: TreeSpec = {
  nodes: [...AVL_START.nodes, { id: "48", x: 66, y: 94, v: "48" }],
  edges: [...AVL_START.edges, ["45", "48"]],
  mark: ["48", "50"],
};

const AVL_ANSWER: TreeSpec = {
  nodes: [
    { id: "root", x: 50, y: 8, slot: "root" },
    { id: "L", x: 28, y: 30, slot: "L" },
    { id: "R", x: 72, y: 30, slot: "R" },
    { id: "LL", x: 16, y: 52, slot: "LL" },
    { id: "LR", x: 38, y: 52, slot: "LR" },
    { id: "RL", x: 62, y: 52, slot: "RL" },
    { id: "RR", x: 86, y: 52, slot: "RR" },
    { id: "LLR", x: 23, y: 74, slot: "LLR" },
    { id: "RLR", x: 69, y: 74, slot: "RLR" },
    { id: "RRR", x: 93, y: 74, slot: "RRR" },
  ],
  edges: [["root", "L"], ["root", "R"], ["L", "LL"], ["L", "LR"], ["R", "RL"], ["R", "RR"], ["LL", "LLR"], ["RL", "RLR"], ["RR", "RRR"]],
};

const B3: Question = {
  id: "B3",
  pts: 5,
  category: "ALG",
  topic: "AVL Trees",
  title: "Insert 48",
  story: "Show the final result of inserting **48** into the AVL tree in your inventory.",
  given: [{ id: "b3-tree", title: "The AVL tree", kind: "tree", tree: AVL_START }],
  steps: [
    {
      id: "where",
      kind: "choice",
      title: "Where does 48 land?",
      prompt: "First insert like a normal BST. Walk down from 50: 48 < 50 go left, 48 > 25 go right, 48 > 37 go right, 48 > 45 go right. Where does 48 end up?",
      options: [
        { t: "As the right child of 45", ok: true, why: "Right. Now walk back up the path checking each node's balance." },
        { t: "As the right child of 37", why: "37 already has a right child (45). Keep going down." },
        { t: "As the left child of 80", why: "48 < 50, so it goes into the left subtree." },
      ],
    },
    {
      id: "unbalanced",
      kind: "choice",
      title: "First node out of balance",
      prompt: "Walk up from 48: 45, 37, 25, 50. Which is the first node whose two subtree heights differ by 2?",
      give: [{ id: "b3-after", title: "After the BST insert (before fixing)", kind: "tree", tree: AVL_INSERTED }],
      options: [
        { t: "50: its left side is now 4 levels deep (25→37→45→48), its right only 2 (80→90)", ok: true, why: "45, 37 and 25 are all off by at most 1. 50 is the first that breaks." },
        { t: "37: its right side is deeper", why: "37 has 36 on the left (height 1) and 45→48 on the right (height 2). Off by 1 is fine." },
        { t: "25: its right side is deeper", why: "25 has 12→18 (height 2) on the left and 37→45→48 (height 3) on the right. Off by 1 is still fine." },
      ],
    },
    {
      id: "case",
      kind: "choice",
      title: "Which rotation?",
      prompt: "At 50 we went **left** (to 25), then **right** (to 37). What kind of fix is that?",
      options: [
        { t: "Left-right zig-zag: a double rotation, and 37 (the middle value of 25, 37, 50) becomes the new root", ok: true, why: "Zig-zag means double rotation. The grandchild 37 rises to the top, with 25 on its left and 50 on its right." },
        { t: "Left-left: a single right rotation, and 25 becomes the root", why: "Left-left would need the path to go left twice. Here it goes left, then right." },
      ],
    },
    {
      id: "kids",
      kind: "choice",
      title: "37's old children",
      prompt: "37 moves up, so its old children 36 and 45 need new homes. Where do they go?",
      options: [
        { t: "36 becomes 25's right child; 45 (with 48) becomes 50's left child", ok: true, why: "36 is between 25 and 37, and 45 is between 37 and 50. The BST order picks their spots for you." },
        { t: "Both stay under 37", why: "37 now has 25 and 50 as children. There's no room left, so 36 and 45 move." },
      ],
    },
    {
      id: "final",
      kind: "slots",
      title: "Draw the final tree",
      pts: 5,
      score: "each",
      prompt: "**(5 pts).** Fill in the final AVL tree.",
      layout: "tree",
      tree: AVL_ANSWER,
      slots: [
        { id: "root", answer: "37", pts: 2 },
        { id: "L", answer: "25", pts: 1 },
        { id: "R", answer: "50", pts: 1 },
        { id: "LL", answer: "12", pts: 1 / 7 },
        { id: "LR", answer: "36", pts: 1 / 7 },
        { id: "RL", answer: "45", pts: 1 / 7 },
        { id: "RR", answer: "80", pts: 1 / 7 },
        { id: "LLR", answer: "18", pts: 1 / 7 },
        { id: "RLR", answer: "48", pts: 1 / 7 },
        { id: "RRR", answer: "90", pts: 1 / 7 },
      ],
      learn: "Rubric: a valid AVL tree with the right values (1 pt), 37 at the root (1 pt), 25 on the left (1 pt), 50 on the right (1 pt), and the rest attached properly (1 pt). Not a valid AVL tree? Automatic 0.",
    },
  ],
  answer: "            37\n         /      \\\n       25        50\n      /  \\      /  \\\n    12    36  45    80\n      \\         \\     \\\n       18        48    90",
  takeaway: "Insert like a BST, walk up to the first node that's off by 2, and check the path: straight line is a single rotation, zig-zag is a double.",
};

// ───────────────────────────── Section C ─────────────────────────────

const RUNTIMES: [string, string, string[], string][] = [
  ["a", "Inserting 1 item into a binary search tree storing n items.", ["O(n)"], "Worst case, a BST is a straight line (insert sorted data), so you walk all n nodes."],
  ["b", "Inserting 1 item into an AVL tree storing n items.", ["O(lg n)", "O(log n)", "O(lgn)", "O(logn)"], "AVL trees stay balanced, so the height is always O(lg n)."],
  ["c", "Printing out each number in base b with exactly k digits (printing one digit is O(1)).", ["O(k*b^k)", "O(kb^k)", "O(b^k*k)", "O(k*b^(k))"], "There are about b^k such numbers, and each one has k digits to print."],
  ["d", "Creating a heap out of n unsorted values, using the most efficient algorithm.", ["O(n)"], "Bottom-up heapify (percolate down from n/2 to 1) is O(n), not O(n lg n)."],
  ["e", "Deleting the third item in a linked list (of more than 3 items) and returning a pointer to the front.", ["O(1)"], "The third node is always 2 hops away, no matter how long the list is."],
  ["f", "Counting the integers that appear in both of two sorted lists of n integers, most efficiently.", ["O(n)"], "Walk both lists with two pointers, like the merge step of Merge Sort."],
  ["g", "Executing p consecutive pops on a stack that started with n elements (p < n).", ["O(p)"], "Each pop is O(1), and you do p of them. n doesn't matter."],
  ["h", "Sorting n unsorted items with Heap Sort.", ["O(n lg n)", "O(nlgn)", "O(n log n)", "O(nlogn)"], "Build the heap in O(n), then n delete-mins at O(lg n) each."],
  ["i", "Converting a positive integer n from decimal into binary.", ["O(lg n)", "O(log n)", "O(lgn)", "O(logn)"], "Each step divides n by 2, and n has about lg n binary digits."],
  ["j", "Adding a c-digit integer to a d-digit integer, stored digit by digit in arrays.", ["O(max(c,d))", "O(c+d)", "O(max(c, d))", "O(d+c)", "O(max(d,c))"], "You touch every digit of the longer number once."],
];

const C1: Question = {
  id: "C1",
  pts: 10,
  category: "ANL",
  topic: "Algorithm Analysis",
  title: "Ten worst-case run times",
  story: "What is the **worst case** run time of each algorithm or operation? Give each answer in Big-Oh form using the variables in that part.",
  given: [{ id: "c1-tip", title: "Typing tip", kind: "text", body: "Type answers like O(n), O(lg n), O(n lg n), O(k*b^k)\nlg or log both work." }],
  steps: [
    {
      id: "worst",
      kind: "choice",
      title: "Worst case means…",
      prompt: "Before we start: \"worst case\" for a plain BST means what?",
      options: [
        { t: "The input that makes it slowest, like inserting already-sorted data so the tree becomes a line", ok: true, why: "That's why part (a) is O(n) and not O(lg n). Only balanced trees (AVL) guarantee lg n." },
        { t: "The average input", why: "That's average case. Worst case is the nastiest possible input." },
      ],
    },
    ...RUNTIMES.map(([id, prompt, answers, learn]) => ({
      id,
      kind: "type" as const,
      title: `(${id}) ${prompt.split(" ").slice(0, 5).join(" ")}…`,
      pts: 1,
      prompt: `**(${id}) 1 pt.** ${prompt}`,
      answers,
      learn,
      placeholder: "O(...)",
      hints: [{ when: ["n", "lg", "log"], at: "O", say: "Write it in Big-Oh form: start with `O(`." }],
    })),
  ],
  answer: RUNTIMES.map(([id, , a]) => `(${id}) ${a[0]}`).join("\n"),
  takeaway: "Know the classics cold: plain BST worst is O(n), AVL is O(lg n), heapify is O(n), heap sort is O(n lg n).",
};

const C2: Question = {
  id: "C2",
  pts: 5,
  category: "ANL",
  topic: "Algorithm Analysis",
  title: "Scaling an O(n³) algorithm",
  story: "An O(n³) image processing algorithm took **125 milliseconds** to index **n = 400** images. How long would it take to index **640** images, in milliseconds? Show the algebra.",
  given: [{ id: "c2-setup", title: "What we know", kind: "text", body: "T(n) = c · n³\nT(400) = 125 ms\nFind: T(640)" }],
  steps: [
    {
      id: "setup",
      kind: "type",
      title: "Set up for c",
      pts: 1,
      prompt: "**(1 pt).** Plug n = 400 into T(n) = c·n³. Write the equation. (Use `^` for powers.)",
      answers: ["c*400^3=125", "c400^3=125", "c(400^3)=125", "c*(400^3)=125", "125=c*400^3", "T(400)=c*400^3=125"],
      hints: [{ when: "640", say: "640 comes later. First use the run we already know about: n = 400." }],
    },
    {
      id: "c",
      kind: "type",
      title: "Solve for c",
      pts: 1,
      prompt: "**(1 pt).** Solve for c. Leave it as a fraction; no need to simplify yet.",
      answers: ["c=125/400^3", "125/400^3", "c=125/(400^3)", "125/(400^3)"],
      hints: [{ when: "*", say: "Divide both sides by 400³ to get c alone." }],
    },
    {
      id: "plug",
      kind: "type",
      title: "Plug in 640",
      pts: 1,
      prompt: "**(1 pt).** Now write T(640) using that c.",
      answers: ["T(640)=(125/400^3)*640^3", "(125/400^3)*640^3", "125/400^3*640^3", "T(640)=125/400^3*640^3", "125*(640/400)^3", "T(640)=125*(640/400)^3"],
    },
    {
      id: "ratio",
      kind: "choice",
      title: "The friendly ratio",
      prompt: "The trick is `640³/400³ = (640/400)³`. What does 640/400 simplify to?",
      options: [
        { t: "8/5", ok: true, why: "Divide both by 80. So the answer is 125 · (8/5)³ = 125 · 512/125, and the 125s cancel!" },
        { t: "3/2", why: "400 · 3/2 = 600, not 640. Try dividing both by 80." },
        { t: "16/10", why: "That's equal, but not fully reduced. Keep going: 16/10 = 8/5." },
      ],
    },
    {
      id: "final",
      kind: "type",
      title: "Final answer",
      pts: 2,
      prompt: "**(2 pts).** How many milliseconds? Just the number.",
      answers: ["512", "512ms", "512 ms"],
      hints: [
        { when: "125", say: "That's the old time. Multiply by (8/5)³ = 512/125." },
        { when: "200", say: "That's linear scaling (125 · 8/5). This is n³, so cube the ratio." },
      ],
    },
  ],
  answer: "T(400) = c·400³ = 125  →  c = 125/400³\nT(640) = (125/400³)·640³ = 125·(640/400)³ = 125·(8/5)³ = 125·512/125 = 512 ms",
  takeaway: "Scaling problems: solve for c, plug in the new n, and look for a ratio that simplifies before you multiply anything big.",
};

const C3: Question = {
  id: "C3",
  pts: 10,
  category: "ANL",
  topic: "Summations",
  title: "A double sum, factored",
  story: "Find a closed form for the double summation below, in terms of n. Leave it **factored**, in the form (n+a)(n+b)(n+c)/d where a, b, c and d are integers.",
  given: [
    { id: "c3-sum", title: "The summation", kind: "text", body: "  n    i\n  Σ    Σ   j\n i=1  j=1" },
    { id: "c3-formulas", title: "Formulas you know", kind: "text", body: "Σ (i=1..n) i   = n(n+1)/2\nΣ (i=1..n) i²  = n(n+1)(2n+1)/6" },
  ],
  steps: [
    {
      id: "inside-first",
      kind: "choice",
      title: "Where to start",
      prompt: "With a double sum, which part do you work out first?",
      options: [
        { t: "The inner sum, Σ j from 1 to i, treating i as a constant", ok: true, why: "Inside-out, just like nested loops. The inner sum turns into an expression in i." },
        { t: "The outer sum", why: "The outer sum needs to know what it's adding up. Solve the inner one first." },
      ],
    },
    {
      id: "inner",
      kind: "type",
      title: "The inner sum",
      pts: 1,
      prompt: "**(1 pt).** What is Σ j for j = 1 to i? (Write it in terms of i.)",
      answers: ["i(i+1)/2", "(i(i+1))/2", "i*(i+1)/2", "(i^2+i)/2"],
      hints: [{ when: "n", say: "The inner sum stops at **i**, not n. Use the first formula with i in place of n." }],
    },
    {
      id: "split",
      kind: "type",
      title: "Split it",
      pts: 1,
      prompt: "**(1 pt).** i(i+1)/2 = (i² + i)/2. Pull out the ½ and split the outer sum into two sums. Write the result. (Use `sum(i^2)` and `sum(i)` for the sums.)",
      answers: ["1/2(sum(i^2)+sum(i))", "(1/2)(sum(i^2)+sum(i))", "1/2*(sum(i^2)+sum(i))", "(sum(i^2)+sum(i))/2"],
    },
    {
      id: "sq",
      kind: "type",
      title: "Plug in the i² formula",
      pts: 2,
      prompt: "**(2 pts).** What does Σ i² (i = 1 to n) equal?",
      answers: ["n(n+1)(2n+1)/6", "(n(n+1)(2n+1))/6"],
      hints: [{ when: "2", at: "6", say: "The sum of squares divides by 6." }],
    },
    {
      id: "lin",
      kind: "type",
      title: "Plug in the i formula",
      pts: 2,
      prompt: "**(2 pts).** And Σ i (i = 1 to n)?",
      answers: ["n(n+1)/2", "(n(n+1))/2"],
    },
    {
      id: "common",
      kind: "type",
      title: "Pull out n(n+1)",
      pts: 2,
      prompt: "**(2 pts, algebra).** ½[n(n+1)(2n+1)/6 + n(n+1)/2]. Get a common denominator of 12 and factor out n(n+1). What's left inside the brackets?\n\nn(n+1)/12 · [ ? ]",
      answers: ["2n+4", "(2n+1)+3", "2(n+2)"],
      hints: [{ when: "2n+1", at: "+", say: "Close! n(n+1)/2 becomes 3n(n+1)/6 over the same denominator, so add **3** to (2n+1)." }],
    },
    {
      id: "final",
      kind: "type",
      title: "Factored answer",
      pts: 2,
      prompt: "**(2 pts, algebra).** 2n + 4 = 2(n + 2), and the 2 cancels with the 12. Write the final factored answer.",
      answers: ["n(n+1)(n+2)/6", "(n(n+1)(n+2))/6", "n(n+2)(n+1)/6"],
      hints: [{ when: "12", say: "2(n+2)/12 = (n+2)/6. Cancel that 2." }],
    },
  ],
  answer: "Σ Σ j = Σ i(i+1)/2 = ½[Σ i² + Σ i]\n      = ½[n(n+1)(2n+1)/6 + n(n+1)/2]\n      = n(n+1)/12 · [(2n+1) + 3]\n      = n(n+1)/12 · 2(n+2)\n      = n(n+1)(n+2)/6",
  takeaway: "Inner sum first, split by linearity, plug in the formulas, then factor out the common n(n+1) before expanding anything.",
};

// ───────────────────────────── Section D ─────────────────────────────

const D1: Question = {
  id: "D1",
  pts: 10,
  category: "DSN",
  topic: "Recursive Coding",
  title: "Permutations with a max gap",
  story:
    "Count the permutations of size `n` (values 0 through n−1) where every pair of **adjacent values is within `maxgap`** of each other.\n\n`perm` is the permutation built so far, `used[v]` says whether value v is already placed, and `k` is the next empty spot (0-indexed). Unfilled spots hold 0. **No recursion = 0 points.**",
  given: [
    { id: "d1-header", title: "Function header", kind: "code", body: "int kClosePerm(int* perm, int* used, int n, int maxgap, int k) {\n\n}" },
    { id: "d1-pattern", title: "The permutation pattern", kind: "text", body: "for each value i not yet used:\n    skip it if it breaks a rule\n    mark it used, place it at spot k\n    recurse to fill spot k+1\n    unmark it (backtrack)" },
  ],
  scaffold: {
    title: "kClosePerm so far",
    code: "int kClosePerm(int* perm, int* used, int n, int maxgap, int k) {\n    {{base}}\n    int res = 0;\n    for (int i = 0; i < n; i++) {\n        {{skipused}}\n        {{gap}}\n        {{mark}}\n        {{place}}\n        {{recur}}\n        {{unmark}}\n    }\n    return res;\n}",
  },
  steps: [
    {
      id: "k-meaning",
      kind: "choice",
      title: "What is k?",
      prompt: "What does `k` tell us?",
      options: [
        { t: "How many spots are already filled, which is also the index of the next empty spot", ok: true, why: "So when k reaches n, every spot is filled: one complete permutation." },
        { t: "The value we're about to place", why: "The loop variable `i` is the value. `k` is the *position*." },
        { t: "The max gap allowed", why: "That's `maxgap`." },
      ],
    },
    {
      id: "base",
      kind: "type",
      title: "Base case",
      pts: 1,
      prompt: "**(1 pt).** All n spots are filled, and every adjacent pair already passed the gap check. That's one valid permutation. Write the base case.",
      answers: ["if (n == k) return 1;", "if (k == n) return 1;", "if (k >= n) return 1;"],
      hints: [
        { when: "0", at: "1", say: "We just found one complete, valid permutation, so count it: return 1." },
        { when: "=", at: "==", say: "Compare with `==`." },
      ],
    },
    {
      id: "skipused",
      kind: "type",
      title: "Skip used values",
      pts: 1,
      prompt: "**(1 pt).** Inside the loop: if value `i` is already in the permutation, skip it.",
      answers: ["if (used[i]) continue;", "if (used[i] == 1) continue;", "if (used[i] != 0) continue;"],
      hints: [
        { when: "break", at: "continue", say: "`break` would end the whole loop. We just want to skip this one value: `continue`." },
        { when: "perm", say: "`perm` holds the order. `used` is the array that says whether a value is taken." },
      ],
    },
    {
      id: "gap-why",
      kind: "choice",
      title: "The gap check",
      prompt: "We want to put `i` at spot `k`. Which value does it need to be close to?",
      options: [
        { t: "perm[k-1], the value just before it, and only if k > 0", ok: true, why: "The first spot has no left neighbor, so it's always allowed. Check k > 0 **before** reading perm[k-1], or you'd read perm[-1]." },
        { t: "perm[k+1]", why: "Spot k+1 is still empty. We check backward, against the value already placed." },
        { t: "Every value already placed", why: "Only *adjacent* values must be within maxgap." },
      ],
    },
    {
      id: "gap",
      kind: "type",
      title: "Skip if the gap is too big",
      pts: 2,
      prompt: "**(2 pts).** Skip `i` if it's not the first spot and it's more than `maxgap` away from the previous value. (Use `abs`.)",
      answers: [
        "if (k > 0 && abs(perm[k-1] - i) > maxgap) continue;",
        "if (k > 0 && abs(i - perm[k-1]) > maxgap) continue;",
        "if (k != 0 && abs(perm[k-1] - i) > maxgap) continue;",
        "if (k != 0 && abs(i - perm[k-1]) > maxgap) continue;",
      ],
      hints: [
        { when: "||", at: "&&", say: "Both must hold: there IS a previous spot **and** the gap is too big. That's `&&`." },
        { when: ">=", at: ">", say: "A gap equal to maxgap is allowed (\"within\" maxgap). Only skip when it's strictly bigger." },
        { when: "perm[k]", say: "Spot k is still empty. The neighbor is `perm[k-1]`." },
      ],
    },
    {
      id: "mark",
      kind: "type",
      title: "Mark i used",
      pts: 1,
      prompt: "**(1 pt).** `i` passed both checks. Mark it as used.",
      answers: ["used[i] = 1;", "used[i] = true;"],
    },
    {
      id: "place",
      kind: "type",
      title: "Place i at spot k",
      pts: 1,
      prompt: "**(1 pt).** Put `i` into the permutation at spot `k`.",
      answers: ["perm[k] = i;"],
      hints: [{ when: "perm[i]", say: "The **position** is k; the **value** is i. `perm[k] = i`." }],
    },
    {
      id: "recur",
      kind: "type",
      title: "Recurse",
      pts: 3,
      prompt: "**(3 pts).** Count every way to finish from here, and add it to `res`.",
      answers: ["res += kClosePerm(perm, used, n, maxgap, k+1);", "res = res + kClosePerm(perm, used, n, maxgap, k+1);"],
      hints: [
        { when: "k", at: "k+1", say: "Spot k is filled now. The next call fills spot `k+1`." },
        { when: "k++", say: "Don't change k itself, or the backtracking breaks. Pass `k+1`." },
        { when: "return", say: "Returning right away would only count the first branch. Add to `res` and keep looping." },
      ],
    },
    {
      id: "unmark",
      kind: "type",
      title: "Backtrack",
      pts: 1,
      prompt: "**(1 pt).** Undo the choice so the next loop iteration can try a different value here.",
      answers: ["used[i] = 0;", "used[i] = false;"],
      hints: [{ when: "perm", say: "perm[k] gets overwritten by the next try anyway. It's `used[i]` that must be reset." }],
    },
  ],
  answer:
    "int kClosePerm(int* perm, int* used, int n, int maxgap, int k) {\n    if (n == k) return 1;                                   // 1\n    int res = 0;\n    for (int i = 0; i < n; i++) {\n        if (used[i]) continue;                              // 1\n        if (k > 0 && abs(perm[k-1] - i) > maxgap) continue; // 2\n        used[i] = 1;                                        // 1\n        perm[k] = i;                                        // 1\n        res += kClosePerm(perm, used, n, maxgap, k+1);      // 3\n        used[i] = 0;                                        // 1\n    }\n    return res;\n}",
  takeaway: "Permutation template: skip used, skip rule-breakers, mark, place, recurse on k+1, unmark.",
};

const SEL_ROWS = [
  ["13", "11", "9", "16", "12", "15", "10", "5"],
  ["13", "11", "9", "5", "12", "15", "10", "16"],
  ["13", "11", "9", "5", "12", "10", "15", "16"],
  ["10", "11", "9", "5", "12", "13", "15", "16"],
  ["10", "11", "9", "5", "12", "13", "15", "16"],
  ["10", "5", "9", "11", "12", "13", "15", "16"],
  ["9", "5", "10", "11", "12", "13", "15", "16"],
  ["5", "9", "10", "11", "12", "13", "15", "16"],
];
const IDX8 = ["0", "1", "2", "3", "4", "5", "6", "7"];

const D2: Question = {
  id: "D2",
  pts: 5,
  category: "ALG",
  topic: "Sorting",
  title: "Selection Sort, selecting the max",
  story:
    "Show the array after each iteration of **Selection Sort** where each iteration selects the **maximum** of the unsorted part and swaps it into the last unsorted spot. Iterations 1 and 7 are given.",
  given: [
    {
      id: "d2-table",
      title: "Given rows",
      kind: "table",
      table: { head: ["iter", ...IDX8], rows: [["0", ...SEL_ROWS[0]], ["1", ...SEL_ROWS[1]], ["7", ...SEL_ROWS[7]]] },
    },
  ],
  steps: [
    {
      id: "how",
      kind: "choice",
      title: "One iteration",
      prompt: "Iteration 1 turned `13 11 9 16 12 15 10 5` into `13 11 9 5 12 15 10 16`. What happened?",
      options: [
        { t: "The max (16) swapped with whatever was in the last unsorted spot (5)", ok: true, why: "One swap per iteration. Now index 7 is done forever, and the unsorted part is indices 0 to 6." },
        { t: "16 bubbled to the end through several swaps", why: "That's Bubble Sort. Selection Sort finds the max, then does one swap." },
      ],
    },
    ...SEL_ROWS.slice(2, 7).map((row, k) => {
      const it = k + 2;
      return {
        id: "row" + it,
        kind: "slots" as const,
        title: `Iteration ${it}`,
        pts: 1,
        score: "all" as const,
        prompt: `**Iteration ${it} (1 pt, whole row must be right).** The unsorted part is indices 0 to ${8 - it}. Starting from \`${SEL_ROWS[it - 1].join(" ")}\`, show the array after this iteration.`,
        layout: "array" as const,
        index: IDX8,
        slots: row.map((a, i) => ({ id: `r${it}-${i}`, answer: a })),
        ...(it === 4 ? { learn: "The max of indices 0 to 4 is 12, which is already at index 4. It \"swaps with itself\", so the row doesn't change. That still counts as an iteration!" } : {}),
      };
    }),
  ],
  answer: SEL_ROWS.map((r, i) => `${i}: ${r.join("  ")}`).join("\n"),
  takeaway: "Selection Sort does one swap per iteration. A row can stay the same when the max is already in place, and you still write it.",
};

const D3: Question = {
  id: "D3",
  pts: 10,
  category: "DSN",
  topic: "Bitwise Operators",
  title: "Fewest bits on",
  story:
    "Add some positive power of 2 to `x` so the result has **as few 1-bits as possible**. Return that smallest count. Your function must run in O(b) time, where b is the number of bits in an int. (No overflow will happen.)\n\nExample: 76 = 2² + 2³ + 2⁶. Adding 4 gives 80 = 2⁴ + 2⁶, just 2 bits on. Nothing does better.",
  given: [
    { id: "d3-header", title: "Function skeleton", kind: "code", body: "int leastBitsOn(int x) {\n    int numOn = 0;\n    int cur = 0;\n    int longest = 0;\n    for (int i = 0; i < 8 * sizeof(int); i++) {\n\n    }\n\n}" },
    { id: "d3-76", title: "76 in binary", kind: "text", body: "76      = 0 1 0 0 1 1 0 0\n+4      = 0 0 0 0 0 1 0 0\n80      = 0 1 0 1 0 0 0 0\n\nThe run 11 collapsed into a single carried 1." },
  ],
  scaffold: {
    title: "leastBitsOn so far",
    code: "int leastBitsOn(int x) {\n    int numOn = 0, cur = 0, longest = 0;\n    for (int i = 0; i < 8 * sizeof(int); i++) {\n        {{test}}\n            {{cur}}\n            {{num}}\n        }\n        else {\n            {{reset}}\n        }\n        {{longest}}\n    }\n    {{ret}}\n}",
  },
  steps: [
    {
      id: "insight",
      kind: "choice",
      title: "The big secret",
      prompt: "Look at the 76 example. Adding 4 hit the lowest bit of a **run** of 1s (`11`). What happened to that run?",
      options: [
        { t: "The carry wiped out the whole run and left a single 1 just above it", ok: true, why: "A run of L ones plus 1 at its bottom becomes one bit. So you lose L bits and gain 1. Pick the **longest** run to save the most." },
        { t: "It doubled", why: "Look at the binary: `0110 0` + `0010 0` → `1000 0`. The run vanished into one carry bit." },
        { t: "Nothing, the bit count stays the same", why: "76 had 3 bits on, and 80 has only 2. The run collapsed." },
      ],
    },
    {
      id: "formula",
      kind: "choice",
      title: "So the answer is…",
      prompt: "If x has `numOn` bits set and its longest run of 1s has length `longest`, what's the fewest bits on after adding the best power of 2?",
      options: [
        { t: "numOn − longest + 1", ok: true, why: "Remove the longest run, add back the single carried bit. For 76: 3 − 2 + 1 = 2. ✓" },
        { t: "numOn − longest", why: "The carry doesn't vanish. It becomes one new 1-bit above the run." },
        { t: "numOn + 1", why: "That's adding a power of 2 into an empty spot, which only makes things worse." },
      ],
    },
    {
      id: "test",
      kind: "type",
      title: "Is bit i on?",
      pts: 2,
      prompt: "**(2 pts).** Inside the loop, write the `if` header (with its opening brace) that checks whether bit `i` of `x` is on.\n\n*(The key lists 3 pts here, but its own breakdown adds up to 11 for a 10-point question. We count 2 so the total stays 10.)*",
      answers: ["if ((x & (1 << i)) != 0) {", "if (x & (1 << i)) {", "if ((x >> i) & 1) {"],
      hints: [
        { when: "&&", at: "&", say: "`&&` is logical AND. To look at one bit you need **bitwise** AND, a single `&`." },
        { when: "i", at: "1", say: "Build a mask with a single 1 in position i: `1 << i`. Then AND it with x." },
        { when: "|", at: "&", say: "OR *sets* bits. To *test* a bit, use AND." },
      ],
    },
    {
      id: "cur",
      kind: "type",
      title: "Grow the current run",
      pts: 1,
      prompt: "**(1 pt).** The bit is on. Grow the length of the current run.",
      answers: ["cur++;", "++cur;", "cur += 1;", "cur = cur + 1;"],
    },
    {
      id: "num",
      kind: "type",
      title: "Count the bit",
      pts: 1,
      prompt: "**(1 pt).** Also count it toward the total number of 1-bits.",
      answers: ["numOn++;", "++numOn;", "numOn += 1;", "numOn = numOn + 1;"],
    },
    {
      id: "reset",
      kind: "type",
      title: "Run broken",
      pts: 1,
      prompt: "**(1 pt).** In the `else` (bit is off): the current run just ended. Reset it.",
      answers: ["cur = 0;"],
      hints: [{ when: "longest", say: "Don't touch longest here. We only reset the *current* run." }],
    },
    {
      id: "longest",
      kind: "type",
      title: "Track the longest",
      pts: 2,
      prompt: "**(2 pts).** After the if/else, update `longest` if the current run beats it. One line.",
      answers: ["if (longest < cur) longest = cur;", "if (cur > longest) longest = cur;"],
      hints: [{ when: "cur", at: "longest", say: "Assign the other way: `longest = cur`, so longest remembers the best run." }],
    },
    {
      id: "ret",
      kind: "type",
      title: "Return",
      pts: 3,
      prompt: "**(3 pts).** After the loop: remove the longest run and add back the one carried bit.",
      answers: ["return numOn + 1 - longest;", "return numOn - longest + 1;", "return 1 + numOn - longest;"],
      hints: [{ when: ";", at: "+", say: "Don't forget the carried bit: `+ 1`." }],
    },
  ],
  answer:
    "int leastBitsOn(int x) {\n    int numOn = 0, cur = 0, longest = 0;\n    for (int i = 0; i < 8 * sizeof(int); i++) {\n        if ((x & (1 << i)) != 0) {   // bit test\n            cur++;                   // 1\n            numOn++;                 // 1\n        }\n        else {\n            cur = 0;                 // 1\n        }\n        if (longest < cur)           // 2\n            longest = cur;\n    }\n    return numOn + 1 - longest;      // 3\n}",
  takeaway: "Adding 2^k at the bottom of a run of 1s collapses the whole run into one carry bit. Find the longest run.",
};

export const SPRING_2024: Exam = {
  id: "spring2024",
  term: "Spring 2024",
  date: "January 13, 2024",
  blurb: "A triangular sum in a 2D array, pair-swapping lists, single-parent trees, an AVL zig-zag, max-gap permutations, and bit runs.",
  questionsPdf: `${EXAMS_URL}spr2024/FE-Jan24.pdf`,
  solutionsPdf: `${EXAMS_URL}spr2024/FE-Jan24-Sol.pdf`,
  sections: [
    { id: "A", name: "Basic Data Structures", questions: [A1, A2, A3] },
    { id: "B", name: "Advanced Data Structures", questions: [B1, B2, B3] },
    { id: "C", name: "Algorithm Analysis", questions: [C1, C2, C3] },
    { id: "D", name: "Algorithms", questions: [D1, D2, D3] },
  ],
};
