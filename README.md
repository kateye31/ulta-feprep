# ☕ FE Café

A cozy, cute, ADHD-friendly study café for UCF's CS **Foundation Exam** (COP 3502 topics).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production: `npm run build && npm start`

## What's inside

- **18 topics** across all 4 exam parts (I-A, I-B, II-A, II-B), each with: TL;DR → real-life picture → 3–4 levels (Sprout → Bloom) → interactive playground → C code → memory tricks → missing puzzle pieces → exam traps → step-by-step worked problem → quiz → hand-picked outside resources + the matching COP3502 lecture PDFs.
- **19 playgrounds**: pointer/heap memory, linked-list train, pancake stack, postfix lab, café-line queue, BST & AVL gardens, heap dango stand, coat-check hash table, trie builder, Big-O race, timing solver, Gauss staircase, recurrence tree, Towers of Hanoi, sorting bake-off, bit switchboard, N-Queens, base converter.
- **Cozy dock** (bottom-right): 🍅 pomodoro brew timer, 🌧 rain sounds (generated, no audio files), 🎯 focus mode.
- 🐾 Loyalty-card stamps (saved in your browser), 🃏 flashcards, 🧾 printable cheat sheet, 📚 past-exam shelf.
- Day ☀️ / night 🌙 café themes.

## Your personal tools

- **💻 Code Studio** (`/studio`): folders + files saved in your browser, a C editor with *no autocomplete and no AI*, and a little terminal (`help`, `ls`, `cd`, `touch`, `run`…). Code runs on real gcc 14 via Compiler Explorer (godbolt.org), so it **needs internet**. Memory check catches leaks, use-after-free, double free, NULL crashes and out-of-bounds, with line numbers. Starter drills live in `public/starters/`.
- **🧭 My Plan** (`/plan`): built from your last exam + your professor's notes (`content/me.ts`, which you can remove before sharing publicly).
- **📓 Journal** (`/journal`): your question log, with a "redo it in Studio" button.
- **⏱ Runtime Gym** (`/runtime`): 25 "what's the Big-O?" reps.

Everything personal is stored in this browser's localStorage. Use Studio → ⬇ Backup now and then.

## Where things live

- `content/topics/*.tsx`: all topic content (edit or add topics here, then register them in `content/index.ts`)
- `components/widgets/`: the interactive playgrounds
- `components/characters.tsx`: Mochi 🐱, Pip 🌰 and Tofu 🦉
- `app/globals.css`: design tokens (colors, fonts, dark mode)

Built with Next.js, React, GSAP, and Lenis. Not an official UCF site.
