import type { SourceNote } from "@/lib/guha/types";

export const summations: SourceNote = {
  topic: "summations",
  title: "Summations, the way Guha teaches them",
  tldr: "Split a complicated sum into familiar pieces, adjust its bounds, then simplify before deciding its growth.",
  sections: [
    { heading: "Read the bounds", body: "A summation adds one term for each integer index from its lower bound through its upper bound. There are `b-a+1` terms from a through b. Guha's analysis unit moves from counting loop work to writing that count as a sum." },
    { heading: "Split and factor", body: "Use linearity: the sum of `3i+2` is three times the sum of i plus two times the number of terms. For a lower bound above 1, subtract the earlier prefix: sum from a through b equals sum from 1 through b minus sum from 1 through a-1." },
    { heading: "Know the core shapes", body: "The sum of 1 through n is `n(n+1)/2`; a constant c repeated n times sums to `cn`. A geometric sequence such as `1+2+4+...+2^k` totals `2^(k+1)-1`. Check whether your upper bound is an index or a number of terms." },
  ],
  misses: ["Inclusive bounds from a through b contain `b-a+1` terms.", "When subtracting a prefix, stop at `a-1`, not a.", "A constant inside a sum is multiplied by the number of terms.", "The last geometric term `2^k` means `k+1` terms when starting at `2^0`.", "Simplify the exact sum before taking its Big-O bound."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (summations lecture)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review (sums)", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
  ],
};
