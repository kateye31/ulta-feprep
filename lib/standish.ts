/**
 * The textbook: Thomas A. Standish, "Data Structures, Algorithms, and Software Principles in C"
 * (Addison-Wesley, ©1995, first printed 1994). An all-C data structures book, so it lines up with
 * what the FE tests.
 *
 * Only CHAPTER titles are listed here: they come from the book's published listing. Section numbers
 * and page numbers aren't, because they couldn't be checked against a copy. Every word below the
 * chapter titles (the reading guides, questions, exercises) is written for this site, not taken
 * from the book. Text supports `code` and **bold**.
 */

export const BOOK = {
  title: "Data Structures, Algorithms, and Software Principles in C",
  short: "Standish",
  author: "Thomas A. Standish",
  publisher: "Addison-Wesley",
  year: "1995 (first printed 1994)",
  pages: 748,
  isbn10: "0201591189",
  isbn13: "9780201591187",
};

/** where to get a copy */
export const GET_IT: { label: string; url: string; note: string }[] = [
  { label: "UCF Libraries", url: "https://library.ucf.edu/", note: "Search the title. Not on the shelf? Ask for it through Interlibrary Loan: it's free for students and usually takes a few days." },
  { label: "WorldCat", url: "https://search.worldcat.org/title/30353899", note: "Shows which libraries near you own a copy." },
  { label: "AbeBooks (used)", url: "https://www.abebooks.com/servlet/SearchResults?isbn=9780201591187", note: "Used copies of a 1994 book are often cheap. Compare a few sellers." },
  { label: "Better World Books (used)", url: "https://www.betterworldbooks.com/product/detail/data-structures-algorithms-and-software-principles-in-c-9780201591187", note: "Another used-book seller, by ISBN." },
];

export type ChapterId = number | "A";
export type Chapter = { id: ChapterId; title: string; fe: "core" | "useful" | "skip"; why: string };

export const CHAPTERS: Chapter[] = [
  { id: 1, title: "Preparing for the Journey", fe: "useful", why: "Sets up the book's way of thinking. A light read: skim it once." },
  { id: 2, title: "Linked Data Representations", fe: "core", why: "Pointers, structs that point to structs, and linked lists. This is Section I-A of the FE." },
  { id: 3, title: "Introduction to Recursion", fe: "core", why: "How recursion works and how to count its cost. FE Section II-B lives on this." },
  { id: 4, title: "Modularity and Data Abstraction", fe: "useful", why: "The idea of an ADT: what a stack or table DOES, apart from how it's built. Makes Chapters 7, 9 and 11 easier." },
  { id: 5, title: "Introduction to Software Engineering Concepts", fe: "skip", why: "Testing, proofs and design process. Good to know, but not FE points." },
  { id: 6, title: "Introduction to Analysis of Algorithms", fe: "core", why: "Big-O, counting steps, and how runtime scales. FE Section II-A." },
  { id: 7, title: "Linear Data Structures: Stacks and Queues", fe: "core", why: "Stacks, queues, postfix, and building them with arrays or lists. FE Section I-A." },
  { id: 8, title: "Lists, Strings, and Dynamic Memory Allocation", fe: "core", why: "malloc and free, and strings in C. FE Section I-A." },
  { id: 9, title: "Trees", fe: "core", why: "Binary trees, traversals, search trees, balanced trees and heaps. FE Section I-B." },
  { id: 10, title: "Graphs", fe: "skip", why: "Not on the FE." },
  { id: 11, title: "Hashing and the Table ADT", fe: "core", why: "Hash functions, collisions, probing and chaining. FE Section I-B." },
  { id: 12, title: "External Collections of Data", fe: "skip", why: "Data on disk. Not on the FE." },
  { id: 13, title: "Sorting", fe: "core", why: "The sorts the FE asks about, with their runtimes. FE Section II-B." },
  { id: 14, title: "Advanced Recursion", fe: "useful", why: "Recursion on harder problems. Helps with backtracking-style questions." },
  { id: 15, title: "Object-Oriented Programming", fe: "skip", why: "Not on the FE." },
  { id: 16, title: "Advanced Software Engineering Concepts", fe: "skip", why: "Not on the FE." },
  { id: "A", title: "Math Reference and Tutorial (appendix)", fe: "core", why: "Sums, logs and powers: the math under Big-O, summations and recurrences. FE Section II-A." },
];

