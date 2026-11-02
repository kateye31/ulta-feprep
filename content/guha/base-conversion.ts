import type { SourceNote } from "@/lib/guha/types";

export const baseConversion: SourceNote = {
  topic: "base-conversion",
  title: "Base conversion, the way Guha teaches it",
  tldr: "Repeated division extracts digits from right to left; recursion or a stack can print them in the opposite order.",
  sections: [
    { heading: "Find one digit", body: "Guha places base conversion early in the recursion unit. For nonnegative integer n and base b at least 2, `n % b` is the least significant digit and integer division `n / b` removes it. Repeat until the quotient is zero. Map digit values 10 and above to letters when b exceeds 10." },
    { heading: "Print in reading order", body: "The first remainder is the rightmost digit. A recursive printer handles the quotient first, then prints the current remainder while calls return. Handle zero explicitly: its representation is `0`, even though repeated division may otherwise do no work." },
    { heading: "Go back to decimal", body: "For digits `d_k ... d_0` in base b, the value is the sum of `d_i * b^i`. Alternatively scan left to right with `value = value*b + digit`. Reject a digit greater than or equal to the base. For fixed-width C integers, check for overflow if arbitrary input is allowed." },
  ],
  misses: ["Remainders come out from least significant to most significant.", "Zero must produce one digit.", "The base must be at least 2 for repeated division to progress.", "A digit's value must be less than the base.", "Negative values need an explicit sign policy; `%` alone is not a complete formatter."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (recursion and base conversion lessons/program)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review (recursion method)", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
  ],
};
