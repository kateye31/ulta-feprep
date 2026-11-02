import type { Exam, Question, TreeSpec } from "@/lib/arcade/types";
import { EXAMS_URL } from "@/lib/sections";
import { loops } from "./fall2026-ab";

// January 17, 2026 Foundation Exam, every question, every rubric point.

// ───────────────────────────── Section A ─────────────────────────────

const KART = `// struct representing an item
typedef struct {
    char itemName[15];
} item_t;

// struct representing a driver
typedef struct {
    char driverName[20];
    item_t *items;
    int itemCount;
} driver_t;`;

const A1: Question = {
  id: "A1",
  pts: 10,
  category: "DSN",
  topic: "Dynamic Memory Management in C",
  title: "Mario Kart item bag",
  story:
    "In Mario Kart, every driver collects items: shells, bananas, mushrooms. Write `addItem`, which stores one newly collected item for a driver. The string inside `newItem` must be copied into **newly allocated memory** inside `driver`. Return 1 if the item was added, 0 otherwise.\n\n• The driver may have no items at first (`itemCount` is 0).\n• Every item name fits in the 15-char array; no length check needed.\n• A driver can hold **at most 3** items. addItem returns 0 if the driver already has 3.",
  given: [
    { id: "a1-structs", title: "The structs: item_t and driver_t", kind: "code", body: KART },
    { id: "a1-header", title: "Function header", kind: "code", body: "int addItem(driver_t *driver, const item_t *newItem) {\n\n}" },
  ],
  scaffold: { title: "addItem so far", code: "int addItem(driver_t *driver, const item_t *newItem) {\n    {{full}}\n        {{reject}}\n\n    {{grow}}\n\n    {{copy}}\n\n    {{count}}\n    {{success}}\n}" },
  steps: [
    {
      id: "itemname",
      kind: "choice",
      title: "What is char itemName[15]?",
      prompt: "Look at `item_t`. What exactly is `char itemName[15]`?",
      options: [
        { t: "An array of 15 chars living inside the struct", ok: true, why: "No malloc needed for the name. It holds up to 14 letters plus the `'\\0'` terminator." },
        { t: "A pointer to a string somewhere else", why: "That would be `char *itemName`. With `[15]` the letters are stored inside the struct." },
        { t: "A single character", why: "A single char would be `char itemName`. The `[15]` makes it an array." },
      ],
    },
    {
      id: "items",
      kind: "choice",
      title: "What is item_t *items?",
      prompt: "Now `driver_t`'s field `item_t *items`. What is it?",
      options: [
        { t: "A pointer to the start of a heap array of item_t", ok: true, why: "The struct only stores the address. The actual items live on the heap, and `items` points at item 0." },
        { t: "An array of items stored inside the struct", why: "That would be `item_t items[3]`. The star makes it a pointer." },
        { t: "One single item", why: "It points at the first of possibly several items, one after another." },
      ],
    },
    {
      id: "count-what",
      kind: "choice",
      title: "What does itemCount tell us?",
      prompt: "A driver has `itemCount == 2`. What does that tell us?",
      options: [
        { t: "There are 2 items (indexes 0 and 1), so the next one goes at index 2", ok: true, why: "The count is also the index of the next free slot. Keep that in mind for the copy line." },
        { t: "The array has room for 15 items", why: "15 is the length of each **name**, not the number of items." },
      ],
    },
    {
      id: "why-pointer",
      kind: "choice",
      title: "Why a pointer?",
      prompt: "Why is `items` a pointer instead of a fixed array?",
      options: [
        { t: "So the block can be resized with realloc as the driver collects items", ok: true, why: "That's the whole question: the bag grows one slot at a time." },
        { t: "Structs can't contain arrays", why: "They can: `itemName[15]` is an array inside a struct." },
      ],
    },
    {
      id: "const",
      kind: "choice",
      title: "What does const promise?",
      prompt: "What does the `const` in `const item_t *newItem` promise?",
      options: [
        { t: "This function won't change the item newItem points at", ok: true, why: "We only read `newItem->itemName` and copy out of it." },
        { t: "newItem can only be read once", why: "const is about not *changing* it. You can read it as often as you like." },
      ],
    },
    {
      id: "full",
      kind: "type",
      title: "Is the bag full?",
      pts: 1,
      prompt: "**(1 pt).** Write the `if` header that catches a driver who already has 3 items. (No body yet.)",
      answers: ["if (driver->itemCount == 3)", "if (driver->itemCount >= 3)"],
      hints: [
        { when: "itemcount", say: "C is case sensitive. The field is spelled `itemCount`, with a capital C." },
        { when: "items", at: "itemCount", say: "You want the **count**, not the array itself." },
      ],
    },
    {
      id: "reject",
      kind: "type",
      title: "Refuse the item",
      pts: 1,
      prompt: "**(1 pt).** The bag is full. What does the function do?",
      answers: ["return 0;"],
      hints: [
        { when: "1", at: "0", say: "1 means \"added\". This driver couldn't take the item." },
        { when: "NULL", say: "The function returns an `int`. A plain number is what's wanted." },
      ],
    },
    {
      id: "grow",
      kind: "type",
      title: "Grow by one slot",
      pts: 3,
      prompt: "**(3 pts).** There's room. Grow the items array by **exactly one** item, and store the new block back in the driver.",
      answers: ["driver->items = realloc(driver->items, sizeof(item_t) * (driver->itemCount + 1));", "driver->items = realloc(driver->items, (driver->itemCount + 1) * sizeof(item_t));"],
      hints: [
        { when: "malloc", at: "realloc", say: "malloc gives fresh memory and forgets the items already collected. Which function **re**sizes and keeps them?" },
        { when: "calloc", at: "realloc", say: "calloc also starts from scratch. You need to keep the old items: **re**alloc." },
        { when: "sizeof", at: "driver", say: "realloc's **first** argument is the old block you're resizing. The size comes second." },
        { when: "driver_t", at: "item_t", say: "Each slot holds one item, so measure `item_t`." },
        { when: ")", at: "+", say: "That's only room for the items already there. You need **one more**: `itemCount + 1`." },
      ],
      learn: "Rubric: 1 pt for the left side and calling realloc, 2 pts for the arguments. realloc also works when `items` starts out NULL.",
    },
    {
      id: "copy",
      kind: "type",
      title: "Copy the name in",
      pts: 3,
      prompt: "**(3 pts).** Copy the new item's name into the slot you just created.",
      answers: ["strcpy(driver->items[driver->itemCount].itemName, newItem->itemName);"],
      hints: [
        { when: "newItem", at: "driver", say: "`strcpy(destination, source)`. The new slot inside driver is the destination." },
        { when: ["strcat", "strcmp", "strlen"], at: "strcpy", say: "strcat appends, strcmp compares, strlen measures. You want to **copy**." },
        { when: "+", at: "]", say: "The count hasn't gone up yet, so the new slot is exactly at index `itemCount`." },
      ],
      learn: "`driver->items[i]` is an item_t *value*, so reach into it with a dot. `newItem` is a pointer, so it uses an arrow.",
    },
    {
      id: "count",
      kind: "type",
      title: "Count it",
      pts: 1,
      prompt: "**(1 pt).** The driver now has one more item. Update the struct.",
      answers: ["driver->itemCount++;", "++driver->itemCount;", "driver->itemCount += 1;", "driver->itemCount = driver->itemCount + 1;"],
      hints: [{ when: "items", at: "itemCount", say: "Don't move the pointer! Add to the **count**." }],
    },
    {
      id: "success",
      kind: "type",
      title: "Report success",
      pts: 1,
      prompt: "**(1 pt).** Report the good news.",
      answers: ["return 1;"],
    },
  ],
  answer:
    "int addItem(driver_t *driver, const item_t *newItem) {\n    if (driver->itemCount == 3)        // 2 (if + return)\n        return 0;\n    driver->items = realloc(driver->items,\n                    sizeof(item_t) * (driver->itemCount + 1));   // 3\n    strcpy(driver->items[driver->itemCount].itemName,\n           newItem->itemName);         // 3\n    driver->itemCount++;               // 1\n    return 1;                          // 1\n}",
  takeaway: "Grow with realloc (store it back!), write at index count, then increment the count.",
};

