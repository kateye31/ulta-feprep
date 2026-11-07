import type { Exam, Question, TreeSpec } from "@/lib/arcade/types";
import { EXAMS_URL } from "@/lib/sections";
import { loops } from "./fall2026-ab";

// August 24, 2024 Foundation Exam, every question, every rubric point.

/** every way of writing `lhs ^= (1 << sh);` that the grader accepts */
const xor = (lhs: string, sh: string) => [`${lhs} ^= (1<<${sh});`, `${lhs} ^= 1<<${sh};`, `${lhs} = ${lhs} ^ (1<<${sh});`];

// ───────────────────────────── Section A ─────────────────────────────

const GAME = `// struct representing video game information
typedef struct {
    char * name;
    int year;
    double price;
} videogame_t;`;

const A1_GIVEN = `videogame_t* getClassicGames(videogame_t * inventory,
                              int n, int* ptrNumGames) {
    videogame_t* res = malloc(n*sizeof(videogame_t));
    int nG = 0;

    // (your code goes here)

    res = realloc(res, nG*sizeof(videogame_t));
    *ptrNumGames = nG;
    return res;
}`;

const IN_80S = (() => {
  const lo = ["inventory[i].year >= 1980", "inventory[i].year > 1979", "1980 <= inventory[i].year"];
  const hi = ["inventory[i].year < 1990", "inventory[i].year <= 1989", "1990 > inventory[i].year"];
  return lo.flatMap((a) => hi.map((b) => `if (${a} && ${b}) {`));
})();

const A1: Question = {
  id: "A1",
  pts: 10,
  category: "DSN",
  topic: "Dynamic Memory Management in C",
  title: "Copy out the 1980s games",
  recipe: "malloc",
  story:
    "The struct `videogame_t` stores information about video games in a store's inventory. As a fan of the 1980s, you want a list of all the games produced **between 1980 and 1989, inclusive**.\n\nWrite `getClassicGames`. It takes an array of `videogame_t`, its length `n`, and a pointer `ptrNumGames`. It returns a **newly dynamically allocated array** holding a copy of every 1980s game, and sets the variable pointed to by `ptrNumGames` to the size of that array.\n\nThe copy must be a **deep copy**: allocate memory for each copied name and copy the name into it.\n\nSome of the function is already written for you (in your inventory). Don't forget to allocate the right amount of space for each string!",
  given: [
    { id: "a1-struct", title: "struct videogame_t", kind: "code", body: GAME },
    { id: "a1-given", title: "What's already written", kind: "code", body: A1_GIVEN },
  ],
  scaffold: {
    title: "getClassicGames so far",
    code: "videogame_t* getClassicGames(videogame_t * inventory, int n, int* ptrNumGames) {\n    videogame_t* res = malloc(n*sizeof(videogame_t));\n    int nG = 0;\n    {{loop}}\n        {{in80s}}\n            {{name}}\n            {{copy}}\n            {{year}}\n            {{price}}\n            {{count}}\n        }\n    }\n    res = realloc(res, nG*sizeof(videogame_t));\n    *ptrNumGames = nG;\n    return res;\n}",
  },
  steps: [
    {
      id: "why-ng",
      kind: "choice",
      title: "Two counters",
      prompt: "The given code makes `res` big enough for all `n` games and starts `nG` at 0. Why do we need `nG` as well as the loop's `i`?",
      options: [
        { t: "i walks every game in the inventory; nG is the next free slot in res, and only moves when we keep a game", ok: true, why: "Yes. Games we skip leave no gaps in res. At the end, nG is also the count, which is why the given code reallocs to nG and stores it." },
        { t: "They're always equal", why: "Only if every game is from the 80s. Skipped games move i but not nG." },
      ],
    },
    {
      id: "loop",
      kind: "type",
      title: "Every game",
      pts: 1,
      prompt: "**(1 pt).** Write the `for` header (with its opening brace) over every game in `inventory`.",
      answers: loops(["int i=0"], ["i<n"], ["i++", "++i", "i+=1"], ["{"]),
    },
    {
      id: "in80s",
      kind: "type",
      title: "From the 80s?",
      pts: 3,
      prompt: "**(3 pts).** Write the `if` header (with its opening brace) that checks game `i` was made from 1980 through 1989, inclusive.",
      answers: IN_80S,
      hints: [
        { when: "->", at: ".", say: "`inventory[i]` is a struct (not a pointer), so use a dot. The key takes off a point for `->` here." },
        { when: "||", at: "&&", say: "The year must be ≥ 1980 **and** before 1990. Both at once means `&&`." },
        { when: "1990", at: "1989", say: "With `<=`, the last year that counts is 1989." },
      ],
    },
    {
      id: "deep",
      kind: "choice",
      title: "Why not res[nG].name = inventory[i].name?",
      prompt: "Why can't we just copy the name pointer?",
      options: [
        { t: "Then both arrays would share one string. The question asks for a deep copy, so each copy needs its own memory", ok: true, why: "Right: malloc room for the letters plus '\\0', then strcpy them in." },
        { t: "It won't compile", why: "It compiles. It's just a shallow copy, which the question rules out." },
      ],
    },
    {
      id: "name",
      kind: "type",
      title: "Room for the name",
      pts: 2,
      prompt: "**(2 pts).** Allocate exactly enough room for game `i`'s name in `res[nG].name`. (Slot `nG`, not `i`!)",
      answers: [
        "res[nG].name = malloc(sizeof(char)*(1+strlen(inventory[i].name)));",
        "res[nG].name = malloc(sizeof(char)*(strlen(inventory[i].name)+1));",
        "res[nG].name = malloc((strlen(inventory[i].name)+1)*sizeof(char));",
        "res[nG].name = malloc(strlen(inventory[i].name)+1);",
        "res[nG].name = malloc(1+strlen(inventory[i].name));",
      ],
      hints: [
        { when: "i", at: "nG", say: "The copy goes in the next free slot of res, which is `nG`, not `i`." },
        { when: ")", at: "+", say: "strlen doesn't count the '\\0'. Add 1 (the key takes off a point without it)." },
      ],
    },
    {
      id: "copy",
      kind: "type",
      title: "Copy the letters",
      pts: 1,
      prompt: "**(1 pt).** Copy the name in. (Using `=` here gets no credit.)",
      answers: ["strcpy(res[nG].name, inventory[i].name);"],
    },
    { id: "year", kind: "type", title: "Copy the year", pts: 1, prompt: "**(1 pt).** Copy the year.", answers: ["res[nG].year = inventory[i].year;"] },
    { id: "price", kind: "type", title: "Copy the price", pts: 1, prompt: "**(1 pt).** Copy the price.", answers: ["res[nG].price = inventory[i].price;"] },
    {
      id: "count",
      kind: "type",
      title: "Next free slot",
      pts: 1,
      prompt: "**(1 pt).** We kept a game: move `nG` to the next free slot.",
      answers: ["nG++;", "++nG;", "nG += 1;", "nG = nG + 1;"],
    },
  ],
  answer:
    "videogame_t* getClassicGames(videogame_t * inventory, int n, int* ptrNumGames) {\n    videogame_t* res = malloc(n*sizeof(videogame_t));\n    int nG = 0;\n    for (int i=0; i<n; i++) {                                         // 1\n        if (inventory[i].year >= 1980 && inventory[i].year < 1990) {  // 3\n            res[nG].name = malloc(sizeof(char)*(1+strlen(inventory[i].name))); // 2\n            strcpy(res[nG].name, inventory[i].name);                  // 1\n            res[nG].year = inventory[i].year;                         // 1\n            res[nG].price = inventory[i].price;                       // 1\n            nG++;                                                     // 1\n        }\n    }\n    res = realloc(res, nG*sizeof(videogame_t));\n    *ptrNumGames = nG;\n    return res;\n}",
  takeaway: "Filtering into a new array: one index walks the input, another (nG) fills the output. Deep copy = malloc strlen + 1, then strcpy.",
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
  title: "Flip the halves",
  story:
    "Complete `flipHalf`. It takes the head of a singly linked list and the number of nodes `n`, and moves the **first half** of the nodes to the **back** of the list while the second half moves up to the front. Return the new head.\n\nWrite it **iteratively, with NO recursion**. You may assume the list has an **even** number of elements and is not empty.",
  given: [
    { id: "a2-struct", title: "struct node_s", kind: "code", body: NODE_T },
    { id: "a2-pic", title: "The scenario", kind: "text", body: "Before:  1 → 2 → 3 → 4 → NIL\nAfter:   3 → 4 → 1 → 2 → NIL" },
    { id: "a2-header", title: "Function header", kind: "code", body: "node_t * flipHalf(node_t * head, int n) {\n\n}" },
  ],
  scaffold: {
    title: "flipHalf so far",
    code: "node_t * flipHalf(node_t * head, int n) {\n    {{end}}\n    {{walk}}\n        {{step}}\n    {{front}}\n    {{cut}}\n    {{tmp}}\n    {{walk2}}\n        {{step2}}\n    {{join}}\n    {{ret}}\n}",
  },
  steps: [
    {
      id: "plan",
      kind: "choice",
      title: "The plan",
      prompt: "In the picture, which arrows change?",
      options: [
        { t: "2's next becomes NIL (it's the new tail), and 4's next becomes 1 (the old head)", ok: true, why: "Yes. So we need: the last node of the first half (2), the first node of the second half (3, the new front), and the very last node (4)." },
        { t: "Every node's arrow reverses", why: "That's reversing a list. Here each half keeps its own order: 3 → 4 and 1 → 2." },
      ],
    },
    { id: "end", kind: "type", title: "Start a walker", pts: 1, prompt: "**(1 pt, part of finding the halves).** Make a pointer `end` that starts at `head`. It will stop on the last node of the first half.", answers: ["node_t* end = head;"] },
    {
      id: "how-far",
      kind: "choice",
      title: "How many hops?",
      prompt: "The first half has n/2 nodes. Starting **on** the first node, how many hops reach the **last** node of the first half?",
      options: [
        { t: "n/2 − 1", ok: true, why: "With n = 4: half is 2 nodes, and one hop takes you from 1 to 2." },
        { t: "n/2", why: "That lands on the first node of the *second* half (3), one too far." },
        { t: "n − 1", why: "That walks to the very end of the list." },
      ],
    },
    {
      id: "walk",
      kind: "type",
      title: "Hop n/2 − 1 times",
      pts: 2,
      prompt: "**(2 pts).** Write the `for` header (no brace) that runs n/2 − 1 times.",
      answers: loops(["int i=0"], ["i<n/2-1", "i<(n/2)-1", "i<n/2 - 1"], ["i++", "++i", "i+=1"]),
      hints: [{ when: "<=", at: "<", say: "Starting at 0 with `<` runs exactly n/2 − 1 times." }],
    },
    { id: "step", kind: "type", title: "Hop", pts: 1, prompt: "**(1 pt).** Loop body: move `end` forward.", answers: ["end = end->next;"] },
    { id: "front", kind: "type", title: "The new front", pts: 1, prompt: "**(1 pt).** The node after `end` starts the second half. Save it in a new pointer `newfront`.", answers: ["node_t* newfront = end->next;"] },
    {
      id: "cut",
      kind: "type",
      title: "Cut the first half off",
      pts: 1,
      prompt: "**(1 pt).** `end` will be the new tail. End the list there.",
      answers: ["end->next = NULL;"],
      hints: [{ when: "end", at: "NULL", say: "Set `end->next`, not end itself: we're cutting the arrow *out of* end." }],
    },
    { id: "tmp", kind: "type", title: "Another walker", pts: 0, prompt: "Make a pointer `tmp` starting at `newfront`. It will find the last node of the original list.", answers: ["node_t* tmp = newfront;"] },
    {
      id: "walk2",
      kind: "type",
      title: "Walk to the end",
      pts: 1,
      prompt: "**(1 pt, part of the 2 for reaching the end).** Write the `while` header (no brace) that stops when `tmp` is the last node.",
      answers: ["while (tmp->next != NULL)", "while (tmp->next)", "while (NULL != tmp->next)"],
      hints: [{ when: "tmp", at: "->", say: "`while (tmp != NULL)` walks off the end. Stop *on* the last node: check `tmp->next`." }],
    },
    { id: "step2", kind: "type", title: "Step", pts: 1, prompt: "**(1 pt).** Loop body: move `tmp` forward.", answers: ["tmp = tmp->next;"] },
    { id: "join", kind: "type", title: "Old end → old head", pts: 1, prompt: "**(1 pt).** Link the last node to the old head.", answers: ["tmp->next = head;"] },
    { id: "ret", kind: "type", title: "Return", pts: 1, prompt: "**(1 pt).** Return the new front.", answers: ["return newfront;"] },
  ],
  answer:
    "node_t * flipHalf(node_t * head, int n) {\n    node_t* end = head;\n    for (int i=0; i<n/2-1; i++)\n        end = end->next;\n    node_t* newfront = end->next;     // 5 pts for finding both halves\n    end->next = NULL;                 // 1\n    node_t* tmp = newfront;\n    while (tmp->next != NULL)         // 2\n        tmp = tmp->next;\n    tmp->next = head;                 // 1\n    return newfront;                  // 1\n}",
  takeaway: "Rotating a list: find the cut point, NULL-terminate the new tail, walk to the old tail, and link it to the old head.",
};

