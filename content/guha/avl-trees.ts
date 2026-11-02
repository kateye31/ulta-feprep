import type { SourceNote } from "@/lib/guha/types";

export const avlTrees: SourceNote = {
  topic: "avl-trees",
  title: "AVL trees, the way Guha teaches them",
  tldr: "An AVL is a BST that repairs height differences with rotations. Work upward from the changed spot, checking each ancestor.",
  sections: [
    { heading: "Measure the imbalance", body: "Guha teaches ordinary BST changes first, then AVL repair. At each node, compare left and right subtree heights. Their difference must be at most 1 in magnitude. Define the empty subtree's height consistently; the chosen convention changes numbers, not which nodes are balanced." },
    { heading: "Choose the rotation", body: "A heavy left-left path gets one right rotation; right-right gets one left rotation. Left-right needs a left rotation of the child, then a right rotation of the ancestor. Right-left is the mirror. Rotations preserve BST key order while shortening the heavy path." },
    { heading: "Insertion and deletion", body: "After insertion, walk upward to the first unbalanced ancestor and fix it; one local restructuring finishes insertion repair. Deletion can shrink a subtree repeatedly, so continue checking ancestors after a rotation. A January 2026 exam specifically asks for two stages of an AVL deletion." },
    { heading: "Cost", body: "AVL height stays O(log n), so search, insertion, and deletion take O(log n). Draw subtree roots and moved middle branches during a rotation; the middle branch must be reattached, not discarded." },
  ],
  misses: ["Balance is a height difference, not a difference in node counts.", "Check the child's leaning to distinguish single from double rotations.", "The middle subtree changes parent during a rotation; keep it attached.", "Deletion may need more than one repair on the path to the root.", "BST ordering must still hold after every rotation."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (AVL insertion/deletion)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
    { label: "UCF, January 2026 Foundation Exam questions", url: "https://www.cs.ucf.edu/registration/exm/spr2026/FE-Jan26.pdf" },
  ],
};