const MYSTERY = `typedef struct node_s {
    int val;
    struct node_s *next;
} node_t;

node_t *mystery(node_t *head) {
    node_t *second, *rest, *tail;
    if (head == NULL || head->next == NULL)
        return head;
    second = head->next;
    rest = mystery(second->next);
    head->next = rest;
    tail = head;
    while (tail->next != NULL)
        tail = tail->next;
    tail->next = second;
    second->next = NULL;
    return head;
}`;

const A2: Question = {
  id: "A2",
  pts: 5,
  category: "ALG",
  topic: "Linked Lists",
  title: "Mystery list order",
  story: "We call `head = mystery(head);` on the list **1 → 2 → 3 → 4 → 5**. The list still has five nodes afterward. Show the values in their final order.",
  given: [
    { id: "a2-code", title: "The struct and mystery()", kind: "code", body: MYSTERY },
    { id: "a2-list", title: "The starting list", kind: "text", body: "head → 1 → 2 → 3 → 4 → 5" },
  ],
  steps: [
    {
      id: "base",
      kind: "choice",
      title: "When does it stop?",
      prompt: "When does the recursion stop?",
      options: [
        { t: "When the list is empty or has exactly one node", ok: true, why: "`head == NULL || head->next == NULL` covers both. That list is returned untouched." },
        { t: "When the list has two nodes", why: "With two nodes, `head->next` isn't NULL, so it keeps going." },
      ],
    },
    {
      id: "peel",
      kind: "choice",
      title: "What goes into the recursive call?",
      prompt: "On 1 → 2 → 3 → 4 → 5, `second` is node 2 and the call is `mystery(second->next)`. Which sublist goes in?",
      options: [
        { t: "3 → 4 → 5", ok: true, why: "Each level peels off **two** nodes: the head it keeps, and `second`, which it sets aside." },
        { t: "2 → 3 → 4 → 5", why: "It recurses on `second->next`, which skips past node 2." },
      ],
    },
    {
      id: "second-goes",
      kind: "choice",
      title: "Where does second go?",
      prompt: "After the call, `tail` walks to the end, then `tail->next = second; second->next = NULL;`. What happens to `second`?",
      options: [
        { t: "It moves to the very back of the list", ok: true, why: "Every set-aside second node gets hung off the end." },
        { t: "It becomes the new head", why: "The function returns the original `head`. second goes to the tail." },
      ],
    },
    {
      id: "inner",
      kind: "choice",
      title: "Solve the inner call first",
      prompt: "Inner call: `mystery(3 → 4 → 5)` keeps 3, sets 4 aside, recurses on just 5, then hangs 4 at the end. What does it return?",
      options: [
        { t: "3 → 5 → 4", ok: true, why: "Now the outer call attaches that after 1, and hangs 2 at the very end." },
        { t: "3 → 4 → 5", why: "4 was set aside and gets re-attached at the **tail**, after 5." },
      ],
    },
    {
      id: "result",
      kind: "slots",
      title: "The final list",
      pts: 5,
      prompt: "**(5 pts, 1 per slot).** Fill in the list after `head = mystery(head);`.",
      layout: "row",
      score: "each",
      sep: " → ",
      slots: ["1", "3", "5", "4", "2"].map((a, i) => ({ id: "n" + i, answer: a, pts: 1, w: 3, ...(i === 0 ? { label: "head →" } : {}) })),
      learn: "mystery(5) = 5 · mystery(3→4→5) = 3→5→4 · mystery(1→…→5) = 1→3→5→4→2",
    },
  ],
  answer: "head → 1 → 3 → 5 → 4 → 2",
  takeaway: "Recursive list tracing: solve the innermost call first, then work outward.",
};

const A3_EXPR = `7 * (3 + 9) - 4 / 6 + (8 * 2 - (5 + 7)) / 3 - 9 * 4 + 6

A: just after the first minus, before the 4
B: just after the 5, before its plus
C: just after the 4 (in 9 * 4), before the final plus`;

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
        { t: "Straight to the output", ok: true, why: "Numbers never touch the stack, so they come out in their original order." },
        { t: "Onto the stack", why: "Only operators and `(` wait on the stack." },
      ],
    },
    {
      id: "close",
      kind: "choice",
      title: "A closing parenthesis",
      prompt: "You read a `)`. What happens?",
      options: [
        { t: "Pop to the output until the matching (, then throw both away", ok: true, why: "Parentheses never appear in postfix. They only shape the stack." },
        { t: "Pop the whole stack", why: "A `)` only pops down to its own `(`." },
      ],
    },
    {
      id: "prec",
      kind: "choice",
      title: "Precedence",
      prompt: "The incoming operator is `-` and `*` is on top of the stack. What first?",
      options: [
        { t: "Pop the * to the output, then keep checking", ok: true, why: "Anything equal or higher pops before you push." },
        { t: "Push - on top of *", why: "Only push onto something with **lower** precedence." },
      ],
    },
    {
      id: "stackA",
      kind: "slots",
      title: "Stack at A",
      pts: 1,
      score: "all",
      prompt: "**Stack A (1 pt, all or nothing).** After `7 * (3 + 9) -`, fill the stack bottom to top. Leave extra boxes empty.",
      layout: "stacks",
      stacks: [["A", ["a1", "a2", "a3", "a4", "a5"]]],
      slots: [
        { id: "a1", answer: "-" },
        { id: "a2", answer: "" },
        { id: "a3", answer: "" },
        { id: "a4", answer: "" },
        { id: "a5", answer: "" },
      ],
      learn: "The `)` popped the `+`, and the `-` popped the `*`. Output so far: `7 3 9 + *`.",
    },
    {
      id: "stackB",
      kind: "slots",
      title: "Stack at B",
      pts: 2,
      score: "minusEach",
      prompt: "**Stack B (2 pts).** Continue through `4 / 6 + (8 * 2 - (5`. Fill the stack bottom to top.",
      layout: "stacks",
      stacks: [["B", ["b1", "b2", "b3", "b4", "b5"]]],
      slots: [
        { id: "b1", answer: "+" },
        { id: "b2", answer: "(" },
        { id: "b3", answer: "-" },
        { id: "b4", answer: "(" },
        { id: "b5", answer: "" },
      ],
      learn: "`+` popped `/` and the old `-`. Inside the parentheses, `-` popped `*`. Output so far: `7 3 9 + * 4 6 / - 8 2 *`.",
    },
    {
      id: "stackC",
      kind: "slots",
      title: "Stack at C",
      pts: 2,
      score: "minusEach",
      prompt: "**Stack C (2 pts).** Continue through `+ 7)) / 3 - 9 * 4`. Fill the stack bottom to top.",
      layout: "stacks",
      stacks: [["C", ["c1", "c2", "c3", "c4", "c5"]]],
      slots: [
        { id: "c1", answer: "-" },
        { id: "c2", answer: "*" },
        { id: "c3", answer: "" },
        { id: "c4", answer: "" },
        { id: "c5", answer: "" },
      ],
      learn: "Both parentheses closed. The `-` after `/ 3` popped `/` and `+`. Then `*` went on top of it.",
    },
    {
      id: "postfix",
      kind: "type",
      title: "The whole postfix",
      pts: 5,
      penalty: 1,
      prompt: "**(5 pts).** Type the full postfix expression, with spaces between items. (14 numbers, 13 operators.)",
      answers: ["7 3 9 + * 4 6 / - 8 2 * 5 7 + - 3 / + 9 4 * - 6 +"],
      nudge: "Use your three stack snapshots as checkpoints, and empty the stack at the end.",
      hints: [{ when: ["(", ")"], say: "Parentheses never appear in postfix." }],
      learn: "Numbers out of order = automatic 0. Otherwise −1 per operator in the wrong place.",
    },
  ],
  answer: "Stack A (bottom→top): -\nStack B: +  (  -  (\nStack C: -  *\n\nPostfix: 7 3 9 + * 4 6 / - 8 2 * 5 7 + - 3 / + 9 4 * - 6 +",
  takeaway: "Numbers out, ( in, ) pops to (, equal or higher precedence pops before you push.",
};