const QUEUE = `typedef struct node_s {
    char * hero;
    struct node_s * next;
} node_t;

typedef struct {
    node_t * front;
    node_t * back;
    int size;
} queue_t;

void enqueue(queue_t * heroqueue, char * hero);
char * dequeue(queue_t * heroqueue);

void followQueue(queue_t * heroqueue) {
    enqueue(heroqueue, "Hawkeye");
    enqueue(heroqueue, "Thor");
    enqueue(heroqueue, "Spider-Man");
    dequeue(heroqueue);
    enqueue(heroqueue, "Wanda");
    enqueue(heroqueue, "Vision");          // A
    enqueue(heroqueue, "Ms. Marvel");
    enqueue(heroqueue, "Dr. Strange");
    dequeue(heroqueue);
    dequeue(heroqueue);
    enqueue(heroqueue, "Loki");
    enqueue(heroqueue, "Captain Marvel");
    dequeue(heroqueue);
    dequeue(heroqueue);                    // B
    enqueue(heroqueue, "Iron Man");
    dequeue(heroqueue);                    // C
}`;

const H = {
  thor: ["Thor"],
  spidey: ["Spider-Man", "Spiderman", "Spider Man"],
  wanda: ["Wanda"],
  vision: ["Vision"],
  ms: ["Ms. Marvel", "Ms Marvel"],
  dr: ["Dr. Strange", "Dr Strange"],
  loki: ["Loki"],
  cap: ["Captain Marvel"],
  iron: ["Iron Man", "Ironman"],
};
const QIDX = ["front", "2nd", "3rd", "rear"];
const qSlots = (who: string[][], pts: number) => who.map((answer, i) => ({ id: `s${i}`, answer, pts, w: 13 }));

