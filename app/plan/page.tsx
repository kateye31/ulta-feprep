import type { Metadata } from "next";
import Link from "next/link";
import { Mochi } from "@/components/characters";
import { Callout } from "@/components/ui";
import { ExamCountdown, ReadChecklist } from "@/components/PlanWidgets";
import { GUHA_OFFICE_HOURS, LAST_EXAM, PROFESSOR_NOTES, READ_CHECKLIST } from "@/content/me";

export const metadata: Metadata = { title: "🧭 My Plan", description: "A study plan built from my last Foundation Exam and my professor's notes." };

const scoreTone = (s: number) => (s >= 7 ? "var(--matcha)" : s >= 4 ? "var(--butter)" : "var(--blush)");

const PRIORITIES = [
  {
    emoji: "🍰",
    title: "Write code from scratch (Section II-B)",
    why: "Part D came out 1 · 0 · 1. Your professor said the same: tracing is fine, WRITING is the gap. This is the biggest pile of points.",
    do: [
      { label: "Studio: linked list drill (recursive length & delete)", href: "/studio?open=professor-drills/1-linked-list.c" },
      { label: "Studio: BST drill (every function is recursive)", href: "/studio?open=professor-drills/2-bst.c" },
      { label: "Topic: Recursion", href: "/topics/recursion" },
      { label: "Topic: Sorting (trace + write insertion sort)", href: "/topics/sorting" },
      { label: "Topic: Backtracking", href: "/topics/backtracking" },
    ],
  },
  {
    emoji: "⏱",
    title: "Runtime of code (Section II-A)",
    why: "Part C was 2 · 9 · 0, and you said you don't know the runtime of anything yet. The good news: runtime is a small set of patterns, and reps make them automatic.",
    do: [
      { label: "Runtime Gym: 10 reps a day", href: "/runtime" },
      { label: "Studio: runtime lab (code counts its own steps)", href: "/studio?open=professor-drills/5-runtime-lab.c" },
      { label: "Topic: Big-O & code analysis", href: "/topics/big-o" },
      { label: "Topic: Summations", href: "/topics/summations" },
      { label: "Topic: Recurrences", href: "/topics/recurrences" },
    ],
  },
  {
    emoji: "🌳",
    title: "Binary trees & heaps (Section I-B)",
    why: "Part B was 1 · 3 · 8, and your professor flagged heaps and binary trees by name.",
    do: [
      { label: "Studio: write your own BST", href: "/studio?open=professor-drills/2-bst.c" },
      { label: "Studio: write your own min-heap", href: "/studio?open=professor-drills/4-heap.c" },
      { label: "Topic: Binary Trees (play in the BST Garden)", href: "/topics/binary-trees" },
      { label: "Topic: Heaps (Dango Stand)", href: "/topics/heaps" },
      { label: "Topic: AVL Trees", href: "/topics/avl-trees" },
    ],
  },
  {
    emoji: "💡",
    title: "Bitwise operators",
    why: "On your professor's list. It's a small topic with very learnable points: 4 recipes and binary conversion.",
    do: [
      { label: "Studio: bitwise drill (predict on paper first!)", href: "/studio?open=professor-drills/3-bitwise.c" },
      { label: "Topic: Bitwise (light-switch board)", href: "/topics/bitwise" },
    ],
  },
  {
    emoji: "📦",
    title: "Dynamic memory & linked lists: precision (Section I-A)",
    why: "Part A was 2 · 2 · 9. You KNOW this material. Your journal shows the points leaked from misreading (return type, sizeof, return NULL, free order).",
    do: [
      { label: "Journal: redo each question in the Studio", href: "/journal" },
      { label: "Studio: Summer '26 Q1 redo (sentinel)", href: "/studio?open=exam-redo/sum26-q1-odd-stars.c" },
      { label: "Studio: Summer '23 freeList fix", href: "/studio?open=exam-redo/sum23-freelist-fix.c" },
      { label: "Topic: Dynamic Memory", href: "/topics/dynamic-memory" },
    ],
  },
];

