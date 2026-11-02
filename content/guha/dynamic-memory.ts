import type { SourceNote } from "@/lib/guha/types";

export const dynamicMemory: SourceNote = {
  topic: "dynamic-memory",
  title: "Dynamic memory, the way Guha teaches it",
  tldr: "Draw the ownership shape first: one object, an array, or an array of pointers. Allocate every level you draw, then free it from the inside out.",
  sections: [
    { heading: "Start with the shape", body: "Guha begins with pointers and arrays, then combines them. `item *p` may point to one item or the first item of an array. `item **rows` often points to an array of pointers; each pointer may need its own allocation. A pointer variable alone does not create the object it points to." },
    { heading: "Allocate the right bytes", body: "For `n` objects, request `n * sizeof *p` bytes. For a C string of `n` characters, reserve `n + 1` bytes for the terminating zero. Check allocation before using the pointer. `calloc` zero-initializes bytes; `realloc` may move the allocation, so assign its result to a temporary pointer first." },
    { heading: "Release in reverse order", body: "If each array slot owns another allocation, free those children first, then the outer array. Freeing a struct does not automatically free pointers stored in its fields. After `free(p)`, the old pointer value cannot be dereferenced; set an owning pointer to `NULL` when it will remain in scope." },
    { heading: "Exam-sized move", body: "The January 2026 exam asks for an item array that can grow. Keep the old allocation if `realloc` fails; after success, copy the new item into slot `count`, then increment `count`. Check the capacity rule before changing either pointer or count." },
  ],
  misses: ["`malloc(sizeof p)` allocates pointer-sized space, not necessarily one pointed-to object.", "A string needs one extra byte for `\0`.", "Assigning `realloc` straight to the only pointer loses the old block on failure.", "Free nested allocations before freeing the array or struct that holds their pointers.", "A successful `free` does not make other aliases safe to use."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (dynamic memory lectures and programs)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
    { label: "UCF, January 2026 Foundation Exam questions", url: "https://www.cs.ucf.edu/registration/exm/spr2026/FE-Jan26.pdf" },
  ],
};
