import type { Exam, Question } from "@/lib/arcade/types";
import { loops } from "./fall2026-ab";

const STACK_FNS = `void initialize(stack* s); // initializes an empty stack
int push(stack* s, char value); // pushes the char value to the stack
int isEmpty(stack* s); // returns 1 if the stack is empty, 0 otherwise
char pop(stack* s); // pops and returns the character at the top
char peek(stack* s); // returns the character at the top

// pop and peek return 'I' if the stack is empty`;

const PAL: Question = {
  id: "pal",
  pts: 10,
  category: "DSN",
  topic: "Stacks",
  title: "Palindrome with a stack",
  recipe: "stack-code",
  story:
    "A word is a **palindrome** if its reverse is the same as the original word. \"racecar\", \"hannah\", \"level\", \"madam\" and \"yay\" are palindromes. \"test\" is not, since its reverse is \"tset\".\n\nWrite a function that takes a string and returns **1** if it's a palindrome, otherwise **0**. **You have to use stack operations during this process.** Credit isn't awarded for solving the problem correctly, but for using the stack to do it.\n\nThe stack functions in your inventory are already written for you, and the stack grows automatically if it gets full.",
  given: [
    { id: "pal-fns", title: "Stack functions you can use", kind: "code", body: STACK_FNS },
    { id: "pal-header", title: "Function header", kind: "code", body: "int isPalindrome(char *str) {\n    struct stack s;\n    initialize(&s);\n    int len = strlen(str);\n\n}" },
  ],
  scaffold: {
    title: "isPalindrome so far",
    code: "int isPalindrome(char *str) {\n    struct stack s;\n    initialize(&s);\n    int len = strlen(str);\n\n    {{loop1}}\n        {{push}}\n\n    {{loop2}}\n        {{check}}\n            {{ret0}}\n\n    {{ret1}}\n}",
  },
  steps: [
    {
      id: "big-idea",
      kind: "choice",
      title: "What the stack is for",
      prompt: "Before any code: why does a stack help you check a palindrome?",
      options: [
        { t: "It flips order. Push the first half, and popping hands it back reversed, ready to compare with the second half", ok: true, why: "Yes. Push r a c from racecar, and pops give c, a, r. That should match the end of the word: c, a, r." },
        { t: "It finds the middle of the word for you", why: "The stack doesn't know where the middle is. You work that out with len/2." },
        { t: "It sorts the letters", why: "A stack never sorts. Its one trick is reversing order: last in, first out." },
      ],
    },
    {
      id: "your-try",
      kind: "choice",
      title: "What went wrong in your first try",
      prompt: "Your first try had `int x = isEmpty(str)` and `if (isEmpty == 1)`. What's wrong with those?",
      options: [
        { t: "isEmpty asks about a stack, so it needs the stack's address: isEmpty(&s). And isEmpty == 1 compares the function itself, not a result", ok: true, why: "Right. `str` is the word, not a stack. Every stack function takes `&s`. A function's name on its own isn't a call, so `isEmpty == 1` never runs it. You also don't need isEmpty here at all." },
        { t: "Nothing. You just need a semicolon after them", why: "The missing semicolon is a slip too, but the bigger problem is passing the word where the stack should go." },
      ],
    },
    {
      id: "loop1",
      kind: "type",
      title: "Loop over the first half",
      pts: 2,
      prompt: "**(2 pts: correct number of pushes).** Write the `for` header (no brace) that walks the **first half** of the word.",
      answers: loops(["int i=0"], ["i<len/2"], ["i++", "++i", "i+=1"]),
      hints: [
        { when: ";", at: "/", say: "That walks the whole word. You only push the first HALF, so stop at `len/2`." },
        { when: "<=", say: "`<=` pushes one extra letter. Use `<` so you stop right before index len/2." },
      ],
      learn: "racecar: len 7, len/2 = 3, so you push indexes 0, 1, 2 (r a c). hannah: len 6, len/2 = 3, so you push h a n.",
    },
    {
      id: "push",
      kind: "type",
      title: "Push each letter",
      pts: 2,
      prompt: "**(2 pts: push the first half).** Push letter `i` of the word onto the stack.",
      answers: ["push(&s, str[i]);"],
      hints: [
        { when: "s", at: "&", say: "push needs the stack's address, not the stack itself: `&s`." },
        { when: "str", at: "&", say: "The stack comes first and the letter second: `push(&s, letter)`." },
      ],
    },
    {
      id: "odd-even",
      kind: "slots",
      title: "Odd vs. even words",
      prompt: "Where does the second half start? For each word, how many letters do you push (`len/2`), and at which index does the second loop start?",
      layout: "row",
      score: "all",
      slots: [
        { id: "rc-push", label: "racecar (len 7): pushes", answer: "3", w: 2 },
        { id: "rc-start", label: "starts at index", answer: "4", w: 2 },
        { id: "hn-push", label: "hannah (len 6): pushes", answer: "3", w: 2 },
        { id: "hn-start", label: "starts at index", answer: "3", w: 2 },
      ],
      learn: "racecar skips its middle letter (e, index 3), so the second half starts at 4. hannah has no middle, so it starts at 3. `len - len/2` gives 4 and 3, which covers both.",
    },
    {
      id: "loop2",
      kind: "type",
      title: "Loop over the second half",
      pts: 2,
      prompt: "**(2 pts: indexing and number of pops).** Write the `for` header (no brace) that walks the **second half**, so it works for odd and even words.",
      answers: loops(["int i=len-len/2", "int i=(len+1)/2"], ["i<len"], ["i++", "++i", "i+=1"]),
      hints: [
        { when: "/", at: "-", say: "`len/2` works for hannah, but for racecar it lands on the middle e, which you never pushed. Start at `len - len/2`." },
        { when: "0", say: "Starting at 0 compares against the first half again. Start where the second half begins." },
      ],
    },
    {
      id: "check",
      kind: "type",
      title: "Pop and compare",
      pts: 2,
      prompt: "**(2 pts: pop off the second half).** Write the `if` (no brace) that pops a letter and checks whether it's **different** from letter `i`.",
      answers: ["if (pop(&s) != str[i])"],
      hints: [
        { when: "peek", say: "`peek` only looks, so the same letter stays on top for the next compare. `pop` removes it." },
        { when: "==", at: "!=", say: "You want to catch the moment they're DIFFERENT, so you can return 0 right away." },
        { when: "s", at: "&", say: "pop needs the stack's address: `pop(&s)`." },
      ],
    },
    {
      id: "ret0",
      kind: "type",
      title: "Mismatch",
      pts: 1,
      prompt: "**(1 pt).** They're different, so this isn't a palindrome. Return right away.",
      answers: ["return 0;"],
    },
    {
      id: "ret1",
      kind: "type",
      title: "All matched",
      pts: 1,
      prompt: "**(1 pt).** Every letter matched. What do you return after the loop?",
      answers: ["return 1;"],
      learn: "You popped exactly as many letters as you pushed, so the stack is already empty. No isEmpty check needed.",
    },
  ],
  answer:
    "int isPalindrome(char *str) {\n    struct stack s;\n    initialize(&s);\n    int len = strlen(str);\n\n    for (int i=0; i<len/2; i++)          // 2 pts: right number of pushes\n        push(&s, str[i]);                // 2 pts: push the first half\n\n    for (int i=len-len/2; i<len; i++)    // 2 pts: indexing and number of pops\n        if (pop(&s) != str[i])           // 2 pts: pop off the second half\n            return 0;                    // 1 pt: stop at the first mismatch\n\n    return 1;                            // 1 pt\n}\n\nThe second loop can also start at (len+1)/2.",
  takeaway: "A stack flips order: push the first half, pop to compare with the second. Every stack function takes &s.",
};