export const chapter = (id: ChapterId) => CHAPTERS.find((c) => c.id === id);
export const chLabel = (id: ChapterId) => (id === "A" ? "Appendix A" : `Ch ${id}`);
export const chAnchor = (id: ChapterId) => `ch-${id}`;

export type BookRead = {
  ch: ChapterId[];
  /** what to look for in the chapter, by subject */
  look: string;
  /** the deeper idea, the "why" under the recipes */
  lens: string[];
  /** read to answer these. Write the answers in your own words */
  ask: string[];
  /** close the book, then do this */
  doIt: string;
  /** where the book and the FE part ways */
  gap?: string;
};

/** one reading guide per topic page (keyed by topic slug) */
export const READING: Record<string, BookRead> = {
  "dynamic-memory": {
    ch: [2, 8],
    look: "In **Ch 2**, the parts on pointers and on structs that hold pointers. In **Ch 8**, the parts on dynamic memory allocation and on strings.",
    lens: [
      "The book's big move is to treat memory as **a picture you can draw**: every variable is a box, and every pointer is an arrow to another box. Once you draw it, `malloc` just means \"make a new box with no name and give me an arrow to it\", and `free` means \"erase that box\". The arrow you're still holding is now pointing at nothing (a dangling pointer).",
      "That picture explains every FE rule you've been memorizing. `sizeof(int *)` vs `sizeof(int)`? One is the size of an arrow, one is the size of a box of ints. Free the inside first? Erasing the outer box first erases the arrows you needed to find the inside boxes. `strlen + 1`? The string box needs one more slot for `'\\0'`.",
      "Chapter 8 adds the idea of a **heap of free memory** that `malloc` hands out from and `free` gives back to. It explains why memory you forget to free is lost for the rest of the program (a leak): nobody holds an arrow to it anymore.",
    ],
    ask: [
      "What's the difference between a pointer variable and the thing it points to? Draw both.",
      "What exactly does `malloc` return, and what happens if there's no memory left?",
      "Why can a function return a pointer to memory it `malloc`'d, but not a pointer to one of its local variables?",
      "How is a C string stored, and why does copying one take `strcpy` (not `=`)?",
    ],
    doIt: "Close the book. On paper, write `createTeam` (Night Shift Daily #289) and **draw the memory picture** after each line: the Team box, the players array, the arrows. Then write a matching `freeTeam`.",
  },
  "linked-lists": {
    ch: [2, 8],
    look: "In **Ch 2**, the part on linear linked lists: inserting, deleting, searching and printing. In **Ch 8**, the part on lists as a general structure.",
    lens: [
      "A linked list is a chain of boxes where each box holds data plus **one arrow to the next box**. The only way in is the arrow to the first box (the head). Lose that and the whole list is gone.",
      "The book's habit worth stealing: before writing any list function, **draw the list before and after**, then circle every arrow that changes. Insertion changes 2 arrows. Deletion changes 1. Those changed arrows are your lines of code, and their **order** matters: hook up the new arrow before you break the old one, or you lose the rest of the list.",
      "It also handles the special cases that cost FE points: the empty list (`head == NULL`), changing the first node (so the function has to return the new head, or take a pointer to the head), and the last node (its `next` is `NULL`).",
    ],
    ask: [
      "Why does inserting at the front have to either return the new head or take `node **`?",
      "What's the difference between `while (p != NULL)` and `while (p->next != NULL)`? Where does each one stop?",
      "How do you delete a node when you only have a pointer to the node BEFORE it?",
      "Write the recursive version of \"print the list\". Now flip two lines: what does it print?",
    ],
    doIt: "Close the book. Write `insertSorted`, `deleteValue` and a **recursive** `length` on paper. Test each with an empty list, a 1-node list and a 3-node list by drawing arrows. Then run them in the Studio linked list drill.",
  },
  stacks: {
    ch: [7, 4],
    look: "In **Ch 7**, the parts on stacks, on building a stack from an array and from a linked list, and on using a stack to evaluate expressions. **Ch 4** explains the \"ADT\" idea behind it.",
    lens: [
      "The book teaches a stack as an **ADT**, an abstract data type: a promise about what the operations do (`push`, `pop`, `peek`, `isEmpty`) that says nothing about how they're built. Then it builds the same stack twice, with an array and with a linked list, and the code that USES the stack doesn't change at all.",
      "That's why FE questions say \"you may use these stack functions\": they hand you the ADT. Your job is only to use it. All you need to know is its one property, **last in, first out**, which means a stack **reverses order**. Palindromes, undo, matching parentheses and postfix evaluation are all that one trick.",
      "For postfix, the stack holds **numbers waiting for an operator**. For infix → postfix, it holds **operators waiting for their turn**, and precedence decides who has to wait.",
    ],
    ask: [
      "What does each stack operation promise, in one sentence each? What should `pop` do on an empty stack?",
      "Array stack vs linked list stack: what's the \"top\" in each one, and what does each one do when it's full?",
      "In postfix evaluation, why does the order of the two popped numbers matter for `-` and `/`?",
      "In infix → postfix, why does a `+` arriving pop a `*` that's already on the stack?",
    ],
    doIt: "Close the book. Write an array stack (`push`/`pop`/`isEmpty`) from blank, then use it to write `isPalindrome`. Run the Studio palindrome drill until 11/11.",
  },
  queues: {
    ch: [7],
    look: "In **Ch 7**, the parts on queues and on building a queue with a circular array and with a linked list.",
    lens: [
      "A queue is the stack's opposite: **first in, first out**. It keeps order instead of reversing it, which is why it shows up anywhere things have to wait their turn.",
      "The interesting part is building it with an array. If you add at the back and remove at the front, the used part of the array crawls to the right and runs off the end. The fix is to make the array **circular**: indexes wrap around with `% size`. Then the front and back chase each other around a ring.",
      "With a circular array, the classic question is **how do you tell full from empty?** When `front == back` it could be either. The usual answers are to keep a separate count, or to leave one slot unused. FE questions about `(front + count) % size` come straight from this.",
    ],
    ask: [
      "Where does `enqueue` write, and where does `dequeue` read, in a circular array?",
      "Why is `% size` needed, and what goes wrong without it?",
      "With only `front` and `back` (no count), how can you tell a full queue from an empty one?",
      "For a linked list queue, why do you keep a pointer to the back as well as the front?",
    ],
    doIt: "Close the book. Write a circular array queue with a `count`, then trace 6 enqueues and 3 dequeues on a size-5 array on paper. Check yourself against the Studio Summer '26 ring queue drill.",
  },
  recursion: {
    ch: [3, 14],
    look: "All of **Ch 3**: how recursion works, classic examples, and the part on analyzing recursive programs. Skim **Ch 14** once Ch 3 feels comfortable.",
    lens: [
      "The book's key recursion idea: **trust the smaller call**. To write `sum(n)`, assume `sum(n-1)` already works, and only ask \"given the answer for a smaller problem, how do I finish this one?\" Then add the **base case** that stops it. You don't trace the whole thing in your head. That's the leap of faith that makes recursion writable.",
      "Every recursive function is two questions: **What's the smallest case I can answer directly?** and **How does a slightly smaller answer build this one?** If a call doesn't move toward the base case, it never stops.",
      "Ch 3 also connects recursion to **counting its cost**: each call does some work and makes some smaller calls, which is exactly a recurrence relation. That's the bridge to the Recurrences topic.",
    ],
    ask: [
      "What happens in memory (on the call stack) when a function calls itself? Draw 3 calls deep.",
      "For each example in the chapter: what's the base case, and how does each call get closer to it?",
      "Why does printing BEFORE vs AFTER the recursive call reverse the output order?",
      "How do you turn a recursive function into a recurrence like `T(n) = T(n-1) + 1`?",
    ],
    doIt: "Close the book. Write recursive `power(b, e)`, `countDigits(n)` and `printBackwards(list)`. For each, write the base case FIRST, then the recurrence for its runtime.",
  },
  backtracking: {
    ch: [14, 3],
    look: "In **Ch 14**, the harder recursion examples that try choices and undo them. Review **Ch 3** first.",
    lens: [
      "Backtracking is recursion that **makes a choice, recurses, then undoes the choice** and tries the next one. Picture a maze: walk down a hallway, hit a dead end, step back to the last fork, try the next hallway.",
      "Every backtracking function has the same skeleton: (1) if the solution is complete, record it or return true; (2) for each possible choice, if it's **allowed**, make it, recurse, then **unmake it**. The \"unmake\" line is what people forget, and it's why the next choice sees a clean board.",
      "The `allowed` check is where the speed comes from. Cutting off a bad branch early (pruning) skips everything under it.",
    ],
    ask: [
      "In the chapter's examples, what's one \"choice\", and what's the \"undo\"?",
      "What's the base case: when does the function know it found a full answer?",
      "Where does the check for \"is this choice legal?\" go, and why before the recursive call?",
    ],
    doIt: "Close the book. Write a function that prints every permutation of `\"abc\"` using a `used[]` array: choose, recurse, un-choose. Then compare it to the N-Queens example on the Backtracking topic page.",
    gap: "The FE's backtracking questions (N-Queens style, permutations) follow Guha's course notes closely. Use the book for the recursion habits, and the course PDF for the exact FE style.",
  },
  "big-o": {
    ch: [6, "A"],
    look: "All of **Ch 6**: what O-notation means, how to find it for loops, and how algorithms compare. Use **Appendix A** for the logs and sums it relies on.",
    lens: [
      "The book defines Big-O the honest way: `f(n)` is `O(g(n))` if, past some point, `f(n)` is at most a constant times `g(n)`. In plain words: **for big inputs, f grows no faster than g**. That's why constants and smaller terms vanish: `3n² + 5n + 2` is `O(n²)`, because for big n the `n²` term swamps everything else.",
      "To find a runtime, **count how many times the innermost line runs**, as a function of n. A loop that runs n times around a loop that runs n times is n·n. A loop that **halves** something each time runs about `log n` times. A loop whose bound depends on the outer variable (`j < i`) is a **sum**, `1 + 2 + … + n`, which is `n²/2`, still `O(n²)`.",
      "The book also compares growth rates directly: `1 < log n < n < n log n < n² < 2ⁿ`. Knowing this ladder by heart answers most \"which is faster\" questions.",
    ],
    ask: [
      "In your own words, what does \"f(n) is O(g(n))\" promise? Why are constants dropped?",
      "Why does a loop that does `i = i * 2` run about `log₂ n` times?",
      "How do you get the runtime of two loops one after the other vs one inside the other?",
      "Put these in order of growth: `n log n`, `2ⁿ`, `log n`, `n²`, `n`, `1`.",
    ],
    doIt: "Close the book. Do 10 Runtime Gym reps, but for each one, write the **count** (like `n(n+1)/2`) before the Big-O. Then run the Studio runtime lab to check your counts.",
  },
  "timing-problems": {
    ch: [6],
    look: "In **Ch 6**, the part comparing how fast different growth rates get slow as n grows.",
    lens: [
      "Timing problems flip Big-O around: you know the runtime **shape** and one measurement, and you predict another. The whole trick is writing `time = c · f(n)`, solving for the constant `c` using the measurement you're given, then plugging in the new `n`.",
      "Example: an `O(n²)` algorithm takes 4 s for n = 1000. Then `c · 1000² = 4`, so `c = 4/10⁶`. For n = 3000: `(4/10⁶) · 3000² = 36 s`. A shortcut: tripling n multiplies the time by 3² = 9.",
      "This is why the book cares about growth rates: doubling n doubles an `O(n)` time, quadruples an `O(n²)` time, and barely moves an `O(log n)` time.",
    ],
    ask: [
      "If n doubles, what happens to the time for `O(n)`, `O(n²)`, `O(n³)` and `O(log n)`?",
      "Why can you ignore the constant `c` when you compare two sizes of the same algorithm?",
    ],
    doIt: "Close the book. Make up 3 timing problems of your own (one each for `n`, `n²` and `n log n`), solve them with `c · f(n)`, then check with the Timing topic's widget.",
  },
  summations: {
    ch: ["A", 6],
    look: "In **Appendix A**, the parts on sums (arithmetic and geometric series) and on logarithms. In **Ch 6**, where sums are used to count loop steps.",
    lens: [
      "Summations matter because **a loop is a sum**. `for i = 1..n: for j = 1..i` runs `1 + 2 + … + n` times, and the closed form `n(n+1)/2` tells you it's `O(n²)`. The appendix gives the handful of formulas that cover almost every FE summation.",
      "The two you need cold: **arithmetic**, `1 + 2 + … + n = n(n+1)/2` (pair the first and last terms: n/2 pairs that each add to n+1), and **geometric**, `1 + 2 + 4 + … + 2ᵏ = 2ᵏ⁺¹ − 1`. Everything else is splitting a sum apart: pull out constants, split `Σ(a + b)` into `Σa + Σb`, and shift the index.",
      "The FE also loves **changing the starting index**: `Σ from i=5 to n` is `Σ from 1 to n` minus `Σ from 1 to 4`.",
    ],
    ask: [
      "Derive `n(n+1)/2` yourself by pairing terms. Why does it work for odd n too?",
      "What's `Σ (2i + 3)` from 1 to n? Split it before you compute.",
      "Why is a geometric sum dominated by its LAST term?",
    ],
    doIt: "Close the book. Write the sum for this loop, then get its closed form: `for (i=0; i<n; i++) for (j=i; j<n; j++) x++;`. Check it by running it in the Studio for n = 5.",
  },
  recurrences: {
    ch: [3, "A", 6],
    look: "In **Ch 3**, the part on analyzing recursive programs. In **Appendix A**, the sum formulas you'll need once you unroll a recurrence.",
    lens: [
      "A recurrence is just **the runtime of a recursive function, written recursively**. `T(n) = T(n-1) + 1` says \"to do n, do n−1 and then one more step\". `T(n) = 2T(n/2) + n` says \"two half-size calls, plus n work to combine\" (merge sort).",
      "The way to solve one is **iteration**: substitute the formula into itself a few times, spot the pattern after k steps, then pick k so you hit the base case. For `T(n) = T(n-1) + n` you get `n + (n-1) + … + 1`, which is a summation: `n(n+1)/2`, so `O(n²)`. That's why the book's math appendix and its recursion chapter belong together.",
      "Rules of thumb to check your answer: peel off 1 each time → about n levels. Halve each time → about `log n` levels. The total is (work per level) × (number of levels) when each level costs the same.",
    ],
    ask: [
      "Write the recurrence for: recursive linked list length, binary search, merge sort.",
      "Unroll `T(n) = T(n/2) + 1` three times. What's the pattern after k steps? When does it stop?",
      "Why does `T(n) = 2T(n/2) + n` come out to `n log n` and not `n²`?",
    ],
    doIt: "Close the book. Solve `T(n) = T(n-1) + 2n` with T(1) = 1 by iteration, showing the k-step pattern. Then solve `T(n) = 3T(n/3) + n` the same way.",
  },
  "binary-trees": {
    ch: [9],
    look: "In **Ch 9**, the parts on binary trees, traversals and binary search trees: search, insert and delete.",
    lens: [
      "A binary tree is a linked structure where each node has **two** arrows: left and right. The book's key insight is that a tree is **recursive by definition**: a tree is either empty, or a node with a left tree and a right tree. So almost every tree function is recursive and has the same shape: handle `NULL`, do something with the root, recurse left, recurse right.",
      "The three traversals differ only in **when you visit the root**: before the children (preorder), between them (inorder), or after them (postorder). In a BST, inorder visits values in sorted order. That's the BST rule, left < root < right, showing itself.",
      "BST delete has three cases, decided by how many children the node has: 0 (just remove it), 1 (let the child take its place), 2 (copy in the next-larger value, which is the smallest in the right subtree, then delete that one instead).",
    ],
    ask: [
      "Write the recursive definition of a binary tree in one sentence. How does every tree function mirror it?",
      "Do pre, in and postorder on a 7-node tree. Why does inorder sort a BST?",
      "Why do search and insert cost O(height), and what's the height of a \"stick\" tree vs a balanced one?",
      "For delete with two children, why does the smallest value in the RIGHT subtree work as the replacement?",
    ],
    doIt: "Close the book. Write `insert`, `countNodes`, `height` and `sumLeaves` recursively. Run the Studio BST drill until it passes.",
  },
  "avl-trees": {
    ch: [9],
    look: "In **Ch 9**, the part on balanced (AVL) trees and rotations.",
    lens: [
      "AVL trees fix the BST's weak spot: insert sorted data into a plain BST and you get a stick, so every operation is O(n). AVL keeps a rule at **every** node: the left and right heights differ by at most 1. Keep that, and the height stays about `log n`, so everything stays fast.",
      "When an insert breaks the rule, you fix it with a **rotation** at the lowest unbalanced node. There are only 4 cases, named by the path from that node toward the insert: LL and RR take one rotation, LR and RL take two (a \"double rotation\": first turn the kink into a straight line, then rotate that).",
      "Think of a rotation as **lifting the middle value up** and letting the other two hang off it, with the in-between subtree moving to the side it belongs on. The BST order never changes. Only the shape does.",
    ],
    ask: [
      "What's a node's balance factor, and when exactly is a node \"unbalanced\"?",
      "After an insert, which node do you fix first: the lowest unbalanced one or the root? Why?",
      "Draw the 4 cases. Which need a single rotation and which need a double?",
      "During a rotation, which subtree changes parents, and why does BST order still hold?",
    ],
    doIt: "Close the book. Insert 10, 20, 30, 25, 28, 5, 3 into an empty AVL tree on paper, naming each rotation. Check with the AVL animation link on the topic page.",
  },
  heaps: {
    ch: [9, 13],
    look: "In **Ch 9**, the part on priority queues and heaps. In **Ch 13**, the part on heapsort.",
    lens: [
      "A heap is a **complete** binary tree (filled left to right, no gaps) where every parent is smaller than its children (a min-heap). Because it's complete, you can store it in a plain **array** with no pointers: node `i`'s children are `2i` and `2i+1`, and its parent is `i/2` (with the root at index 1).",
      "It's built for one job: **a priority queue**, which always hands you the smallest item next. Insert puts the new item at the end and lets it **bubble up** (swap with its parent while it's smaller). Delete-min takes the root, moves the last item to the root, and lets it **sift down** (swap with its smaller child). Both walk one path, so both are O(log n).",
      "Heapsort is just: build a heap, then remove the min n times. That's n removals at O(log n) each, so O(n log n). And building the heap bottom-up is surprisingly O(n), not O(n log n), because most nodes sit near the bottom and barely move.",
    ],
    ask: [
      "Why does \"complete tree\" make the array trick work? What breaks if there's a gap?",
      "With the root at index 1, what are the children and parent of index 5?",
      "Why does sift-down swap with the SMALLER child, not just any child?",
      "Why is heapsort O(n log n) even though building the heap is O(n)?",
    ],
    doIt: "Close the book. Insert 9, 4, 7, 1, 8, 2 into an empty min-heap array, writing the array after each insert. Then delete-min twice. Run the Studio min-heap drill.",
  },
  "hash-tables": {
    ch: [11, 4],
    look: "In **Ch 11**, the parts on the Table ADT, hash functions, collision resolution (open addressing and chaining) and how full the table is (load factor). **Ch 4** helps with the \"Table ADT\" idea.",
    lens: [
      "The book starts from the **Table ADT**: store `(key, value)` pairs, then find, insert or delete by key. A sorted array or a BST can do it in O(log n). Hashing aims for **O(1)** by computing where a key lives instead of searching for it: `index = hash(key) % size`.",
      "The catch is **collisions**: two keys landing on the same index. Open addressing looks for another empty slot (linear probing tries the next one, then the next; quadratic probing jumps 1, 4, 9…). Chaining keeps a linked list at each slot instead.",
      "How well it works depends on the **load factor** (items ÷ slots). As the table fills up, probe sequences get longer and lookups slow down. Linear probing also builds **clusters**, runs of full slots that keep growing, which is why quadratic probing exists.",
    ],
    ask: [
      "What does the Table ADT promise? Why can hashing beat a BST at it?",
      "Insert keys 15, 25, 35 into a size-10 table with `h(k) = k % 10` using linear, then quadratic probing. Where does each one land?",
      "Why does deleting from an open-addressing table need a special \"deleted\" marker?",
      "What's the load factor, and why does performance fall apart as it nears 1?",
    ],
    doIt: "Close the book. Write `insert` for a linear-probing table of ints (with `-1` as empty) and trace it on 6 keys that collide. Then do the same keys with chaining, drawing the lists.",
  },
  tries: {
    ch: [9, 11],
    look: "Tries aren't a main topic in the book. Read the tree basics in **Ch 9** and the **Table ADT** idea in **Ch 11**. A trie is one more way to build a table whose keys are strings.",
    lens: [
      "Seen through the book's lens, a trie is **a table for string keys, shaped like a tree**. Each node has one child slot per letter (26 for a–z), and a word is stored as **a path from the root**, one letter per level, plus a flag on the last node saying \"a word ends here\".",
      "That gives a different cost than hashing: looking up a word costs O(length of the word), no matter how many words are stored. And because words that share a prefix share a path, tries are great at \"how many words start with…\" questions, which are exactly what the FE asks.",
      "The FE pattern is recursion over 26 children: `for (i = 0; i < 26; i++) if (node->next[i]) total += f(node->next[i]);`, plus something for the current node.",
    ],
    ask: [
      "Compare a trie, a hash table and a BST as ways to store words. What does each one cost to look up a word?",
      "Why does a trie node need an \"is a word\" flag? Give two words where it matters.",
    ],
    doIt: "Close the book. Draw the trie for: car, cart, cat, do, dog. Then write a recursive `countWords(node)`.",
    gap: "The book doesn't teach tries as their own topic. The course notes (TrieNotes.pdf) and the trie sample programs are your main source here.",
  },
  sorting: {
    ch: [13, 6],
    look: "All of **Ch 13**: the simple O(n²) sorts, merge sort, quicksort and heapsort, and how they compare. Use **Ch 6** for the runtime reasoning.",
    lens: [
      "The book compares sorts by **what each one keeps true as it goes**. Selection sort: the front part is sorted and holds the smallest items, final positions. Insertion sort: the front part is sorted, but not final (later items can still slide in). Bubble sort: after each pass, the largest remaining item has sunk to the end. If you know what's true after each pass, you can trace any pass on the FE.",
      "The fast sorts are **divide and conquer**. Merge sort splits in half for free, then does the real work combining (merging two sorted halves in O(n)). Quicksort does the real work first (partitioning around a pivot), then the halves need no combining. Both are O(n log n) on average: log n levels × n work per level.",
      "Quicksort's worst case, O(n²), happens when the pivot keeps being the smallest or largest item (like on already-sorted input with the first item as pivot). Then one side is empty every time, and you get n levels instead of log n.",
    ],
    ask: [
      "For selection, insertion and bubble sort: what's guaranteed to be true after each pass?",
      "Why is merging two sorted lists O(n)? Trace merging `1 4 7` with `2 3 9`.",
      "What does one quicksort partition guarantee about the pivot's position?",
      "Which sorts are O(n²) in the worst case, and which input causes it for each?",
    ],
    doIt: "Close the book. Trace one pass of selection, insertion and bubble sort on `7 3 9 1 5`, then write insertion sort from blank. Run it in the Studio and count its swaps.",
  },
  "base-conversion": {
    ch: ["A"],
    look: "The book doesn't cover base conversion as an FE topic. **Appendix A** helps with powers of 2 and logs, which are the same ideas.",
    lens: [
      "Every base works the same way: a digit's value is `digit × base^position`, counting positions from 0 on the right. So `2A` in hex is `2·16 + 10 = 42`. Converting TO base 10 means adding up those values.",
      "Converting FROM base 10 is repeated division: divide by the base, write down the remainder, repeat with the quotient, then read the remainders **bottom to top**.",
      "Hex and binary are friends because 16 = 2⁴: each hex digit is exactly 4 bits. Convert one group of 4 at a time and skip base 10 entirely.",
    ],
    ask: ["What's `1011₂` in base 10? What's `0x3F` in binary?"],
    doIt: "Close the book. Convert 157 to base 2, base 8 and base 16 by repeated division, then check them against each other using the group-of-4 trick.",
    gap: "Not a chapter in the book. Use Guha's BaseConversion.pdf and the base widget on the topic page.",
  },
  bitwise: {
    ch: ["A"],
    look: "The book doesn't cover C's bitwise operators. **Appendix A** helps with binary and powers of 2.",
    lens: [
      "Bitwise operators work on each bit separately: `&` keeps a bit only if both have it, `|` keeps it if either has it, `^` keeps it if exactly one has it. Shifts move all the bits: `x << k` multiplies by 2ᵏ, `x >> k` divides by 2ᵏ.",
      "The FE uses four patterns: test bit k with `x & (1 << k)`, set it with `x | (1 << k)`, clear it with `x & ~(1 << k)`, and flip it with `x ^ (1 << k)`. A bitmask is just an int whose bits mean \"in\" or \"out\".",
    ],
    ask: ["What does `x & (x - 1)` do to the lowest 1 bit of x? Try it on 12."],
    doIt: "Close the book. Do the Studio bitwise drill, predicting every output on paper first.",
    gap: "Not in the book. Use Guha's BitwiseOperators.pdf and the light-switch widget on the topic page.",
  },
};

