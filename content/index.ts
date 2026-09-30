import type { SectionId, Topic } from "@/lib/types";
import { SECTION_ORDER } from "@/lib/sections";
import { dynamicMemory } from "./topics/dynamic-memory";
import { linkedLists } from "./topics/linked-lists";
import { stacks } from "./topics/stacks";
import { queues } from "./topics/queues";
import { binaryTrees } from "./topics/binary-trees";
import { avlTrees } from "./topics/avl-trees";
import { heaps } from "./topics/heaps";
import { hashTables } from "./topics/hash-tables";
import { tries } from "./topics/tries";
import { bigO } from "./topics/big-o";
import { timingProblems } from "./topics/timing-problems";
import { summations } from "./topics/summations";
import { recurrences } from "./topics/recurrences";
import { recursion } from "./topics/recursion";
import { sorting } from "./topics/sorting";
import { bitwise } from "./topics/bitwise";
import { backtracking } from "./topics/backtracking";
import { baseConversion } from "./topics/base-conversion";

/** Study order: follows the COP3502 schedule within each exam section. */
export const TOPICS: Topic[] = [
  dynamicMemory,
  linkedLists,
  stacks,
  queues,
  binaryTrees,
  avlTrees,
  heaps,
  hashTables,
  tries,
  bigO,
  timingProblems,
  summations,
  recurrences,
  recursion,
  sorting,
  bitwise,
  backtracking,
  baseConversion,
];

export const getTopic = (slug: string) => TOPICS.find((t) => t.slug === slug);

export const topicsBySection = (): { id: SectionId; topics: Topic[] }[] =>
  SECTION_ORDER.map((id) => ({ id, topics: TOPICS.filter((t) => t.section === id) }));

/** Plain data safe to hand to client components. */
export const topicSummaries = () => TOPICS.map((t) => ({ slug: t.slug, emoji: t.emoji, short: t.short, title: t.title, section: t.section }));
