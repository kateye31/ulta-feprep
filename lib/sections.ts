import type { SectionId } from "./types";

export const SECTIONS: Record<
  SectionId,
  { id: SectionId; name: string; part: string; blurb: string; emoji: string; menuName: string }
> = {
  IA: {
    id: "IA",
    name: "Section I · Part A",
    part: "Data Structures (the basics)",
    blurb: "Memory, pointers, linked lists, stacks and queues: the plates and cups of the kitchen.",
    emoji: "🥐",
    menuName: "Pastries",
  },
  IB: {
    id: "IB",
    name: "Section I · Part B",
    part: "Data Structures (the fancy ones)",
    blurb: "Trees, AVL trees, heaps, hash tables and tries. These are the clever storage systems.",
    emoji: "🍵",
    menuName: "Teas",
  },
  IIA: {
    id: "IIA",
    name: "Section II · Part A",
    part: "Algorithm Analysis",
    blurb: "Big-O, timing problems, summations and recurrences. This is measuring how fast the kitchen runs.",
    emoji: "☕",
    menuName: "Coffee",
  },
  IIB: {
    id: "IIB",
    name: "Section II · Part B",
    part: "Algorithms (writing them!)",
    blurb: "Recursion, sorting, bitwise tricks and backtracking. These are the recipes themselves.",
    emoji: "🍰",
    menuName: "Desserts",
  },
};

export const SECTION_ORDER: SectionId[] = ["IA", "IB", "IIA", "IIB"];

export const NOTES_BASE = "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/lec/";
export const EXAMS_URL = "https://www.cs.ucf.edu/registration/exm/";
export const MATERIAL_URL = "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/";
export const FEPREP_URL = "https://feprep.net/dashboard";