// ───────────────────────────── Section B ─────────────────────────────

const TREENODE = `typedef struct treenode {
    int data;
    struct treenode *left;
    struct treenode *right;
} treenode;

void printMystery(treenode* root) {
    if (root == NULL)
        return;
    printMystery(root->right);
    printf("%d ", root->data);
    printMystery(root->left);
}`;

const PRINTED: TreeSpec = {
  nodes: [
    { id: "20", x: 50, y: 8, v: "20" }, { id: "63", x: 29, y: 27, v: "63" }, { id: "44", x: 75, y: 27, v: "44" },
    { id: "8", x: 15, y: 45, v: "8" }, { id: "36", x: 42, y: 45, v: "36" }, { id: "19", x: 65, y: 45, v: "19" },
    { id: "51", x: 34, y: 64, v: "51" }, { id: "2", x: 50, y: 64, v: "2" }, { id: "31", x: 73, y: 64, v: "31" },
    { id: "14", x: 43, y: 83, v: "14" },
  ],
  edges: [["20", "63"], ["20", "44"], ["63", "8"], ["63", "36"], ["36", "51"], ["36", "2"], ["2", "14"], ["44", "19"], ["19", "31"]],
};

const B1: Question = {
  id: "B1",
  pts: 10,
  category: "ALG",
  topic: "Binary Trees",
  title: "What does printMystery print?",
  story: "Given the tree in your inventory and the function `printMystery`, what ten numbers are printed when we call `printMystery` on the root?",
  given: [
    { id: "b1-code", title: "The struct and printMystery", kind: "code", body: TREENODE },
    { id: "b1-tree", title: "The tree", kind: "tree", tree: PRINTED },
  ],
  steps: [
    {
      id: "order",
      kind: "choice",
      title: "Which order?",
      prompt: "Look where the `printf` sits and which call comes first. In what order does printMystery handle a node?",
      options: [
        { t: "Right subtree, then the node, then the left subtree (reverse inorder)", ok: true, why: "The printf is between the calls, and the **right** call comes first. Rule: \"right, me, left\"." },
        { t: "Left, node, right (normal inorder)", why: "Look again: `printMystery(root->right)` is called first." },
        { t: "Node, left, right (preorder)", why: "The printf isn't first. It sits between the two calls." },
      ],
    },
    {
      id: "bst",
      kind: "choice",
      title: "Can you just sort?",
      prompt: "On a BST, reverse inorder prints largest to smallest. Is this tree a BST?",
      options: [
        { t: "No (63 is left of 20), so trace the actual links", ok: true, why: "You can't shortcut by sorting. Follow the picture exactly." },
        { t: "Yes, so just sort the values from largest to smallest", why: "63 sits on 20's left, which breaks BST order. Trace it literally." },
      ],
    },
    {
      id: "first",
      kind: "choice",
      title: "What prints first?",
      prompt: "From the root, go right to 44. 44 has no right child. What's printed first?",
      options: [
        { t: "44", ok: true, why: "Its right side is empty, so the call returns right away and 44 prints." },
        { t: "20", why: "The root waits until its whole right subtree is done." },
        { t: "31", why: "31 is in 44's **left** subtree, which comes after 44 itself." },
      ],
    },
    {
      id: "printed",
      kind: "slots",
      title: "All ten numbers",
      pts: 10,
      prompt: "**(10 pts, 1 per slot).** Fill in all ten numbers in printed order.",
      layout: "row",
      score: "each",
      slots: ["44", "31", "19", "20", "2", "14", "36", "51", "63", "8"].map((a, i) => ({ id: "p" + i, answer: a, pts: 1, w: 3 })),
      learn: "44's side: 44, 31, 19. Then 20. Then 63's right subtree (36's side: 2, 14, 36, 51), then 63, then 8.",
    },
  ],
  answer: "44 31 19 20 2 14 36 51 63 8",
  takeaway: "Read the order off the code (where's the printf, which side first), then trace the picture literally.",
};

const HASH_CODE = `f(s, m) = ( value(s[0]) * 27^0
          + value(s[1]) * 27^1
          + ...
          + value(s[n-1]) * 27^(n-1) ) mod m

value('a') = 1, value('b') = 2, ..., value('z') = 26

int f(char* s, int m) {
    int res = 0;
    int pow27 = 1;
    int len = strlen(s);
    for (int i = 0; i < len; i++) {
        // (1) update res
        // (2) update pow27
    }
    return res;
}`;

