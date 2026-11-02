/**
 * The FE 100 Crash Course study plan (feprep.net/studyplan/fe-100): 100 problem titles in 16 topics.
 * Only the titles and difficulty come from there. Every playable question in ./fe100 is written fresh
 * for that title, so this list is the build plan: a topic shows up in Night Shift once its file exists.
 */

export type Fe100Problem = { title: string; slug: string; kind: "Coding" | "Solving"; level: "Easy" | "Med." | "Hard" };
export type Fe100Topic = { name: string; emoji: string; recipe: string; problems: Fe100Problem[] };

/** points by difficulty, so a Hard problem weighs like a full exam question and a half */
export const LEVEL_PTS = { Easy: 5, "Med.": 10, Hard: 15 } as const;

const p = (title: string, slug: string, kind: "C" | "S", level: Fe100Problem["level"]): Fe100Problem => ({
  title,
  slug,
  kind: kind === "C" ? "Coding" : "Solving",
  level,
});

export const FE100: Fe100Topic[] = [
  {
    name: "Dynamic Memory Management",
    emoji: "🧱",
    recipe: "malloc",
    problems: [
      p("Allocate and Initialize Juice Case Struct", "allocate-and-initialize-juice-case-struct", "C", "Easy"),
      p("Delete Dynamically Allocated TV Show List", "delete-dynamically-allocated-tv-show-list", "C", "Easy"),
      p("Random Cartesian Points with Dynamic Memory", "random-cartesian-points-with-dynamic-memory", "C", "Easy"),
      p("Fix Linked List Memory Leak in C", "fix-linked-list-memory-leak-in-c", "S", "Easy"),
      p("Dynamic Employee Array Memory Management", "dynamic-employee-array-memory-management", "C", "Med."),
      p("Deallocate Memory for Book Structures", "deallocate-memory-for-book-structures", "C", "Med."),
      p("Dynamic Triangular Sum Calculation", "dynamic-triangular-sum-calculation", "C", "Med."),
      p("Super Mario Galaxy Odd Star Log", "super-mario-galaxy-odd-star-log", "C", "Med."),
      p("Deep Copy 1980s Video Games Inventory", "deep-copy-1980s-video-games-inventory", "C", "Hard"),
    ],
  },
  {
    name: "Linked Lists",
    emoji: "🔗",
    recipe: "list-code",
    problems: [
      p("Transform Linked List to Prefix Sum List", "transform-linked-list-to-prefix-sum-list", "S", "Easy"),
      p("Convert Linked List to C String", "convert-linked-list-to-c-string", "C", "Easy"),
      p("Check All Even in Linked List Recursively", "check-all-even-in-linked-list-recursively", "C", "Easy"),
      p("Convert Singly Linked List to Circular List", "convert-singly-linked-list-to-circular-list", "C", "Easy"),
      p("Insert Minus One After Even Nodes in List", "insert-minus-one-after-even-nodes-in-list", "C", "Easy"),
      p("Insert Node with Value 3 in Sorted Linked List", "insert-node-with-value-3-in-sorted-linked-list", "C", "Med."),
      p("Move Head Node to Second Last in Linked List", "move-head-node-to-second-last-in-linked-list", "C", "Med."),
      p("Delete Node from Doubly Linked List", "delete-node-from-doubly-linked-list", "C", "Med."),
      p("Swap Consecutive Nodes in Linked List", "swap-consecutive-nodes-in-linked-list", "S", "Med."),
    ],
  },
  {
    name: "Stacks",
    emoji: "🥞",
    recipe: "postfix",
    problems: [
      p("Trace Stack Operations", "trace-stack-operations", "S", "Easy"),
      p("Evaluate Postfix Expression 3", "evaluate-postfix-expression-3", "S", "Easy"),
      p("Infix to Postfix Evaluation 9", "infix-to-postfix-evaluation-9", "S", "Med."),
      p("Palindrome Check Using Stack Operations", "palindrome-check-using-stack-operations", "C", "Easy"),
      p("Valid Moves in Towers of Hanoi Using Stacks", "valid-moves-in-towers-of-hanoi-using-stacks", "C", "Med."),
      p("Stack-Based Scoring Game with Sum Rules", "stack-based-scoring-game-with-sum-rules", "C", "Med."),
    ],
  },
  {
    name: "Queues",
    emoji: "🚶",
    recipe: "queue",
    problems: [
      p("Traffic Light Simulation Using Queues", "traffic-light-simulation-using-queues", "S", "Easy"),
      p("Superhero Queue Simulation", "superhero-queue-simulation", "S", "Easy"),
      p("Implement Add to Front in Deque Using Linked List", "implement-add-to-front-in-deque-using-linked-list", "C", "Med."),
      p("Implement Circular Queue Dequeue Function", "implement-circular-queue-dequeue-function", "C", "Med."),
      p("Circular Battle Arena", "circular-battle-arena", "C", "Hard"),
    ],
  },
  {
    name: "Binary Trees",
    emoji: "🌳",
    recipe: "tree-code",
    problems: [
      p("Binary Tree Traversal and BST Validation", "binary-tree-traversal-and-bst-validation", "S", "Easy"),
      p("Recursive Postorder Traversal of Binary Tree", "recursive-postorder-traversal-of-binary-tree", "C", "Easy"),
      p("Recursive Binary Tree Sum", "recursive-binary-tree-sum", "C", "Easy"),
      p("Recursive Height Assignment in Binary Tree", "recursive-height-assignment-in-binary-tree", "C", "Med."),
      p("Find Smallest Leaf in Binary Tree", "find-smallest-leaf-in-binary-tree", "C", "Med."),
    ],
  },
  {
    name: "Hashing",
    emoji: "#️⃣",
    recipe: "hash",
    problems: [
      p("Quadratic Probing in Hash Table Insertion", "quadratic-probing-in-hash-table-insertion", "S", "Easy"),
      p("Linear Probing with Flawed Hash Function", "linear-probing-with-flawed-hash-function", "S", "Easy"),
      p("Determine Hash Indices for Banana", "determine-hash-indices-for-banana", "S", "Med."),
      p("Identify Duplicate Integer via Hash Collisions", "identify-duplicate-integer-via-hash-collisions", "S", "Med."),
      p("Quadratic Probing with Custom String Hashing", "quadratic-probing-with-custom-string-hashing", "S", "Hard"),
    ],
  },
  {
    name: "Heaps",
    emoji: "⛰️",
    recipe: "heap",
    problems: [
      p("MaxHeap Insertion Steps with Tree and Array", "maxheap-insertion-steps-with-tree-and-array", "S", "Easy"),
      p("Minheap Insertion and Deletion Operations", "minheap-insertion-and-deletion-operations", "S", "Easy"),
      p("Calculate Heap Height and Insert in Max-Heap", "calculate-heap-height-and-insert-in-max-heap", "S", "Easy"),
      p("Min Heap Operations and Validity Check", "min-heap-operations-and-validity-check", "C", "Med."),
      p("Non-Recursive Min-Heap Verification", "non-recursive-min-heap-verification", "C", "Hard"),
    ],
  },
  {
    name: "Tries",
    emoji: "🔤",
    recipe: "trie",
    problems: [
      p("Trie Node Count and AVL Tree Rotation", "trie-node-count-and-avl-tree-rotation", "S", "Easy"),
      p("Count Nodes in Trie After Word Insertion", "count-nodes-in-trie-after-word-insertion", "S", "Med."),
      p("Trie Node Count and Deletion Challenge", "trie-node-count-and-deletion-challenge", "S", "Med."),
      p("Longest Prefix Match in Trie", "longest-prefix-match-in-trie", "C", "Hard"),
      p("Count Five Letter Words in a Trie", "count-five-letter-words-in-a-trie", "C", "Hard"),
    ],
  },
  {
    name: "AVL Trees",
    emoji: "⚖️",
    recipe: "avl",
    problems: [
      p("AVL Tree Insertion and Deletion Balancing", "avl-tree-insertion-and-deletion-balancing", "S", "Easy"),
      p("Insert Element and Analyze AVL Tree Runtimes", "insert-element-and-analyze-avl-tree-runtimes", "S", "Easy"),
      p("AVL Tree Insertion and Rebalancing", "avl-tree-insertion-and-rebalancing", "S", "Med."),
      p("AVL Tree Node Deletion and Rebalancing", "avl-tree-node-deletion-and-rebalancing", "S", "Med."),
      p("Find Insertion Ranges for AVL Double Rotation", "find-insertion-ranges-for-avl-double-rotation", "S", "Hard"),
    ],
  },
  {
    name: "Recursion",
    emoji: "🪆",
    recipe: "recursive-code",
    problems: [
      p("Recursive Count Down to One", "recursive-count-down-to-one", "C", "Easy"),
      p("Recursive Trailing Zeros in Factorial", "recursive-trailing-zeros-in-factorial", "C", "Easy"),
      p("Recursive Frog Escape from Well", "recursive-frog-escape-from-well", "C", "Med."),
      p("Count Even Numbers in Array Range Recursively", "count-even-numbers-in-array-range-recursively", "C", "Med."),
      p("Recursive Grid Virus Spread Activation", "recursive-grid-virus-spread-activation", "C", "Easy"),
      p("Transform Number with Add or Multiply Steps", "transform-number-with-add-or-multiply-steps", "C", "Med."),
      p("Recursive Binary Search Index Finder", "recursive-binary-search-index-finder", "C", "Hard"),
      p("Recursive Tic-Tac-Toe Win Checker", "recursive-tic-tac-toe-win-checker", "C", "Hard"),
    ],
  },
  {
    name: "Sorting",
    emoji: "📊",
    recipe: "sorting",
    problems: [
      p("Trace Selection Sort Iterations", "trace-selection-sort-iterations", "S", "Easy"),
      p("Iterative Insertion Sort and Complexity Analysis", "iterative-insertion-sort-and-complexity-analysis", "S", "Easy"),
      p("Count Bubble Sort Swaps for Given Array", "count-bubble-sort-swaps-for-given-array", "S", "Easy"),
      p("Implement One of Three Basic Sorting Algorithms", "implement-one-of-three-basic-sorting-algorithms", "C", "Med."),
      p("Recursive Bubble Sort", "recursive-bubble-sort", "C", "Hard"),
      p("Sort Students by Last Name First Name ID", "sort-students-by-last-name-first-name-id", "C", "Med."),
      p("Stable Quicksort on Linked List with Blanks", "stable-quicksort-on-linked-list-with-blanks", "C", "Med."),
      p("Identify Sorting Algorithm from First Pass", "identify-sorting-algorithm-from-first-pass", "S", "Med."),
      p("Implement Merge Function for Merge Sort", "implement-merge-function-for-merge-sort", "C", "Hard"),
    ],
  },
  {
    name: "Algorithm Analysis",
    emoji: "⏱️",
    recipe: "code-runtime",
    problems: [
      p("Array Processing Time Calculation", "array-processing-time-calculation", "S", "Easy"),
      p("Calculate Milliseconds for Logarithmic Search", "calculate-milliseconds-for-logarithmic-search", "S", "Easy"),
      p("Calculate Runtime for Scaled Input Size", "calculate-runtime-for-scaled-input-size", "S", "Med."),
      p("Big O Analysis with Max(N M)", "big-o-analysis-with-maxn-m", "S", "Easy"),
      p("Runtime Analysis of Binary Search Halving", "runtime-analysis-of-binary-search-halving", "S", "Med."),
      p("Nested Loop Binary Search", "nested-loop-binary-search", "S", "Hard"),
      p("Recursive Array Analysis with Divide and Conquer", "recursive-array-analysis-with-divide-and-conquer", "S", "Med."),
      p("Two-Stack Queue Run-Time Analysis", "two-stack-queue-run-time-analysis", "S", "Med."),
      p("Analyze Big O Complexity of Nested Loops", "analyze-big-o-complexity-of-nested-loops", "S", "Hard"),
    ],
  },
  {
    name: "Summations",
    emoji: "➕",
    recipe: "summation",
    problems: [
      p("Evaluate and Simplify Nested Summations", "evaluate-and-simplify-nested-summations", "S", "Easy"),
      p("Closed Form Solution for Summation of 2i 5", "closed-form-solution-for-summation-of-2i-5", "S", "Med."),
      p("Closed Form Solution for Summation of i + 3i", "closed-form-solution-for-summation-of-i-3i", "S", "Med."),
      p("Factor Nested Summation into Closed Form", "factor-nested-summation-into-closed-form", "S", "Hard"),
      p("Closed Form of a Cubic-Term Summation", "closed-form-of-a-cubic-term-summation", "S", "Med."),
    ],
  },
  {
    name: "Recurrence Relations",
    emoji: "🔁",
    recipe: "recurrence",
    problems: [
      p("Closed Form for Recursive Division by Four", "closed-form-for-recursive-division-by-four", "S", "Med."),
      p("Iterative Big-Oh Analysis of Recurrence Relation", "iterative-big-oh-analysis-of-recurrence-relation", "S", "Med."),
      p("Find Big-Oh for Recursive 2T(n / 2) + n3 Using Iteration", "find-big-oh-for-recursive-2tn-2-n3-using-iteration", "S", "Hard"),
      p("Solve Recurrence 2T(n-1) + 5", "solve-recurrence-2tn-1-5", "S", "Hard"),
      p("Solve Recurrence 3T(n-1) + 3n", "solve-recurrence-3tn-1-3n", "S", "Hard"),
    ],
  },
  {
    name: "Base Conversions",
    emoji: "🔢",
    recipe: "base-conversion",
    problems: [
      p("Hex to Binary Birthday Puzzle", "hex-to-binary-birthday-puzzle", "S", "Easy"),
      p("Convert Decimal 375 to Binary", "convert-decimal-375-to-binary", "S", "Easy"),
      p("Base 8 to 16 Conversion Challenge", "base-8-to-16-conversion-challenge", "S", "Easy"),
      p("Binary to Base 16", "binary-to-base-16", "S", "Med."),
      p("Hex to Octal and Decimal to Hexadecimal Conversion", "hex-to-octal-and-decimal-to-hexadecimal-conversion", "S", "Med."),
    ],
  },
  {
    name: "Bitwise Operators",
    emoji: "💡",
    recipe: "bitwise",
    problems: [
      p("Evaluate Expressions Using C Bitwise Operators", "evaluate-expressions-using-c-bitwise-operators", "S", "Med."),
      p("NIM Game Winning Strategy with XOR", "nim-game-winning-strategy-with-xor", "C", "Med."),
      p("Employee Drive Access with Bitwise Codes", "employee-drive-access-with-bitwise-codes", "C", "Med."),
      p("Validate New User ID by Bit Difference", "validate-new-user-id-by-bit-difference", "C", "Hard"),
      p("Powers of Two Decomposition", "powers-of-two-decomposition", "C", "Hard"),
    ],
  },
];