const TEAM_STRUCTS = `typedef struct Player {
    char pname[50];    // player's name
    char country[50];  // player's country
    int age;
} Player;

typedef struct Team {
    char tname[50];    // team's name
    Player *players;   // all players on the team
    int numPlayers;    // number of players on the team
} Team;`;

const TEAM_FILE = `NewKnights 5
Hannan USA 22
Mabel India 21
Samarina Bangladesh 21
Tamsen USA 21
Susan Mexico 22`;

/** `&(x)` and `&x` both count */
const amp = (x: string) => [`&(${x})`, `&${x}`];

const TEAM: Question = {
  id: "289",
  pts: 10,
  category: "DSN",
  topic: "Dynamic Memory",
  title: "Dynamic team creation from a file",
  recipe: "file-struct",
  story:
    "A file stores one team. The **first line** has the team's name and how many players it has. **Each line after that** is one player: name, country, age. (Names have no spaces.)\n\nWrite a function that takes a file pointer and **returns a pointer to a dynamically allocated Team struct** with all the information loaded into it. The file is already open in read mode, ready to read from the start. Don't close it: whoever called `createTeam()` will.",
  given: [
    { id: "team-structs", title: "The structs", kind: "code", body: TEAM_STRUCTS },
    { id: "team-file", title: "Sample input file", kind: "file", body: TEAM_FILE },
    { id: "team-header", title: "Function header", kind: "code", body: "Team *createTeam(FILE *fp) {\n\n}" },
  ],
  scaffold: {
    title: "createTeam so far",
    code: "Team *createTeam(FILE *fp) {\n    {{malloc}}\n\n    {{header}}\n\n    {{calloc}}\n\n    {{loop}}\n        {{player}}\n\n    {{ret}}\n}",
  },
  steps: [
    {
      id: "big-idea",
      kind: "choice",
      title: "What the function does",
      prompt: "Before any code: what is `createTeam` supposed to do?",
      options: [
        { t: "READ the file into memory: make a Team, fill it from the file with fscanf, and hand back its address", ok: true, why: "Yes. Nothing gets printed. The file flows INTO the struct. fscanf is scanf that reads from a file instead of the keyboard." },
        { t: "Print the team and its players to the screen", why: "That's printf, which goes the other way: memory → screen. Here the data starts in the file and has to end up in a struct you return." },
        { t: "Open the file, read it, and close it", why: "The file is already open, and the question says not to close it. You only read." },
      ],
    },
    {
      id: "your-try",
      kind: "choice",
      title: "What went wrong in your first try",
      prompt: "Your first try had `printf(tname + \" \" + numPlayers)` and `Player->pname + Player->country + Player->age`. What's wrong?",
      options: [
        { t: "printf writes OUT, but you need to read IN with fscanf(fp, ...). C can't glue strings with +. And Player is a type, not a variable: you need res->players[i]", ok: true, why: "Right, three slips. (1) Wrong direction: reading a file is `fscanf(fp, ...)`. (2) `+` doesn't join strings in C; each value gets its own `%` code. (3) `Player` is the struct's *type*. The actual players live at `res->players[i]`. And nothing was malloc'd, so there was no Team to fill or return." },
        { t: "Just syntax: missing parentheses in the for loop", why: "The `for` needs parentheses and semicolons too, but even with those fixed, the code prints instead of reading and never makes a Team." },
      ],
    },
    {
      id: "malloc",
      kind: "type",
      title: "Make the Team",
      pts: 1,
      prompt: "**(1 pt).** Allocate ONE Team on the heap and call the pointer `res`.",
      answers: ["Team* res = malloc(sizeof(Team));", "Team* res = (Team*)malloc(sizeof(Team));", "Team* res = calloc(1, sizeof(Team));"],
      hints: [
        { when: "Player", at: "Team", say: "First you need the Team itself. The players get their own block in a moment." },
        { when: "*", at: ")", say: "`sizeof(Team*)` is just the size of an address (8 bytes). You want room for the whole struct: `sizeof(Team)`." },
      ],
      learn: "You return a pointer, so the Team has to live on the heap. A local `Team t;` would be gone the moment the function returns.",
    },
    {
      id: "amp",
      kind: "slots",
      title: "Which ones need &?",
      prompt: "fscanf needs an **address** for every value it fills. Arrays (strings) already ARE addresses, so they get no `&`. Ints need one. Type **yes** or **no** for each.",
      layout: "row",
      score: "all",
      slots: [
        { id: "tname", label: "res->tname", answer: ["no", "n"], w: 4 },
        { id: "num", label: "res->numPlayers", answer: ["yes", "y"], w: 4 },
        { id: "pname", label: "res->players[i].pname", answer: ["no", "n"], w: 4 },
        { id: "age", label: "res->players[i].age", answer: ["yes", "y"], w: 4 },
      ],
      learn: "Rule of thumb: `%s` → no `&` (char arrays are already addresses). `%d` → `&` (an int is a value, so fscanf needs to know where it lives).",
    },
    {
      id: "header",
      kind: "type",
      title: "Read the first line",
      pts: 2,
      prompt: "**(2 pts).** Read the team name and the number of players from `fp` straight into `res`.",
      answers: amp("res->numPlayers").map((n) => `fscanf(fp, "%s%d", res->tname, ${n});`),
      hints: [
        { when: "scanf", at: "fscanf", say: "`scanf` reads the keyboard. Reading a FILE is `fscanf`, with the file pointer first." },
        { when: "printf", say: "printf writes out. You're reading in: `fscanf`." },
        { when: "&", at: "res", say: "`tname` is a char array, which is already an address. No `&` for `%s`." },
        { when: "res", at: "&", say: "`numPlayers` is an int, so fscanf needs its address: `&res->numPlayers`." },
        { when: "tname", at: "res", say: "`tname` lives inside the Team, so reach it through the pointer: `res->tname`." },
      ],
    },
    {
      id: "calloc",
      kind: "type",
      title: "Make room for the players",
      pts: 2,
      prompt: "**(2 pts).** Now you know how many players there are. Allocate an array of that many Players and store it in the Team.",
      answers: [
        "res->players = calloc(res->numPlayers, sizeof(Player));",
        "res->players = malloc(res->numPlayers * sizeof(Player));",
        "res->players = malloc(sizeof(Player) * res->numPlayers);",
        "res->players = (Player*)malloc(res->numPlayers * sizeof(Player));",
        "res->players = (Player*)calloc(res->numPlayers, sizeof(Player));",
      ],
      hints: [
        { when: "Player", at: "res", say: "`Player` is a type. You're filling the Team's field: `res->players = ...`" },
        { when: "*", at: ")", say: "Each slot holds a whole Player, not a pointer: `sizeof(Player)`." },
      ],
      learn: "`Player *players` is just an arrow. Until you allocate, it points nowhere. The order matters: read numPlayers FIRST, then you know how big to make it.",
    },
    {
      id: "loop",
      kind: "type",
      title: "One line per player",
      pts: 1,
      prompt: "**(1 pt).** Write the `for` header (no brace) that runs once per player.",
      answers: loops(["int i=0", "i=0"], ["i<res->numPlayers"], ["i++", "++i", "i+=1"]),
      hints: [
        { when: "numPlayers", at: "res", say: "numPlayers lives inside the Team: `res->numPlayers`." },
        { when: "<=", say: "`<=` reads one player too many. Indexes go 0 to numPlayers−1." },
      ],
    },
    {
      id: "player",
      kind: "type",
      title: "Read one player",
      pts: 3,
      prompt: "**(3 pts: 1 per value).** Read player `i`'s name, country and age into `res->players[i]`.",
      answers: amp("res->players[i].age").map((a) => `fscanf(fp, "%s%s%d", res->players[i].pname, res->players[i].country, ${a});`),
      hints: [
        { when: "->", at: ".", say: "`res->players[i]` is a whole Player (not a pointer), so use a dot: `.pname`." },
        { when: "&", at: "res", say: "`pname` and `country` are char arrays, already addresses. No `&` for `%s`." },
        { when: "res", at: "&", say: "`age` is an int, so it needs `&`." },
        { when: "Player", at: "res", say: "`Player` is the type. The real player is `res->players[i]`." },
      ],
      learn: "Read the path left to right: `res` → (arrow, it's a pointer) → `players` array → `[i]` one Player → (dot, it's a struct) → `.age`.",
    },
    {
      id: "ret",
      kind: "type",
      title: "Hand it back",
      pts: 1,
      prompt: "**(1 pt).** Return the Team.",
      answers: ["return res;"],
      hints: [{ when: "*", say: "`res` is already a `Team*`, which is what the function returns. No star." }],
    },
  ],
  answer:
    'Team *createTeam(FILE *fp) {\n    Team* res = malloc(sizeof(Team));                       // 1 pt\n\n    fscanf(fp, "%s%d", res->tname, &(res->numPlayers));      // 2 pts\n\n    res->players = calloc(res->numPlayers, sizeof(Player));  // 2 pts\n\n    for (int i=0; i<res->numPlayers; i++)                    // 1 pt loop\n        fscanf(fp, "%s%s%d", res->players[i].pname,          // 1 pt each value\n               res->players[i].country, &(res->players[i].age));\n\n    return res;                                              // 1 pt\n}',
  takeaway: "File → struct: malloc the struct, fscanf the header, allocate the array with the count you just read, loop fscanf, return. & only for ints.",
};

