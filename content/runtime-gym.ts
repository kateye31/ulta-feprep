export type GymQ = {
  id: string;
  level: 1 | 2 | 3;
  code: string;
  choices: string[];
  answer: string;
  hint: string;
  why: string;
};

/** Each snippet: what is the Big-O runtime in terms of n (and m, when there is one)? */
export const GYM: GymQ[] = [
  {
    id: "single",
    level: 1,
    code: `for (int i = 0; i < n; i++)
    sum++;`,
    choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    answer: "O(n)",
    hint: "How many times does sum++ run?",
    why: "i goes 0, 1, 2, … n−1, so sum++ runs n times. One plain loop up to n = O(n).",
  },
  {
    id: "nested",
    level: 1,
    code: `for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        sum++;`,
    choices: ["O(n)", "O(2n)", "O(n²)", "O(n log n)"],
    answer: "O(n²)",
    hint: "For EACH i, how many j's?",
    why: "The inner loop runs n times for each of the n values of i: n × n = n². Nested loops multiply.",
  },
  {
    id: "sequential",
    level: 1,
    code: `for (int i = 0; i < n; i++)
    a++;
for (int j = 0; j < n; j++)
    b++;`,
    choices: ["O(n)", "O(n²)", "O(2n²)", "O(log n)"],
    answer: "O(n)",
    hint: "Are these loops inside each other, or one after the other?",
    why: "One AFTER the other means add: n + n = 2n. Drop the constant → O(n). Only nesting multiplies.",
  },
  {
    id: "doubling",
    level: 1,
    code: `for (int i = 1; i < n; i *= 2)
    sum++;`,
    choices: ["O(n)", "O(n/2)", "O(log n)", "O(1)"],
    answer: "O(log n)",
    hint: "Write out i: 1, 2, 4, 8, … How many steps to reach n?",
    why: "i doubles each time: 1, 2, 4, 8, … 2ᵏ. It passes n after about log₂ n steps. Doubling or halving = log.",
  },
  {
    id: "halving",
    level: 1,
    code: `while (n > 1)
    n = n / 2;`,
    choices: ["O(n)", "O(log n)", "O(n/2)", "O(√n)"],
    answer: "O(log n)",
    hint: "How many times can you cut n in half before it hits 1?",
    why: "Halving until 1 takes log₂ n steps. That's the definition of log₂ n!",
  },
  {
    id: "constant-inner",
    level: 1,
    code: `for (int i = 0; i < n; i++)
    for (int j = 0; j < 100; j++)
        sum++;`,
    choices: ["O(n)", "O(n²)", "O(100)", "O(1)"],
    answer: "O(n)",
    hint: "Does the inner loop depend on n at all?",
    why: "The inner loop is always 100, a constant. 100·n = O(n). Only things that grow with n matter.",
  },
  {
    id: "triangle",
    level: 2,
    code: `for (int i = 0; i < n; i++)
    for (int j = 0; j < i; j++)
        sum++;`,
    choices: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
    answer: "O(n²)",
    hint: "Inner loop runs 0 times, then 1, then 2, … Add those up.",
    why: "0 + 1 + 2 + … + (n−1) = n(n−1)/2 ≈ n²/2 → O(n²). A 'triangle' of work is still quadratic.",
  },
  {
    id: "n-log-n",
    level: 2,
    code: `for (int i = 0; i < n; i++)
    for (int j = 1; j < n; j *= 2)
        sum++;`,
    choices: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
    answer: "O(n log n)",
    hint: "Outer loop: n times. Inner loop: doubling. Multiply.",
    why: "Outer n × inner log n (doubling) = O(n log n).",
  },
  {
    id: "two-pointer",
    level: 2,
    code: `int j = 0;
for (int i = 0; i < n; i++) {
    while (j < n && arr[j] < arr[i])
        j++;
}`,
    choices: ["O(n²)", "O(n)", "O(n log n)", "O(log n)"],
    answer: "O(n)",
    hint: "Does j ever go back to 0?",
    why: "j is NEVER reset. Across the WHOLE program, j can only move forward n times. Total = n (for i) + n (for j) = O(n). FE favorite trap!",
  },
  {
    id: "shrinking-inner",
    level: 2,
    code: `for (int i = n; i > 0; i /= 2)
    for (int j = 0; j < i; j++)
        sum++;`,
    choices: ["O(n log n)", "O(n)", "O(log n)", "O(n²)"],
    answer: "O(n)",
    hint: "Inner loop runs n, then n/2, then n/4, … Add those.",
    why: "n + n/2 + n/4 + … + 1 < 2n (the pizza you never finish 🍕). So it's O(n), NOT n log n!",
  },
  {
    id: "sqrt",
    level: 2,
    code: `for (int i = 1; i * i <= n; i++)
    sum++;`,
    choices: ["O(n)", "O(log n)", "O(√n)", "O(n²)"],
    answer: "O(√n)",
    hint: "The loop stops when i² passes n. So what's the biggest i?",
    why: "It keeps going while i² ≤ n, i.e. i ≤ √n. So it runs about √n times.",
  },
  {
    id: "n-squared-bound",
    level: 2,
    code: `for (int i = 0; i < n * n; i++)
    sum++;`,
    choices: ["O(n)", "O(n²)", "O(2n)", "O(log n)"],
    answer: "O(n²)",
    hint: "What's the upper bound of the loop?",
    why: "It's one loop, but it goes up to n·n. So n² steps. Don't just count loops, count the steps!",
  },
  {
    id: "two-inputs",
    level: 2,
    code: `for (int i = 0; i < n; i++)
    for (int j = 0; j < m; j++)
        grid[i][j] = 0;`,
    choices: ["O(n²)", "O(n + m)", "O(n·m)", "O(m)"],
    answer: "O(n·m)",
    hint: "There are TWO different sizes here.",
    why: "n rows × m columns = n·m. Keep both variables! It's only n² if m happens to equal n.",
  },
  {
    id: "triple",
    level: 2,
    code: `for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        for (int k = 0; k < n; k++)
            sum++;`,
    choices: ["O(n²)", "O(3n)", "O(n³)", "O(n log n)"],
    answer: "O(n³)",
    hint: "Three nested loops that each go to n…",
    why: "n × n × n = n³.",
  },
  {
    id: "rec-linear",
    level: 2,
    code: `int f(int n) {
    if (n == 0) return 0;
    return 1 + f(n - 1);
}`,
    choices: ["O(1)", "O(log n)", "O(n)", "O(2ⁿ)"],
    answer: "O(n)",
    hint: "How many calls happen before n reaches 0? How much work does each call do?",
    why: "T(n) = T(n−1) + 1. That's n calls with O(1) work each → O(n).",
  },
  {
    id: "rec-half",
    level: 2,
    code: `int f(int n) {
    if (n <= 1) return 1;
    return 1 + f(n / 2);
}`,
    choices: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: "O(log n)",
    hint: "Each call cuts n in half.",
    why: "T(n) = T(n/2) + 1 → about log₂ n calls → O(log n). Same shape as binary search.",
  },
  {
    id: "rec-two-calls",
    level: 3,
    code: `int f(int n) {
    if (n <= 1) return 1;
    return f(n - 1) + f(n - 1);
}`,
    choices: ["O(n)", "O(n²)", "O(2ⁿ)", "O(log n)"],
    answer: "O(2ⁿ)",
    hint: "Each call makes TWO calls. Draw the call tree: 1, 2, 4, 8…",
    why: "T(n) = 2T(n−1) + 1. The number of calls doubles every level for n levels → 2ⁿ. (Save f(n−1) in a variable and it becomes O(n)!)",
  },
  {
    id: "rec-merge",
    level: 3,
    code: `void f(int *a, int lo, int hi) {
    if (lo >= hi) return;
    int mid = (lo + hi) / 2;
    f(a, lo, mid);
    f(a, mid + 1, hi);
    for (int i = lo; i <= hi; i++)   // linear work
        a[i] = a[i];
}`,
    choices: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    answer: "O(n log n)",
    hint: "Two calls on HALF the size, plus a loop over the whole range.",
    why: "T(n) = 2T(n/2) + n. That's merge sort's recurrence: log n levels, each doing n total work → O(n log n).",
  },
  {
    id: "break-early",
    level: 3,
    code: `for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        if (j == 5) break;
        sum++;
    }
}`,
    choices: ["O(n²)", "O(n)", "O(5)", "O(n log n)"],
    answer: "O(n)",
    hint: "How far does j actually get before break?",
    why: "The inner loop always stops at j == 5, so it's a constant 6 checks. n × 6 = O(n).",
  },
  {
    id: "strlen",
    level: 3,
    code: `// s has length n
for (int i = 0; i < strlen(s); i++)
    if (s[i] == 'a') count++;`,
    choices: ["O(n)", "O(n²)", "O(1)", "O(log n)"],
    answer: "O(n²)",
    hint: "strlen isn't free. What does it do every time the condition is checked?",
    why: "strlen walks the whole string (O(n)) and it's called EVERY iteration: n × n = O(n²). Fix: int len = strlen(s); before the loop.",
  },
  {
    id: "insert-back",
    level: 3,
    code: `// build a list of n items by
// inserting each at the BACK,
// walking from head every time
node *head = NULL;
for (int i = 0; i < n; i++)
    head = insertBack(head, i);`,
    choices: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
    answer: "O(n²)",
    hint: "insertBack walks the whole list. How long is the list on step i?",
    why: "Step i walks i nodes: 0 + 1 + … + (n−1) = O(n²). Keeping a tail pointer makes each insert O(1) → O(n) total.",
  },
  {
    id: "heap-n",
    level: 3,
    code: `// insert n values into an
// empty min-heap, one at a time
for (int i = 0; i < n; i++)
    heapInsert(h, vals[i]);`,
    choices: ["O(n)", "O(n log n)", "O(log n)", "O(n²)"],
    answer: "O(n log n)",
    hint: "One heap insert percolates up the height of the tree.",
    why: "Each insert is O(log n) (the height of the heap), done n times → O(n log n). (heapify builds it in O(n), a special trick.)",
  },
  {
    id: "bst-search",
    level: 3,
    code: `// search a BALANCED BST
// that holds n values
node *t = root;
while (t && t->data != x)
    t = (x < t->data) ? t->left : t->right;`,
    choices: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: "O(log n)",
    hint: "Each step goes down one level. How many levels does a balanced tree have?",
    why: "A balanced tree has about log₂ n levels, and we go down one per step → O(log n). (Unbalanced 'stick' tree → O(n).)",
  },
  {
    id: "cube-triangle",
    level: 3,
    code: `for (int i = 0; i < n; i++)
    for (int j = 0; j < i; j++)
        for (int k = 0; k < j; k++)
            sum++;`,
    choices: ["O(n²)", "O(n³)", "O(n² log n)", "O(n)"],
    answer: "O(n³)",
    hint: "It's a 'triangle' but in 3D. Constants shrink, the power doesn't.",
    why: "It's about n³/6 steps. Dropping the 1/6 → O(n³). Each nested loop bounded by something up to n adds a power.",
  },
  {
    id: "thirds",
    level: 3,
    code: `int count = 0;
while (n > 0) {
    n = n / 3;
    count++;
}`,
    choices: ["O(n)", "O(n/3)", "O(log n)", "O(1)"],
    answer: "O(log n)",
    hint: "Dividing by 3 instead of 2. Does that change the Big-O?",
    why: "log₃ n steps. Log bases only differ by a constant factor, so it's still O(log n).",
  },
];
