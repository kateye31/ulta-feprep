import type { SourceNote } from "@/lib/guha/types";

export const sorting: SourceNote = {
  topic: "sorting",
  title: "Sorting, the way Guha teaches it",
  tldr: "Know each sort's repeated move, trace its intermediate array, and separate typical from worst-case time.",
  sections: [
    { heading: "Start with simple passes", body: "Guha teaches insertion, bubble, and selection sorts before divide-and-conquer sorts. Insertion shifts larger items to make room for the current key. Bubble swaps adjacent out-of-order pairs. Selection finds the smallest remaining item and puts it at the next final position." },
    { heading: "Split or partition", body: "Merge sort divides into halves, recursively sorts them, and merges in order, taking Θ(n log n) time and O(n) extra array space. Quick sort partitions around a pivot, then sorts the sides. A balanced partition gives Θ(n log n); repeatedly lopsided partitions give Θ(n²)." },
    { heading: "Trace the right moment", body: "Guha's review expects a trace of all five sorts, including merge and quick sort. Label whether the question asks after an outer pass, one swap, one partition, or one merge. Different pivot and partition conventions can produce different intermediate arrays while still sorting correctly." },
  ],
  misses: ["Selection sort chooses one minimum per outer pass; it is not bubble sort.", "Insertion sort moves the key into a sorted prefix.", "Merge sort needs a correct merge of two sorted ranges.", "Quick sort's worst case is Θ(n²), not Θ(n log n).", "A quick-sort trace depends on the stated pivot and partition scheme."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (simple sorts, merge, quick sort)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review (sorting expectations)", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
  ],
};
