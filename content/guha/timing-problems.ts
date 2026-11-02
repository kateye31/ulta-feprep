import type { SourceNote } from "@/lib/guha/types";

export const timingProblems: SourceNote = {
  topic: "timing-problems",
  title: "Timing problems, the way Guha teaches them",
  tldr: "Treat the given running time as a scale equation. Use one known measurement to predict another under the stated model.",
  sections: [
    { heading: "Write the model", body: "Guha separates timing word problems from loop analysis. If the problem says time is proportional to `f(n)`, write `T(n) = c f(n)` for the same machine and implementation. The unknown `c` captures the scale in the problem's simplified model." },
    { heading: "Use a ratio", body: "Given `T(a)`, compute `T(b) = T(a) * f(b) / f(a)`. For a quadratic model, doubling size multiplies time by 4. For `n log n`, use the whole expression; doubling n is slightly more than a factor of 2." },
    { heading: "Respect units and assumptions", body: "Convert seconds, minutes, and hours before comparing. If two inputs or machines change, use the relationship the question actually provides. A Big-O label alone does not specify an exact time; the ratio calculation requires the explicit proportional-time assumption." },
  ],
  misses: ["O(n²) alone does not prove an exact 4× timing ratio; the model must say proportional.", "For `n log n`, include the logarithm at both input sizes.", "Keep time units consistent.", "Do not cancel a constant if the two runs use different assumed machines or algorithms.", "Use input size, not the numeric value of an individual data item."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (algorithm analysis sequence)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review (timing questions)", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
  ],
};
