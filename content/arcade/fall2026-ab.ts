import type { Question } from "@/lib/arcade/types";

/** every spelling of a for-loop header we'd accept */
export function loops(init: string[], cond: string[], step: string[], open = [""]) {
  const out: string[] = [];
  for (const a of init) for (const b of cond) for (const c of step) for (const o of open) out.push(`for (${a}; ${b}; ${c})${o}`);
  return out;
}

// ───────────────────────────── Section A ─────────────────────────────

const ENEMY = `typedef struct {
    char *name;
    int id;
    int coins;
} enemy_t;`;

const ENEMY_CODE = `enemy_t* ptr1 = malloc(sizeof(enemy_t));
enemy_t* ptr2 = malloc(sizeof(enemy_t));
ptr1->name = calloc(20, sizeof(char));
scanf("%s%d%d", ptr1->name, &(ptr1->id), &(ptr1->coins));
ptr2->name = ptr1->name;
ptr2->id = ptr1->id+1;
ptr2->coins = ptr1->coins + 10;

// Work with the structs here.`;

export const A1: Question = {
  id: "A1",
  pts: 5,
  category: "DSN",
  topic: "Dynamic Memory Management in C",
  title: "Bowser's enemy roster",
  story:
    "In a Mario adventure game, Bowser keeps track of the enemies guarding a level. Each enemy has a dynamically allocated name, an integer ID, and the number of coins Mario earns for defeating that enemy.\n\nThe code segment allocates some memory dynamically and fills it. (The name read in is 19 or fewer lower case letters.)\n\n**Write the code to free all of the dynamically allocated memory that was allocated in the code segment.** Each statement you write will include either `ptr1` or `ptr2`.",
  given: [
    { id: "a1-struct", title: "The struct: enemy_t", kind: "code", body: ENEMY },
    { id: "a1-code", title: "The code segment", kind: "code", body: ENEMY_CODE },
  ],
  scaffold: { title: "Your free() code", code: "{{free-name}}\n{{free-1}}\n{{free-2}}" },
  steps: [
    {
      id: "name-field",
      kind: "choice",
      title: "What is char *name?",
      prompt: "Look at the struct in your inventory. What exactly is `char *name`?",
      mono: false,
      options: [
        { t: "A pointer to a char. It holds an address, and the actual letters live somewhere else", ok: true, why: "Yes! The struct only stores an *address*. The letters themselves get their own memory later (that's the `calloc` line)." },
        { t: "An array of 20 chars stored inside the struct", why: "That would be `char name[20]`. With a `*` it's just a pointer, so the letters live *outside* the struct." },
        { t: "A single character", why: "A single character would be `char name` with no star. The `*` makes it a pointer." },
      ],
    },
    {
      id: "id-field",
      kind: "choice",
      title: "What about int id and int coins?",
      prompt: "And `int id;` and `int coins;`, where do those numbers live?",
      options: [
        { t: "Right inside the struct's own memory", ok: true, why: "Exactly. They're plain ints, so they live inside the struct's memory and disappear when the struct is freed. They never need their own `free`." },
        { t: "In their own separate malloc'd memory", why: "Only things that got their own `malloc`/`calloc` live separately. These are plain ints, so they're stored inside the struct." },
      ],
    },
    {
      id: "count-allocs",
      kind: "choice",
      title: "Count the allocations",
      prompt: "Go through the code segment line by line. How many times is memory allocated (`malloc` or `calloc`)?",
      options: [
        { t: "2", why: "Count again: `ptr1` gets one, `ptr2` gets one… and there's a `calloc` too." },
        { t: "3", ok: true, why: "Yes: `malloc` for ptr1, `malloc` for ptr2, and `calloc` for ptr1->name. Three allocations." },
        { t: "4", why: "Look at `ptr2->name = ptr1->name;` closely. That line doesn't allocate anything, it just copies a pointer." },
      ],
    },
    {
      id: "shared",
      kind: "choice",
      title: "The sneaky line",
      prompt: "This is the line the whole question is built around:\n\n`ptr2->name = ptr1->name;`\n\nWhat does it do?",
      options: [
        { t: "Copies the ADDRESS, so both structs now point at the SAME string", ok: true, why: "Right! There's only one string in memory, with two pointers aimed at it. So it must be freed exactly once." },
        { t: "Makes a brand-new copy of the string for ptr2", why: "Copying a string needs new memory plus `strcpy`. `=` on pointers only copies the address." },
        { t: "Moves the string from ptr1 to ptr2, so ptr1->name becomes NULL", why: "Nothing changes on ptr1's side. `=` copies the address; both pointers keep it." },
      ],
      learn: "Two pointers, one string. Freeing it through ptr1 *and* ptr2 would be a **double free** (the rubric only gives 3/5 for that).",
    },
    {
      id: "how-many",
      kind: "choice",
      title: "How many frees?",
      prompt: "So how many `free(...)` calls do you need in total?",
      options: [
        { t: "3: one per allocation", ok: true, why: "One `free` for every `malloc`/`calloc`. That's the golden rule." },
        { t: "4: both structs and both names", why: "That frees the shared string twice, which is a double free. On the exam that's 3/5." },
        { t: "2: just the two structs", why: "Then the string is leaked: nobody can reach it anymore. On the exam that's 2/5." },
      ],
    },
    {
      id: "order",
      kind: "choice",
      title: "Which goes first?",
      prompt: "In what order should the frees happen?",
      options: [
        { t: "The name first, then the structs", ok: true, why: "Free inside-out. If you free the struct first, `ptr1->name` lives in memory you've given away, so you can't safely read it anymore." },
        { t: "The structs first, then the name", why: "After `free(ptr1)` you're not allowed to touch `ptr1->name`, because that's reading freed memory. Inside-out!" },
        { t: "It doesn't matter", why: "It matters! Reading a field out of a freed struct is undefined behavior. Free the inside first." },
      ],
    },
    {
      id: "free-name",
      kind: "type",
      title: "Free the name",
      pts: 3,
      penalty: 1,
      prompt: "Type the first line: free the shared name. (Use `ptr1` or `ptr2`, either works.)",
      answers: ["free(ptr1->name);", "free(ptr2->name);"],
      hints: [
        { when: ["delete", "dealloc", "release"], say: "That's not a C word. In C, giving memory back is a function called `free`." },
        { when: "name", at: /^ptr[12]$/, say: "`name` by itself doesn't exist here. It lives *inside* a struct. Which pointer gets you to it?" },
      ],
      nudge: "We're freeing the string that ptr1 (and ptr2) point at.",
    },
    {
      id: "free-1",
      kind: "type",
      title: "Free ptr1",
      pts: 1,
      prompt: "Now free the first struct.",
      answers: ["free(ptr1);"],
      hints: [{ when: "ptr2", say: "We'll get to ptr2 next. Start with ptr1." }],
    },
    {
      id: "free-2",
      kind: "type",
      title: "Free ptr2",
      pts: 1,
      prompt: "And the last one.",
      answers: ["free(ptr2);"],
      hints: [{ when: "name", say: "The name is already freed (it was shared). Just the struct is left." }],
    },
  ],
  answer: "free(ptr1->name);   // or free(ptr2->name), but only ONE of them\nfree(ptr1);\nfree(ptr2);",
  takeaway: "One free per malloc/calloc. Watch for two pointers sharing one block, and free inside-out.",
};