const A3: Question = {
  id: "A3",
  pts: 5,
  category: "ALG",
  topic: "Queues",
  title: "The superhero queue",
  story:
    "The C code in your inventory runs a FIFO queue of superheroes (stored as strings). Show the contents of the queue at each commented point **A**, **B** and **C**.\n\nThere are exactly the right number of boxes for each state, but in between, the queue may hold more than 4 heroes.",
  given: [{ id: "a3-code", title: "The queue code", kind: "code", body: QUEUE }],
  steps: [
    {
      id: "fifo",
      kind: "choice",
      title: "Which end?",
      prompt: "In a FIFO queue, `enqueue` adds at the ____ and `dequeue` removes from the ____.",
      options: [
        { t: "back; front", ok: true, why: "First in, first out: like a line at a coffee shop. New people join the back, the front gets served." },
        { t: "front; front", why: "That's a stack (last in, first out)." },
        { t: "back; back", why: "That's a stack too, just upside down." },
      ],
    },
    {
      id: "A",
      kind: "slots",
      title: "At point A",
      pts: 2,
      score: "each",
      prompt: "**(2 pts).** Trace to `// A`. Hawkeye, Thor, Spider-Man join; one dequeue removes the front; Wanda and Vision join. Front to rear:",
      layout: "array",
      index: QIDX,
      slots: qSlots([H.thor, H.spidey, H.wanda, H.vision], 0.5),
    },
    {
      id: "B",
      kind: "slots",
      title: "At point B",
      pts: 2,
      score: "each",
      prompt: "**(2 pts).** Keep going to `// B`. (The queue grows to 6 at one point. Write it out on scratch paper.)",
      layout: "array",
      index: QIDX,
      slots: qSlots([H.ms, H.dr, H.loki, H.cap], 0.5),
    },
    {
      id: "C",
      kind: "slots",
      title: "At point C",
      pts: 1,
      score: "each",
      prompt: "**(1 pt).** And finally `// C`.",
      layout: "array",
      index: QIDX,
      slots: qSlots([H.dr, H.loki, H.cap, H.iron], 0.25),
    },
  ],
  answer: "A: Thor, Spider-Man, Wanda, Vision\nB: Ms. Marvel, Dr. Strange, Loki, Captain Marvel\nC: Dr. Strange, Loki, Captain Marvel, Iron Man\n(front first, rear last)",
  takeaway: "Queue traces: keep one running line on paper. Enqueue writes on the right, dequeue crosses out the leftmost.",
};

// ───────────────────────────── Section B ─────────────────────────────

const MYSTERY = `struct treenode {
    int data;
    struct treenode *left;
    struct treenode *right;
};

int mystery (struct treenode* root) {
    if (root == NULL)
        return 0;
    if (root->data % 2 == 0) {
        struct treenode* temp = root->left;
        root->left = root->right;
        root->right = temp;
    }
    return 5 + mystery(root->left) + mystery(root->right);
}`;

const B1_START: TreeSpec = {
  nodes: [
    { id: "13", x: 50, y: 8, v: "13" },
    { id: "4", x: 28, y: 30, v: "4" },
    { id: "25", x: 72, y: 30, v: "25" },
    { id: "3", x: 14, y: 52, v: "3" },
    { id: "8", x: 40, y: 52, v: "8" },
    { id: "20", x: 62, y: 52, v: "20" },
    { id: "30", x: 88, y: 52, v: "30" },
    { id: "2", x: 6, y: 74, v: "2" },
    { id: "5", x: 34, y: 74, v: "5" },
    { id: "15", x: 56, y: 74, v: "15" },
  ],
  edges: [["13", "4"], ["13", "25"], ["4", "3"], ["4", "8"], ["25", "20"], ["25", "30"], ["3", "2"], ["8", "5"], ["20", "15"]],
};

const B1_AFTER: TreeSpec = {
  nodes: [
    { id: "root", x: 50, y: 8, slot: "root" },
    { id: "L", x: 28, y: 30, slot: "L" },
    { id: "R", x: 72, y: 30, slot: "R" },
    { id: "LL", x: 12, y: 52, slot: "LL" },
    { id: "LR", x: 42, y: 52, slot: "LR" },
    { id: "RL", x: 62, y: 52, slot: "RL" },
    { id: "RR", x: 88, y: 52, slot: "RR" },
    { id: "LLR", x: 21, y: 74, slot: "LLR" },
    { id: "LRL", x: 34, y: 74, slot: "LRL" },
    { id: "RLR", x: 70, y: 74, slot: "RLR" },
  ],
  edges: [["root", "L"], ["root", "R"], ["L", "LL"], ["L", "LR"], ["R", "RL"], ["R", "RR"], ["LL", "LLR"], ["LR", "LRL"], ["RL", "RLR"]],
};

const B1: Question = {
  id: "B1",
  pts: 10,
  category: "DSN",
  topic: "Binary Trees",
  title: "The child-swapping mystery",
  recipe: "tree-trace",
  story: "Consider the `mystery` function in your inventory, which uses a typical binary tree node.\n\n**a)** Redraw the tree after `mystery` is called on its root, **and**\n\n**b)** give the value the function returns.",
  given: [
    { id: "b1-code", title: "struct treenode and mystery", kind: "code", body: MYSTERY },
    { id: "b1-tree", title: "The tree", kind: "tree", tree: B1_START },
  ],
  steps: [
    {
      id: "does",
      kind: "choice",
      title: "What does it do?",
      prompt: "Read `mystery` one node at a time. What happens at a node with an **even** value?",
      options: [
        { t: "Its left and right children swap places (whole subtrees move with them)", ok: true, why: "temp holds the old left, left takes the right, right takes temp. Then it recurses into both (new) children." },
        { t: "The node is deleted", why: "Nothing is freed or removed: only the left/right pointers swap." },
        { t: "Its value changes", why: "`data` is only read, never written." },
      ],
    },
    {
      id: "which",
      kind: "choice",
      title: "Which swaps matter?",
      prompt: "The even values are 4, 8, 20, 2 and 30. Which of those swaps actually **change** the picture?",
      options: [
        { t: "4, 8 and 20: 2 and 30 are leaves, so they swap NULL with NULL", ok: true, why: "So: 4's children flip (8 left, 3 right), 8's child 5 moves to its right, and 20's child 15 moves to its right." },
        { t: "All five", why: "Swapping two NULLs leaves a leaf looking exactly the same." },
        { t: "Only 4", why: "8 and 20 also have one child each, and swapping moves that child to the other side." },
      ],
    },
    {
      id: "a",
      kind: "slots",
      title: "(a) Redraw",
      pts: 8,
      score: "each",
      prompt: "**(a) 8 pts.** Fill in the tree after `mystery` runs.",
      layout: "tree",
      tree: B1_AFTER,
      slots: [
        { id: "root", answer: "13", pts: 0.5 },
        { id: "L", answer: "4", pts: 0.5 },
        { id: "R", answer: "25", pts: 0.5 },
        { id: "RR", answer: "30", pts: 0.5 },
        { id: "LL", answer: "8", pts: 1 },
        { id: "LLR", answer: "5", pts: 1 },
        { id: "LR", answer: "3", pts: 1 },
        { id: "LRL", answer: "2", pts: 1 },
        { id: "RL", answer: "20", pts: 1 },
        { id: "RLR", answer: "15", pts: 1 },
      ],
      learn: "Rubric: 1 pt for the exact spot of each of the 6 nodes that moved (8, 5, 3, 2, 20, 15) and ½ pt for each of the other 4, rounded down.",
    },
    {
      id: "b",
      kind: "type",
      title: "(b) Return value",
      pts: 2,
      prompt: "**(b) 2 pts.** Every non-NULL node adds 5, and NULL adds 0. What does `mystery` return? (Count the nodes.)",
      answers: ["50"],
      hints: [{ when: ["45", "55"], say: "Count again: 13, 4, 25, 8, 3, 20, 30, 5, 2, 15. That's 10 nodes." }],
    },
  ],
  answer: "a)            13\n          /      \\\n         4        25\n       /   \\     /   \\\n      8     3   20    30\n       \\   /      \\\n        5 2        15\nb) 50  (10 nodes × 5)",
  takeaway: "Trace tree functions node by node: what happens here, then recurse. 'return k + f(left) + f(right)' just counts nodes × k.",
};

