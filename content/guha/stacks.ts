import type { SourceNote } from "@/lib/guha/types";

export const stacks: SourceNote = {
  topic: "stacks",
  title: "Stacks, the way Guha teaches them",
  tldr: "A stack exposes only its top: the last thing pushed is the first thing popped.",
  sections: [
    { heading: "The rule", body: "Guha follows linked lists with stacks. `push` adds at the top; `pop` removes that same top. Trace the contents after every operation, with the top clearly labeled. A stack can use a linked-list head or an array plus a top index and capacity." },
    { heading: "The implementation", body: "For an array with `top = -1` when empty, push writes to `a[++top]`; pop reads `a[top--]`, after checking bounds. A linked implementation inserts and removes at the head. Both operations take O(1), assuming array capacity is available or allocation succeeds." },
    { heading: "Why the exam cares", body: "Guha uses stacks for expression work. In infix-to-postfix conversion, output operands immediately; hold operators until precedence and parentheses say they can leave. The January 2026 exam asks for both the final postfix expression and the stack at checkpoints." },
  ],
  misses: ["Do not pop an empty stack or push past fixed capacity.", "State whether `top` is an index or a count before tracing.", "A left parenthesis is a marker, not an operator emitted to postfix.", "For equal-precedence left-associative operators, pop the earlier operator first.", "A linked stack's top is its head; scanning to the tail makes push or pop O(n)."],
  sources: [
    { label: "Guha, COP 3502 Fall 2025 material index (stacks and postfix examples)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/" },
    { label: "Guha, Foundation Exam style final review", url: "https://www.cs.ucf.edu/courses/cop3502/sum2020/exam/fe/FinalExamReview-Sum2020.pdf" },
    { label: "UCF, January 2026 Foundation Exam questions", url: "https://www.cs.ucf.edu/registration/exm/spr2026/FE-Jan26.pdf" },
  ],
};
