import type { SourceNote } from "@/lib/guha/types";

export const linkedLists: SourceNote = {
  topic: "linked-lists",
  title: "Linked lists, the way Guha teaches them",
  tldr: "A list is a chain of separately allocated nodes. Draw each arrow before changing it so the rest of the chain stays reachable.",
  sections: [
    { heading: "Build the chain", body: "Guha moves from dynamic allocation to a node with data and `next`. The head points at the first node; the last node's `next` is `NULL`. Walking from head takes O(n), unlike array indexing. Inserting at the front can take O(1) once the new node exists." },
    { heading: "Splice carefully", body: "To insert after `cur`, first connect `newNode->next` to the old successor, then set `cur->next` to the new node. To delete, save the node, connect its predecessor to its successor, then free it. If the first node changes, return the new head or pass a pointer to the head pointer." },
    { heading: "Variations", body: "A tail pointer makes append O(1), provided it stays current. A doubly linked list also repairs `prev` links. A circular list has no `NULL` terminator: stop when you return to the start. Guha's practice moves a first node to the back, which forces you to update both ends." },
    { heading: "Trace the arrows", body: "For a recursive list function, sketch the list at each call and on return. The January 2026 exam uses a function that temporarily detaches nodes and reconnects them later. Values alone do not show whether a node was lost." },
  ],
  misses: ["Check for `NULL` before reading `head->next`.", "Changing `cur->next` too early can lose the old suffix.", "Deleting the head needs a new head value.", "Free a removed node only after saving any link needed to continue.", "A circular-list traversal cannot wait for `NULL`."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (linked list sequence)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, linked list study group solutions", url: "https://www.cs.ucf.edu/~dmarino/ucf/transparency/cop3502/studygroups/StudyGroup-LL-Sol.pdf" },
    { label: "Guha, Foundation Exam style final review", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
    { label: "UCF, January 2026 Foundation Exam questions", url: "https://www.cs.ucf.edu/registration/exm/spr2026/FE-Jan26.pdf" },
  ],
};