const B2: Question = {
  id: "B2",
  pts: 5,
  category: "ALG",
  topic: "Hash Tables",
  title: "A hash function with two outputs",
  story:
    "**a) (3 pts)** A hash table of size 10 uses **linear probing** and the hash function **f(x) = (5x + 4) % 10**. Insert 3, 9, 2, 1, 10 and 6, in that order. Show where each value ends up.\n\n**b) (2 pts)** Why is this a particularly bad hash function?",
  given: [{ id: "b2-rule", title: "Linear probing", kind: "text", body: "Try index f(x). Taken? Try f(x)+1, then +2, …\nwrapping from 9 back to 0." }],
  steps: [
    {
      id: "hashes",
      kind: "slots",
      title: "Hash every value",
      pts: 0,
      score: "all",
      prompt: "Warm-up. Work out f(x) = (5x + 4) % 10 for each value.",
      layout: "row",
      slots: [
        { id: "h3", label: "f(3) =", answer: "9", w: 3 },
        { id: "h9", label: "f(9) =", answer: "9", w: 3 },
        { id: "h2", label: "f(2) =", answer: "4", w: 3 },
        { id: "h1", label: "f(1) =", answer: "9", w: 3 },
        { id: "h10", label: "f(10) =", answer: "4", w: 3 },
        { id: "h6", label: "f(6) =", answer: "4", w: 3 },
      ],
      learn: "Every hash is 4 or 9. Spot that now: it's part (b).",
    },
    {
      id: "a",
      kind: "slots",
      title: "(a) Fill the table",
      pts: 3,
      score: "each",
      prompt: "**(a) 3 pts.** Insert 3, 9, 2, 1, 10, 6 in order, probing forward on collisions (9 wraps to 0). Leave empty slots blank.",
      layout: "array",
      index: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      slots: [
        { id: "i0", answer: "9", pts: 0.5 },
        { id: "i1", answer: "1", pts: 0.5 },
        { id: "i2", answer: "", pts: 0 },
        { id: "i3", answer: "", pts: 0 },
        { id: "i4", answer: "2", pts: 0.5 },
        { id: "i5", answer: "10", pts: 0.5 },
        { id: "i6", answer: "6", pts: 0.5 },
        { id: "i7", answer: "", pts: 0 },
        { id: "i8", answer: "", pts: 0 },
        { id: "i9", answer: "3", pts: 0.5 },
      ],
      learn: "3 → 9. 9 → 9 taken, wrap to 0. 2 → 4. 1 → 9, 0 taken → 1. 10 → 4 taken → 5. 6 → 4, 5 taken → 6.",
    },
    {
      id: "b",
      kind: "choice",
      title: "(b) Why it's bad",
      pts: 2,
      prompt: "**(b) 2 pts.** What makes f(x) = (5x + 4) % 10 so bad?",
      options: [
        { t: "5x + 4 always ends in 4 or 9, so only 2 of the 10 slots can ever be a hash value", ok: true, why: "A good hash function gives every index an equal chance. Here 8 of the 10 indexes have probability 0, so everything piles up and probes." },
        { t: "It's too slow to compute", why: "It's one multiply, one add and one mod: very fast. The problem is *where* it sends values." },
        { t: "It can return negative indexes", why: "For non-negative x it can't. The problem is that it only ever returns 4 or 9." },
      ],
    },
  ],
  answer: "Index: 0  1  2  3  4  5   6  7  8  9\nValue: 9  1  .  .  2  10  6  .  .  3\n\nb) 5x + 4 always ends in 4 or 9, so the function only ever outputs 4 or 9. A good hash function spreads values evenly over all 10 indexes.",
  takeaway: "Before probing, hash every value first. If they all land on a few indexes, that's the 'why is it bad' answer.",
};

const AVL_ANSWER: TreeSpec = {
  nodes: [
    { id: "a5", x: 48, y: 6, slot: "a5" },
    { id: "a2", x: 22, y: 26, slot: "a2" },
    { id: "a8", x: 72, y: 26, slot: "a8" },
    { id: "a1", x: 10, y: 46, slot: "a1" },
    { id: "a3", x: 32, y: 46, slot: "a3" },
    { id: "a6", x: 58, y: 46, slot: "a6" },
    { id: "a10", x: 84, y: 46, slot: "a10" },
    { id: "a4", x: 40, y: 66, slot: "a4" },
    { id: "a7", x: 65, y: 66, slot: "a7" },
    { id: "a9", x: 76, y: 66, slot: "a9" },
    { id: "a11", x: 92, y: 66, slot: "a11" },
    { id: "a12", x: 98, y: 86, slot: "a12" },
  ],
  edges: [["a5", "a2"], ["a5", "a8"], ["a2", "a1"], ["a2", "a3"], ["a3", "a4"], ["a8", "a6"], ["a8", "a10"], ["a6", "a7"], ["a10", "a9"], ["a10", "a11"], ["a11", "a12"]],
};

