/**
 * Exam Arcade data model. An exam is a list of sections → questions → steps.
 * Each question is broken into small steps; the steps' `pts` add up to the real rubric points,
 * so finishing a question shows what you'd have earned on paper.
 */

export type TreeNode = { id: string; x: number; y: number; v?: string; slot?: string };
export type TreeSpec = { nodes: TreeNode[]; edges: [string, string][]; mark?: string[] };

/** Something the player holds in their satchel: a struct, a code segment, a picture, a sample file… */
export type Item = {
  id: string;
  title: string;
  kind: "code" | "text" | "tree" | "file" | "table";
  body?: string;
  tree?: TreeSpec;
  table?: { head: string[]; rows: string[][] };
};

/** A custom hint for the typing checker: when the wrong word matches `when`, Bea says `say`. */
export type Rule = { when: string | string[] | RegExp; at?: string | RegExp; say: string; mood?: Mood };

export type Mood = "happy" | "explain" | "think" | "worry" | "oops" | "proud" | "love" | "calm" | "cheeky" | "tired" | "driven";

type Base = {
  id: string;
  /** short label for the step list, e.g. "malloc the node" */
  title: string;
  /** the question Bea asks. Supports `code`, **bold**, *italic*, and blank-line paragraphs. */
  prompt: string;
  /** rubric points this step is worth on the real exam (0 for warm-ups) */
  pts?: number;
  /** items that drop into the inventory when this step opens */
  give?: Item[];
  /** shown after the step is solved: the "why" */
  learn?: string;
};

export type ChoiceStep = Base & {
  kind: "choice";
  options: { t: string; ok?: boolean; why: string }[];
  /** render option text as code */
  mono?: boolean;
};

export type TypeStep = Base & {
  kind: "type";
  /** accepted answers (whitespace never matters) */
  answers: string[];
  hints?: Rule[];
  /** general nudge used when no specific hint fits */
  nudge?: string;
  /** points lost per auto-filled word (default: half the step, at least 1) */
  penalty?: number;
  /** ignore commas (for "60, 55, 30" style answers) */
  loose?: boolean;
  placeholder?: string;
};

/** label = text before the box, after = text after it (row layout), w = width in characters */
export type Slot = { id: string; answer: string | string[]; label?: string; after?: string; pts?: number; w?: number };

export type SlotsStep = Base & {
  kind: "slots";
  layout: "row" | "array" | "stacks" | "tree";
  slots: Slot[];
  /** array layout: header labels (indices) */
  index?: string[];
  /** stacks layout: [label, slot ids bottom→top][] */
  stacks?: [string, string[]][];
  tree?: TreeSpec;
  /** "each" = sum slot pts · "floorHalf" = floor(correct/2) · "all" = pts only if every slot right · "minusEach" = pts − 1 per wrong slot */
  score?: "each" | "floorHalf" | "all" | "minusEach";
  /** text shown before/after each slot in row layout, e.g. "T(n) = " */
  sep?: string;
};

export type InfoStep = Base & { kind: "info"; button?: string };

export type Step = ChoiceStep | TypeStep | SlotsStep | InfoStep;

export type Question = {
  id: string; // "A1"
  pts: number;
  category: "DSN" | "ALG" | "ANL";
  topic: string;
  title: string;
  /** the opening story, shown like the exam's question text */
  story: string;
  /** starting inventory */
  given: Item[];
  /** "Your answer so far": code with {{stepId}} placeholders filled as type-steps are solved */
  scaffold?: { title: string; code: string };
  steps: Step[];
  /** the complete official answer, shown at the end */
  answer: string;
  /** one-line exam-day takeaway */
  takeaway: string;
  /** recipe id from lib/recipes.ts, when the topic alone doesn't pick the right one */
  recipe?: string;
};

export type Section = { id: string; name: string; questions: Question[] };

export type Exam = {
  id: string;
  term: string;
  date: string;
  blurb: string;
  /** the original paper (practice sets have none) */
  questionsPdf?: string;
  solutionsPdf?: string;
  /** a practice set, not a real sitting: the lobby skips "Foundation Exam" and the PDF links */
  practice?: boolean;
  sections: Section[];
};
