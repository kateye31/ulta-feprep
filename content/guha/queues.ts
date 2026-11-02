import type { SourceNote } from "@/lib/guha/types";

export const queues: SourceNote = {
  topic: "queues",
  title: "Queues, the way Guha teaches them",
  tldr: "A queue serves the oldest item first. Keep track of both ends so neither enqueue nor dequeue must scan or shift the whole structure.",
  sections: [
    { heading: "Front and back", body: "After stacks, Guha switches the removal end. Enqueue at the back, dequeue at the front: first in, first out. In a linked queue, keep both `front` and `back` pointers. The first insertion sets both; removing the last node makes both `NULL`." },
    { heading: "Circular array", body: "An array queue can hold `front`, `count`, and `capacity`. The next insert goes at `(front + count) % capacity`; removing increments `front` modulo capacity and decreases `count`. This reuses freed slots without moving elements. Each ordinary operation is O(1)." },
    { heading: "Why Guha compares designs", body: "If an array queue insists that the front stay at index 0, each removal shifts up to n items: O(n). A circular array or two-ended linked queue avoids that cost. His course uses queues alongside maze exploration, where processing order matters." },
  ],
  misses: ["A queue removes from the front, unlike a stack.", "When the last linked node leaves, clear the rear pointer too.", "Use modulo capacity when a circular index wraps.", "Distinguish empty from full; a `front` index alone cannot tell them apart.", "Shifting an array after every dequeue makes that operation O(n)."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (queues and maze)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
  ],
};