const B3: Question = {
  id: "B3",
  pts: 10,
  category: "ALG",
  topic: "AVL Trees",
  title: "The lopsided 12-node AVL tree",
  story:
    "There is a **unique** AVL tree of **height 4** with **12 nodes** storing the integers 1 through 12, such that for every non-leaf node, the **left subtree is strictly shorter** than the right subtree.\n\n**(a) (7 pts)** Draw this AVL tree.\n\n**(b) (3 pts)** Explain how you built it.",
  given: [{ id: "b3-rule", title: "Heights", kind: "text", body: "A single node has height 0.\nAn empty tree has height −1.\nAVL: at every node, the two subtree heights differ by at most 1." }],
  steps: [
    {
      id: "minimal",
      kind: "choice",
      title: "(b) Why it's forced",
      pts: 1,
      prompt: "**(b) 1 pt.** \"Left strictly shorter\" at every non-leaf node, in an AVL tree, means the left is exactly **one** shorter. What kind of tree does that build?",
      options: [
        { t: "The AVL tree with the fewest possible nodes for its height: every node is as lopsided as AVL allows", ok: true, why: "Each subtree is itself a minimal AVL tree, one level shorter on the left. That's what makes the shape unique." },
        { t: "A perfectly balanced tree", why: "Balanced means equal heights. Here the left is always shorter." },
      ],
    },
    {
      id: "counts",
      kind: "slots",
      title: "(b) Count the nodes",
      pts: 1,
      score: "all",
      prompt: "**(b) 1 pt.** Min nodes N(h) for height h: N(h) = 1 + N(h−1) + N(h−2), with N(0) = 1 and N(1) = 2. Fill in the rest.",
      layout: "row",
      slots: [
        { id: "n2", label: "N(2) =", answer: "4", w: 3 },
        { id: "n3", label: "N(3) =", answer: "7", w: 3 },
        { id: "n4", label: "N(4) =", answer: "12", w: 3 },
      ],
      learn: "N(4) = 12, exactly the node count in the question. That confirms the tree is a minimal AVL tree.",
    },
    {
      id: "root",
      kind: "choice",
      title: "(b) Which value is the root?",
      pts: 1,
      prompt: "**(b) 1 pt.** The root's left subtree has height 2 (one less than the right's 3), so it holds N(2) = 4 nodes. In a BST, which value sits at the root?",
      options: [
        { t: "5: four smaller values (1–4) go left", ok: true, why: "Then the right subtree holds 6–12 (7 nodes, height 3). Apply the same logic inside each subtree." },
        { t: "6", why: "That would put 5 values on the left, but the left subtree only has 4 nodes." },
        { t: "7, the middle", why: "The middle would be right for a balanced tree. This one is lopsided: only 4 nodes on the left." },
      ],
    },
    {
      id: "a",
      kind: "slots",
      title: "(a) Draw the tree",
      pts: 7,
      score: "each",
      prompt: "**(a) 7 pts.** Fill in 1–12. Same logic in every subtree: the left side gets N(h−2) nodes, the right side N(h−1).\n\n*(Hint: under 5, the right subtree's root is 8, since its left holds N(1) = 2 values: 6 and 7.)*",
      layout: "tree",
      tree: AVL_ANSWER,
      slots: [
        { id: "a5", answer: "5", pts: 2 },
        { id: "a2", answer: "2", pts: 3 / 8 },
        { id: "a1", answer: "1", pts: 3 / 8 },
        { id: "a3", answer: "3", pts: 3 / 8 },
        { id: "a4", answer: "4", pts: 3 / 8 },
        { id: "a8", answer: "8", pts: 1.5 },
        { id: "a6", answer: "6", pts: 0.5 },
        { id: "a7", answer: "7", pts: 0.5 },
        { id: "a10", answer: "10", pts: 0.25 },
        { id: "a9", answer: "9", pts: 0.25 },
        { id: "a11", answer: "11", pts: 0.25 },
        { id: "a12", answer: "12", pts: 0.25 },
      ],
      learn: "Rubric: 1 valid AVL tree, 1 all 12 values, 1 root 5, 1 left subtree, 3 for the right (1 for 8, 1 for 8's left, 1 for 8's right). The game spreads those over the boxes.",
    },
  ],
  answer: "            5\n         /     \\\n        2        8\n       / \\     /   \\\n      1   3   6     10\n           \\   \\   /  \\\n            4   7 9    11\n                         \\\n                          12\n\nb) Minimal AVL trees: N(0)=1, N(1)=2, N(2)=4, N(3)=7, N(4)=12. The left of the root has height 2 → 4 nodes → root is 5. Repeat inside each subtree.",
  takeaway: "Minimum nodes in an AVL tree: N(h) = 1 + N(h−1) + N(h−2), starting 1, 2, 4, 7, 12, 20.",
};

// ───────────────────────────── Section C ─────────────────────────────

const HYBRID = `Sort n² integers like this:
1. Separate the n² integers into n groups of n integers each.
2. Create heaps out of each of the n groups.
3. Call delete min on each of the n heaps, storing the n deleted
   values in a linked list, along with which heap each came from.
4. Repeat n² times:
   a. Loop through the linked list to find the minimum integer x,
      noting the heap H it came from.
   b. Place x next in the sorted list and delete it from the linked list.
   c. If H isn't empty, delete the minimum item from H and add it to
      the end of the linked list (noting it came from H).`;

const C1: Question = {
  id: "C1",
  pts: 10,
  category: "ANL",
  topic: "Algorithm Analysis",
  title: "A hybrid heap sort",
  recipe: "code-runtime",
  story:
    "Sorting n² integers with insertion sort takes O(n⁴). A single heap sort takes O(n² lg n). Consider the **hybrid** approach in your inventory and, **with proof**, find its worst-case run time in terms of n. Assume efficient heap and linked list operations. Leave the answer in Big-Oh notation.",
  given: [{ id: "c1-steps", title: "The hybrid approach", kind: "text", body: HYBRID }],
  steps: [
    {
      id: "s1",
      kind: "choice",
      title: "Step 1",
      prompt: "Warm-up. Step 1 splits n² integers into groups. How long does that take?",
      options: [
        { t: "O(n²): each integer is handled once", ok: true, why: "Touching each of the n² numbers once is O(n²)." },
        { t: "O(n)", why: "There are n² numbers to place, not n." },
      ],
    },
    {
      id: "s2",
      kind: "choice",
      title: "Step 2",
      pts: 2,
      prompt: "**(2 pts).** Step 2 makes n heaps of n integers each. What's the total?",
      options: [
        { t: "O(n²): heapify on n items is O(n), done n times", ok: true, why: "Bottom-up heapify is linear. (Inserting one by one would be O(n² lg n), which the key also accepts.)" },
        { t: "O(n)", why: "Each heap alone costs O(n), and there are n heaps." },
        { t: "O(n³)", why: "Each heap costs O(n), not O(n²). n × O(n) = O(n²)." },
      ],
    },
    {
      id: "delmin",
      kind: "choice",
      title: "Each delete-min",
      pts: 1,
      prompt: "**(1 pt).** Steps 3 and 4c call delete-min. Each heap holds at most n items. What does one delete-min cost, and how many happen in total?",
      options: [
        { t: "O(lg n) each, and every one of the n² items is deleted once: O(n² lg n) total", ok: true, why: "Each heap has ≤ n items, so its height is about lg n." },
        { t: "O(lg n²) each, n times total", why: "Every item comes out of some heap exactly once, so that's n² delete-mins, not n." },
      ],
    },
    {
      id: "iter",
      kind: "choice",
      title: "One pass of step 4",
      pts: 2,
      prompt: "**(2 pts).** The linked list always holds at most n values (one per heap). What does **one** pass of step 4 (a + b + c) cost?",
      options: [
        { t: "O(n): scanning the list is O(n), removing is O(1), and one delete-min is O(lg n)", ok: true, why: "O(n) + O(1) + O(lg n) = O(n). The scan in 4a dominates." },
        { t: "O(lg n)", why: "Finding the min in a plain linked list means checking all ≤ n entries: O(n)." },
        { t: "O(n²)", why: "The list only ever holds one value per heap, so ≤ n items to scan." },
      ],
    },
    {
      id: "total4",
      kind: "choice",
      title: "All of step 4",
      pts: 3,
      prompt: "**(3 pts).** Step 4 repeats n² times. What's its total?",
      options: [
        { t: "n² × O(n) = O(n³)", ok: true, why: "That dwarfs everything else: O(n²) + O(n²) + O(n² lg n) + O(n³) + O(n²) = O(n³)." },
        { t: "O(n² lg n)", why: "That counts only the delete-mins. The list scans cost O(n) each, n² times." },
      ],
    },
    {
      id: "final",
      kind: "type",
      title: "Run time",
      pts: 2,
      prompt: "**(2 pts).** Add up every step. What's the worst-case run time?",
      answers: ["O(n^3)"],
      placeholder: "O(...)",
      hints: [{ when: "n^2", say: "Step 4's scans alone cost n² × n." }],
    },
  ],
  answer:
    "Step 1: O(n²). Step 2: n heapifies of n items = O(n²). Every item is delete-min'd once at O(lg n): O(n² lg n) for steps 3 and 4c.\nStep 4a scans a list of ≤ n items: O(n) per pass, n² passes = O(n³). Step 4b: O(1) per pass = O(n²).\nTotal: O(n²) + O(n²) + O(n² lg n) + O(n³) + O(n²) = O(n³).",
  takeaway: "For a described algorithm, cost each step, multiply by how often it repeats, and keep the biggest term.",
};