const B2: Question = {
  id: "B2",
  pts: 5,
  category: "DSN",
  topic: "Hash Tables",
  title: "Rolling base-27 hash",
  story: "Complete the hash function for lowercase strings. Fill in the two missing lines. Everything must be computed under mod, and **calling pow is an automatic zero**.",
  given: [{ id: "b2-code", title: "Formula and skeleton", kind: "code", body: HASH_CODE }],
  scaffold: { title: "The two missing lines", code: "for (int i = 0; i < len; i++) {\n    {{res}}\n    {{power}}\n}" },
  steps: [
    {
      id: "pow27",
      kind: "choice",
      title: "What is pow27?",
      prompt: "On loop pass `i`, what should `pow27` hold?",
      options: [
        { t: "27^i (mod m)", ok: true, why: "It starts at 1 = 27⁰ and gets multiplied by 27 each pass." },
        { t: "The string's length", why: "That's `len`. pow27 is the place value for position i." },
      ],
    },
    {
      id: "letter",
      kind: "choice",
      title: "A letter's value",
      prompt: "What does `s[i] - 'a' + 1` compute?",
      options: [
        { t: "The letter's value: 1 for 'a' through 26 for 'z'", ok: true, why: "`- 'a'` maps a→0, and `+ 1` shifts it to the 1-to-26 scale." },
        { t: "The letter's ASCII code", why: "Subtracting `'a'` turns the ASCII code into a position in the alphabet." },
      ],
    },
    {
      id: "why-mod",
      kind: "choice",
      title: "Why mod every pass?",
      prompt: "Why apply `% m` on every pass instead of once at the end?",
      options: [
        { t: "Mod works with + and ×, so reducing early gives the same answer and keeps the numbers from overflowing", ok: true, why: "27^n blows past int range fast. Reducing as you go keeps everything below m." },
        { t: "It makes the hash more random", why: "The answer is the same either way. It's about avoiding overflow." },
      ],
    },
    {
      id: "res",
      kind: "type",
      title: "Line (1): update res",
      pts: 3,
      prompt: "**(3 pts).** Add this letter's value × `pow27` to `res`, all under mod m.",
      answers: ["res = (res + pow27*(s[i]-'a'+1))%m;", "res = (res + (s[i]-'a'+1)*pow27)%m;"],
      hints: [
        { when: "pow", at: "pow27", say: "Calling `pow` is an automatic zero. Use the `pow27` variable." },
        { when: "27", at: "pow27", say: "Don't multiply by 27 here. `pow27` already holds the right power." },
        { when: "+=", at: "=", say: "Write it as `res = (...) % m;` so the mod covers the whole sum." },
      ],
      learn: "Rubric: 1 pt for times pow27 and adding to res, 1 pt for (s[i] − 'a' + 1), 1 pt for the mod.",
    },
    {
      id: "power",
      kind: "type",
      title: "Line (2): update pow27",
      pts: 2,
      prompt: "**(2 pts).** Move `pow27` to the next power of 27, under mod m.",
      answers: ["pow27 = (pow27*27)%m;", "pow27 = (27*pow27)%m;"],
      hints: [
        { when: "*=", at: "=", say: "Multiplying is right, but you'd lose the mod. Write `pow27 = (pow27*27) % m;`." },
        { when: "+", at: "*", say: "Powers grow by **multiplying**, not adding." },
        { when: "27", at: "m", say: "Mod by `m`, the table size. 27 is what you multiply by." },
      ],
    },
  ],
  answer: "res = (res + pow27*(s[i]-'a'+1)) % m;   // 3\npow27 = (pow27*27) % m;                  // 2",
  takeaway: "Rolling hash: keep a running power instead of calling pow, and mod both lines every pass.",
};

const AVL_START: TreeSpec = {
  nodes: [
    { id: "54", x: 50, y: 5, v: "54" }, { id: "6", x: 28, y: 20, v: "6" }, { id: "76", x: 72, y: 20, v: "76" },
    { id: "3", x: 18, y: 36, v: "3" }, { id: "8", x: 37, y: 36, v: "8" }, { id: "61", x: 63, y: 36, v: "61" }, { id: "85", x: 83, y: 36, v: "85" },
    { id: "4", x: 24, y: 52, v: "4" }, { id: "55", x: 58, y: 52, v: "55" }, { id: "67", x: 68, y: 52, v: "67" }, { id: "79", x: 78, y: 52, v: "79" }, { id: "93", x: 90, y: 52, v: "93" },
    { id: "88", x: 85, y: 68, v: "88" }, { id: "97", x: 96, y: 68, v: "97" },
  ],
  edges: [["54", "6"], ["54", "76"], ["6", "3"], ["6", "8"], ["3", "4"], ["76", "61"], ["76", "85"], ["61", "55"], ["61", "67"], ["85", "79"], ["85", "93"], ["93", "88"], ["93", "97"]],
};

// picture (a): the 4 changed spots are boxes, 76's side is printed (it doesn't move)
const AVL_A: TreeSpec = {
  nodes: [
    { id: "a54", x: 50, y: 5, slot: "a54" }, { id: "a4", x: 27, y: 22, slot: "a4" }, { id: "76", x: 72, y: 22, v: "76" },
    { id: "a3", x: 18, y: 40, slot: "a3" }, { id: "a6", x: 36, y: 40, slot: "a6" }, { id: "61", x: 63, y: 40, v: "61" }, { id: "85", x: 83, y: 40, v: "85" },
    { id: "55", x: 57, y: 58, v: "55" }, { id: "67", x: 68, y: 58, v: "67" }, { id: "79", x: 78, y: 58, v: "79" }, { id: "93", x: 91, y: 58, v: "93" },
    { id: "88", x: 86, y: 76, v: "88" }, { id: "97", x: 96, y: 76, v: "97" },
  ],
  edges: [["a54", "a4"], ["a54", "76"], ["a4", "a3"], ["a4", "a6"], ["76", "61"], ["76", "85"], ["61", "55"], ["61", "67"], ["85", "79"], ["85", "93"], ["93", "88"], ["93", "97"]],
};

// picture (b): every spot is a box
const AVL_B: TreeSpec = {
  nodes: [
    { id: "b76", x: 50, y: 5, slot: "b76" }, { id: "b54", x: 29, y: 23, slot: "b54" }, { id: "b85", x: 73, y: 23, slot: "b85" },
    { id: "b4", x: 18, y: 42, slot: "b4" }, { id: "b61", x: 40, y: 42, slot: "b61" }, { id: "b79", x: 64, y: 42, slot: "b79" }, { id: "b93", x: 85, y: 42, slot: "b93" },
    { id: "b3", x: 12, y: 61, slot: "b3" }, { id: "b6", x: 24, y: 61, slot: "b6" }, { id: "b55", x: 35, y: 61, slot: "b55" }, { id: "b67", x: 46, y: 61, slot: "b67" },
    { id: "b88", x: 80, y: 61, slot: "b88" }, { id: "b97", x: 91, y: 61, slot: "b97" },
  ],
  edges: [["b76", "b54"], ["b76", "b85"], ["b54", "b4"], ["b54", "b61"], ["b4", "b3"], ["b4", "b6"], ["b61", "b55"], ["b61", "b67"], ["b85", "b79"], ["b85", "b93"], ["b93", "b88"], ["b93", "b97"]],
};

