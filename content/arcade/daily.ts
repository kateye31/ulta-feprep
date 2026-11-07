import type { Exam, Question } from "@/lib/arcade/types";

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
  sections: [{ id: "D", name: "Algorithms", questions: [P287] }],
};