const NODE = `typedef struct node_t {
    int data;
    struct node_t* prev;
    struct node_t* next;
} node_t;`;

export const A2: Question = {
  id: "A2",
  pts: 10,
  category: "DSN",
  topic: "Linked Lists",
  title: "Doubly linked insertFront",
  story:
    "In a doubly linked list, each node has two pointers: one to the previous node in the list and one to the next node in the list.\n\nComplete the function so that it takes in a pointer to the front of a doubly linked list, `listPtr`, and an integer, `value`, and **creates a new node storing value, inserts it into the front of the existing list and returns a pointer to the new front of the list.** (Make sure your code works when inserting into an empty list!)",
  given: [
    { id: "a2-struct", title: "The struct: node_t", kind: "code", body: NODE },
    { id: "a2-header", title: "Function header", kind: "code", body: "node_t* insertFront(node_t* listPtr, int value) {\n\n}" },
  ],
  scaffold: {
    title: "insertFront so far",
    code: "node_t* insertFront(node_t* listPtr, int value) {\n    {{malloc}}\n    {{data}}\n    {{prev}}\n    {{next}}\n\n    {{if}}\n        {{back}}\n\n    {{ret}}\n}",
  },
  steps: [
    {
      id: "ret-type",
      kind: "choice",
      title: "Read the header: return type",
      prompt: "Start with the function header. What does `node_t*` at the very front tell you?",
      options: [
        { t: "The function must return a pointer to a node", ok: true, why: "Yes. Circle it! Whatever happens, we must `return` a node pointer: the new front of the list." },
        { t: "The function takes a node as input", why: "Inputs are inside the parentheses. The type *before* the name is what comes back out." },
        { t: "Nothing, it's just decoration", why: "It's the return type, and the #1 way students lose points is returning the wrong thing." },
      ],
    },
    {
      id: "params",
      kind: "choice",
      title: "Read the header: listPtr",
      prompt: "What is `listPtr`?",
      options: [
        { t: "A pointer to the current FIRST node (or NULL if the list is empty)", ok: true, why: "Right. And the question warns us: it could be `NULL`." },
        { t: "A pointer to the last node", why: "The story says it's the *front* of the list." },
        { t: "The new node we're inserting", why: "We have to *create* the new node ourselves. listPtr is the old front." },
      ],
    },
    {
      id: "plan",
      kind: "choice",
      title: "Make a plan",
      prompt: "Picture the list `[7] ⇄ [3] ⇄ [9]` and we insert 5 at the front. Which pointers need to change?",
      options: [
        { t: "new->next = old front, new->prev = NULL, and old front->prev = new", ok: true, why: "That's the whole recipe. Three links, plus the data." },
        { t: "Only new->next = old front", why: "That's a singly linked list. Here the old front also has a `prev` that should point back at the new node." },
        { t: "We walk to the end of the list first", why: "We're inserting at the *front*. No walking needed: O(1)!" },
      ],
    },
    {
      id: "malloc",
      kind: "type",
      title: "Make the node",
      pts: 3,
      prompt: "Line 1: make a brand-new node on the heap. Call it `newN`.",
      answers: [
        "node_t* newN = malloc(sizeof(node_t));",
        "node_t* newN = (node_t*)malloc(sizeof(node_t));",
        "node_t* newN = malloc(sizeof(*newN));",
        "node_t* newN = calloc(1, sizeof(node_t));",
      ],
      hints: [
        { when: "newN", at: "*", say: "Something's missing between `node_t` and `newN`. `malloc` hands back an *address*, so newN has to be a…?" },
        { when: "node_t", at: "sizeof", say: "`malloc` doesn't take a type directly. It takes a number of *bytes*. Which operator turns a type into a byte count?" },
        { when: ["struct"], say: "There's a `typedef`, so `node_t` alone is the type. No `struct` needed (both work in C, but keep it simple)." },
        { when: "int", at: "node_t", say: "We're allocating a whole *node*, not an int. How big is a node?" },
      ],
      nudge: "Pattern: type* name = malloc(sizeof(type));",
    },
    {
      id: "data",
      kind: "type",
      title: "Store the value",
      pts: 1,
      prompt: "Line 2: put `value` into the new node.",
      answers: ["newN->data = value;", "(*newN).data = value;"],
      hints: [{ when: "listPtr", say: "listPtr is the *old* front. We're filling in the new node." }],
    },
    {
      id: "prev",
      kind: "type",
      title: "Nothing before it",
      pts: 1,
      prompt: "Line 3: the new node will be first. What goes in its `prev`?",
      answers: ["newN->prev = NULL;", "newN->prev = 0;"],
      hints: [{ when: "listPtr", at: "NULL", say: "If newN is the front, is there anything *before* it?" }],
    },
    {
      id: "next",
      kind: "type",
      title: "Link to the old front",
      pts: 1,
      prompt: "Line 4: the new node's `next` should point at…?",
      answers: ["newN->next = listPtr;"],
      hints: [{ when: "NULL", at: "listPtr", say: "If the list *isn't* empty, NULL would lose it! What's after the new node?" }],
    },
    {
      id: "if",
      kind: "type",
      title: "The empty-list check",
      pts: 1,
      prompt: "Now we want to make the old front point *back* at newN. But careful, the question said *“make sure your code works when inserting into an empty list!”* Write the `if` that guards it.",
      answers: ["if (listPtr != NULL)", "if (listPtr)", "if (NULL != listPtr)", "if (listPtr != 0)", "if (listPtr != NULL) {", "if (listPtr) {"],
      hints: [
        { when: "newN", at: "listPtr", say: "newN definitely exists. Which pointer might be NULL?" },
        { when: "==", say: "We want to do the work only when the list is NOT empty." },
      ],
    },
    {
      id: "back",
      kind: "type",
      title: "Point back",
      pts: 2,
      prompt: "Inside the `if`: make the old front's `prev` point at the new node.",
      answers: ["listPtr->prev = newN;", "listPtr->prev = newN; }"],
      hints: [
        { when: "newN", at: "listPtr", say: "We're changing the *old* front's pointer this time." },
        { when: "next", at: "prev", say: "The old front's `next` is fine. It's the *back* link that needs updating." },
      ],
    },
    {
      id: "ret",
      kind: "type",
      title: "Return the new front",
      pts: 1,
      prompt: "Last line. Remember the return type you circled?",
      answers: ["return newN;"],
      hints: [{ when: "listPtr", say: "listPtr is the *old* front now. Who's at the front after inserting?" }],
    },
  ],
  answer:
    "node_t* insertFront(node_t* listPtr, int value) {\n    node_t* newN = malloc(sizeof(node_t));   // 3 pts\n    newN->data = value;                      // 1 pt\n    newN->prev = NULL;                       // 1 pt\n    newN->next = listPtr;                    // 1 pt\n    if (listPtr != NULL)                     // 1 pt\n        listPtr->prev = newN;                // 2 pts\n    return newN;                             // 1 pt\n}",
  takeaway: "Circle the return type, malloc with sizeof(the TYPE), and guard every -> on a pointer that might be NULL.",
};