const B3: Question = {
  id: "B3",
  pts: 10,
  category: "ALG",
  topic: "AVL Trees",
  title: "Delete 8, rebalance twice",
  story: "Delete **8** from the AVL tree in your inventory. The tree restructures **twice**.\n\n**(a) (5 pts)** Draw the tree right after the first restructuring.\n\n**(b) (5 pts)** Draw the tree at the end, right after the second restructuring.",
  given: [{ id: "b3-start", title: "The AVL tree", kind: "tree", tree: AVL_START }],
  steps: [
    {
      id: "leaf",
      kind: "choice",
      title: "Deleting a leaf",
      prompt: "8 is a leaf. What's the actual deletion step?",
      options: [
        { t: "Just remove it, then walk back up checking balance", ok: true, why: "Leaf deletion is the easy case. The drama happens on the way back up." },
        { t: "Replace it with its inorder predecessor", why: "That's for deleting a node with two children. A leaf just goes." },
      ],
    },
    {
      id: "first-bad",
      kind: "choice",
      title: "First node off balance",
      prompt: "With 8 gone, which node is the first one out of balance as you walk up?",
      options: [
        { t: "6: its left side (3 → 4) is 2 levels deep, its right side is empty", ok: true, why: "Off by 2 at 6. That's the lowest problem node." },
        { t: "54", why: "54 does go bad too, but only **after** we fix 6. Fix the lowest one first." },
        { t: "3", why: "3 has only one child (4). Off by 1 is fine." },
      ],
    },
    {
      id: "first-case",
      kind: "choice",
      title: "Which rotation at 6?",
      prompt: "From 6 we go **left** to 3, then **right** to 4. Which fix applies?",
      options: [
        { t: "Left-right zig-zag: double rotation, and 4 (the middle of 3, 4, 6) goes on top", ok: true, why: "4 rises with 3 on its left and 6 on its right." },
        { t: "Single right rotation, and 3 goes on top", why: "That's for left-left. The path here zig-zags." },
      ],
    },
    {
      id: "pic-a",
      kind: "slots",
      title: "(a) After the first restructure",
      pts: 4,
      score: "each",
      prompt: "**(a) 4 of 5 pts.** Fill in the four spots on the left side. (76's subtree doesn't move.)",
      layout: "tree",
      tree: AVL_A,
      slots: [
        { id: "a54", answer: "54", pts: 1 },
        { id: "a4", answer: "4", pts: 1 },
        { id: "a3", answer: "3", pts: 1 },
        { id: "a6", answer: "6", pts: 1 },
      ],
    },
    {
      id: "rest-a",
      kind: "choice",
      title: "(a) The rest stays put",
      pts: 1,
      prompt: "**(a) last pt.** In picture (a), what happened to 76's subtree?",
      options: [
        { t: "Nothing: 76 with 61 (55, 67) and 85 (79, 93 → 88, 97), exactly as before", ok: true, why: "The first rotation only touched 6's corner of the tree." },
        { t: "It rotated too", why: "Not yet. The second rotation comes next, at the root." },
      ],
    },
    {
      id: "second-bad",
      kind: "choice",
      title: "Keep walking up",
      prompt: "Now the root 54: its left side (4) is 2 levels deep, its right side (76) is 4 levels deep. What's the fix?",
      options: [
        { t: "Right-right: single left rotation, and 76 becomes the root", ok: true, why: "76 rises, 54 drops to its left, and 76's old left child 61 becomes 54's right child." },
        { t: "Right-left double rotation", why: "From 54 the path goes right (76), then right again (85 is the taller side). Straight line = single rotation." },
      ],
    },
    {
      id: "pic-b",
      kind: "slots",
      title: "(b) The final tree",
      pts: 5,
      score: "each",
      prompt: "**(b) 5 pts.** Fill in the whole final tree.",
      layout: "tree",
      tree: AVL_B,
      slots: [
        { id: "b76", answer: "76", pts: 1 },
        { id: "b54", answer: "54", pts: 1 },
        { id: "b85", answer: "85", pts: 1 },
        { id: "b4", answer: "4", pts: 1 / 6 },
        { id: "b61", answer: "61", pts: 1 / 6 },
        { id: "b3", answer: "3", pts: 1 / 6 },
        { id: "b6", answer: "6", pts: 1 / 6 },
        { id: "b55", answer: "55", pts: 1 / 6 },
        { id: "b67", answer: "67", pts: 1 / 6 },
        { id: "b79", answer: "79", pts: 1 / 4 },
        { id: "b93", answer: "93", pts: 1 / 4 },
        { id: "b88", answer: "88", pts: 1 / 4 },
        { id: "b97", answer: "97", pts: 1 / 4 },
      ],
      learn: "Rubric: 1 pt each for 54, 76, 85 in place, 1 pt for everything below 54, 1 pt for everything below 85.",
    },
  ],
  answer:
    "(a)         54                    (b)          76\n          /      \\                         /        \\\n         4        76                     54          85\n        / \\      /   \\                 /    \\       /   \\\n       3   6   61     85              4      61    79    93\n              /  \\   /  \\            / \\    /  \\        /  \\\n            55   67 79   93         3   6  55   67     88   97\n                        /  \\\n                      88    97",
  takeaway: "After a delete, fix the lowest imbalance first, then keep walking up: a second rotation can happen.",
};

// ───────────────────────────── Section C ─────────────────────────────

const C1_CODE = `int f(int* values, int n, int m) {
    if (n == 1) return values[0];
    int left  = f(values, n/2, m-1);
    int right = f(values+n/2, n/2, m-1);
    while (m > 0) {
        if (left > right)
            left--;
        else
            right++;
        m--;
    }
    return 2*(left+right);
}`;

const C1: Question = {
  id: "C1",
  pts: 5,
  category: "ANL",
  topic: "Algorithm Analysis",
  title: "Two-parameter recurrence",
  story: "Let `T(n, m)` be the run time of the function below, in terms of both parameters. Write the recurrence relation it satisfies.",
  given: [{ id: "c1-code", title: "The code", kind: "code", body: C1_CODE }],
  recipe: "recurrence",
  steps: [
    {
      id: "calls",
      kind: "choice",
      title: "Recursive calls",
      prompt: "How many recursive calls are made, and with what arguments?",
      options: [
        { t: "Two calls, each with size n/2 and m − 1", ok: true, why: "One on each half of the array, both passing `m-1`." },
        { t: "Two calls with size n/2 and m", why: "Look at the third argument: both calls pass `m-1`." },
        { t: "One call", why: "There are two: `left` and `right`." },
      ],
    },
    {
      id: "loop",
      kind: "choice",
      title: "The while loop",
      prompt: "How many times does the `while` loop body run?",
      options: [
        { t: "Exactly m times, so O(m)", ok: true, why: "Whichever branch runs, `m--` happens every pass. The array values don't matter." },
        { t: "n times", why: "The loop is controlled by `m`, not `n`." },
        { t: "It depends on the values", why: "The if/else only changes left or right. `m` drops by 1 every time either way." },
      ],
    },
    {
      id: "lhs",
      kind: "type",
      title: "Left side",
      pts: 1,
      prompt: "**(1 pt).** Write the left side of the recurrence (both parameters).",
      answers: ["T(n,m)", "T(n, m)"],
      hints: [{ when: ")", at: ",", say: "Both parameters matter: `T(n, m)`." }],
    },
    {
      id: "rec",
      kind: "type",
      title: "The recursive part",
      pts: 3,
      prompt: "**(3 pts).** Write the recursive part of the right side: how many calls, and what each one's T looks like.",
      answers: ["2T(n/2,m-1)", "2*T(n/2,m-1)"],
      hints: [
        { when: "T", at: "2", say: "There are **two** calls, so put a 2 in front." },
        { when: "m", at: "m-1", say: "Each call passes `m-1`." },
      ],
      learn: "+1 for the 2, +1 for n/2, +1 for m−1.",
    },
    {
      id: "local",
      kind: "type",
      title: "The loop's cost",
      pts: 1,
      prompt: "**(1 pt).** Add the work done outside the calls (the loop). Start with `+`.",
      answers: ["+O(m)", "+Θ(m)", "+m"],
      hints: [{ when: "n", at: "m", say: "The loop runs m times, not n." }],
    },
  ],
  answer: "T(n, m) = 2T(n/2, m−1) + O(m)",
  takeaway: "Recurrence from code: (number of calls) × T(their arguments) + the work outside the calls.",
};

