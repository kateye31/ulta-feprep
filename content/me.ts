/**
 * Personal study data: your last exam, your professor's notes, and your question log.
 * ⚠ This lives in the code. Remove it before sharing the site publicly if you'd rather keep it private.
 */

export const LAST_EXAM = {
  name: "Fall 2026 Foundation Exam",
  date: "August 29, 2026",
  section1: 24,
  section2: 16,
  total: 40,
  /** Your own per-question notes. "usually" = what that slot typically covers on recent exams (a guess, not the official list). */
  parts: [
    { id: "IA", label: "I-A", scores: [2, 2, 9], note: "", usually: ["dynamic memory", "linked lists", "stacks / queues"] },
    { id: "IB", label: "I-B", scores: [1, 3, 8], note: "−1 somewhere", usually: ["binary trees", "hash / heap / AVL", "trees & more"] },
    { id: "IIA", label: "II-A", scores: [2, 9, 0], note: "", usually: ["runtime of code", "timing problem", "summation / recurrence"] },
    { id: "IIB", label: "II-B", scores: [1, 0, 1], note: "+1 somewhere", usually: ["recursion", "sorting", "bitwise / backtracking"] },
  ],
} as const;

export const PROFESSOR_NOTES = {
  weak: ["writing code", "heaps", "binary trees"],
  strong: ["tracing code"],
  todo: ["Write your own linked list", "Write your own BST", "Bitwise operators", "Compute runtime"],
};

/** Distilled from the comments in your own question log. */
export const READ_CHECKLIST = [
  "Circle the RETURN TYPE. Does it want an int, a pointer, or NULL at the end?",
  "What exactly am I allocating? The type on the LEFT matches the sizeof on the RIGHT (CartPoint *a = malloc(n * sizeof(CartPoint))).",
  "Do I need +1 room? A sentinel (-1) or a '\\0' at the end needs one extra slot.",
  "Check malloc: if (a == NULL) return NULL;",
  "No typedef? Then write `struct name` every single time.",
  "a[i] is a struct → use a dot. p is a pointer → use ->.",
  "Freeing: char* field → free it once. char** field → free each [j], then the field itself. Static fields: don't free.",
  "Free inside-out. Save ->next BEFORE free. In recursion, free the current node LAST.",
  "Handle the empty case first: NULL list, NULL root, size 0.",
  "Re-read the question one last time. TAKE YOUR TIME. ✨",
];

export type JournalEntry = {
  id: string;
  category: string;
  subcat: string;
  term: string;
  points: string;
  date: string;
  link: string;
  difficulty: string;
  grades: string;
  comments: string;
  code: string;
  /** a Code Studio file to practice this question for real */
  redo?: string;
};

export const JOURNAL_SEED: JournalEntry[] = [
  {
    id: "s1",
    category: "DSN",
    subcat: "DMA",
    term: "Summer 2020",
    points: "5",
    date: "8/29",
    link: "",
    difficulty: "Easy",
    grades: "3/5; 4/5",
    comments: "No typedef means write `struct` every time when stating the struct. Don't forget the asterisk.",
    code: "",
  },
  {
    id: "s2",
    redo: "exam-redo/sum26-q1-odd-stars.c",
    category: "DSN",
    subcat: "DMM",
    term: "Summer 2026",
    points: "10",
    date: "8/29",
    link: "",
    difficulty: "",
    grades: "2/10",
    comments: "Sentinel means the very end. malloc fails if what is to the left equals NULL. Read the question carefully.",
    code: `int k = 0;
for (int i = 0; i < routeLen; i++)
{
    int s = getStarsOnPlanet(route[i]);
    if (s % 2 == 1)
        a[k++] = s;
}

a[k] = -1;
*outSize = k;
return a;`,
  },
  {
    id: "s3",
    redo: "exam-redo/spr20-delete-shows.c",
    category: "DSN",
    subcat: "DMA",
    term: "Spring 2020",
    points: "10",
    date: "8/30",
    link: "",
    difficulty: "Easy",
    grades: "5/10",
    comments:
      "Read carefully: only do free(name[i].feature[j]) rather than free(name[i].feature) if there are two stars in front of the field (char ** feature vs char * feature). char ** → free [i].[j]. char * → free [i]. Only free fields that are dynamic. Static fields don't need to be freed. Also: return NULL!",
    code: `struct tv_show {
    char *show_name;
    int number_of_seasons;
};

struct tv_show *delete_show_list(struct tv_show *show_list, int length) {
    for (int i = 0; i < length; i++)
    {
        // for (int j...) not necessary: show_name is char*, not char**
        free(show_list[i].show_name);
    }
    free(show_list);
    // read carefully, return NULL
    return NULL; // correction added
}`,
  },
  {
    id: "s4",
    redo: "exam-redo/sum26-q2-house-points.c",
    category: "DSN",
    subcat: "Linked List",
    term: "Summer 2026",
    points: "10",
    date: "8/30",
    link: "",
    difficulty: "",
    grades: "2/10; 6/10",
    comments:
      "Read carefully, make sure to have the correct return type. It wants an int, not a head. For summing numbers from a linked list just use while (head != NULL): strcmp the house name with head->house, increment sum, then head = head->next. Simple. strcmp returns 0 if equal, anything else if not the same.",
    code: "",
  },
  {
    id: "s5",
    redo: "exam-redo/sum19-cartpoints.c",
    category: "DSN",
    subcat: "DMM",
    term: "Summer 2019",
    points: "10",
    date: "8/31",
    link: "",
    difficulty: "Easy",
    grades: "2/10",
    comments:
      "malloc the correct things (LHS and RHS). The question has your answers! It says dynamically allocate an array of numPoints CartPoint structs, so CartPoint *a (not int *a), then malloc(numPoints * sizeof(CartPoint)), not sizeof(int). A random int 0 to b-1 inclusive is rand() % b. Also use dot, not ->.",
    code: "",
  },
  {
    id: "s6",
    redo: "exam-redo/sum26-q3-ring-queue.c",
    category: "DSN",
    subcat: "Queue",
    term: "",
    points: "5",
    date: "8/31",
    link: "",
    difficulty: "",
    grades: "0/5",
    comments:
      "A ring, not a line. An efficient array queue never shifts its elements. It just wraps around, like a clock face with 10 positions. All we track is where the front is and how many items are in it. dequeue → read index front, then front = (front + 1) % 10. enqueue → write index (front + size) % 10, then size++.",
    code: "",
  },
  {
    id: "s7",
    redo: "exam-redo/sum23-freelist-fix.c",
    category: "ALG",
    subcat: "DMA",
    term: "Summer 2023",
    points: "5",
    date: "",
    link: "",
    difficulty: "Easy",
    grades: "1/5",
    comments:
      "You can't just free the head first, so the first if statement is the problem. Important to say: check if front is NULL → just return. Then do the recursive call to free the rest of the list (as long as there is a list). Then free front LAST. Please take your time with the questions and read through carefully. TAKE YOUR TIME.",
    code: `void freeList(node* front) {
    if (front != NULL)
        free(front);
    if (front->next != NULL)
        freeList(front->next);
}`,
  },
  {
    id: "s8",
    category: "ANL",
    subcat: "Algo Analysis",
    term: "Fall 2026",
    points: "10",
    date: "",
    link: "",
    difficulty: "",
    grades: "",
    comments: "",
    code: "",
  },
];

export const GUHA_OFFICE_HOURS = "https://www.cs.ucf.edu/~dmarino/ucf/OH.html";