const C2: Question = {
  id: "C2",
  pts: 10,
  category: "ANL",
  topic: "Algorithm Analysis",
  title: "Permutations get expensive",
  recipe: "scaling",
  story:
    "A brute force algorithm that processes all permutations of n routines runs in **O(n · n!)** time. On one computer, n = **9** takes **180 milliseconds**. How many **seconds** should n = **11** take on the same computer?",
  given: [{ id: "c2-setup", title: "What we know", kind: "text", body: "T(n) = c · n · n!\nT(9) = 180 ms\nFind: T(11), in seconds\n\nTyping tip: write factorials like 9! and put them at the end,\ne.g.  180 = c*9*9!" }],
  steps: [
    {
      id: "setup",
      kind: "type",
      title: "Equation for c",
      pts: 1,
      prompt: "**(1 pt).** Plug n = 9 in. Write it as `180 = …`.",
      answers: ["180=c*9*9!", "180=9*9!*c", "180=c*9(9!)", "180=c(9)(9!)", "180=9c*9!"],
    },
    {
      id: "c",
      kind: "type",
      title: "Solve for c",
      pts: 3,
      prompt: "**(3 pts).** Solve for c. (No need to simplify.)",
      answers: ["c=180/(9*9!)", "c=20/9!", "c=180/(9(9!))", "c=180/9/9!"],
      hints: [{ when: "180", at: "c", say: "Write it as `c = …`." }],
    },
    {
      id: "t11",
      kind: "type",
      title: "Set up T(11)",
      pts: 1,
      prompt: "**(1 pt).** Write T(11) in terms of c.",
      answers: ["T(11)=c*11*11!", "T(11)=11*11!*c", "T(11)=c(11)(11!)", "c*11*11!"],
    },
    {
      id: "sub",
      kind: "type",
      title: "Substitute c",
      pts: 1,
      prompt: "**(1 pt).** Substitute c = 20/9! into it.",
      answers: ["T(11)=20/9!*11*11!", "20/9!*11*11!", "T(11)=20*11*11!/9!", "20*11*11!/9!", "T(11)=(20/9!)*11*11!", "(20/9!)*11*11!"],
    },
    {
      id: "fact",
      kind: "choice",
      title: "11! ÷ 9!",
      prompt: "Never multiply out factorials. What's 11!/9!?",
      options: [
        { t: "11 × 10 = 110: everything from 9 down cancels", ok: true, why: "11! = 11 · 10 · 9!, so the 9! cancels and leaves 110." },
        { t: "2", why: "11 − 9 = 2, but factorials don't subtract like that. Write out 11! = 11 · 10 · 9!." },
        { t: "11/9", why: "11! = 11 · 10 · 9!, so dividing by 9! leaves 11 · 10." },
      ],
    },
    {
      id: "ms",
      kind: "type",
      title: "Milliseconds",
      pts: 3,
      prompt: "**(3 pts).** So T(11) = 20 · 11 · 110. How many milliseconds?",
      answers: ["24200", "24200ms", "24200 ms"],
      hints: [{ when: ["2200", "220"], say: "Don't drop a factor: 20 · 11 · 110." }],
    },
    {
      id: "sec",
      kind: "type",
      title: "Seconds",
      pts: 1,
      prompt: "**(1 pt).** The question asks for **seconds**.",
      answers: ["24.2", "24.2s", "24.2 s", "24.2 seconds"],
      hints: [{ when: "24200", say: "1 second = 1000 milliseconds. Divide by 1000." }],
    },
  ],
  answer: "T(9) = c·9·9! = 180  →  c = 180/(9·9!) = 20/9!\nT(11) = c·11·11! = (20/9!)·11·11! = 20·11·(11·10) = 20·1210 = 24200 ms = 24.2 seconds",
  takeaway: "With factorials, cancel before you multiply: 11!/9! = 11 · 10. And check the units the question asks for.",
};

const C3: Question = {
  id: "C3",
  pts: 5,
  category: "ANL",
  topic: "Summations",
  title: "Σ (2i + 5) up to 3n",
  story: "Find a closed form for the summation below, in terms of **n**. Simplify to standard polynomial form (not factored).",
  given: [
    { id: "c3-sum", title: "The summation", kind: "text", body: " 3n\n  Σ  (2i + 5)\n i=1" },
    { id: "c3-formulas", title: "Formulas you know", kind: "text", body: "Σ (i=1..m) i = m(m+1)/2\nΣ (i=1..m) c = c·m\n\nHere the top is m = 3n." },
  ],
  steps: [
    {
      id: "split",
      kind: "type",
      title: "Split it",
      pts: 1,
      prompt: "**(1 pt).** Split into two sums. (Write sums as `sum(2i)` and `sum(5)`.)",
      answers: ["sum(2i)+sum(5)", "sum(5)+sum(2i)", "2sum(i)+sum(5)", "2*sum(i)+sum(5)"],
    },
    {
      id: "twoi",
      kind: "type",
      title: "Sum of 2i",
      pts: 2,
      prompt: "**(2 pts).** Σ 2i up to 3n = 2 · 3n(3n+1)/2. Simplify (keep it factored for now).",
      answers: ["3n(3n+1)", "3n*(3n+1)", "(3n)(3n+1)", "9n^2+3n"],
      hints: [{ when: "n", at: "3", say: "The top of the sum is 3n, not n. Put 3n everywhere the formula says m." }],
    },
    {
      id: "five",
      kind: "type",
      title: "Sum of 5",
      pts: 1,
      prompt: "**(1 pt).** Σ 5 from i = 1 to 3n?",
      answers: ["15n", "5(3n)", "5*3n"],
      hints: [{ when: "5n", say: "There are 3n terms, not n." }],
    },
    {
      id: "final",
      kind: "type",
      title: "Polynomial form",
      pts: 1,
      prompt: "**(1 pt).** Expand 3n(3n+1) + 15n and combine like terms.",
      answers: ["9n^2+18n", "9n²+18n"],
      hints: [{ when: "3n", say: "3n(3n+1) = 9n² + 3n. Then add the 15n." }],
    },
  ],
  answer: "Σ(2i + 5) = Σ2i + Σ5 = 2·3n(3n+1)/2 + 5(3n) = 3n(3n+1) + 15n = 9n² + 3n + 15n = 9n² + 18n",
  takeaway: "When the top is 3n, swap 3n in for every n in the formula, and Σ c counts the terms (3n of them).",
};

// ───────────────────────────── Section D ─────────────────────────────

