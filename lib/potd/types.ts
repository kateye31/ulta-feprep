/**
 * Problem of the Day. One small Foundation-Exam-style problem per day, rotated from a bank.
 * Text fields support the same mini-markdown as the arcade: `code`, **bold**, *italic*, blank-line paragraphs.
 */

export type TopicSlug =
  | "dynamic-memory"
  | "linked-lists"
  | "stacks"
  | "queues"
  | "binary-trees"
  | "avl-trees"
  | "heaps"
  | "hash-tables"
  | "tries"
  | "big-o"
  | "timing-problems"
  | "summations"
  | "recurrences"
  | "recursion"
  | "sorting"
  | "bitwise"
  | "backtracking"
  | "base-conversion";

export type Potd = {
  /** stable id, e.g. "ll-rotate-01" */
  id: string;
  topic: TopicSlug;
  /** trace = "what does this print/return", code = write a line or two, choice = pick one, fill = short answer */
  kind: "trace" | "code" | "choice" | "fill";
  /** 1 = warm-up, 2 = exam-typical, 3 = exam-hard */
  level: 1 | 2 | 3;
  /** short and specific, e.g. "Rotate the train 3 times" */
  title: string;
  /** the question, max ~90 words */
  prompt: string;
  /** C code shown with the question (no markdown fences) */
  code?: string;
  /** accepted answers for trace/code/fill (compared ignoring spaces and case) */
  answers?: string[];
  /** for kind "choice": exactly one ok */
  choices?: { t: string; ok?: boolean; why: string }[];
  /** one gentle hint, revealed on request */
  hint: string;
  /**
   * The walkthrough, in the house voice: name the likely slip, "the big secret" in one line,
   * then a step/round-by-round trace (a markdown table "| Line | What it does | Picture |" is welcome),
   * the answer, and a one-line exam tip. Emojis welcome, short lines, no walls of text.
   */
  explain: string;
  /** the one thing students tend to miss on this kind of problem */
  miss: string;
  /** where the idea comes from, e.g. a past FE question or a COP 3502 lecture */
  source?: { label: string; url?: string };
};
