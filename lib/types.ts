import type { ReactNode } from "react";

export type SectionId = "IA" | "IB" | "IIA" | "IIB";
export type Mascot = "mochi" | "pip" | "tofu";

export type WidgetId =
  | "pointers"
  | "linkedlist"
  | "stack"
  | "postfix"
  | "queue"
  | "bst"
  | "avl"
  | "heap"
  | "hash"
  | "trie"
  | "bigo"
  | "timing"
  | "summation"
  | "hanoi"
  | "sorting"
  | "bitwise"
  | "nqueens"
  | "base"
  | "recurrence";

export type Resource = {
  label: string;
  url: string;
  kind: "video" | "visual" | "read" | "practice";
  note?: string;
};

export type Topic = {
  slug: string;
  title: string;
  short: string;
  emoji: string;
  section: SectionId;
  mascot: Mascot;
  tagline: string;
  minutes: number;
  tldr: ReactNode[];
  picture: { title: string; scene: ReactNode; caption?: string; body: ReactNode };
  levels: { title: string; body: ReactNode }[];
  widgets?: WidgetId[];
  /** Code Studio practice files for this topic: [label, path] */
  drills?: [string, string][];
  code?: { title: string; src: string; note?: ReactNode }[];
  mnemonics: { hook: string; body: ReactNode }[];
  missing: { title: string; body: ReactNode }[];
  traps: ReactNode[];
  example?: { title: string; prompt: ReactNode; steps: ReactNode[] };
  quiz: { q: ReactNode; choices: ReactNode[]; answer: number; why: ReactNode }[];
  flashcards: { front: string; back: string }[];
  resources: Resource[];
  notes: { label: string; file: string }[];
};
