import type { Potd } from "@/lib/potd/types";
import { memory } from "./memory";
import { lists } from "./lists";
import { trees, heaps } from "./trees";
import { runtime } from "./runtime";
import { structures } from "./structures";
import { mathAndC } from "./math-and-c";

export const POTD_BANK: Potd[] = [
  ...memory,
  ...lists,
  ...trees,
  ...heaps,
  ...runtime,
  ...structures,
  ...mathAndC,
];
