import type { Exam } from "@/lib/arcade/types";
import { EXAMS_URL } from "@/lib/sections";
import { A1, A2, A3, B1, B2, B3 } from "./fall2026-ab";
import { C1, C2, C3, D1, D2, D3 } from "./fall2026-cd";
import { DAILY } from "./daily";
import { FE_100 } from "./fe100";
import { SPRING_2024 } from "./spring2024";
import { SPRING_2026 } from "./spring2026";
import { SUMMER_2024 } from "./summer2024";
import { FALL_2024 } from "./fall2024";
import { SUMMER_2026 } from "./summer2026";

export const FALL_2026: Exam = {
  id: "fall2026",
  term: "Fall 2026",
  date: "August 29, 2026",
  blurb: "Bowser's enemies, doubly linked lists, a heapify, an AVL double-rebalance, and a True/False test graded with XOR.",
  questionsPdf: `${EXAMS_URL}fall2026/FE-Aug26.pdf`,
  solutionsPdf: `${EXAMS_URL}fall2026/FE-Aug26-Sol.pdf`,
  sections: [
    { id: "A", name: "Basic Data Structures", questions: [A1, A2, A3] },
    { id: "B", name: "Advanced Data Structures", questions: [B1, B2, B3] },
    { id: "C", name: "Algorithm Analysis", questions: [C1, C2, C3] },
    { id: "D", name: "Algorithms", questions: [D1, D2, D3] },
  ],
};

export const ARCADE_EXAMS: Exam[] = [FE_100, DAILY, FALL_2026, SUMMER_2026, SPRING_2026, FALL_2024, SUMMER_2024, SPRING_2024];

/** shelved exams that don't have a playable version yet */
export const COMING: { term: string; date: string }[] = [
  { term: "Fall 2025", date: "August 23, 2025" },
  { term: "Summer 2025", date: "May 2025" },
  { term: "Spring 2025", date: "January 2025" },
];

export const getExam = (id: string) => ARCADE_EXAMS.find((e) => e.id === id);
