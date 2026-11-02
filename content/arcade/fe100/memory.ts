import type { Question } from "@/lib/arcade/types";
import { loops } from "../fall2026-ab";
import { A1 as SPRING24_A1 } from "../spring2024";
import { A1 as SUMMER26_A1 } from "../summer2026";

// FE 100 · Dynamic Memory Management (problems 1–9).

const TOPIC = "Dynamic Memory Management";

const JUICE = `typedef struct JuiceCase {
    char flavor[20];    // a fixed array inside the struct
    int numBottles;
    double price;
} JuiceCase;`;

const Q1: Question = {
  id: "1",
  pts: 5,
  category: "DSN",
  topic: TOPIC,
  title: "Allocate and initialize a juice case",
  story:
    "A juice stand tracks each case of juice with the `JuiceCase` struct in your inventory.\n\nWrite `makeCase`, which **dynamically allocates one** `JuiceCase`, fills in all three fields from its parameters, and returns a pointer to it. If the allocation fails, return `NULL`. You may assume `flavor` has fewer than 20 characters.",
  given: [
    { id: "q1-struct", title: "struct JuiceCase", kind: "code", body: JUICE },
    { id: "q1-header", title: "Function header", kind: "code", body: "JuiceCase* makeCase(char* flavor, int numBottles, double price) {\n\n}" },
  ],
  scaffold: { title: "makeCase so far", code: "JuiceCase* makeCase(char* flavor, int numBottles, double price) {\n    {{alloc}}\n    {{check}}\n    {{flavor}}\n    {{bottles}}\n    {{price}}\n    {{ret}}\n}" },
  steps: [
    {
      id: "how-big",
      kind: "choice",
      title: "How many bytes?",
      prompt: "We need room for **one whole** `JuiceCase`. What goes inside `malloc( )`?",
      mono: true,
      options: [
        { t: "sizeof(JuiceCase)", ok: true, why: "Yes. `sizeof` measures the whole struct: the 20-char array, the int and the double together." },
        { t: "sizeof(JuiceCase*)", why: "That's the size of a *pointer* (8 bytes), far too small to hold the struct itself." },
        { t: "20 + sizeof(int)", why: "That forgets the double, and structs can have padding. Let `sizeof` do the counting." },
      ],
    },
    {
      id: "alloc",
      kind: "type",
      title: "Allocate the struct",
      pts: 1,
      prompt: "**Line 1 (1 pt).** Allocate one `JuiceCase` and store the address in a new pointer called `jc`.",
      answers: ["JuiceCase* jc = malloc(sizeof(JuiceCase));", "JuiceCase* jc = (JuiceCase*)malloc(sizeof(JuiceCase));", "JuiceCase* jc = calloc(1, sizeof(JuiceCase));"],
      hints: [{ when: "*", at: ")", say: "Inside `sizeof`, measure the struct itself, not a pointer to it." }],
    },
    {
      id: "check",
      kind: "type",
      title: "Did it work?",
      pts: 1,
      prompt: "**Line 2 (1 pt).** If `malloc` failed, `jc` is `NULL`. Return `NULL` in that case, all on one line.",
      answers: ["if (jc == NULL) return NULL;", "if (!jc) return NULL;", "if (NULL == jc) return NULL;"],
      hints: [{ when: "=", at: "==", say: "One `=` would *store* NULL in jc. You want to *ask* whether it is NULL." }],
    },
    {
      id: "why-strcpy",
      kind: "choice",
      title: "Copying a string",
      prompt: "`flavor` in the struct is a `char` **array**. Why can't we write `jc->flavor = flavor;`?",
      options: [
        { t: "You can't assign to an array in C. You copy the characters in with strcpy", ok: true, why: "Right. An array name isn't a variable you can point somewhere else. `strcpy(dest, src)` copies letter by letter, including the `'\\0'`." },
        { t: "Because flavor is a pointer and pointers can't be copied", why: "Pointers copy fine. The problem is the *left* side: `jc->flavor` is an array, and arrays can't be assigned to." },
        { t: "It works, it's just slower", why: "It doesn't compile. Arrays can't appear on the left of `=`." },
      ],
    },
    {
      id: "flavor",
      kind: "type",
      title: "Copy the flavor",
      pts: 1,
      prompt: "**Line 3 (1 pt).** Copy `flavor` into the struct. `jc` is a pointer, so reach the field with an arrow.",
      answers: ["strcpy(jc->flavor, flavor);"],
      hints: [
        { when: ".", at: "->", say: "`jc` is a *pointer* to the struct. Use `->` to reach through it." },
        { when: "flavor", at: "jc", say: "strcpy's order is (destination, source). The struct's field is the destination." },
      ],
    },
    {
      id: "bottles",
      kind: "type",
      title: "Set the bottles",
      pts: 1,
      prompt: "**Line 4 (1 pt).** Store `numBottles` in the struct. (Plain ints *can* be assigned with `=`.)",
      answers: ["jc->numBottles = numBottles;"],
      hints: [{ when: ".", at: "->", say: "Still a pointer, still an arrow." }],
    },
    {
      id: "price",
      kind: "type",
      title: "Set the price",
      pts: 0,
      prompt: "Store `price` the same way.",
      answers: ["jc->price = price;"],
    },
    {
      id: "ret",
      kind: "type",
      title: "Hand it back",
      pts: 1,
      prompt: "**Line 5 (1 pt).** Return the new case.",
      answers: ["return jc;"],
      hints: [{ when: "*", say: "Return the pointer itself. `*jc` would be the whole struct, but the function returns a `JuiceCase*`." }],
    },
  ],
  answer:
    "JuiceCase* makeCase(char* flavor, int numBottles, double price) {\n    JuiceCase* jc = malloc(sizeof(JuiceCase));\n    if (jc == NULL) return NULL;\n    strcpy(jc->flavor, flavor);\n    jc->numBottles = numBottles;\n    jc->price = price;\n    return jc;\n}",
  takeaway: "malloc(sizeof(TheStruct)), check for NULL, arrows to fill fields, strcpy for char arrays.",
};

