import type { SourceNote } from "@/lib/guha/types";

export const hashTables: SourceNote = {
  topic: "hash-tables",
  title: "Hash tables, the way Guha teaches them",
  tldr: "A hash maps a key to an array slot; collisions are unavoidable, so lookup must follow the same collision rule as insertion.",
  sections: [
    { heading: "Map the key", body: "Guha moves from tries to hash tables. A hash function computes an index in `0..m-1`. Different keys can land together. For strings, accumulate character contributions under modulo `m`; the January 2026 exam makes students maintain a rolling power instead of calling floating-point `pow`." },
    { heading: "Handle collisions", body: "With chaining, each slot holds a list of keys. With linear probing, try successive slots; quadratic probing uses a growing square offset. Search must repeat the exact insertion path. In open addressing, a deletion marker must not stop a later search prematurely." },
    { heading: "Time and load", body: "Expected O(1) lookup and insert require a useful hash function and controlled load factor. Worst case is O(n), such as a long chain or probe sequence. Guha's review treats open addressing conservatively when the table is more than about half full." },
  ],
  misses: ["Collision does not mean two keys are equal.", "Reduce rolling hash terms modulo `m` as they are computed to limit overflow.", "Search uses the same probe sequence as insert.", "Do not treat a deleted open-addressing slot as a never-used empty slot.", "Hash operations are not worst-case O(1)."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (hash table programs)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
    { label: "UCF, January 2026 Foundation Exam questions", url: "https://www.cs.ucf.edu/registration/exm/spr2026/FE-Jan26.pdf" },
  ],
};
