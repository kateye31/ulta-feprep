import type { SourceNote } from "@/lib/guha/types";

export const backtracking: SourceNote = {
  topic: "backtracking",
  title: "Backtracking, the way Guha teaches it",
  tldr: "Build one partial answer at a time. Reject a choice as soon as it cannot lead to a valid full answer, then undo it and try the next choice.",
  sections: [
    { heading: "Choose, test, recurse", body: "Guha reaches backtracking after recursion and brute force. At each position, loop over candidate values. Check whether the candidate keeps the partial solution valid; only then recurse. A failed early check skips an entire branch of future choices." },
    { heading: "Undo the choice", body: "For eight queens, mark the chosen column and diagonals, recurse to the next row, then unmark them. For Sudoku, place a legal digit, recurse, and clear the cell if that branch fails. Each branch must see the state it inherited, not leftovers from a sibling branch." },
    { heading: "Stop correctly", body: "A completed valid state is a solution. If you need only one, return success through the call chain; if you need all, record it and keep exploring. Guha's digit-divisibility example checks a partial number immediately, avoiding extensions of a prefix that already fails its rule." },
  ],
  misses: ["Check constraints before the recursive call, not only at the final leaf.", "Undo every state change before trying another branch.", "A success return must propagate through callers if the task seeks one solution.", "A pruning test must be safe: reject only prefixes that cannot be extended to a solution.", "Worst-case search can still be exponential despite pruning."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (backtracking, queens, Sudoku)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review (backtracking examples)", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
  ],
};