const TV = `typedef struct TVShow {
    char* title;    // dynamically allocated
    int seasons;
} TVShow;`;

const Q2: Question = {
  id: "2",
  pts: 5,
  category: "DSN",
  topic: TOPIC,
  title: "Delete a list of TV shows",
  story:
    "`shows` is a **dynamically allocated array** of `n` pointers. Each pointer points to a dynamically allocated `TVShow`, and each show's `title` was dynamically allocated too.\n\nWrite `freeShows` so it frees **every** piece of dynamically allocated memory, with no leaks and without touching memory that's already freed.",
  given: [
    { id: "q2-struct", title: "struct TVShow", kind: "code", body: TV },
    {
      id: "q2-pic",
      title: "What the memory looks like",
      kind: "text",
      body: 'shows ──► [ ptr | ptr | ptr ]          (array of n pointers)\n             │\n             ▼\n          TVShow { title ──► "Lost\\0", seasons = 6 }',
    },
    { id: "q2-header", title: "Function header", kind: "code", body: "void freeShows(TVShow** shows, int n) {\n\n}" },
  ],
  scaffold: { title: "freeShows so far", code: "void freeShows(TVShow** shows, int n) {\n    {{loop}}\n        {{title}}\n        {{show}}\n    }\n    {{arr}}\n}" },
  steps: [
    {
      id: "order",
      kind: "choice",
      title: "Which order?",
      prompt: "Three layers: the array, each show, each title. In what order do we free them?",
      options: [
        { t: "Inside out: each title, then its show, then the array last", ok: true, why: "Yes. Once you free a show you can't read `->title` from it any more, so the title has to go first. The array goes last because you need it to find the shows." },
        { t: "The array first, then the shows, then the titles", why: "After freeing the array you can't reach `shows[i]` any more, so every show and title leaks." },
        { t: "Just free(shows); C frees what's inside automatically", why: "C never frees nested memory for you. Every malloc needs its own free." },
      ],
    },
    {
      id: "loop",
      kind: "type",
      title: "Visit each show",
      pts: 0,
      prompt: "Warm-up. Write the `for` header (with its opening brace) that visits every index of `shows`.",
      answers: loops(["int i=0"], ["i<n"], ["i++", "++i", "i+=1"], ["{"]),
      hints: [{ when: "<=", at: "<", say: "Indices run 0 to n−1." }],
    },
    {
      id: "title",
      kind: "type",
      title: "Free the title",
      pts: 2,
      prompt: "**Line 1 (2 pts).** Free show `i`'s title first.",
      answers: ["free(shows[i]->title);"],
      hints: [{ when: ".", at: "->", say: "`shows[i]` is a *pointer* to a TVShow, so use `->`." }],
    },
    {
      id: "show",
      kind: "type",
      title: "Free the show",
      pts: 1,
      prompt: "**Line 2 (1 pt).** Now free the show itself.",
      answers: ["free(shows[i]);"],
    },
    {
      id: "arr",
      kind: "type",
      title: "Free the array",
      pts: 2,
      prompt: "**Line 3 (2 pts).** After the loop, free the array of pointers.",
      answers: ["free(shows);"],
      hints: [{ when: "*", say: "Pass the array pointer itself: `free(shows)`." }],
    },
  ],
  answer: "void freeShows(TVShow** shows, int n) {\n    for (int i = 0; i < n; i++) {\n        free(shows[i]->title);\n        free(shows[i]);\n    }\n    free(shows);\n}",
  takeaway: "Free inside out: the deepest malloc first, the array you used to find everything last.",
};