export default function PlanPage() {
  return (
    <div className="wrap" style={{ padding: "40px 0 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 26 }}>
        <Mochi size={100} className="bob" />
        <div style={{ flex: 1, minWidth: 260 }}>
          <span className="eyebrow">made just for you</span>
          <h1 style={{ margin: 0 }}>🧭 My Plan</h1>
          <p className="muted" style={{ margin: 0 }}>
            Built from your {LAST_EXAM.name} and your professor&apos;s notes. One exam doesn&apos;t define you. It&apos;s a map of exactly where the points are hiding. 🧭💜
          </p>
        </div>
      </div>

      <section className="grid grid-2" style={{ marginBottom: 40 }}>
        <div className="card">
          <h2 style={{ marginBottom: 4 }}>📊 Last exam</h2>
          <p className="muted" style={{ marginTop: 0 }}>{LAST_EXAM.date} · Section I: <b>{LAST_EXAM.section1}</b> · Section II: <b>{LAST_EXAM.section2}</b> · Total: <b>{LAST_EXAM.total}</b></p>
          <div style={{ display: "grid", gap: 10 }}>
            {LAST_EXAM.parts.map((p) => (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "54px 1fr", gap: 10, alignItems: "center" }}>
                <span className={`chip ${p.id}`} style={{ justifyContent: "center" }}>{p.label}</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {p.scores.map((s, i) => (
                    <span key={i} title={`usually: ${p.usually[i]}`} style={{ minWidth: 70, textAlign: "center", padding: "4px 8px", borderRadius: 10, border: "2px solid", borderColor: scoreTone(s), background: "var(--card)", fontSize: "0.85rem" }}>
                      <b style={{ fontSize: "1.1rem" }}>{s}</b>
                      <span className="muted" style={{ display: "block", fontSize: "0.7rem", lineHeight: 1.2 }}>{p.usually[i]}</span>
                    </span>
                  ))}
                  {p.note && <span className="muted" style={{ fontSize: "0.8rem" }}>({p.note})</span>}
                </div>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: "0.8rem", marginBottom: 0 }}>Scores are from your own notes. The small labels are what each slot <i>usually</i> covers, not the official list for that exam.</p>
        </div>

        <div className="card" style={{ background: "var(--lavender-soft)", borderColor: "var(--lavender)" }}>
          <h2 style={{ marginBottom: 8 }}>🎓 Your professor said</h2>
          <p style={{ margin: "0 0 6px" }}>
            <b>Needs work:</b> {PROFESSOR_NOTES.weak.join(", ")}
          </p>
          <p style={{ margin: "0 0 10px" }}>
            <b>Already good:</b> {PROFESSOR_NOTES.strong.join(", ")} ✨
          </p>
          <b>Homework:</b>
          <ul style={{ margin: "6px 0 10px" }}>
            {PROFESSOR_NOTES.todo.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <Callout kind="tip" title="Your superpower: tracing" icon="🔍">
            You can already read code and follow it. The Studio drills turn that around: write, run, read the ✅/❌, fix. Your tracing skill is exactly what makes debugging your own code work.
          </Callout>
          <p style={{ margin: 0, fontSize: "0.92rem" }}>
            📬 Go over the actual Fall exam at <a href={GUHA_OFFICE_HOURS} target="_blank" rel="noreferrer">Arup Guha&apos;s office hours</a> (available from Sept 28). Seeing where the points went is gold.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>🎯 Where the points are, in order</h2>
        <div className="grid" style={{ gap: 16 }}>
          {PRIORITIES.map((p, i) => (
            <div key={i} className="card" data-reveal style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16 }}>
              <div style={{ fontSize: "2.2rem", lineHeight: 1 }}>
                {p.emoji}
                <div className="chip" style={{ marginTop: 8, justifyContent: "center" }}>#{i + 1}</div>
              </div>
              <div>
                <h3 style={{ margin: "0 0 4px" }}>{p.title}</h3>
                <p className="muted" style={{ margin: "0 0 10px" }}>{p.why}</p>
                <div className="controls" style={{ margin: 0 }}>
                  {p.do.map((d) => (
                    <Link key={d.href + d.label} href={d.href} className="btn small secondary">
                      {d.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div className="card" style={{ background: "var(--matcha-soft)", borderColor: "var(--matcha)" }}>
            <b>🥞 Keep warm: stacks & queues.</b> You got a 9 there. Just do the flashcards now and then so it stays that way.
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>☕ The daily 3-brew routine</h2>
        <p className="muted">Three 🍅 brew timers (bottom-right corner) with sip breaks in between. That&apos;s it. Consistency beats marathons, especially for ADHD brains.</p>
        <div className="grid grid-3">
          <div className="card">
            <div style={{ fontSize: "2rem" }}>⏱</div>
            <h3>Brew 1 · Runtime reps</h3>
            <p className="muted" style={{ margin: 0 }}>10 questions in the <Link href="/runtime">Runtime Gym</Link>. Read every explanation, even the ones you get right.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: "2rem" }}>💻</div>
            <h3>Brew 2 · Write it yourself</h3>
            <p className="muted" style={{ margin: 0 }}>One function from a <Link href="/studio">Studio drill</Link>, with no notes and no AI. Stuck for 10 min? Draw it on paper, then try again.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: "2rem" }}>📄</div>
            <h3>Brew 3 · One real question</h3>
            <p className="muted" style={{ margin: 0 }}>One question from a <Link href="/exams">past exam</Link>. Grade it with the solution, then log it in the <Link href="/journal">Journal</Link>.</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>📅 The runway</h2>
        <ExamCountdown />
      </section>

      <section>
        <h2>👀 Before-you-answer checklist</h2>
        <p className="muted">Pulled straight from the lessons in your own journal. Most of your lost I-A points were in here, not in the material itself.</p>
        <ReadChecklist items={READ_CHECKLIST} />
      </section>
    </div>
  );
}
