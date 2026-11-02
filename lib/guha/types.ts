import type { TopicSlug } from "@/lib/potd/types";

/**
 * Source notes: Arup Guha's COP 3502 material, explained in our own words with credit,
 * so the site teaches it here instead of linking out.
 */
export type SourceNote = {
  topic: TopicSlug;
  /** e.g. "Linked lists, the way Guha teaches them" */
  title: string;
  /** 1–2 sentence plain-words summary */
  tldr: string;
  /** short sections; body uses mini-markdown (`code`, **bold**, blank-line paragraphs, simple tables) */
  sections: { heading: string; body: string; code?: string }[];
  /** "what you tend to miss": specific traps the source warns about or past exams punish */
  misses: string[];
  /** every source this note is built from (paraphrased, never copied) */
  sources: { label: string; url: string }[];
};
