import type { SourceNote } from "@/lib/guha/types";

export const recursion: SourceNote = {
  topic: "recursion",
  title: "Recursion, the way Guha teaches it",
  tldr: "Solve a smaller version of the same task, then use its answer. A base case stops the calls.",
  sections: [
    { heading: "Trust the smaller call", body: "Guha starts with direct examples such as Fibonacci, Towers of Hanoi, and base conversion. Imagine the recursive function already solves a smaller input. Your job is to reduce the current input, call it, and combine its answer. The input must actually move toward a base case." },
    { heading: "Trace both directions", body: "On the way down, record each call's arguments. On the way up, record its return value and any work after the call. Printing before recursion produces a different order from printing after it. Separate call count from maximum call-stack depth." },
    { heading: "Branching recursion", body: "Flood fill and permutations can make several recursive calls from one state. Guard grid boundaries and already-visited cells before moving outward. For permutations, choose a candidate, recurse on the remaining choices, then undo that choice so the next branch starts cleanly." },
  ],
  misses: ["A base case must cover the smallest valid input.", "Every recursive branch must make progress toward termination.", "Work after a recursive call happens while returning, not while descending.", "Branching calls can create far more total work than stack depth.", "Restore changed state after exploring a branch when later branches share it."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (recursion, Hanoi, flood fill, permutations)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review (recursion)", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
  ],
};