const INFIX = "1 * (7 - 4) / (5 + 6) + 9 * 2 - 3 / (6 * (4 - 3) ) + 4";

export const A3: Question = {
  id: "A3",
  pts: 10,
  category: "ALG",
  topic: "Stacks",
  title: "Infix → postfix",
  story:
    "Convert the following infix expression to postfix using a stack. **Show the contents of the stack at the indicated points (A, B, and C)** in the infix expression.\n\n• **A** is AFTER the plus operator and BEFORE the value 6.\n• **B** is AFTER the value 6 and BEFORE the multiplication operator.\n• **C** is AFTER the closing parenthesis and BEFORE the plus operator.\n\nThe result has exactly 12 numbers and 11 operators.",
  given: [
    { id: "a3-expr", title: "The expression", kind: "text", body: `${INFIX}\n\nA  after the + in (5 + 6), before the 6\nB  after the second 6, before the *\nC  after the last ), before + 4` },
    { id: "a3-rules", title: "Stack rules card", kind: "text", body: "number → straight to output\n(  → push\n)  → pop to output until (, throw both away\nop → pop while top is an op with ≥ precedence, then push\nend → pop everything\n\n* and / beat + and -" },
  ],
  steps: [
    {
      id: "nums",
      kind: "choice",
      title: "Where do numbers go?",
      prompt: "When the scanner reads a number, what happens to it?",
      options: [
        { t: "It goes straight to the output", ok: true, why: "Yep. Numbers never touch the stack. Only operators and parentheses wait there." },
        { t: "It gets pushed on the stack", why: "The stack is the waiting room for *operators*. Numbers go right out." },
      ],
    },
    {
      id: "close",
      kind: "choice",
      title: "What does ) do?",
      prompt: "You read a `)`. What do you do?",
      options: [
        { t: "Pop operators to the output until you hit '(' and then throw both parentheses away", ok: true, why: "Right, parentheses never appear in postfix." },
        { t: "Push it", why: "A `)` is never pushed. It *triggers* popping back to the matching `(`." },
        { t: "Pop everything on the stack", why: "Only pop back to the matching `(`. Older operators below it stay." },
      ],
    },
    {
      id: "prec",
      kind: "choice",
      title: "Equal precedence",
      prompt: "The stack top is `*` and you read `/`. They're equal precedence. What happens?",
      options: [
        { t: "Pop the * to output, then push /", ok: true, why: "Equal precedence means left-to-right, so the earlier operator leaves first." },
        { t: "Just push / on top of *", why: "Only push directly when the incoming op is *stronger* than the top. Equal means pop first." },
      ],
    },
    {
      id: "warm",
      kind: "slots",
      title: "Warm-up: first chunk",
      prompt: "Let's do the beginning together: `1 * (7 - 4) /`. Fill in the output after the scanner reads the `/` (one number or operator per box).",
      layout: "row",
      slots: [
        { id: "o1", answer: "1" },
        { id: "o2", answer: "7" },
        { id: "o3", answer: "4" },
        { id: "o4", answer: "-" },
        { id: "o5", answer: "*" },
      ],
      learn: "The `)` popped the `-`. Then `/` met `*` (equal precedence) and popped it. The stack now holds just `/`.",
    },
    {
      id: "stackA",
      kind: "slots",
      title: "Stack at A",
      pts: 2,
      score: "minusEach",
      prompt: "Keep going: `( 5 +` and stop at **A** (right before the 6). Fill the stack from the **bottom up**. Leave unused boxes empty.",
      layout: "stacks",
      stacks: [["A", ["a1", "a2", "a3", "a4"]]],
      slots: [
        { id: "a1", answer: "/" },
        { id: "a2", answer: "(" },
        { id: "a3", answer: "+" },
        { id: "a4", answer: "" },
      ],
    },
    {
      id: "stackB",
      kind: "slots",
      title: "Stack at B",
      pts: 2,
      score: "minusEach",
      prompt: "Continue: `6 ) + 9 * 2 - 3 / ( 6` and stop at **B**. Stack from the bottom up?",
      layout: "stacks",
      stacks: [["B", ["b1", "b2", "b3", "b4"]]],
      slots: [
        { id: "b1", answer: "-" },
        { id: "b2", answer: "/" },
        { id: "b3", answer: "(" },
        { id: "b4", answer: "" },
      ],
      learn: "`+` popped the `/`. `-` popped `*` and `+`. Then `/` and `(` went on top of `-`.",
    },
    {
      id: "stackC",
      kind: "slots",
      title: "Stack at C",
      pts: 2,
      score: "minusEach",
      prompt: "Continue: `* ( 4 - 3 ) )` and stop at **C**.",
      layout: "stacks",
      stacks: [["C", ["c1", "c2", "c3", "c4"]]],
      slots: [
        { id: "c1", answer: "-" },
        { id: "c2", answer: "/" },
        { id: "c3", answer: "" },
        { id: "c4", answer: "" },
      ],
    },
    {
      id: "postfix",
      kind: "type",
      title: "The whole postfix",
      pts: 4,
      penalty: 1,
      prompt: "Now type the full postfix expression, with spaces between items (12 numbers, 11 operators).",
      answers: ["1 7 4 - * 5 6 + / 9 2 * + 3 6 4 3 - * / - 4 +"],
      nudge: "Walk the expression again, using your stack snapshots as checkpoints.",
      hints: [{ when: ["(", ")"], say: "Parentheses never show up in postfix: they only guide the popping." }],
    },
  ],
  answer: "Stack A (bottom→top): /  (  +\nStack B: -  /  (\nStack C: -  /\n\nPostfix: 1 7 4 - * 5 6 + / 9 2 * + 3 6 4 3 - * / - 4 +",
  takeaway: "Numbers out, ( in, ) pops to (, equal-or-higher precedence pops before pushing.",
};