/** which chapters each recipe draws on (keyed by recipe id) */
export const RECIPE_BOOK: Record<string, ChapterId[]> = {
  malloc: [2, 8],
  "file-struct": [8, 2],
  "list-code": [2],
  "list-trace": [2],
  postfix: [7],
  "stack-code": [7],
  queue: [7],
  "tree-code": [9],
  "tree-trace": [9],
  heap: [9, 13],
  avl: [9],
  hash: [11],
  trie: [9, 11],
  "bigo-list": [6],
  "code-runtime": [6],
  scaling: [6],
  recurrence: [3, "A"],
  summation: ["A", 6],
  "recursive-code": [3, 14],
  sorting: [13],
  "sort-swaps": [13],
  bitwise: [],
  "base-conversion": [],
};

/** topic pages that read each chapter, for the Library page */
export const topicsFor = (id: ChapterId) => Object.entries(READING).filter(([, r]) => r.ch.includes(id)).map(([slug]) => slug);

/** reading order matched to the plan: C and memory first, then structures, then analysis */
export const READING_ORDER: { week: string; ch: ChapterId[]; topics: string[]; note: string }[] = [
  { week: "Weeks 1–2", ch: [2, 8], topics: ["dynamic-memory", "linked-lists"], note: "Alongside CS50 weeks 1–4. Pointers and malloc first: everything else is built from them." },
  { week: "Week 3", ch: [3], topics: ["recursion"], note: "Recursion before trees, because every tree function is recursive." },
  { week: "Week 4", ch: [4, 7], topics: ["stacks", "queues"], note: "Ch 4's ADT idea (skim), then stacks and queues." },
  { week: "Weeks 5–6", ch: [9], topics: ["binary-trees", "heaps", "avl-trees", "tries"], note: "The biggest chapter, and where your professor said you're weakest. Take two weeks." },
  { week: "Week 7", ch: [11], topics: ["hash-tables"], note: "Hashing and the Table ADT." },
  { week: "Week 8", ch: [6, "A"], topics: ["big-o", "summations", "timing-problems", "recurrences"], note: "Analysis and its math. Read with the Runtime Gym open." },
  { week: "Week 9", ch: [13, 14], topics: ["sorting", "backtracking"], note: "Sorting ties the analysis together. Skim Ch 14 for harder recursion." },
];
