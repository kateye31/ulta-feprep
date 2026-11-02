import type { SourceNote } from "@/lib/guha/types";

export const heaps: SourceNote = {
  topic: "heaps",
  title: "Binary heaps, the way Guha teaches them",
  tldr: "A min-heap is a complete tree whose parent is no larger than its children. The smallest item is at the root.",
  sections: [
    { heading: "Two rules, not one", body: "Guha introduces heaps after AVL trees. A heap must be complete: all levels filled except possibly the last, filled left to right. It also obeys parent priority. It is not globally sorted; a child's descendants may be in many orders." },
    { heading: "Array picture", body: "Guha's array convention starts at index 1. For node `i`, its children are `2*i` and `2*i+1`; its parent is `i/2` using integer division. These formulas change for a 0-indexed array, so label your convention before tracing." },
    { heading: "Repair direction", body: "Insertion places the new item in the next open slot and percolates it upward while smaller than its parent. Delete-min replaces the root with the last item, reduces the size, then percolates downward, swapping with the smaller child when needed. Both take O(log n); reading the minimum is O(1)." },
  ],
  misses: ["A heap is not a BST and does not give O(log n) search for an arbitrary key.", "With 1-indexing, children are `2*i` and `2*i+1`.", "Delete-min moves the final array item to the root before sinking it.", "When sinking a min-heap node, compare both existing children and choose the smaller.", "The heap must stay complete after every operation."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (heaps and sample programs)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
  ],
};