const POINT = `typedef struct point {
    int x;
    int y;
} point;`;

const Q3: Question = {
  id: "3",
  pts: 5,
  category: "DSN",
  topic: TOPIC,
  title: "Random points on a grid",
  story:
    "Write `randomPoints`, which **dynamically allocates an array** of `n` `point` structs, gives each point a random `x` and `y` between `0` and `maxCoord` inclusive, and returns the array.\n\nUse `rand()`, which returns a random non-negative int. (`rand() % k` gives a number from 0 to k − 1.)",
  given: [
    { id: "q3-struct", title: "struct point", kind: "code", body: POINT },
    { id: "q3-header", title: "Function header", kind: "code", body: "point* randomPoints(int n, int maxCoord) {\n\n}" },
  ],
  scaffold: { title: "randomPoints so far", code: "point* randomPoints(int n, int maxCoord) {\n    {{alloc}}\n    {{loop}}\n        {{x}}\n        {{y}}\n    }\n    {{ret}}\n}" },
  steps: [
    {
      id: "alloc",
      kind: "type",
      title: "Allocate the array",
      pts: 2,
      prompt: "**Line 1 (2 pts).** Allocate `n` points (the structs themselves, side by side) and store them in a new pointer called `pts`.",
      answers: ["point* pts = malloc(sizeof(point) * n);", "point* pts = malloc(n * sizeof(point));", "point* pts = calloc(n, sizeof(point));", "point* pts = (point*)malloc(sizeof(point) * n);"],
      hints: [{ when: "*", at: ")", say: "This array holds whole points, not pointers to points. Measure `sizeof(point)`." }],
    },
    {
      id: "loop",
      kind: "type",
      title: "Visit each point",
      pts: 0,
      prompt: "Warm-up. Write the `for` header (with its opening brace) that visits all `n` points.",
      answers: loops(["int i=0"], ["i<n"], ["i++", "++i", "i+=1"], ["{"]),
    },
    {
      id: "range",
      kind: "choice",
      title: "0 to maxCoord inclusive",
      prompt: "`rand() % k` gives 0 up to k − 1. We want 0 up to `maxCoord`, **including** maxCoord. What's k?",
      mono: true,
      options: [
        { t: "maxCoord + 1", ok: true, why: "`% (maxCoord + 1)` gives 0 … maxCoord. The +1 lets maxCoord itself show up." },
        { t: "maxCoord", why: "That gives 0 … maxCoord − 1, so maxCoord could never appear." },
        { t: "maxCoord - 1", why: "That stops even earlier, at maxCoord − 2." },
      ],
    },
    {
      id: "x",
      kind: "type",
      title: "Random x",
      pts: 1,
      prompt: "**Line 2 (1 pt).** Set point `i`'s `x`. `pts[i]` is a whole struct (not a pointer), so use a dot.",
      answers: ["pts[i].x = rand() % (maxCoord + 1);", "pts[i].x = rand() % (maxCoord+1);"],
      hints: [
        { when: "->", at: ".", say: "`pts[i]` is already the struct itself. The `[i]` did the pointer-following for you, so use a dot." },
        { when: "maxCoord", at: "(", say: "Without parentheses, `%` happens before `+`. Wrap `maxCoord + 1`." },
      ],
    },
    {
      id: "y",
      kind: "type",
      title: "Random y",
      pts: 1,
      prompt: "**Line 3 (1 pt).** Same for `y`.",
      answers: ["pts[i].y = rand() % (maxCoord + 1);", "pts[i].y = rand() % (maxCoord+1);"],
      hints: [{ when: "->", at: ".", say: "`pts[i]` is a struct, so it's a dot." }],
    },
    {
      id: "ret",
      kind: "type",
      title: "Return",
      pts: 1,
      prompt: "**Line 4 (1 pt).** After the loop, return the array.",
      answers: ["return pts;"],
    },
  ],
  answer:
    "point* randomPoints(int n, int maxCoord) {\n    point* pts = malloc(sizeof(point) * n);\n    for (int i = 0; i < n; i++) {\n        pts[i].x = rand() % (maxCoord + 1);\n        pts[i].y = rand() % (maxCoord + 1);\n    }\n    return pts;\n}",
  takeaway: "An array of structs: arr[i].field (dot). A pointer to a struct: p->field (arrow).",
};