// ───────────────────────────── Section B ─────────────────────────────

const BST = {
  nodes: [
    { id: "60", x: 50, y: 10, v: "60" },
    { id: "55", x: 26, y: 32, v: "55" },
    { id: "70", x: 70, y: 32, v: "70" },
    { id: "30", x: 12, y: 56, v: "30" },
    { id: "58", x: 40, y: 56, v: "58" },
    { id: "65", x: 62, y: 56, v: "65" },
    { id: "80", x: 86, y: 56, v: "80" },
    { id: "54", x: 30, y: 82, v: "54" },
    { id: "59", x: 50, y: 82, v: "59" },
  ],
  edges: [["60", "55"], ["60", "70"], ["55", "30"], ["55", "58"], ["70", "65"], ["70", "80"], ["58", "54"], ["58", "59"]] as [string, string][],
};

export const B1: Question = {
  id: "B1",
  pts: 5,
  category: "ALG",
  topic: "Binary Trees",
  title: "Is it really a BST?",
  story: "a) (2 pts) Is this a valid binary search tree? Circle the correct option and **justify your answer**.\n\nb) (3 pts) Write the **pre-order traversal** of the tree.",
  given: [{ id: "b1-tree", title: "The tree", kind: "tree", tree: BST }],
  steps: [
    {
      id: "rule",
      kind: "choice",
      title: "The BST rule",
      prompt: "First, the rule itself. In a binary search tree, for EVERY node…",
      options: [
        { t: "Everything in its LEFT subtree is smaller, everything in its RIGHT subtree is bigger", ok: true, why: "The whole subtree, not just the direct children. That's where the trap usually hides." },
        { t: "Its left child is smaller and its right child is bigger", why: "Close, but it's the *whole subtree*, not just the children. A grandchild can break the rule too." },
      ],
    },
    {
      id: "look55",
      kind: "choice",
      title: "Zoom in on 55",
      prompt: "Look at node **55**. Its right subtree holds 58, 54 and 59. Is every one of those bigger than 55?",
      options: [
        { t: "No: 54 is smaller than 55 but sits in 55's right subtree", ok: true, why: "Found it! 54 < 55, but it's on 55's right side." },
        { t: "Yes, they're all bigger", why: "Check each one: 58 > 55 ✓, 59 > 55 ✓, 54 > 55 …?" },
      ],
    },
    {
      id: "valid",
      kind: "choice",
      title: "Circle one",
      pts: 1,
      prompt: "So, is this a valid binary search tree?",
      options: [
        { t: "i) Yes, this is a binary search tree", why: "The 54 breaks it. Locally 54 < 58 looks fine, but it's still in 55's right subtree." },
        { t: "ii) No, this is not a binary search tree", ok: true, why: "Correct!" },
      ],
    },
    {
      id: "justify",
      kind: "choice",
      title: "Justify it",
      pts: 1,
      prompt: "Pick the justification you'd write on the exam.",
      options: [
        { t: "54 is in the right subtree of 55 (but 54 < 55)", ok: true, why: "That's the official justification, short and specific." },
        { t: "58 has two children", why: "Having two children is totally fine in a BST." },
        { t: "54 is less than 58", why: "54 being 58's *left* child is fine locally. The problem is with 55, higher up." },
        { t: "The tree isn't balanced", why: "BSTs don't have to be balanced. That's an AVL thing." },
      ],
    },
    {
      id: "preorder-rule",
      kind: "choice",
      title: "Pre-order means…",
      prompt: "Part b. What order does a **pre**-order traversal visit things in?",
      options: [
        { t: "Root, then left subtree, then right subtree", ok: true, why: "PRE = the root comes first. (In = middle, post = last.)" },
        { t: "Left subtree, root, right subtree", why: "That's *in*-order: the root is in the middle." },
        { t: "Left subtree, right subtree, root", why: "That's *post*-order: the root comes last." },
      ],
    },
    {
      id: "preorder",
      kind: "type",
      title: "Write the pre-order",
      pts: 3,
      penalty: 1,
      loose: true,
      prompt: "Type the pre-order traversal (commas optional). It doesn't matter that it's not a valid BST, just follow the picture.",
      answers: ["60, 55, 30, 58, 54, 59, 70, 65, 80"],
      nudge: "Say 'me, left, right' at every node, then go down the left side first.",
      hints: [{ when: "30", at: "60", say: "Pre-order starts at the very top: the root comes first." }],
    },
  ],
  answer: "a) ii) No. Justification: 54 is in the right subtree of 55.\nb) 60, 55, 30, 58, 54, 59, 70, 65, 80",
  takeaway: "BST = the WHOLE left subtree is smaller and the WHOLE right subtree is bigger. Check grandchildren!",
};

