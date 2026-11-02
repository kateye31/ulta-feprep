import type { SourceNote } from "@/lib/guha/types";

export const bitwise: SourceNote = {
  topic: "bitwise",
  title: "Bitwise operators, the way Guha teaches them",
  tldr: "Treat an integer as a row of bits. Masks let one operation test, add, remove, or flip a selected bit.",
  sections: [
    { heading: "Read one bit at a time", body: "Guha introduces `&`, `|`, `^`, and `~` as operations on corresponding bit positions. AND keeps bits present in both operands; OR keeps either; XOR keeps exactly one. `~` flips all bits in the integer type, including bits outside a small example you drew." },
    { heading: "Make a mask", body: "For bit k in an unsigned integer, use `1u << k` when k is below the type width. Test with `x & mask`; set with `x | mask`; clear with `x & ~mask`; toggle with `x ^ mask`. Use an unsigned type when reasoning about shifts and bit patterns, especially near the sign bit." },
    { heading: "Sets as bits", body: "Guha uses one bit per possible set member. Intersection becomes AND; union becomes OR; XOR identifies membership in exactly one set. Enumerating masks from 0 through `2^n-1` visits all subsets, provided n fits the chosen integer representation." },
  ],
  misses: ["`&&` and `||` are logical operators, not bitwise `&` and `|`.", "`1 << k` can be unsafe near the signed sign bit; use an appropriate unsigned type.", "`~mask` flips every bit of that type.", "A bit test is nonzero, not necessarily equal to 1.", "A shift count at least the type width has undefined behavior in C."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (bitwise operators and programs)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review (bitwise sets)", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
  ],
};