const LEAKY = `typedef struct node {
    int data;
    struct node* next;
} node;

// Removes the first node of the list. Has a memory leak!
void deleteFront(node** pHead) {
    if (*pHead == NULL) return;
    *pHead = (*pHead)->next;
}`;

const Q4: Question = {
  id: "4",
  pts: 5,
  category: "DSN",
  topic: TOPIC,
  title: "Fix the linked list leak",
  story:
    "The function `deleteFront` in your inventory is meant to remove the first node of a linked list. Every node was dynamically allocated. It moves the head forward correctly, but it has a **memory leak**.\n\nFind the leak, then rewrite the body so it removes and frees the old front node.",
  given: [{ id: "q4-code", title: "deleteFront (buggy)", kind: "code", body: LEAKY }],
  scaffold: { title: "deleteFront, fixed", code: "void deleteFront(node** pHead) {\n    if (*pHead == NULL) return;\n    {{save}}\n    {{move}}\n    {{free}}\n}" },
  steps: [
    {
      id: "why-double",
      kind: "choice",
      title: "Why node** ?",
      prompt: "Why does `deleteFront` take a `node**` instead of a `node*`?",
      options: [
        { t: "So it can change the caller's head pointer itself", ok: true, why: "Yes. The head changes to the second node. With a plain `node*` you'd only change a local copy, and the caller would never see it." },
        { t: "Because the list is two-dimensional", why: "It's a regular singly linked list. The second star is about changing the caller's pointer." },
        { t: "free() only accepts double pointers", why: "free takes any pointer. The `**` is so the function can move the caller's head." },
      ],
    },
    {
      id: "leak",
      kind: "choice",
      title: "Where's the leak?",
      pts: 1,
      prompt: "**(1 pt)** What memory leaks?",
      options: [
        { t: "The old front node: after the head moves, nothing points at it, so it can never be freed", ok: true, why: "Exactly. Once `*pHead` moves on, the old first node is unreachable. It's still allocated, but nobody can free it." },
        { t: "The whole list", why: "Only one node is lost per call. The rest are still reachable from the new head." },
        { t: "pHead itself", why: "`pHead` is a parameter on the stack, not something from malloc." },
      ],
    },
    {
      id: "free-first",
      kind: "choice",
      title: "Free first?",
      pts: 1,
      prompt: "**(1 pt)** What if we just wrote `free(*pHead);` and *then* `*pHead = (*pHead)->next;`?",
      options: [
        { t: "Wrong: it reads ->next from memory we already gave back", ok: true, why: "Right. After `free`, that node's memory isn't ours. Reading `->next` from it is undefined behaviour. Save the node, move the head, *then* free." },
        { t: "That works fine", why: "It reads `->next` out of a freed node, which is undefined behaviour. It might seem to work, then crash on exam day." },
        { t: "It frees the wrong node", why: "It frees the right node, but too early: we still need its `next` pointer." },
      ],
    },
    {
      id: "save",
      kind: "type",
      title: "Save the old front",
      pts: 1,
      prompt: "**Fix, line 1 (1 pt).** Save the current front node in a new pointer called `tmp`.",
      answers: ["node* tmp = *pHead;"],
      hints: [{ when: "pHead", at: "*", say: "`pHead` is the address of the head pointer. The front node is `*pHead`." }],
    },
    {
      id: "move",
      kind: "type",
      title: "Move the head",
      pts: 1,
      prompt: "**Fix, line 2 (1 pt).** Point the caller's head at the second node. (You can use `tmp` now.)",
      answers: ["*pHead = tmp->next;", "*pHead = (*pHead)->next;"],
      hints: [{ when: "pHead", at: "*", say: "Change what the caller's head points at: that's `*pHead`, not `pHead`." }],
    },
    {
      id: "free",
      kind: "type",
      title: "Free the old front",
      pts: 1,
      prompt: "**Fix, line 3 (1 pt).** Free the old front node.",
      answers: ["free(tmp);"],
    },
  ],
  answer: "void deleteFront(node** pHead) {\n    if (*pHead == NULL) return;\n    node* tmp = *pHead;\n    *pHead = tmp->next;\n    free(tmp);\n}",
  takeaway: "Save, move, free: grab the node, step past it, then give it back.",
};