const HEAP_TABLE = { head: ["index", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], rows: [["A[i]", "42", "17", "8", "23", "4", "15", "30", "2", "19", "11"]] };

export const B2: Question = {
  id: "B2",
  pts: 10,
  category: "ALG",
  topic: "Heaps",
  title: "Heapify a messy array",
  story:
    "You are given an arbitrary array A containing n elements. Convert the array into a **binary min heap** using `heapify()`. The array uses 1-based indexing: `A[0]` is not used, and the elements are in `A[1]` through `A[n]`.\n\na) (5 pts) Perform heapify on the array and show the resulting min heap as an array.\n\nb) (5 pts) Write `heapify()` so that it runs in **O(n)** time, using the provided functions, without modifying them or using an extra array.",
  given: [
    { id: "b2-array", title: "The array (n = 10)", kind: "table", table: HEAP_TABLE },
    { id: "b2-fns", title: "Provided heap functions", kind: "code", body: "void percolateUp(int A[], int index, int size);\nvoid percolateDown(int A[], int index, int size);\nvoid insert(int A[], int *size, int value);\nint deleteMin(int A[], int *size);" },
  ],
  scaffold: { title: "heapify so far", code: "void heapify(int A[], int n) {\n    {{loop}}\n        {{call}}\n}" },
  steps: [
    {
      id: "kids",
      kind: "choice",
      title: "Where are the kids?",
      prompt: "In a 1-indexed heap stored in an array, the children of index `i` are at…",
      options: [
        { t: "2i and 2i + 1", ok: true, why: "And the parent of i is i/2. (That's why A[0] is skipped: the math is cleaner.)" },
        { t: "2i + 1 and 2i + 2", why: "That's the 0-indexed version. This question uses 1-based indexing." },
        { t: "i + 1 and i + 2", why: "Those are just the next neighbors in the array, not the children in the tree." },
      ],
    },
    {
      id: "start",
      kind: "choice",
      title: "Where does heapify start?",
      prompt: "Heapify fixes nodes from the bottom up, starting at the **last node that has a child**. With n = 10, that's index…",
      options: [
        { t: "5 (that's n / 2)", ok: true, why: "Index 5's child is 10. Anything past n/2 is a leaf, and a leaf is already a valid heap of size 1." },
        { t: "10 (the last element)", why: "Index 10 is a leaf. It has no children, so there's nothing to fix." },
        { t: "1 (the root)", why: "Top-down won't work in O(n). We start low and walk *up* to the root." },
      ],
    },
    {
      id: "i5",
      kind: "choice",
      title: "percolateDown(5)",
      prompt: "A[5] = **4**, and its only child A[10] = **11**. What happens?",
      options: [
        { t: "Nothing, because 4 is already smaller than 11", ok: true, why: "In a min heap the parent must be ≤ its children. 4 ≤ 11 ✓" },
        { t: "Swap 4 and 11", why: "That would put the bigger value on top, which is backwards for a *min* heap." },
      ],
    },
    {
      id: "i4",
      kind: "choice",
      title: "percolateDown(4)",
      prompt: "A[4] = **23**, with children A[8] = **2** and A[9] = **19**. What happens?",
      options: [
        { t: "Swap 23 with 2 (the SMALLER child)", ok: true, why: "Always swap with the smaller child so the new parent is ≤ both kids. Index 8 is a leaf, so 23 stops there." },
        { t: "Swap 23 with 19", why: "Then 19 would be the parent of 2, which breaks the min heap. Swap with the *smaller* child." },
        { t: "Nothing", why: "23 > 2, so the parent is bigger than a child. It has to sink." },
      ],
      learn: "Array now: 42 17 8 **2** 4 15 30 **23** 19 11",
    },
    {
      id: "i3",
      kind: "choice",
      title: "percolateDown(3)",
      prompt: "A[3] = **8**, with children A[6] = **15** and A[7] = **30**.",
      options: [
        { t: "Stays put", ok: true, why: "8 is smaller than both. ✓" },
        { t: "Swap with 15", why: "8 < 15 already. No need to move." },
      ],
    },
    {
      id: "i2",
      kind: "choice",
      title: "percolateDown(2)",
      prompt: "A[2] = **17**, with children A[4] = **2** and A[5] = **4**. Where does 17 end up?",
      options: [
        { t: "Index 4: swap with 2, then 17 < 23 and 17 < 19 so it stops", ok: true, why: "17 swaps down once. Its new kids (23 and 19) are bigger, so it stops." },
        { t: "Index 5: swap with 4", why: "Swap with the *smaller* child, and 2 < 4." },
        { t: "Index 8, all the way to the bottom", why: "After one swap, 17's new kids are 23 and 19, both bigger. It stops early." },
      ],
      learn: "Array now: 42 **2** 8 **17** 4 15 30 23 19 11",
    },
    {
      id: "i1",
      kind: "choice",
      title: "percolateDown(1)",
      prompt: "Finally, the root A[1] = **42** sinks. Which path does it take?",
      options: [
        { t: "Index 1 → 2 → 5 → 10 (swapping with 2, then 4, then 11)", ok: true, why: "At each level 42 trades places with the smaller child, until it hits the bottom." },
        { t: "Index 1 → 3 → 6 (swapping with 8, then 15)", why: "At the root, the kids are 2 and 8, and 2 is smaller. Go left." },
        { t: "Index 1 → 2 → 4 → 8", why: "At index 2, the kids are 17 (index 4) and 4 (index 5). Go to the smaller one." },
      ],
    },
    {
      id: "final",
      kind: "slots",
      title: "Final heap (part a)",
      pts: 5,
      score: "floorHalf",
      prompt: "Fill in the final min heap. (Graded like the exam: points = ⌊correct ÷ 2⌋.)",
      layout: "array",
      index: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      slots: ["2", "4", "8", "17", "11", "15", "30", "23", "19", "42"].map((a, i) => ({ id: "h" + (i + 1), answer: a })),
    },
    {
      id: "which-fn",
      kind: "choice",
      title: "Part b: which helper?",
      prompt: "To build the heap in **O(n)**, which provided function should heapify call?",
      options: [
        { t: "percolateDown, on every non-leaf from n/2 down to 1", ok: true, why: "Exactly what you just did by hand! Bottom-up heapify is O(n)." },
        { t: "insert, n times", why: "n inserts is O(n lg n), and it needs a second array. Both are against the rules here." },
        { t: "percolateUp on every index", why: "Sifting up from every index is O(n lg n). Sifting *down* from the middle is the O(n) trick." },
      ],
    },
    {
      id: "loop",
      kind: "type",
      title: "The loop",
      pts: 3,
      penalty: 1,
      prompt: "Write the `for` loop header: start at `n / 2`, go **backwards**, and include index 1. Use `i` as the loop variable.",
      answers: loops(["int i = n / 2", "int i = n/2"], ["i >= 1", "i > 0", "1 <= i", "0 < i"], ["i--", "--i", "i -= 1", "i = i - 1"], ["", " {"]),
      hints: [
        { when: "0", at: "n", say: "We start in the *middle* (the last parent), not at the beginning." },
        { when: "i++", say: "We're walking *backwards*, from n/2 down to 1." },
        { when: "n", at: "1", say: "Does the loop include index 1 (the root)? It has to!" },
      ],
    },
    {
      id: "call",
      kind: "type",
      title: "The call",
      pts: 2,
      penalty: 1,
      prompt: "Inside the loop: call the helper on index `i`.",
      answers: ["percolateDown(A, i, n);", "percolateDown(A, i, n); }"],
      hints: [
        { when: "percolateUp", say: "Up is the O(n lg n) route. We want the helper that *sinks* a value." },
        { when: "1", at: "i", say: "Use the loop variable so each round fixes a different index." },
      ],
    },
  ],
  answer: "a) 2  4  8  17  11  15  30  23  19  42\n\nb) void heapify(int A[], int n) {\n       for (int i = n / 2; i >= 1; i--)\n           percolateDown(A, i, n);\n   }",
  takeaway: "Heapify = percolateDown from n/2 down to 1. Always swap with the SMALLER child (min heap).",
};

