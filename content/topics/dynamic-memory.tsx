import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const dynamicMemory: Topic = {
  slug: "dynamic-memory",
  title: "Pointers & Dynamic Memory",
  short: "Dynamic Memory",
  emoji: "📦",
  section: "IA",
  mascot: "mochi",
  tagline: "Memory is just a giant wall of numbered cubbies. Pointers are sticky notes with a cubby number on them!",
  minutes: 20,
  tldr: [
    <>Your program has two main memory neighborhoods: the <Hi c="sky">stack</Hi> 🎒 (automatic, cleaned up for you) and the <Hi>heap</Hi> 🏔 (you ask for it, you give it back).</>,
    <>A <b>pointer</b> is a variable that holds an <b>address</b>, a sticky note saying &ldquo;your stuff is in cubby #4096&rdquo;.</>,
    <><code>malloc(bytes)</code> rents space on the heap and returns its address. <code>free(ptr)</code> gives it back.</>,
    <>Every <code>malloc</code> needs exactly <b>one</b> <code>free</code>. Zero frees = <b>leak</b> 💧. Two frees = <b>crash</b> 💥.</>,
    <>FE favorite: allocate a 2D array or an array of structs, then <b>free it inside-out</b> (inner stuff first, outer holder last).</>,
  ],
  picture: {
    title: "The café's backpack vs. the storage unit",
    scene: (
      <EmojiRow items={[["🎒", "stack = backpack"], ["🔑", "pointer = key"], ["🏬", "heap = storage unit"], ["🧾", "free = return key"]]} />
    ),
    caption: "rent it, use it, return it",
    body: (
      <>
        <p>
          <b>The stack is your backpack.</b> When you walk into a function (a class period), you get a fresh backpack for your local variables. When the function ends, the backpack is emptied <i>automatically</i>. It&apos;s fast, but small, and it doesn&apos;t last.
        </p>
        <p>
          <b>The heap is a storage-unit building.</b> You go to the front desk (<code>malloc</code>), ask for a unit of a certain size, and they hand you a <b>key with the unit number</b> (the pointer). The unit stays yours until you return the key (<code>free</code>). Even after your function ends!
        </p>
        <ul>
          <li>🔑 Lose the key without returning it? You pay forever and can&apos;t get in. <b>Memory leak.</b></li>
          <li>👻 Return the key but keep a copy and sneak back in? Someone else&apos;s stuff might be there now. <b>Dangling pointer.</b></li>
          <li>💥 Return the same key twice? The front desk freaks out. <b>Double free.</b></li>
        </ul>
      </>
    ),
  },
  levels: [
    {
      title: "What even is a pointer?",
      body: (
        <>
          <p>Memory is a long row of numbered boxes (bytes). Every variable lives in some box and has an <b>address</b> (its box number).</p>
          <Code
            title="pointer basics"
            src={`
int cookies = 5;        // a box holding 5
int *p = &cookies;      // p holds the ADDRESS of cookies
printf("%d", *p);       // *p = "go to that address" → prints 5
*p = 12;                // changes cookies to 12!`}
          />
          <ul>
            <li><code>&amp;x</code> = &ldquo;<b>a</b>ddress of x&rdquo; (the house&apos;s street address 🏠)</li>
            <li><code>*p</code> = &ldquo;follow the arrow&rdquo; (walk to that house and look inside)</li>
            <li><code>int *p</code> means &ldquo;p points to an int&rdquo;</li>
          </ul>
        </>
      ),
    },
    {
      title: "Asking the heap for memory",
      body: (
        <>
          <p>Local arrays like <code>int a[100]</code> need their size <i>at compile time</i> and die when the function returns. When you need a size decided <b>at runtime</b>, or memory that <b>outlives the function</b>, use the heap:</p>
          <Code
            title="the 4 heap functions"
            src={`
int *a = malloc(n * sizeof(int));   // n ints, GARBAGE values
int *b = calloc(n, sizeof(int));    // n ints, all ZERO
a = realloc(a, 2 * n * sizeof(int)); // grow to 2n (may MOVE!)
free(a);                            // give it back
free(b);`}
          />
          <p>
            <code>malloc</code> takes <Hi>bytes</Hi>, not &ldquo;number of things&rdquo;. That&apos;s why we multiply by <code>sizeof</code>. It returns <code>NULL</code> if it fails. Once you have <code>a</code>, you use it exactly like an array: <code>a[i]</code> is the same as <code>*(a + i)</code>.
          </p>
        </>
      ),
    },
    {
      title: "Pointers to pointers: 2D arrays & arrays of structs",
      body: (
        <>
          <p>A dynamic 2D array is an <b>array of row-pointers</b>, where each pointer leads to its own row. Think of a bookshelf 📚 (the outer array) where each shelf slot holds a <i>note</i> saying where that row&apos;s books are stored.</p>
          <Code
            title="2D array: allocate & free"
            src={`
int **grid = malloc(rows * sizeof(int*));     // the shelf of row-pointers
for (int i = 0; i < rows; i++)
    grid[i] = malloc(cols * sizeof(int));     // each row

// ... use grid[r][c] ...

for (int i = 0; i < rows; i++)
    free(grid[i]);                            // rows FIRST
free(grid);                                   // the shelf LAST`}
          />
          <Callout kind="warn" title="Why rows first?">
            If you <code>free(grid)</code> first, the notes saying where each row lives are gone. You can&apos;t free the rows anymore, so they leak.
          </Callout>
        </>
      ),
    },
    {
      title: "FE level: structs with dynamic strings",
      body: (
        <>
          <p>The classic FE question: an array of pointers to structs, where each struct has a dynamically allocated string. Allocate by working <b>outside-in</b>, and free by working <b>inside-out</b>.</p>
          <Code
            title="array of struct pointers"
            src={`
typedef struct {
    char *name;    // dynamically allocated
    int stars;
} Cafe;

Cafe **makeCafes(int n) {
    Cafe **list = malloc(n * sizeof(Cafe*));            // 1. array of pointers
    for (int i = 0; i < n; i++) {
        char buf[100];
        list[i] = malloc(sizeof(Cafe));                  // 2. each struct
        scanf("%s %d", buf, &list[i]->stars);
        list[i]->name = malloc(strlen(buf) + 1);         // 3. each string (+1 for '\\0'!)
        strcpy(list[i]->name, buf);
    }
    return list;
}

void freeCafes(Cafe **list, int n) {
    for (int i = 0; i < n; i++) {
        free(list[i]->name);   // innermost
        free(list[i]);
    }
    free(list);                // outermost
}`}
          />
          <p><code>list[i]-&gt;stars</code> is shorthand for <code>(*list[i]).stars</code>. The arrow means &ldquo;follow the pointer, then grab the field&rdquo;.</p>
        </>
      ),
    },
  ],
  widgets: ["pointers"],
  drills: [["Redo: Summer 26 Q1 (sentinel array)","exam-redo/sum26-q1-odd-stars.c"],["Redo: Spring 2020 free the TV shows","exam-redo/spr20-delete-shows.c"],["Redo: Summer 2019 CartPoints","exam-redo/sum19-cartpoints.c"],["Redo: Summer 2023 fix freeList","exam-redo/sum23-freelist-fix.c"]],
  mnemonics: [
    { hook: "calloc = Clean, malloc = Messy 🧽", body: <p>calloc hands you <b>zeroed</b> memory. malloc hands you whatever garbage was left there.</p> },
    { hook: "Cookies before the jar 🍪🫙", body: <p>Free the stuff <i>inside</i> first (strings, rows), then the container. Throw the jar out first and the cookies are lost forever (leak).</p> },
    { hook: "& = Address, * = Arrow-follow ⭐", body: <p><b>&amp;</b>mpersand → <b>A</b>ddress. The <b>*</b> star is you following the pointer&apos;s arrow like a shooting star.</p> },
    { hook: "One mug out, one mug back ☕", body: <p>Count your mallocs and frees like the café counts mugs. They should match exactly.</p> },
  ],
  missing: [
    {
      title: "What memory actually looks like",
      body: <p>RAM is a huge list of bytes, each with a number (its address). An <code>int</code> is usually 4 bytes, a <code>char</code> is 1, and <b>any pointer</b> is 8 bytes on a 64-bit machine. So <code>sizeof(int*)</code> ≠ <code>sizeof(int)</code>, and mixing them up is a classic bug.</p>,
    },
    {
      title: "Stack vs heap vs global",
      body: (
        <ul>
          <li><b>Stack</b>: local variables and function parameters. Auto-freed on return.</li>
          <li><b>Heap</b>: malloc/calloc/realloc. Lives until <code>free</code>.</li>
          <li><b>Static/global</b>: lives for the whole program.</li>
          <li>Returning <code>&amp;localArray</code> from a function is a bug. The backpack gets emptied as soon as you leave!</li>
        </ul>
      ),
    },
    {
      title: "How to put a string INTO a struct (my note 📝)",
      body: (
        <>
          <div className="table-scroll">
            <table className="cozy">
              <thead>
                <tr><th>Struct declaration</th><th>How to assign a string</th></tr>
              </thead>
              <tbody>
                <tr><td><code>char *name;</code></td><td><code>node-&gt;name = &quot;Minecraft&quot;;</code> ✅</td></tr>
                <tr><td><code>char name[90];</code></td><td><code>strcpy(node-&gt;name, &quot;Minecraft&quot;);</code> ✅</td></tr>
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 10 }}>
            <b>Why:</b> <code>char *name</code> is a sticky note 📌, so <code>=</code> just points it at the text. <code>char name[90]</code> is a box with 90 slots 📦, and you can&apos;t <code>=</code> a whole array in C (compile error!). You have to copy the letters in with <code>strcpy</code>.
          </p>
          <p style={{ margin: 0 }}>
            <b>Bonus:</b> if the text comes from a buffer you&apos;ll reuse (like <code>scanf</code> into <code>buf</code>), the pointer version needs its own memory: <code>node-&gt;name = malloc(strlen(buf) + 1); strcpy(node-&gt;name, buf);</code>
          </p>
        </>
      ),
    },
    {
      title: "C strings end with a secret '\\0'",
      body: <p><code>&quot;cat&quot;</code> is really 4 chars: <code>c a t \0</code>. <code>strlen</code> says 3 because it doesn&apos;t count the terminator, so allocate <code>strlen(s) + 1</code>. Forget it and <code>strcpy</code> writes past your memory.</p>,
    },
    {
      title: "Arrays secretly become pointers",
      body: <p>When you pass an array to a function, C passes the <b>address of element 0</b>. That&apos;s why functions also need the length (<code>int n</code>) as a parameter, and why <code>sizeof(arr)</code> inside the function gives the pointer size (8), not the array size.</p>,
    },
    {
      title: "void* is a 'generic' pointer",
      body: <p><code>malloc</code> returns <code>void*</code>, meaning &ldquo;an address, type unknown&rdquo;. In C it converts automatically to <code>int*</code>, <code>Cafe*</code>, and so on. Casting like <code>(int*)malloc(...)</code> is allowed but not required.</p>,
    },
  ],
  traps: [
    <><code>malloc(n)</code> gives <b>n bytes</b>, not n ints. Always <code>malloc(n * sizeof(int))</code>.</>,
    <>2D arrays: the outer array holds <b>pointers</b>, so use <code>sizeof(int*)</code>. The rows hold ints, so use <code>sizeof(int)</code>. Swapping these loses points.</>,
    <>Strings: <code>malloc(strlen(s) + 1)</code>. The <b>+1</b> for <code>&apos;\0&apos;</code> is graded!</>,
    <>Freeing the outer array before the inner pieces leaks everything inside.</>,
    <>Using a pointer after <code>free</code> (dangling) or freeing it twice. Setting <code>p = NULL</code> after freeing is a good habit.</>,
    <><code>realloc</code> may move your data. Always write <code>p = realloc(p, newSize)</code>, not just <code>realloc(p, newSize)</code>.</>,
  ],
  example: {
    title: "Worked problem: free a jagged 2D array",
    prompt: (
      <>
        <p><b>FE-style:</b> A 2D array of <code>double</code> was allocated as <code>double **table</code> with <code>n</code> rows, where row <code>i</code> has <code>i+1</code> elements. Write <code>double** makeTable(int n)</code> and <code>void freeTable(double **table, int n)</code>.</p>
      </>
    ),
    steps: [
      <p>Draw it first! 🖍 One column of <code>n</code> arrows (the outer array), and each arrow points to a row of length 1, 2, 3, … n. A staircase!</p>,
      <p>The outer array stores <b>pointers to double</b>, so: <code>double **table = malloc(n * sizeof(double*));</code></p>,
      <p>Each row stores doubles: <code>for (i = 0; i &lt; n; i++) table[i] = malloc((i + 1) * sizeof(double));</code> then <code>return table;</code></p>,
      <p>To free, go <b>inside-out</b>: <code>for (i = 0; i &lt; n; i++) free(table[i]);</code></p>,
      <p>Then the outer array: <code>free(table);</code> ✅ That makes n + 1 mallocs and n + 1 frees. Balanced!</p>,
    ],
  },
  quiz: [
    {
      q: <>On a system with 4-byte ints, <code>int *a = malloc(10);</code> gives room for how many ints?</>,
      choices: ["10", "2 (10 bytes ÷ 4, rounded down)", "40", "It won't compile"],
      answer: 1,
      why: <>malloc counts <b>bytes</b>. 10 bytes fits 2 whole ints. You wanted <code>malloc(10 * sizeof(int))</code>.</>,
    },
    {
      q: <>What&apos;s wrong with: <code>free(grid); for (i = 0; i &lt; r; i++) free(grid[i]);</code></>,
      choices: ["Nothing", "Rows must be freed BEFORE grid; after free(grid), reading grid[i] is use-after-free", "You can't free a double pointer", "free takes two arguments"],
      answer: 1,
      why: <>Once the outer array is freed, the row addresses stored in it are gone. Free the inside first!</>,
    },
    {
      q: <>Which function gives you memory that&apos;s already filled with zeros?</>,
      choices: ["malloc", "calloc", "realloc", "free"],
      answer: 1,
      why: <>calloc = Clean alloc 🧽. It also takes two arguments: <code>calloc(count, size)</code>.</>,
    },
    {
      q: <>To copy the word <code>w</code> into new memory, which is correct?</>,
      choices: [<code key="a">malloc(strlen(w))</code>, <code key="b">malloc(strlen(w) + 1)</code>, <code key="c">malloc(sizeof(w))</code>, <code key="d">malloc(w)</code>],
      answer: 1,
      why: <>+1 for the invisible <code>&apos;\0&apos;</code> terminator. (<code>sizeof(w)</code> on a <code>char*</code> is just 8, the pointer size!)</>,
    },
  ],
  flashcards: [
    { front: "What does malloc(n) allocate?", back: "n BYTES on the heap (garbage values). Returns a void* or NULL on failure." },
    { front: "malloc vs calloc?", back: "calloc(count, size) zeroes the memory; malloc(bytes) leaves garbage." },
    { front: "What is a memory leak?", back: "Heap memory you can no longer reach (lost the pointer) but never freed." },
    { front: "What is a dangling pointer?", back: "A pointer that still holds the address of memory that was already freed." },
    { front: "Order to free a 2D array?", back: "Free each row first (grid[i]), then the outer array (grid). Inside-out!" },
    { front: "Struct has char *name. How do you give it \"Minecraft\"?", back: "node->name = \"Minecraft\";  (a pointer can just point at the text)" },
    { front: "Struct has char name[90]. How do you give it \"Minecraft\"?", back: "strcpy(node->name, \"Minecraft\");  (you can't = an array in C, so copy the letters in)" },
    { front: "Why strlen(s) + 1?", back: "Room for the '\\0' null terminator at the end of every C string." },
    { front: "p->x means…", back: "(*p).x: follow the pointer, then access field x." },
  ],
  resources: [
    { label: "Python Tutor, C mode", url: "https://pythontutor.com/c.html", kind: "visual", note: "Paste any C code and SEE the stack, heap and arrows step by step. Magic for pointers." },
    { label: "CS50 Lecture 4 notes: Memory", url: "https://cs50.harvard.edu/x/2024/notes/4/", kind: "read", note: "Harvard's super friendly pointers & malloc walkthrough." },
    { label: "Programiz: C dynamic memory", url: "https://www.programiz.com/c-programming/c-dynamic-memory-allocation", kind: "read", note: "Short, clear examples of malloc/calloc/realloc/free." },
    { label: "Beej's Guide to C", url: "https://beej.us/guide/bgc/", kind: "read", note: "Funny, casual, and thorough. The pointer chapters are great." },
    { label: "Pointer Fun with Binky 🧸", url: "https://www.youtube.com/results?search_query=pointer+fun+with+binky", kind: "video", note: "A 3-minute Stanford claymation. Silly and unforgettable." },
    { label: "Pointers & malloc explained", url: "https://www.youtube.com/results?search_query=jacob+sorber+malloc+pointers", kind: "video", note: "Jacob Sorber's C videos are calm and practical." },
    { label: "FE past exams: Section I-A", url: "https://www.cs.ucf.edu/registration/exm/", kind: "practice", note: "Section I-A usually opens with a dynamic memory question. Do a few!" },
  ],
  notes: [
    { label: "C Background for Dynamic Memory", file: "CBackgroundForDynMem.pdf" },
    { label: "Dynamic Memory Allocation", file: "DynMemAlloc.pdf" },
    { label: "Sample: dynarrayofstruct.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/dynarrayofstruct.c" },
    { label: "Sample: arrayallocation.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/arrayallocation.c" },
  ],
};
