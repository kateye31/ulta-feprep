import type { SourceNote } from "@/lib/guha/types";

export const tries: SourceNote = {
  topic: "tries",
  title: "Tries, the way Guha teaches them",
  tldr: "A trie shares prefixes: one edge per next character. A complete word needs an explicit ending mark, even when it is also a prefix.",
  sections: [
    { heading: "Walk by characters", body: "Guha introduces tries with word and prefix problems. Starting at the root, follow the child for each character. Create missing children during insertion. A path for `car` can be shared by `cart`; a terminal marker at `car` says that the shorter word exists too." },
    { heading: "Store helpful counts", body: "A node can store how many words pass through it or end there. Increment the right counter at each step of insertion. Then a prefix count can be answered after walking just the prefix, instead of visiting the whole subtree." },
    { heading: "Recurse over children", body: "Guha's review emphasizes collecting answers from every child when a trie question asks about a whole subtree. Depth-first traversal can count words, find a best continuation, or free all nodes. Cost depends on traversed nodes; a single word lookup takes O(L) character steps for length L, assuming constant-size alphabet indexing." },
  ],
  misses: ["A path existing does not prove the path is a stored word.", "Mark the terminal node for a word that is also another word's prefix.", "Check the character's alphabet range before indexing a fixed child array.", "Counts for repeated insertions depend on whether duplicates are allowed.", "A subtree query must combine all relevant child results, not stop at the first child."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (tries and prefix programs)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
  ],
};