const D1: Question = {
  id: "D1",
  pts: 5,
  category: "DSN",
  topic: "Recursive Coding",
  title: "Count the evens in a range",
  story:
    "Write a **recursive** function that, given an array, its length, and a range of indexes, returns how many **even** integers are in that index range. Solutions that use a loop get **0 points**.\n\nExample: arr = [3, 5, 8, 6, 7, 9, 4, 11, 8]. `evens(arr, 9, 2, 6)` returns **3**, because arr[2] = 8, arr[3] = 6 and arr[6] = 4 are even.",
  given: [{ id: "d1-header", title: "Function header", kind: "code", body: "int evens(int * arr, int len, int lowInd, int hiInd) {\n\n}" }],
  scaffold: { title: "evens so far", code: "int evens(int * arr, int len, int lowInd, int hiInd) {\n    {{base}}\n    {{rec}}\n}" },
  steps: [
    {
      id: "shrink",
      kind: "choice",
      title: "Shrink the problem",
      prompt: "How does each call make the range smaller?",
      options: [
        { t: "Look at arr[lowInd] only, then recurse on lowInd + 1 … hiInd", ok: true, why: "Handle one item, let the recursion handle the rest. When the range is empty, stop." },
        { t: "Cut the range in half each time", why: "That works too, but it's more code. One item at a time is the simplest." },
      ],
    },
    {
      id: "base",
      kind: "type",
      title: "Empty range",
      pts: 2,
      prompt: "**(2 pts).** Base case: when `lowInd` has passed `hiInd`, the range is empty. Return 0, one line.",
      answers: ["if (lowInd > hiInd) return 0;", "if (hiInd < lowInd) return 0;"],
      hints: [{ when: ">=", at: ">", say: "When lowInd == hiInd there's still one item to check. Stop only once lowInd is *past* hiInd." }],
    },
    {
      id: "trick",
      kind: "choice",
      title: "1 or 0",
      prompt: "In C, what does `(arr[lowInd] % 2 == 0)` evaluate to?",
      mono: true,
      options: [
        { t: "1 if it's even, 0 if it's odd", ok: true, why: "A comparison in C *is* an int: 1 for true, 0 for false. So you can add it straight onto the count." },
        { t: "true or false, which can't be added", why: "C has no separate bool here: comparisons give the ints 1 and 0." },
      ],
    },
    {
      id: "rec",
      kind: "type",
      title: "Count + recurse",
      pts: 3,
      prompt: "**(3 pts: 2 for the recursive call, 1 for adding the right amount).** Return 1-or-0 for `arr[lowInd]` plus the count for the rest of the range. One line.",
      answers: [
        "return (arr[lowInd]%2 == 0) + evens(arr, len, lowInd+1, hiInd);",
        "return evens(arr, len, lowInd+1, hiInd) + (arr[lowInd]%2 == 0);",
        "return (arr[lowInd]%2 == 0 ? 1 : 0) + evens(arr, len, lowInd+1, hiInd);",
        "return !(arr[lowInd]%2) + evens(arr, len, lowInd+1, hiInd);",
      ],
      hints: [
        { when: "lowInd", at: "lowInd+1", say: "Recurse on a smaller range: start at `lowInd+1`, or it never ends." },
        { when: "lowInd++", say: "`lowInd++` passes the *old* value. Use `lowInd+1`." },
      ],
    },
  ],
  answer: "int evens(int * arr, int len, int lowInd, int hiInd) {\n    if (lowInd > hiInd) return 0;                          // 2\n    return (arr[lowInd]%2 == 0) + evens(arr, len, lowInd+1, hiInd); // 2 + 1\n}",
  takeaway: "Count-in-a-range recursion: empty range returns 0, otherwise (this one counts? 1 : 0) + the rest.",
};

const LIST_API = `typedef struct Node {
    int value;
    struct Node * next;
} Node;

typedef struct List {
    Node* front;
    Node* back;
} List;

void addToTail(List * list, Node * node);  // Add to tail
List * merge(List * front, List * back);   // Returns a list that is the combination of 2 given lists
Node* getAndRemoveHead(List * list);       // Removes and returns the head
List* createEmptyList();                   // Returns dynamically allocated empty List
int isEmpty(List * list);                  // Returns 1 if empty and 0 otherwise
void deleteList(List * list);              // Cleans up any leftover dynamic memory`;

const SORT_CODE = `List * sort(List * lst) {
    if (___①___(lst)) return lst;
    Node * pivot = getAndRemoveHead(lst);
    List * first = ___②___();
    List * last = ___③___();
    List * middle = createEmptyList();
    addToTail(middle, pivot);
    while (!isEmpty(lst)) {
        Node * cur = ___④___(lst);
        if (cur->value < pivot->value)
            addToTail(___⑤___, cur);
        else if (cur->value == pivot->value)
            addToTail(___⑥___, cur);
        else
            addToTail(___⑦___, cur);
    }
    first = sort(___⑧___);
    last = sort(___⑨___);
    first = merge(first, middle);
    first = merge(first, last);
    free(middle);
    free(last);
    free(lst);
    return ___⑩___;
}`;

const D2: Question = {
  id: "D2",
  pts: 10,
  category: "DSN",
  topic: "Sorting",
  title: "Stable quicksort on a linked list",
  story:
    "Fill in the blanks to finish a **stable** quicksort on a linked list (equal values keep their original order). The head of the list is the pivot. All the list functions in your inventory are implemented and take O(1).\n\nEach blank is worth **1 point** and is either a function call or a parameter, from the functions listed.",
  given: [
    { id: "d2-api", title: "Structs and list functions", kind: "code", body: LIST_API },
    { id: "d2-code", title: "sort, with blanks", kind: "code", body: SORT_CODE },
  ],
  steps: [
    {
      id: "three",
      kind: "choice",
      title: "Three piles",
      prompt: "The code makes three lists: `first`, `middle`, `last`. What goes in each?",
      options: [
        { t: "first: smaller than the pivot · middle: equal to it · last: bigger", ok: true, why: "Then sort first and last, and glue first + middle + last back together." },
        { t: "first: the first half of the list · last: the second half", why: "That's how merge sort splits. Quicksort splits by comparing to the pivot." },
      ],
    },
    {
      id: "stable",
      kind: "choice",
      title: "Why it's stable",
      prompt: "What keeps equal values in their original order?",
      options: [
        { t: "Nodes are taken from the head and added to the tail, so each pile keeps the order they arrived in", ok: true, why: "Head out, tail in = first-come, first-placed. Equal values never pass each other." },
        { t: "The pivot is the head", why: "That picks the pivot. Stability comes from always adding to the tail." },
      ],
    },
    {
      id: "setup",
      kind: "slots",
      title: "Blanks ①–③",
      pts: 3,
      score: "each",
      prompt: "**(3 pts).** Fill the setup blanks with function names from your inventory.",
      layout: "row",
      slots: [
        { id: "b1", label: "if (", after: "(lst)) return lst;", answer: "isEmpty", w: 16, pts: 1 },
        { id: "b2", label: "List * first =", after: "();", answer: "createEmptyList", w: 16, pts: 1 },
        { id: "b3", label: "List * last =", after: "();", answer: "createEmptyList", w: 16, pts: 1 },
      ],
    },
    {
      id: "loop",
      kind: "slots",
      title: "Blanks ④–⑦",
      pts: 4,
      score: "each",
      prompt: "**(4 pts).** Inside the loop: take the next node, then drop it in the right pile.",
      layout: "row",
      slots: [
        { id: "b4", label: "Node * cur =", after: "(lst);", answer: "getAndRemoveHead", w: 17, pts: 1 },
        { id: "b5", label: "smaller → addToTail(", after: ", cur);", answer: "first", w: 8, pts: 1 },
        { id: "b6", label: "equal → addToTail(", after: ", cur);", answer: "middle", w: 8, pts: 1 },
        { id: "b7", label: "bigger → addToTail(", after: ", cur);", answer: "last", w: 8, pts: 1 },
      ],
    },
    {
      id: "finish",
      kind: "slots",
      title: "Blanks ⑧–⑩",
      pts: 3,
      score: "each",
      prompt: "**(3 pts).** Sort the two outer piles, and return the glued-together list.",
      layout: "row",
      slots: [
        { id: "b8", label: "first = sort(", after: ");", answer: "first", w: 8, pts: 1 },
        { id: "b9", label: "last = sort(", after: ");", answer: "last", w: 8, pts: 1 },
        { id: "b10", label: "return", after: ";", answer: "first", w: 8, pts: 1 },
      ],
      learn: "`middle` never needs sorting: everything in it equals the pivot.",
    },
  ],
  answer: "① isEmpty  ② createEmptyList  ③ createEmptyList  ④ getAndRemoveHead\n⑤ first  ⑥ middle  ⑦ last  ⑧ first  ⑨ last  ⑩ first",
  takeaway: "List quicksort: split into smaller / equal / bigger piles by adding to the tail, sort the outer two, and merge all three.",
};

