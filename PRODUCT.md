# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One person: a UCF computer science student retaking the CS Foundation Exam (COP 3502 topics) after scoring 40 on the Fall 2026 attempt. They study alone at home, often in long sessions, and have ADHD. Their job: get from "I can trace code" to "I can write code from a blank page under exam conditions" before the next exam (Spring 2027, mid-January; exact date stored in the site and editable).

Known weak spots (from their professor and their own question log): writing code from scratch, heaps, binary trees, runtime analysis. Most lost points come from misreading the prompt: return type, malloc size, NULL checks, free order, char* vs char**, dot vs arrow.

## Product Purpose

FE Café turns Foundation Exam prep into something the student will actually come back to every day: real past exams broken into small steps, topic explanations with the "missing puzzle pieces" lectures skip, hands-on playgrounds, and a C code studio. Success means daily return visits, honest exam-style scores trending up, and passing the exam.

## Positioning

A personal study space built around one student's actual mistakes and real UCF exam material. It brings the course's own sources (Arup Guha's COP 3502 notes, programs and past exams) into the site, explained in plain words with credit, instead of sending the student off to scattered external pages.

## Operating Context

- Runs locally (`npm run dev`) on the student's Windows laptop; everything personal saves to `data/fe-cafe-save.json` plus browser storage, and must survive restarts, new ports and new browsers.
- Study rhythm: Pomodoro sessions, daily practice, past exams on paper and in the arcade.
- The student also uses Claude Code and Codex in the terminal to build and extend the site.

## Capabilities and Constraints

Existing, to preserve:
- 18 topic pages with levels, playgrounds, worked problems, quizzes (`content/topics/`).
- Night Shift exam arcade (`/arcade`): Fall 2026 fully gamified with rubric-true points, word-by-word typing checker, hints, inventory, notes, decorating with beans.
- Code Studio (`/studio`): C editor with NO autocomplete and NO AI, runs code via Compiler Explorer.
- My Plan, Journal (question log), Runtime Gym, flashcards, cheat sheet, past-exam shelf.
- Offline tutor "Juni" in the arcade (no API key needed); the Claude-powered tutor is an optional upgrade.

Requested next (confirmed with the user, 2026-10-30):
- Problems of the day (gamified).
- A sources-backed explainer ("Fact Explorer"-style): explains a topic using real sources and surfaces the parts the student tends to miss.
- Guha's COP 3502 material brought into the site (paraphrased, credited), not linked out.
- Calendar: daily study log (from Jan 1) plus exam countdown.
- An embedded, non-AI video Pomodoro.
- Small, satisfying puzzles.
- Far more human-made illustration (public domain / CC0 only), and a colorful, human-feeling site.

Constraints:
- No AI in the Code Studio. AI help only in the tutor.
- Only public-domain or CC0/openly licensed art ships on the site. The user's mood board (`references/moodboard/`, git-ignored) is other artists' copyrighted work: inspiration only, never shipped or traced.
- Prefer building from own knowledge plus credited sources; the user dislikes repeated web-fetch permission prompts.

## Brand Commitments

- Name: FE Café. Cozy café metaphor; the student liked the purple/lavender family (disliked the original green/cream), and now wants much more color overall.
- Characters already in use: Mochi (cat), Pip (acorn), Tofu (owl) on topic pages; Bea (barista) and Juni (tutor) in the arcade.
- Voice: warm, encouraging, ADHD-friendly, emojis welcome, short chunks, tables and step-by-step traces with emoji markers, "Guha-style tip" asides. Example of the explanation voice the user wants is the linked-list rotation walkthrough (2026-10-30 conversation): diagnose the slip, name the big secret, table of line → effect → picture, round-by-round trace, answer, exam tip.

## Evidence on Hand

- Official past exams (Spring/Summer/Fall 2026 question + solution PDFs downloaded during development); full archive at cs.ucf.edu/registration/exm.
- The student's real scores and question log: `content/me.ts`, `data/fe-cafe-save.json`.
- CC0 art already in the repo: `public/art/` (Open Doodles, Open Peeps by Pablo Stanley).
- No testimonials, users, or performance claims exist; do not invent any.

## Product Principles

1. Practice that feels like play, but scores like the real exam.
2. Bring the source in: explain it here, credit it, never just link out.
3. Built around this student's actual mistakes, not a generic syllabus.
4. Small steps and instant feedback beat long pages.
5. Human-made, never generic.

## Accessibility & Inclusion

ADHD-friendly throughout: one thing at a time, visible progress, short text chunks, timers that help rather than pressure, no walls of text. Respect reduced motion. Readable type (body text designed for legibility).