const NLOGN = ["O(n lg n)", "O(n log n)", "O(nlgn)", "O(nlogn)", "n lg n", "n log n"];
const NSQ = ["O(n^2)", "O(n²)", "O(n*n)", "n^2", "n²"];

const P287: Question = {
  id: "287",
  pts: 10,
  category: "ALG",
  topic: "Sorting",
  title: "Count Swaps in Insertion Sort",
  recipe: "sort-swaps",
  story:
    "**(a)** Consider running an Insertion Sort on the array in your inventory. How many swaps will execute for the duration of the algorithm? Explain how you got your answer.\n\n**(b)** List the average case run time of each of these sorting algorithms: Insertion, Merge, Heap, Selection, Quick.",
  given: [{ id: "p287-array", title: "The array", kind: "table", table: { head: ["index", "0", "1", "2", "3", "4", "5", "6", "7", "8"], rows: [["value", "35", "25", "15", "29", "39", "22", "19", "6", "21"]] } }],
  steps: [
    {
      id: "what-counts",
      kind: "choice",
      title: "What a swap count means",
      prompt: "Before counting anything: what does the total number of Insertion Sort swaps measure?",
      options: [
        { t: "How far each element has to travel: every bigger number to its left is one swap", ok: true, why: "Yes. Each swap moves one element past exactly one bigger number, so you add up the distances." },
        { t: "How many elements are in the wrong place", why: "That's the tempting one. One element can be misplaced and still cost 7 swaps, like the 6 in this array." },
      ],
    },
    {
      id: "trace",
      kind: "slots",
      title: "Swaps for each element",
      prompt: "Go left to right. For each element, count the **bigger numbers to its left**. (35 goes first and has nothing to pass.)",
      layout: "row",
      score: "all",
      slots: [
        { id: "s25", label: "25", answer: "1", w: 2 },
        { id: "s15", label: "15", answer: "2", w: 2 },
        { id: "s29", label: "29", answer: "1", w: 2 },
        { id: "s39", label: "39", answer: "0", w: 2 },
        { id: "s22", label: "22", answer: "4", w: 2 },
        { id: "s19", label: "19", answer: "5", w: 2 },
        { id: "s6", label: "6", answer: "7", w: 2 },
        { id: "s21", label: "21", answer: "5", w: 2 },
      ],
      learn: "39 costs 0 because nothing before it is bigger. The 6 costs 7 because everything before it is bigger.",
    },
    {
      id: "total",
      kind: "type",
      title: "(a) Total swaps",
      pts: 5,
      prompt: "**(a)** Add up your counts. How many swaps in total?",
      answers: ["25"],
      nudge: "Add the 8 counts: 1, 2, 1, 0, 4, 5, 7, 5.",
      learn: "1 + 2 + 1 + 0 + 4 + 5 + 7 + 5 = 25. The array's total is the number of out-of-order pairs.",
    },
    {
      id: "runtimes",
      kind: "slots",
      title: "(b) Average run times",
      pts: 5,
      prompt: "**(b) 1 pt each.** Give the average case run time of each sort, like `O(n^2)` or `O(n lg n)`.",
      layout: "row",
      score: "each",
      slots: [
        { id: "insertion", label: "Insertion", answer: NSQ, pts: 1, w: 10 },
        { id: "merge", label: "Merge", answer: NLOGN, pts: 1, w: 10 },
        { id: "heap", label: "Heap", answer: NLOGN, pts: 1, w: 10 },
        { id: "selection", label: "Selection", answer: NSQ, pts: 1, w: 10 },
        { id: "quick", label: "Quick", answer: NLOGN, pts: 1, w: 10 },
      ],
      learn:
        "**Heap:** building the heap is O(n), but then you do n removals × O(lg n) each, so O(n lg n).\n\n**Selection:** only O(n) *swaps*, but every round scans the whole unsorted part: n + (n−1) + … + 1, so O(n²).",
    },
  ],
  answer: "(a) 25 swaps: 1 + 2 + 1 + 0 + 4 + 5 + 7 + 5\n(b) Insertion O(n²) · Merge O(n lg n) · Heap O(n lg n) · Selection O(n²) · Quick O(n lg n)",
  takeaway: "Swaps = bigger numbers to the left, added up. Heap sort: build O(n), n removals × lg n.",
};

export const DAILY: Exam = {
  id: "daily",
  term: "Daily Problems",
  date: "Practice set · from the daily drop",
  blurb: "Problems you've solved from the daily drop, saved here so what tripped you up counts in your analytics.",
  practice: true,
  sections: [
    { id: "A", name: "Basic Data Structures", questions: [PAL, TEAM] },
    { id: "D", name: "Algorithms", questions: [P287] },
  ],
};