const D3: Question = {
  id: "D3",
  pts: 10,
  category: "DSN",
  topic: "Bitwise Operators",
  title: "Lights Out",
  story:
    "A **Lights Out** puzzle is played on a 2D grid. Pressing a cell **toggles** it and its 4 neighbors (up, down, left, right). Your program stores the puzzle as an array of ints, one int per row: a bit that's on means that cell is lit.\n\nExample: if a row has cells 0, 5 and 6 on, its value is 97 = 2⁰ + 2⁵ + 2⁶. Pressing column 1 of that row turns cell 0 off and cells 1 and 2 on, giving 2¹ + 2² + 2⁵ + 2⁶ = 102. If a row above exists, one bit changes there too, and the same for the row below.\n\nWrite `cellPress`, which emulates pressing the cell at (`row`, `col`), 0-indexed. Be careful not to go out of bounds: 5 bits may flip, and the 4 neighbors only flip if they're inside the grid.",
  given: [{ id: "d3-header", title: "Function header", kind: "code", body: "void cellPress(int row, int col, int height, int width, int * grid) {\n\n}" }],
  scaffold: {
    title: "cellPress so far",
    code: "void cellPress(int row, int col, int height, int width, int * grid) {\n    {{self}}\n    {{ifl}}\n        {{left}}\n    {{ifu}}\n        {{up}}\n    {{ifd}}\n        {{down}}\n    {{ifr}}\n        {{right}}\n}",
  },
  steps: [
    {
      id: "toggle",
      kind: "choice",
      title: "Which operator toggles?",
      prompt: "To **flip** one bit (on → off, off → on) and leave the rest alone, which operator do you use with a mask like `1 << col`?",
      mono: true,
      options: [
        { t: "^ (XOR)", ok: true, why: "x ^ 1 flips the bit, x ^ 0 leaves it. So `grid[row] ^= (1<<col)` flips exactly bit col." },
        { t: "| (OR)", why: "OR only turns bits *on*. A lit cell would stay lit." },
        { t: "& (AND)", why: "AND with a one-bit mask wipes out every other bit in the row." },
      ],
    },
    { id: "self", kind: "type", title: "The pressed cell", pts: 2, prompt: "**(2 pts).** The pressed cell always flips. Toggle bit `col` of row `row`.", answers: xor("grid[row]", "col"), hints: [{ when: "|=", at: "^=", say: "OR only turns bits on. Toggling needs XOR: `^=`." }] },
    {
      id: "ifl",
      kind: "type",
      title: "Left neighbor exists?",
      pts: 1,
      prompt: "**(1 pt).** The left neighbor is column col − 1. Write the `if` header (no brace) that checks it exists.",
      answers: ["if (col > 0)", "if (col)", "if (col >= 1)", "if (col != 0)", "if (col-1 >= 0)"],
    },
    { id: "left", kind: "type", title: "Toggle left", pts: 1, prompt: "**(1 pt).** Toggle it (same row).", answers: xor("grid[row]", "(col-1)"), hints: [{ when: "col", at: "(", say: "Shift by `(col-1)`, in parentheses." }] },
    { id: "ifu", kind: "type", title: "Row above exists?", pts: 1, prompt: "**(1 pt).** The cell above is in row − 1. Write the `if` header that checks that row exists.", answers: ["if (row > 0)", "if (row)", "if (row >= 1)", "if (row != 0)", "if (row-1 >= 0)"] },
    { id: "up", kind: "type", title: "Toggle above", pts: 1, prompt: "**(1 pt).** Toggle bit `col` in the row above.", answers: xor("grid[row-1]", "col"), hints: [{ when: "row", at: "row-1", say: "The row above is `grid[row-1]`." }] },
    {
      id: "ifd",
      kind: "type",
      title: "Row below exists?",
      pts: 1,
      prompt: "**(1 pt).** The row below is row + 1. Rows go 0 to height − 1. Write the `if` header.",
      answers: ["if (row < height-1)", "if (row+1 < height)", "if (row <= height-2)", "if (row != height-1)"],
      hints: [{ when: "height", at: "height-1", say: "The last row is `height - 1`. Only rows *before* it have a row below." }],
    },
    { id: "down", kind: "type", title: "Toggle below", pts: 1, prompt: "**(1 pt).** Toggle bit `col` in the row below.", answers: xor("grid[row+1]", "col") },
    { id: "ifr", kind: "type", title: "Right neighbor exists?", pts: 1, prompt: "**(1 pt).** The right neighbor is col + 1. Columns go 0 to width − 1. Write the `if` header.", answers: ["if (col < width-1)", "if (col+1 < width)", "if (col <= width-2)", "if (col != width-1)"] },
    { id: "right", kind: "type", title: "Toggle right", pts: 1, prompt: "**(1 pt).** Toggle it.", answers: xor("grid[row]", "(col+1)") },
  ],
  answer:
    "void cellPress(int row, int col, int height, int width, int * grid) {\n    grid[row] ^= (1<<col);                 // 2\n    if (col)\n        grid[row] ^= (1<<(col-1));         // 1 + 1\n    if (row)\n        grid[row-1] ^= (1<<col);           // 1 + 1\n    if (row < height - 1)\n        grid[row+1] ^= (1<<col);           // 1 + 1\n    if (col < width - 1)\n        grid[row] ^= (1<<(col+1));         // 1 + 1\n}",
  takeaway: "Toggle = XOR with a one-bit mask. Check bounds before touching every neighbor: col > 0, row > 0, row < height − 1, col < width − 1.",
};

export const FALL_2024: Exam = {
  id: "fall2024",
  term: "Fall 2024",
  date: "August 24, 2024",
  blurb: "1980s games deep-copied, flipping list halves, a superhero queue, a child-swapping tree, a lopsided AVL tree, and Lights Out with XOR.",
  questionsPdf: `${EXAMS_URL}fall2024/FE-Aug24.pdf`,
  solutionsPdf: `${EXAMS_URL}fall2024/FE-Aug24-Sol.pdf`,
  sections: [
    { id: "A", name: "Basic Data Structures", questions: [A1, A2, A3] },
    { id: "B", name: "Advanced Data Structures", questions: [B1, B2, B3] },
    { id: "C", name: "Algorithm Analysis", questions: [C1, C2, C3] },
    { id: "D", name: "Algorithms", questions: [D1, D2, D3] },
  ],
};