const EMP = `typedef struct employee {
    char* name;      // dynamically allocated: exactly enough room
    int id;
    double salary;
} employee;`;

const Q5: Question = {
  id: "5",
  pts: 10,
  category: "DSN",
  topic: TOPIC,
  title: "Read in the employees",
  story:
    "Write `readEmployees`, which reads `n` employees from standard input and returns them as a **dynamically allocated array** of `employee` structs.\n\nEach line of input holds a name (one word, at most 49 letters), an id and a salary, like `Rosa 1042 51000.50`.\n\nEach `name` must be **dynamically allocated with exactly enough space** for its string. Use the buffer `buf` to read each name before copying it.",
  given: [
    { id: "q5-struct", title: "struct employee", kind: "code", body: EMP },
    { id: "q5-header", title: "Function header", kind: "code", body: "employee* readEmployees(int n) {\n    char buf[50];\n\n}" },
  ],
  scaffold: {
    title: "readEmployees so far",
    code: "employee* readEmployees(int n) {\n    char buf[50];\n    {{alloc}}\n    {{loop}}\n        {{read}}\n        {{name}}\n        {{copy}}\n    }\n    {{ret}}\n}",
  },
  steps: [
    {
      id: "alloc",
      kind: "type",
      title: "Allocate the array",
      pts: 2,
      prompt: "**Line 1 (2 pts).** Allocate room for `n` employee structs. Store it in a new pointer called `list`.",
      answers: ["employee* list = malloc(sizeof(employee) * n);", "employee* list = malloc(n * sizeof(employee));", "employee* list = calloc(n, sizeof(employee));", "employee* list = (employee*)malloc(sizeof(employee) * n);"],
      hints: [{ when: "*", at: ")", say: "The array holds whole employee structs, so measure `sizeof(employee)`." }],
    },
    {
      id: "loop",
      kind: "type",
      title: "One employee at a time",
      pts: 0,
      prompt: "Warm-up. Write the `for` header (with its opening brace) for `n` employees.",
      answers: loops(["int i=0"], ["i<n"], ["i++", "++i", "i+=1"], ["{"]),
    },
    {
      id: "read",
      kind: "type",
      title: "Read one line",
      pts: 2,
      prompt: "**Line 2 (2 pts).** Read the name into `buf` and the id and salary straight into `list[i]`.\n\nReminder: `%s` = string, `%d` = int, `%lf` = double. Strings don't need `&`, but ints and doubles do.",
      answers: ['scanf("%s %d %lf", buf, &list[i].id, &list[i].salary);', 'scanf("%s%d%lf", buf, &list[i].id, &list[i].salary);'],
      hints: [
        { when: "list", at: "&", say: "scanf needs the *address* of the int and the double, so put `&` in front." },
        { when: '"%s %d %f"', say: "For a `double`, scanf needs `%lf` (the l is for long float)." },
        { when: "&", at: "buf", say: "`buf` is an array, and an array name is already an address. No `&` for it." },
      ],
    },
    {
      id: "plus-one",
      kind: "choice",
      title: "Exactly enough space",
      prompt: "`buf` holds `\"Rosa\"`, and `strlen(buf)` is 4. How many chars do we need for the name?",
      options: [
        { t: "5: the four letters plus the '\\0' at the end", ok: true, why: "Yes. strlen doesn't count the null terminator, but the string needs it. Always `strlen + 1`." },
        { t: "4", why: "Then there's no room for `'\\0'`, and strcpy writes one byte past the end." },
        { t: "50, the size of buf", why: "That works but wastes space. The question says *exactly* enough." },
      ],
    },
    {
      id: "name",
      kind: "type",
      title: "Allocate the name",
      pts: 3,
      prompt: "**Line 3 (3 pts).** Allocate exactly enough room for the name and store it in `list[i].name`.",
      answers: [
        "list[i].name = malloc(sizeof(char) * (strlen(buf) + 1));",
        "list[i].name = malloc((strlen(buf) + 1) * sizeof(char));",
        "list[i].name = malloc(strlen(buf) + 1);",
        "list[i].name = calloc(strlen(buf) + 1, sizeof(char));",
      ],
      hints: [
        { when: ")", at: "+", say: "Don't forget the `+ 1` for the `'\\0'`." },
        { when: "->", at: ".", say: "`list[i]` is a struct, not a pointer, so use a dot." },
      ],
    },
    {
      id: "copy",
      kind: "type",
      title: "Copy the name in",
      pts: 2,
      prompt: "**Line 4 (2 pts).** Copy `buf` into the new name.",
      answers: ["strcpy(list[i].name, buf);"],
      hints: [{ when: "buf", at: "list", say: "strcpy goes (destination, source). The new name is the destination." }],
    },
    {
      id: "ret",
      kind: "type",
      title: "Return",
      pts: 1,
      prompt: "**Line 5 (1 pt).** After the loop, return the array.",
      answers: ["return list;"],
    },
  ],
  answer:
    'employee* readEmployees(int n) {\n    char buf[50];\n    employee* list = malloc(sizeof(employee) * n);\n    for (int i = 0; i < n; i++) {\n        scanf("%s %d %lf", buf, &list[i].id, &list[i].salary);\n        list[i].name = malloc(sizeof(char) * (strlen(buf) + 1));\n        strcpy(list[i].name, buf);\n    }\n    return list;\n}',
  takeaway: "Read into a buffer, malloc strlen + 1, then strcpy. That's the exam's favourite pattern.",
};