const AVL0 = {
  nodes: [
    { id: "50", x: 50, y: 8, v: "50" },
    { id: "25", x: 27, y: 28, v: "25" },
    { id: "75", x: 73, y: 28, v: "75" },
    { id: "10", x: 14, y: 48, v: "10" },
    { id: "30", x: 38, y: 48, v: "30" },
    { id: "60", x: 64, y: 48, v: "60" },
    { id: "80", x: 88, y: 48, v: "80" },
    { id: "5", x: 7, y: 68, v: "5" },
    { id: "15", x: 20, y: 68, v: "15" },
    { id: "28", x: 32, y: 68, v: "28" },
    { id: "35", x: 44, y: 68, v: "35" },
    { id: "70", x: 70, y: 68, v: "70" },
    { id: "3", x: 2, y: 88, v: "3" },
  ],
  edges: [["50", "25"], ["50", "75"], ["25", "10"], ["25", "30"], ["75", "60"], ["75", "80"], ["10", "5"], ["10", "15"], ["30", "28"], ["30", "35"], ["60", "70"], ["5", "3"]] as [string, string][],
};

const AVL1 = {
  nodes: [
    ...AVL0.nodes.filter((n) => ["50", "25", "10", "30", "5", "15", "28", "35", "3"].includes(n.id)),
    { id: "r", x: 73, y: 28, slot: "r" },
    { id: "rl", x: 64, y: 48, slot: "rl" },
    { id: "rr", x: 84, y: 48, slot: "rr" },
  ],
  edges: [["50", "25"], ["50", "r"], ["25", "10"], ["25", "30"], ["r", "rl"], ["r", "rr"], ["10", "5"], ["10", "15"], ["30", "28"], ["30", "35"], ["5", "3"]] as [string, string][],
};