const C2: Question = {
  id: "C2",
  pts: 10,
  category: "ANL",
  topic: "Algorithm Analysis",
  title: "Scaling n²√n, in days",
  story: "An algorithm running in O(n²√n) takes **3 seconds** on an input of size n = 10,000. How many **days** does it take on n = 10⁶? There are 86,400 seconds in a day. Give a fraction in lowest terms.",
  given: [{ id: "c2-setup", title: "What we know", kind: "text", body: "T(n) = c · n² · √n\nT(10^4) = 3 seconds\n1 day = 86,400 seconds\nFind: T(10^6) in DAYS, as a reduced fraction" }],
  steps: [
    {
      id: "power",
      kind: "choice",
      title: "One power of n",
      prompt: "Rewrite n² · √n as one power of n.",
      options: [
        { t: "n^2.5", ok: true, why: "√n = n^0.5, and n² · n^0.5 = n^2.5." },
        { t: "n^3", why: "√n is n to the **half**, so add 0.5, not 1." },
      ],
    },
    {
      id: "setup",
      kind: "type",
      title: "Set up for c",
      pts: 1,
      prompt: "**(1 pt).** Plug n = 10⁴ in. Write the equation using `^` and `sqrt(...)`.",
      answers: ["c*(10^4)^2*sqrt(10^4)=3", "c(10^4)^2sqrt(10^4)=3", "c*10^8*10^2=3", "c*10^10=3", "3=c*(10^4)^2*sqrt(10^4)"],
    },
    {
      id: "c",
      kind: "type",
      title: "Solve for c",
      pts: 3,
      prompt: "**(3 pts).** (10⁴)² = 10⁸ and √(10⁴) = 10², so the product is 10¹⁰. What is c?",
      answers: ["3/10^10", "c=3/10^10", "3/(10^10)"],
      hints: [
        { when: "10^8", say: "Don't forget the √ part: 10⁸ · 10² = 10¹⁰." },
        { when: "*", say: "c is 3 seconds **divided** by 10¹⁰." },
      ],
    },
    {
      id: "plug",
      kind: "type",
      title: "Plug in 10⁶",
      pts: 1,
      prompt: "**(1 pt).** For n = 10⁶: (10⁶)² · √(10⁶) = 10¹² · 10³ = 10¹⁵. Write T(10⁶) with your c.",
      answers: ["T(10^6)=3/10^10*10^15", "3/10^10*10^15", "(3/10^10)*10^15", "T(10^6)=(3/10^10)*10^15", "3*10^5"],
    },
    {
      id: "sec",
      kind: "type",
      title: "Seconds",
      pts: 3,
      prompt: "**(3 pts).** How many **seconds** is that? Just the number.",
      answers: ["300000", "300,000"],
      hints: [
        { when: "3000000", say: "10¹⁵ / 10¹⁰ = 10⁵. Then times 3." },
        { when: "30000", say: "10¹⁵ / 10¹⁰ = 10⁵. Then times 3." },
      ],
    },
    {
      id: "days",
      kind: "type",
      title: "Days, reduced",
      pts: 2,
      prompt: "**(2 pts).** Divide by 86,400 and reduce all the way. Write it as `a/b`.",
      answers: ["125/36"],
      hints: [
        { when: ["3000/864", "375/108", "300000/86400"], say: "Right value, but keep reducing. (Any correct unreduced fraction is worth 1 pt.)" },
        { when: "36/125", say: "Flipped: seconds ÷ seconds-per-day puts the seconds on top." },
      ],
    },
  ],
  answer: "c · 10⁸ · 10² = 3  →  c = 3/10¹⁰ s\nT(10⁶) = (3/10¹⁰) · 10¹² · 10³ = 300,000 s\n300,000 / 86,400 = 3000/864 = 375/108 = 125/36 days",
  takeaway: "Turn roots into powers, solve for c, plug in, then convert units and reduce.",
};

const C3: Question = {
  id: "C3",
  pts: 10,
  category: "ANL",
  topic: "Recurrence Relations",
  title: "Closed form by iteration",
  story: "Find an **exact** closed form (not a Big-Oh bound) for the recurrence below, using the iteration technique.",
  given: [{ id: "c3-rec", title: "The recurrence", kind: "text", body: "T(n) = 3T(n−1) + 3^n    for integers n > 1\nT(1) = 12" }],
  steps: [
    {
      id: "magic",
      kind: "choice",
      title: "The big secret",
      prompt: "When you substitute T(n−1) = 3T(n−2) + 3^(n−1), you get a term 3 · 3^(n−1). What is that?",
      options: [
        { t: "3^n", ok: true, why: "So every substitution adds one more full 3^n. The extra terms just count up." },
        { t: "9^n", why: "3 · 3^(n−1) adds 1 to the exponent: 3^n." },
      ],
    },
    {
      id: "one",
      kind: "type",
      title: "Write T(n−1)",
      pts: 1,
      prompt: "**(1 pt).** Write the recurrence for T(n−1): plug n−1 in for n. Start with `T(n-1)=`.",
      answers: ["T(n-1)=3T(n-2)+3^(n-1)"],
    },
    {
      id: "two",
      kind: "type",
      title: "Second iteration",
      pts: 1,
      prompt: "**(1 pt).** Substitute it in and simplify `3(3T(n−2) + 3^(n−1)) + 3^n` to the form `aT(n-2)+b(3^n)`.",
      answers: ["9T(n-2)+2(3^n)", "9T(n-2)+2*3^n"],
      hints: [
        { when: "3T", at: "9T", say: "3 · 3 = 9 in front of T." },
        { when: "3^(n-1)", say: "3 · 3^(n−1) simplifies to 3^n." },
      ],
    },
    {
      id: "three",
      kind: "type",
      title: "Third iteration",
      pts: 1,
      prompt: "**(1 pt).** One more round. Write it as `aT(n-3)+b(3^n)`.",
      answers: ["27T(n-3)+3(3^n)", "27T(n-3)+3*3^n"],
    },
    {
      id: "general",
      kind: "type",
      title: "After k steps",
      pts: 2,
      prompt: "**(2 pts).** The pattern: 3, 9, 27 in front of T, and 1, 2, 3 copies of 3^n. Write the form after **k** steps.",
      answers: ["3^k*T(n-k)+k*3^n", "3^k*T(n-k)+k(3^n)", "3^k T(n-k)+k(3^n)", "3^k T(n-k)+k*3^n", "3^kT(n-k)+k(3^n)", "3^kT(n-k)+k*3^n"],
      hints: [{ when: "kT", say: "The front number grew 3, 9, 27: that's 3^k, not k." }],
    },
    {
      id: "k",
      kind: "type",
      title: "Pick k",
      pts: 1,
      prompt: "**(1 pt).** Which k lands exactly on T(1)? (Solve n − k = 1.) Write `k=...`.",
      answers: ["k=n-1"],
    },
    {
      id: "plug",
      kind: "type",
      title: "Plug in T(1) = 12",
      pts: 1,
      prompt: "**(1 pt).** Put k = n − 1 and T(1) = 12 into the general form. Write the result (don't simplify yet).",
      answers: ["3^(n-1)*12+(n-1)(3^n)", "12*3^(n-1)+(n-1)(3^n)", "12*3^(n-1)+(n-1)*3^n", "3^(n-1)*12+(n-1)*3^n"],
    },
    {
      id: "final",
      kind: "type",
      title: "Simplify",
      pts: 3,
      prompt: "**(3 pts).** 12 · 3^(n−1) = 4 · 3^n. Combine with (n−1)(3^n) and write the answer as a product.",
      answers: ["(n+3)(3^n)", "(n+3)3^n", "(n+3)*3^n", "n3^n+3^(n+1)", "n*3^n+3^(n+1)"],
      hints: [
        { when: "(n+4)", say: "It's (n − 1) copies plus 4 more copies of 3^n: n + 3." },
        { when: "12", say: "12 · 3^(n−1) = 4 · 3^n. Fold that into the other term." },
      ],
    },
  ],
  answer: "T(n) = 3^k T(n−k) + k·3^n,  k = n−1:\n     = 12·3^(n−1) + (n−1)·3^n\n     = 4·3^n + (n−1)·3^n\n     = (n + 3)·3^n",
  takeaway: "Iterate 3 times, spot the pattern after k steps, choose k to hit the base case, then simplify.",
};

