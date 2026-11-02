import type { TopicSlug } from "@/lib/potd/types";
import type { SourceNote } from "@/lib/guha/types";
import { dynamicMemory } from "./dynamic-memory";
import { linkedLists } from "./linked-lists";
import { stacks } from "./stacks";
import { queues } from "./queues";
import { binaryTrees } from "./binary-trees";
import { avlTrees } from "./avl-trees";
import { heaps } from "./heaps";
import { hashTables } from "./hash-tables";
import { tries } from "./tries";
import { bigO } from "./big-o";
import { timingProblems } from "./timing-problems";
import { summations } from "./summations";
import { recurrences } from "./recurrences";
import { recursion } from "./recursion";
import { sorting } from "./sorting";
import { bitwise } from "./bitwise";
import { backtracking } from "./backtracking";
import { baseConversion } from "./base-conversion";

export const SOURCE_NOTES: SourceNote[] = [
  dynamicMemory, linkedLists, stacks, queues, binaryTrees, avlTrees,
  heaps, hashTables, tries, bigO, timingProblems, summations,
  recurrences, recursion, sorting, bitwise, backtracking, baseConversion,
];

export function noteFor(topic: TopicSlug): SourceNote | undefined {
  return SOURCE_NOTES.find((note) => note.topic === topic);
}