const AVL2 = {
  nodes: [
    { id: "root", x: 50, y: 8, slot: "root" },
    { id: "L", x: 26, y: 28, slot: "L" },
    { id: "R", x: 74, y: 28, slot: "R" },
    { id: "LL", x: 14, y: 48, slot: "LL" },
    { id: "LR", x: 36, y: 48, slot: "LR" },
    { id: "RL", x: 62, y: 48, slot: "RL" },
    { id: "RR", x: 86, y: 48, slot: "RR" },
    { id: "LLL", x: 7, y: 68, slot: "LLL" },
    { id: "RLL", x: 55, y: 68, slot: "RLL" },
    { id: "RLR", x: 69, y: 68, slot: "RLR" },
    { id: "RRL", x: 80, y: 68, slot: "RRL" },
    { id: "RRR", x: 93, y: 68, slot: "RRR" },
  ],
  edges: [["root", "L"], ["root", "R"], ["L", "LL"], ["L", "LR"], ["R", "RL"], ["R", "RR"], ["LL", "LLL"], ["RL", "RLL"], ["RL", "RLR"], ["RR", "RRL"], ["RR", "RRR"]] as [string, string][],
};

export const B3: Question = {
  id: "B3",
  pts: 10,
  category: "ALG",
  topic: "AVL Trees",
  title: "Delete 80 from the AVL tree",
  story:
    "a) (8 pts) Show the updated tree after **deleting the node containing 80**. There are **2 rebalances** in the process. 3 pts are for the picture after the first rebalance, and 5 pts for the final picture.\n\nb) (2 pts) What additional information must be stored with each node in an AVL tree that isn't necessarily stored for a regular binary search tree node?",
  given: [{ id: "b3-tree", title: "The AVL tree", kind: "tree", tree: AVL0 }],
  steps: [
    {
      id: "rule",
      kind: "choice",
      title: "When is a node unbalanced?",
      prompt: "An AVL node is out of balance when the heights of its left and right subtrees differ by more than…",
      options: [
        { t: "1", ok: true, why: "A difference of 0 or 1 is fine. 2 or more means rotate." },
        { t: "0", why: "AVL allows a little lopsidedness: a difference of 1 is OK." },
        { t: "2", why: "A difference of 2 *is* already unbalanced. The limit is 1." },
      ],
    },
    {
      id: "first-bad",
      kind: "choice",
      title: "Who tips over first?",
      prompt: "Delete 80 (it's a leaf, so it just disappears). Now walk back **up** from where 80 was. Which node is the first one out of balance?",
      options: [
        { t: "75: its left side (60 → 70) is 2 levels deep, its right side is now empty", ok: true, why: "2 levels vs 0 levels. That's a difference of 2!" },
        { t: "50", why: "50 will need help too, but we fix from the bottom up. Who's closer to where 80 was?" },
        { t: "60", why: "60 has one child (70): 0 levels vs 1 level. That's fine." },
      ],
    },
    {
      id: "shape",
      kind: "choice",
      title: "Which shape?",
      prompt: "At 75 the extra weight goes 75 → **left** to 60 → **right** to 70. What kind of imbalance is that?",
      options: [
        { t: "Left-Right (a zig-zag), so a double rotation", ok: true, why: "A zig-zag needs a double rotation. The middle value, 70, rises to the top of this little group." },
        { t: "Left-Left (a straight line), so a single rotation", why: "It's not a straight line: from 60 it bends *right* to 70. Zig-zag!" },
        { t: "Right-Right", why: "The heavy side of 75 is its *left*." },
      ],
      learn: "Trick for zig-zags: take the three nodes (75, 60, 70) and put the **middle value** on top: 70, with 60 on its left and 75 on its right.",
    },
    {
      id: "left-same",
      kind: "choice",
      title: "Does the left side move?",
      pts: 1,
      prompt: "During this *first* rebalance, does 50 or anything in its left subtree change?",
      options: [
        { t: "No, they stay exactly where they are", ok: true, why: "The first rotation only touches 75's little corner of the tree." },
        { t: "Yes, everything shifts", why: "A rotation only rearranges the nodes involved. 50 and its left side are untouched (for now)." },
      ],
    },
    {
      id: "pic1",
      kind: "slots",
      title: "Picture after rebalance #1",
      pts: 2,
      score: "all",
      prompt: "Fill in **50's right subtree** after the first rebalance.",
      layout: "tree",
      tree: AVL1,
      slots: [
        { id: "r", answer: "70" },
        { id: "rl", answer: "60" },
        { id: "rr", answer: "75" },
      ],
    },
    {
      id: "check50",
      kind: "choice",
      title: "Walk up again",
      prompt: "Keep walking up. 50's left subtree is **4 levels** deep (25→10→5→3). Its right subtree is **2 levels** deep (70→60). Balanced?",
      options: [
        { t: "No, they differ by 2, so rebalance #2 happens at 50", ok: true, why: "That's the second rebalance the question promised." },
        { t: "Yes, it's fine", why: "4 − 2 = 2, which is more than 1." },
      ],
    },
    {
      id: "rot50",
      kind: "choice",
      title: "Which rotation at 50?",
      prompt: "50 is left-heavy. Its left child 25 is *also* left-heavy (10's side is taller than 30's). So…",
      options: [
        { t: "Left-Left: a single right rotation, and 25 becomes the new root", ok: true, why: "Straight line → single rotation. 25 rises, 50 drops to 25's right." },
        { t: "Left-Right: a double rotation, and 30 becomes the root", why: "It's only a zig-zag if 25's *right* side were taller. Here the left (10, 5, 3) is taller." },
      ],
    },
    {
      id: "orphan",
      kind: "choice",
      title: "The adopted subtree",
      prompt: "When 25 moves up, it already has a right child: **30** (with 28 and 35). And 50 is about to become 25's right child. Where does 30's subtree go?",
      options: [
        { t: "It becomes 50's new LEFT child", ok: true, why: "Everything in 30's subtree is between 25 and 50, so it fits perfectly on 50's left." },
        { t: "It stays as 25's right child", why: "25's right spot is taken by 50 now. 30 needs a new parent." },
        { t: "It becomes 70's left child", why: "30 < 50, so it must stay on 50's left side." },
      ],
    },
    {
      id: "pic2",
      kind: "slots",
      title: "Final picture",
      pts: 5,
      score: "each",
      prompt: "Fill in the **final** tree. (Rubric: 1 pt root, 2 pts left subtree, 2 pts right subtree.)",
      layout: "tree",
      tree: AVL2,
      slots: [
        { id: "root", answer: "25", pts: 1 },
        { id: "L", answer: "10", pts: 0.5 },
        { id: "LL", answer: "5", pts: 0.5 },
        { id: "LR", answer: "15", pts: 0.5 },
        { id: "LLL", answer: "3", pts: 0.5 },
        { id: "R", answer: "50", pts: 0.4 },
        { id: "RL", answer: "30", pts: 0.4 },
        { id: "RR", answer: "70", pts: 0.4 },
        { id: "RLL", answer: "28", pts: 0.2 },
        { id: "RLR", answer: "35", pts: 0.2 },
        { id: "RRL", answer: "60", pts: 0.2 },
        { id: "RRR", answer: "75", pts: 0.2 },
      ],
      learn: "On the real exam you also draw the shape yourself, so practice sketching it once from memory.",
    },
    {
      id: "partb",
      kind: "choice",
      title: "Part b",
      pts: 2,
      prompt: "What extra information must each AVL node store that a plain BST node doesn't need?",
      options: [
        { t: "The node's height", ok: true, why: "Height (distance to the furthest leaf below it). That's how the tree notices imbalance." },
        { t: "The balance factor", why: "Trap! The rubric gives NO credit for 'balance factor'. The balance factor is *computed* from the stored heights." },
        { t: "A pointer to the parent", why: "Handy sometimes, but not what makes a tree an AVL tree." },
        { t: "The number of nodes in its subtree", why: "That's for order-statistic trees, not AVL." },
      ],
    },
  ],
  answer:
    "After rebalance #1: 50 and its left subtree unchanged; 50's right subtree = 70 (60, 75).\n\nFinal tree:\n            25\n         /      \\\n       10        50\n      /  \\      /   \\\n     5   15   30     70\n    /        /  \\   /  \\\n   3        28  35 60  75\n\nb) The node's height.",
  takeaway: "Fix from the deleted spot upward. Zig-zag means double rotation (the middle value rises). Store HEIGHT, not the balance factor.",
};