const BOOK = `typedef struct book {
    char* title;       // dynamically allocated
    char** authors;    // dynamically allocated array of numAuthors strings,
                       // and each string is dynamically allocated too
    int numAuthors;
} book;`;

const Q6: Question = {
  id: "6",
  pts: 10,
  category: "DSN",
  topic: TOPIC,
  title: "Free the whole library",
  story:
    "`library` is a **dynamically allocated array** of `numBooks` `book` structs (the structs themselves, not pointers). Each book's title, its authors array and every author string were all dynamically allocated.\n\nWrite `freeLibrary` so it frees **all** of that memory.",
  given: [
    { id: "q6-struct", title: "struct book", kind: "code", body: BOOK },
    { id: "q6-header", title: "Function header", kind: "code", body: "void freeLibrary(book* library, int numBooks) {\n\n}" },
  ],
  scaffold: {
    title: "freeLibrary so far",
    code: "void freeLibrary(book* library, int numBooks) {\n    {{outer}}\n        {{inner}}\n            {{author}}\n        {{authors}}\n        {{title}}\n    }\n    {{lib}}\n}",
  },
  steps: [
    {
      id: "count",
      kind: "choice",
      title: "Count the mallocs",
      prompt: "For **one** book with 3 authors, how many separate blocks of memory were allocated (not counting the library array)?",
      options: [
        { t: "5: the title, the authors array, and 3 author strings", ok: true, why: "Yes. Each of those needs its own `free`. The book struct itself lives inside the library array, so it's freed with the array." },
        { t: "2: the title and the authors array", why: "Each author string is its own malloc too." },
        { t: "1: the book", why: "The struct holds *pointers* to separately allocated memory. Each pointer's block needs freeing." },
      ],
    },
    {
      id: "outer",
      kind: "type",
      title: "Loop over books",
      pts: 1,
      prompt: "**Line 1 (1 pt).** Write the `for` header (with its opening brace) that visits every book, using `i`.",
      answers: loops(["int i=0"], ["i<numBooks"], ["i++", "++i", "i+=1"], ["{"]),
    },
    {
      id: "inner",
      kind: "type",
      title: "Loop over authors",
      pts: 1,
      prompt: "**Line 2 (1 pt).** Inside it, write the `for` header that visits every author of book `i`, using `j`. (No brace needed: its body is one line.)",
      answers: loops(["int j=0"], ["j<library[i].numAuthors"], ["j++", "++j", "j+=1"]),
      hints: [{ when: "->", at: ".", say: "`library[i]` is a struct (the array holds structs), so use a dot." }],
    },
    {
      id: "author",
      kind: "type",
      title: "Free one author",
      pts: 2,
      prompt: "**Line 3 (2 pts).** Free author `j` of book `i`.",
      answers: ["free(library[i].authors[j]);"],
    },
    {
      id: "authors",
      kind: "type",
      title: "Free the authors array",
      pts: 2,
      prompt: "**Line 4 (2 pts).** After the inner loop, free book `i`'s array of author pointers.",
      answers: ["free(library[i].authors);"],
    },
    {
      id: "title",
      kind: "type",
      title: "Free the title",
      pts: 2,
      prompt: "**Line 5 (2 pts).** Free book `i`'s title.",
      answers: ["free(library[i].title);"],
    },
    {
      id: "lib",
      kind: "type",
      title: "Free the library",
      pts: 2,
      prompt: "**Line 6 (2 pts).** After the outer loop, free the array of books.",
      answers: ["free(library);"],
    },
  ],
  answer:
    "void freeLibrary(book* library, int numBooks) {\n    for (int i = 0; i < numBooks; i++) {\n        for (int j = 0; j < library[i].numAuthors; j++)\n            free(library[i].authors[j]);\n        free(library[i].authors);\n        free(library[i].title);\n    }\n    free(library);\n}",
  takeaway: "One free per malloc. Count the stars in the struct to find them all.",
};

