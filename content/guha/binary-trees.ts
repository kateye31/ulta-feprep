import type { SourceNote } from "@/lib/guha/types";

export const binaryTrees: SourceNote = {
  topic: "binary-trees",
  title: "Binary trees, the way Guha teaches them",
  tldr: "A tree node can lead to two smaller trees. Recursion handles both branches; a BST adds an ordering rule for searching.",
  sections: [
    { heading: "First, the shape", body: "Guha introduces plain binary trees before binary search trees. Each node has left and right pointers; either may be `NULL`. A recursive walk handles the current node and then each child. A full traversal visits all n nodes in O(n) time." },
    { heading: "Then, BST order", body: "In a BST with unique keys, every key on the left is smaller than the node and every key on the right is larger. Search follows one branch per comparison: O(h), where h is tree height. A balanced tree has h = O(log n); a chain has h = O(n)." },
    { heading: "Delete and traverse", body: "Deleting a leaf or one-child node reconnects its parent. With two children, replace the key using the inorder predecessor or successor, then remove that donor node. Inorder means left, node, right; preorder and postorder change the visit point. Guha's exam review stresses writing recursive walks." },
    { heading: "Exam trace", body: "A recent exam asks for right, node, left print order. That is a traversal order even if the pictured tree does not satisfy BST ordering. Follow the code's call order, not the numerical appearance of the values." },
  ],
  misses: ["A binary tree is not automatically a BST.", "BST search is O(h), not always O(log n).", "Inorder is sorted only when the BST invariant holds.", "A two-child delete must also remove the predecessor or successor's original node.", "Traversal output follows recursive call order exactly."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (binary trees, BST insert/delete)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
    { label: "UCF, January 2026 Foundation Exam questions", url: "https://www.cs.ucf.edu/registration/exm/spr2026/FE-Jan26.pdf" },
  ],
};
