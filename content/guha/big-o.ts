import type { SourceNote } from "@/lib/guha/types";

export const bigO: SourceNote = {
  topic: "big-o",
  title: "Big-O, the way Guha teaches it",
  tldr: "Count how often the basic step runs as input grows. Keep the dominant growth term and say what input size means.",
  sections: [
    { heading: "Count first", body: "Guha introduces algorithm analysis after the linear structures. Name the input size `n`, then count iterations or operations. A loop of n constant-time steps is O(n). Two consecutive such loops add; a nested n-by-n pair multiplies to O(n²)." },
    { heading: "Follow changing bounds", body: "For triangular loops, add the inner counts: `1 + 2 + ... + n = n(n+1)/2`, so O(n²). A counter doubled until it passes n takes O(log n) iterations. If the work per iteration grows, sum that work rather than labeling the whole loop logarithmic." },
    { heading: "Choose the bound", body: "Big-O is an asymptotic upper bound. Tight growth is often written Θ. Drop fixed multipliers and lower-order terms only after making the count. For data structures, express work using height or load as needed; for example, BST search is O(h), and h need not be logarithmic." },
  ],
  misses: ["Two nested loops are not automatically O(n²); inspect their bounds.", "A loop that halves n has O(log n) iterations only if each iteration is O(1).", "Sequential loops add their costs; nested loops require a sum or product.", "Best, average, and worst cases can have different bounds.", "State the variable whose growth is being measured."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (algorithm analysis lectures)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
  ],
};