// ───────────────────────────── Section D ─────────────────────────────

const D1: Question = {
  id: "D1",
  pts: 10,
  category: "DSN",
  topic: "Recursive Coding",
  title: "Cheapest way to cut a chocolate bar",
  story:
    "A chocolate bar is `length` inches long and `width` inches wide, and must be cut into 1×1 squares. Each cut splits one bar into two pieces **as close to equal as possible**, and both pieces are then cut recursively.\n\n• A cut that leaves the **length** unchanged costs `length`.\n• A cut that leaves the **width** unchanged costs `2*width`.\n• If one dimension is already 1, only one kind of cut is possible.\n\nReturn the **minimum** total cost to reduce the bar to 1×1 squares.",
  given: [{ id: "d1-header", title: "Function header", kind: "code", body: "int minCutCost(int length, int width) {\n\n}" }],
  scaffold: { title: "minCutCost so far", code: "int minCutCost(int length, int width) {\n    {{base}}\n    {{skinny}}\n\n    {{cutlen}}\n    {{cutwid}}\n\n    {{pick}}\n}" },
  steps: [
    {
      id: "base-idea",
      kind: "choice",
      title: "Base case",
      prompt: "What's the base case?",
      options: [
        { t: "length == 1 && width == 1, cost 0", ok: true, why: "A 1×1 square is done: no cuts, no cost." },
        { t: "length == 0 && width == 0", why: "Bars never shrink to 0. The smallest piece is 1×1." },
      ],
    },
    {
      id: "cost-idea",
      kind: "choice",
      title: "Pricing one cut",
      prompt: "An 8×3 bar is cut so the length stays 8 and the width splits into 1 and 2. What does that cut cost?",
      options: [
        { t: "8", ok: true, why: "The length stayed the same, so the cost is `length` = 8." },
        { t: "6", why: "That's `2*width`, the price of the **other** kind of cut (splitting the length)." },
      ],
    },
    {
      id: "base",
      kind: "type",
      title: "Base case",
      pts: 2,
      prompt: "**(2 pts).** Write the one-line base case for a finished 1×1 square.",
      answers: ["if (length == 1 && width == 1) return 0;", "if (width == 1 && length == 1) return 0;"],
      hints: [{ when: "||", at: "&&", say: "With `||`, a 1×5 bar would return 0, but it still needs cutting. **Both** must be 1." }],
    },
    {
      id: "skinny",
      kind: "type",
      title: "The skinny bars",
      pts: 1,
      prompt: "**(1 pt).** If one dimension is 1, only one kind of cut works. A 1×w strip needs w−1 cuts costing 1 each. An L×1 strip needs L−1 cuts costing 2 each. Write both one-line cases.",
      answers: ["if (length == 1) return width-1;\nif (width == 1) return 2*(length-1);", "if (width == 1) return 2*(length-1);\nif (length == 1) return width-1;"],
      hints: [{ when: "width", at: "width-1", say: "Count the **cuts**, not the squares: a strip of w squares takes w−1 cuts." }],
    },
    {
      id: "cutlen",
      kind: "type",
      title: "Option 1: split the length",
      pts: 2,
      prompt: "**(2 pts).** Split the length as evenly as possible, recurse on both pieces, and add the price of this cut. Store it in a new int called `cutLen`.",
      answers: ["int cutLen = minCutCost(length/2, width) + minCutCost(length-length/2, width) + 2*width;"],
      hints: [
        { when: "length/2", at: "length", say: "For odd lengths, 7/2 = 3, so the other piece is `length - length/2` (= 4), not another length/2." },
        { when: "length", at: "2", say: "Splitting the length leaves the **width** unchanged, so the cut costs `2*width`." },
      ],
    },
    {
      id: "cutwid",
      kind: "type",
      title: "Option 2: split the width",
      pts: 2,
      prompt: "**(2 pts).** Now split the width the same way. Store it in a new int called `cutWid`.",
      answers: ["int cutWid = minCutCost(length, width/2) + minCutCost(length, width-width/2) + length;"],
      hints: [
        { when: "width/2", at: "width", say: "Odd widths: the second piece is `width - width/2`." },
        { when: "2", at: "length", say: "Splitting the width leaves the **length** unchanged, so the cut costs just `length`." },
      ],
    },
    {
      id: "pick",
      kind: "type",
      title: "Pick the cheaper plan",
      pts: 3,
      prompt: "**(3 pts).** Return the smaller of `cutLen` and `cutWid`. Two statements: an if-return, then a return.",
      answers: ["if (cutWid < cutLen) return cutWid;\nreturn cutLen;", "if (cutLen < cutWid) return cutLen;\nreturn cutWid;", "if (cutLen <= cutWid) return cutLen;\nreturn cutWid;"],
      hints: [
        { when: "min", say: "C has no built-in `min` for ints. Write the comparison yourself." },
        { when: ">", at: "<", say: "That returns the more expensive plan. We want the minimum." },
      ],
      learn: "Rubric: 1 pt for the comparison, 1 pt for each return.",
    },
  ],
  answer:
    "int minCutCost(int length, int width) {\n    if (length == 1 && width == 1) return 0;          // 2\n    if (length == 1) return width-1;                  // 1 (both)\n    if (width == 1) return 2*(length-1);\n    int cutLen = minCutCost(length/2, width) +\n                 minCutCost(length-length/2, width) + 2*width;   // 2\n    int cutWid = minCutCost(length, width/2) +\n                 minCutCost(length, width-width/2) + length;     // 2\n    if (cutWid < cutLen) return cutWid;               // 3\n    return cutLen;\n}",
  takeaway: "Try every option recursively, price each one, return the cheapest. Watch odd splits: n − n/2.",
};

