import type { SourceNote } from "@/lib/guha/types";

export const recurrences: SourceNote = {
  topic: "recurrences",
  title: "Recurrences, the way Guha teaches them",
  tldr: "Expand the relation a few times, spot the pattern after k steps, then stop at the base case.",
  sections: [
    { heading: "Describe one step", body: "A recurrence relates work on size n to work on smaller input. For example, `T(n)=T(n-1)+n` means the current call does n extra work after one smaller call. Give a base value such as `T(0)=0`; without it, the total is undetermined." },
    { heading: "Unroll it", body: "Guha's review asks students to expand about three times before guessing. Here, `T(n)=n+(n-1)+(n-2)+...+1+T(0)`, which is Θ(n²). For `T(n)=T(n/2)+1`, the input halves about log₂ n times, giving Θ(log n)." },
    { heading: "Stop at the base", body: "Write the k-step form, choose k so the remaining argument reaches 0 or 1, then simplify the resulting sum. If the relation makes two recursive calls, keep both branches; `2T(n/2)+n` is different from `T(n/2)+n`." },
  ],
  misses: ["Include the base-case value when unrolling.", "Do not replace two recursive calls with one.", "For halving, k is logarithmic; for subtracting one, k is linear.", "The per-level work may change, so count it at each level.", "Check domain assumptions when n/2 is rounded by integer division."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (recurrence relations)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review (recurrence method)", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
  ],
};