const GAME = `typedef struct game {
    char* title;    // dynamically allocated
    int year;
} game;

typedef struct inventory {
    game** games;   // dynamically allocated array of numGames pointers,
                    // each pointing to a dynamically allocated game
    int numGames;
} inventory;`;

const Q9: Question = {
  id: "9",
  pts: 15,
  category: "DSN",
  topic: TOPIC,
  title: "Deep copy the arcade inventory",
  story:
    "A retro shop keeps its 1980s video games in an `inventory`. Write `deepCopy`, which returns a pointer to a **brand-new** inventory that is an exact copy of `src` but **shares no memory** with it. Changing or freeing the copy must never affect the original.\n\nYou may assume every allocation succeeds.",
  given: [
    { id: "q9-struct", title: "structs game and inventory", kind: "code", body: GAME },
    { id: "q9-header", title: "Function header", kind: "code", body: "inventory* deepCopy(inventory* src) {\n\n}" },
  ],
  scaffold: {
    title: "deepCopy so far",
    code: "inventory* deepCopy(inventory* src) {\n    {{inv}}\n    {{num}}\n    {{arr}}\n    {{loop}}\n        {{game}}\n        {{year}}\n        {{title}}\n        {{copy}}\n    }\n    {{ret}}\n}",
  },
  steps: [
    {
      id: "deep",
      kind: "choice",
      title: "Shallow vs deep",
      prompt: "What if we just did `copy->games = src->games;`?",
      options: [
        { t: "That's a shallow copy: both inventories would point at the same games, so freeing one breaks the other", ok: true, why: "Right. A *deep* copy mallocs fresh memory for every layer and copies the values in." },
        { t: "That's a deep copy", why: "It copies one pointer, so both inventories share the same array of games." },
        { t: "It won't compile", why: "It compiles fine. That's what makes it a sneaky bug." },
      ],
    },
    {
      id: "inv",
      kind: "type",
      title: "New inventory",
      pts: 2,
      prompt: "**Line 1 (2 pts).** Allocate a new `inventory` and store it in a new pointer called `copy`.",
      answers: ["inventory* copy = malloc(sizeof(inventory));", "inventory* copy = (inventory*)malloc(sizeof(inventory));"],
    },
    {
      id: "num",
      kind: "type",
      title: "Copy the count",
      pts: 1,
      prompt: "**Line 2 (1 pt).** Copy `numGames` across.",
      answers: ["copy->numGames = src->numGames;"],
    },
    {
      id: "arr",
      kind: "type",
      title: "New array of pointers",
      pts: 3,
      prompt: "**Line 3 (3 pts).** Allocate a new array of `src->numGames` **game pointers** for `copy->games`.",
      answers: ["copy->games = malloc(sizeof(game*) * src->numGames);", "copy->games = malloc(src->numGames * sizeof(game*));", "copy->games = malloc(sizeof(game*) * copy->numGames);", "copy->games = malloc(copy->numGames * sizeof(game*));"],
      hints: [{ when: ")", at: "*", say: "Each slot holds a *pointer* to a game, so measure `sizeof(game*)`." }],
    },
    {
      id: "loop",
      kind: "type",
      title: "Each game",
      pts: 1,
      prompt: "**Line 4 (1 pt).** Write the `for` header (with its opening brace) that visits each game.",
      answers: [...loops(["int i=0"], ["i<src->numGames"], ["i++", "++i", "i+=1"], ["{"]), ...loops(["int i=0"], ["i<copy->numGames"], ["i++", "++i", "i+=1"], ["{"])],
    },
    {
      id: "game",
      kind: "type",
      title: "New game",
      pts: 2,
      prompt: "**Line 5 (2 pts).** Allocate a new `game` for slot `i` of the copy.",
      answers: ["copy->games[i] = malloc(sizeof(game));", "copy->games[i] = (game*)malloc(sizeof(game));"],
    },
    {
      id: "year",
      kind: "type",
      title: "Copy the year",
      pts: 1,
      prompt: "**Line 6 (1 pt).** Copy the year. `copy->games[i]` is a pointer, so use an arrow.",
      answers: ["copy->games[i]->year = src->games[i]->year;"],
    },
    {
      id: "title",
      kind: "type",
      title: "Room for the title",
      pts: 3,
      prompt: "**Line 7 (3 pts).** Allocate exactly enough room for the title, measured from the source game's title.",
      answers: [
        "copy->games[i]->title = malloc(sizeof(char) * (strlen(src->games[i]->title) + 1));",
        "copy->games[i]->title = malloc((strlen(src->games[i]->title) + 1) * sizeof(char));",
        "copy->games[i]->title = malloc(strlen(src->games[i]->title) + 1);",
      ],
      hints: [{ when: ")", at: "+", say: "strlen doesn't count the `'\\0'`, so add 1." }],
    },
    {
      id: "copy",
      kind: "type",
      title: "Copy the title",
      pts: 1,
      prompt: "**Line 8 (1 pt).** Copy the title's letters in.",
      answers: ["strcpy(copy->games[i]->title, src->games[i]->title);"],
    },
    {
      id: "ret",
      kind: "type",
      title: "Return",
      pts: 1,
      prompt: "**Line 9 (1 pt).** After the loop, return the copy.",
      answers: ["return copy;"],
    },
  ],
  answer:
    "inventory* deepCopy(inventory* src) {\n    inventory* copy = malloc(sizeof(inventory));\n    copy->numGames = src->numGames;\n    copy->games = malloc(sizeof(game*) * src->numGames);\n    for (int i = 0; i < src->numGames; i++) {\n        copy->games[i] = malloc(sizeof(game));\n        copy->games[i]->year = src->games[i]->year;\n        copy->games[i]->title = malloc(sizeof(char) * (strlen(src->games[i]->title) + 1));\n        strcpy(copy->games[i]->title, src->games[i]->title);\n    }\n    return copy;\n}",
  takeaway: "Deep copy = one malloc for every malloc the original had, then copy the values in.",
};

export const MEMORY: Question[] = [
  Q1,
  Q2,
  Q3,
  Q4,
  Q5,
  Q6,
  { ...SPRING24_A1, id: "7", topic: TOPIC, title: "Dynamic triangular sum (Spring 2024 A1)" },
  { ...SUMMER26_A1, id: "8", topic: TOPIC, title: "Odd star log (Summer 2026 A1)" },
  Q9,
];