export const D2: Question = {
  id: "D2",
  pts: 10,
  category: "DSN",
  topic: "Sorting",
  title: "Recursive Bubble Sort",
  story: "Bubble Sort is usually written with loops, but it's naturally recursive: after one pass over n elements, what's left is the same problem on n − 1 elements. Fill in the function so it sorts the array in **ascending** order.",
  given: [{ id: "d2-header", title: "Function header", kind: "code", body: "void bubbleSortRec(int* array, int n) {\n\n}" }],
  scaffold: { title: "bubbleSortRec so far", code: "void bubbleSortRec(int* array, int n) {\n    {{base}}\n    {{loop}}\n        {{compare}}\n            {{swap}}\n        }\n    }\n    {{recur}}\n}" },
  steps: [
    {
      id: "one-pass",
      kind: "choice",
      title: "What does one pass guarantee?",
      prompt: "What's guaranteed after one full Bubble Sort pass over n elements?",
      options: [
        { t: "The largest element has bubbled to the last position", ok: true, why: "That slot is done forever, so the rest is the same problem on n − 1 elements." },
        { t: "The array is sorted", why: "One pass only places the biggest value." },
        { t: "The smallest element is at the front", why: "Small values move left only one step per pass. It's the biggest that reaches its spot." },
      ],
    },
    {
      id: "base",
      kind: "type",
      title: "Base case",
      pts: 1,
      prompt: "**(1 pt).** A one-element array is already sorted. Stop there.",
      answers: ["if (n == 1) return;", "if (n <= 1) return;"],
      hints: [{ when: "0", at: ";", say: "The function is `void`. A bare `return;`." }],
    },
    {
      id: "loop",
      kind: "type",
      title: "One pass",
      pts: 1,
      prompt: "**(1 pt).** Write the `for` header (with its opening brace) for one pass, using `i`. Think about where it must stop: the body will look at `array[i+1]`.",
      answers: loops(["int i=0"], ["i<n-1"], ["i++", "++i", "i+=1"], ["{"]),
      hints: [{ when: ";", at: "-", say: "If i reaches n−1, `array[i+1]` reads past the end. Stop at `i < n-1`." }],
    },
    {
      id: "compare",
      kind: "type",
      title: "Out of order?",
      pts: 2,
      prompt: "**(2 pts).** Write the `if` header (with its opening brace) that's true when the neighbors are out of order (ascending).",
      answers: ["if (array[i] > array[i+1]) {", "if (array[i+1] < array[i]) {"],
      hints: [
        { when: "<", at: ">", say: "That would sort descending. Swap when the **left** one is bigger." },
        { when: ">=", at: ">", say: "Swapping equal values is wasted work. Use a strict `>`." },
      ],
    },
    {
      id: "swap",
      kind: "type",
      title: "Swap the neighbors",
      pts: 3,
      prompt: "**(3 pts, 1 per line).** Swap `array[i]` and `array[i+1]` using a temporary int called `tmp`. Three lines.",
      answers: ["int tmp = array[i];\narray[i] = array[i+1];\narray[i+1] = tmp;", "int tmp = array[i+1];\narray[i+1] = array[i];\narray[i] = tmp;"],
      hints: [{ when: "array", at: "int", say: "Save one value in `tmp` first, or it's gone the moment you overwrite it." }],
    },
    {
      id: "recur",
      kind: "type",
      title: "Recurse on the rest",
      pts: 3,
      prompt: "**(3 pts).** The last slot is settled. Hand the rest back to the function.",
      answers: ["bubbleSortRec(array, n-1);"],
      hints: [
        { when: "n", at: "n-1", say: "Passing n again never shrinks the problem: infinite recursion." },
        { when: "+", at: ",", say: "The **end** is finished, not the front. The pointer stays put; only n shrinks." },
      ],
    },
  ],
  answer:
    "void bubbleSortRec(int* array, int n) {\n    if (n == 1) return;                       // 1\n    for (int i = 0; i < n-1; i++) {           // 1 (must be n-1)\n        if (array[i] > array[i+1]) {          // 2\n            int tmp = array[i];               // 1\n            array[i] = array[i+1];            // 1\n            array[i+1] = tmp;                 // 1\n        }\n    }\n    bubbleSortRec(array, n-1);                // 3\n}",
  takeaway: "One pass places the max at the end, so recurse on n − 1. Loop to n − 1 because you touch i + 1.",
};

const HEX_TABLE = `0000 = 0    0100 = 4    1000 = 8    1100 = C
0001 = 1    0101 = 5    1001 = 9    1101 = D
0010 = 2    0110 = 6    1010 = A    1110 = E
0011 = 3    0111 = 7    1011 = B    1111 = F`;

const HEX: [string, string, string, string[], string][] = [
  ["a", "10010110", "96", ["96", "0x96"], "1001 = 9, 0110 = 6."],
  ["b", "11001111", "CF", ["CF", "cf", "0xCF"], "1100 = C, 1111 = F."],
  ["c", "101101", "2D", ["2D", "2d", "0x2D"], "Pad to 0010 1101: 2 and D."],
  ["d", "10111101011", "5EB", ["5EB", "5eb", "0x5EB"], "Pad to 0101 1110 1011: 5, E, B."],
  ["e", "100110110100010000", "26D10", ["26D10", "26d10", "0x26D10"], "Pad to 0010 0110 1101 0001 0000: 2, 6, D, 1, 0."],
];

const D3: Question = {
  id: "D3",
  pts: 5,
  category: "ALG",
  topic: "Base Conversion",
  title: "Binary to hex",
  story: "Convert each binary number to base 16 (hexadecimal). Answers only; no work needed.",
  given: [{ id: "d3-table", title: "4 bits → 1 hex digit", kind: "text", body: HEX_TABLE }],
  steps: [
    {
      id: "why4",
      kind: "choice",
      title: "Why groups of 4?",
      prompt: "Why exactly 4 bits per hex digit?",
      options: [
        { t: "4 bits make 16 values, exactly one hex digit", ok: true, why: "2⁴ = 16. So each group of 4 bits is one hex digit, with no arithmetic needed." },
        { t: "Because a byte is 8 bits", why: "A byte is two hex digits, but the reason is 2⁴ = 16." },
      ],
    },
    {
      id: "right",
      kind: "choice",
      title: "Which end do you group from?",
      prompt: "101101 has 6 bits. How do you split it?",
      options: [
        { t: "From the right: 10 | 1101, then pad the left group to 0010", ok: true, why: "Always group from the right and pad the leftmost group with zeros." },
        { t: "From the left: 1011 | 01", why: "Grouping from the left changes the value. Start at the right end." },
      ],
    },
    ...HEX.map(([id, bits, , answers, learn]) => ({
      id,
      kind: "type" as const,
      title: `(${id}) ${bits}`,
      pts: 1,
      prompt: `**(${id}) 1 pt.** Convert \`${bits}\` to hexadecimal.`,
      answers,
      learn,
      placeholder: "hex",
    })),
  ],
  answer: HEX.map(([id, bits, hex]) => `(${id}) ${bits} → ${hex}`).join("\n"),
  takeaway: "Group bits in 4s from the right, pad the left with zeros, convert each group.",
};

export const SPRING_2026: Exam = {
  id: "spring2026",
  term: "Spring 2026",
  date: "January 17, 2026",
  blurb: "Mario Kart items, a mystery list, a printing puzzle, an AVL double-rebalance, recurrences, chocolate bars, and hex.",
  questionsPdf: `${EXAMS_URL}spr2026/FE-Jan26.pdf`,
  solutionsPdf: `${EXAMS_URL}spr2026/FE-Jan26-Sol.pdf`,
  sections: [
    { id: "A", name: "Basic Data Structures", questions: [A1, A2, A3] },
    { id: "B", name: "Advanced Data Structures", questions: [B1, B2, B3] },
    { id: "C", name: "Algorithm Analysis", questions: [C1, C2, C3] },
    { id: "D", name: "Algorithms", questions: [D1, D2, D3] },
  ],
};
