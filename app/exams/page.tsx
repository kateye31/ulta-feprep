import type { Metadata } from "next";
import Link from "next/link";
import { Tofu } from "@/components/characters";
import { Callout } from "@/components/ui";
import { EXAMS_URL, FEPREP_URL, MATERIAL_URL } from "@/lib/sections";

export const metadata: Metadata = { title: "📚 Past Exams", description: "Official past Foundation Exams, plus a cozy strategy for using them." };

const RECENT = [
  { date: "August 29, 2026", dir: "fall2026", code: "Aug26" },
  { date: "May 16, 2026", dir: "sum2026", code: "May26" },
  { date: "January 17, 2026", dir: "spr2026", code: "Jan26" },
  { date: "August 23, 2025", dir: "fall2025", code: "Aug25" },
  { date: "May 17, 2025", dir: "sum2025", code: "May25" },
  { date: "January 11, 2025", dir: "spr2025", code: "Jan25" },
];

const SHELF = ["#ec9f9f", "#f2c95f", "#9cc58e", "#86c3d7", "#b39ddb", "#d98c6a"];

export default function ExamsPage() {
  return (
    <div className="wrap" style={{ padding: "40px 0 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <Tofu size={96} className="bob" />
        <div style={{ flex: 1, minWidth: 260 }}>
          <span className="eyebrow">Tofu&apos;s library shelf</span>
          <h1 style={{ margin: 0 }}>📚 Past Exams</h1>
          <p className="muted" style={{ margin: 0 }}>The single best way to prepare is real past exams. Here&apos;s the most recent shelf, plus how to use them without burning out.</p>
        </div>
      </div>

      <div className="grid grid-3" data-stagger>
        {RECENT.map((e, i) => (
          <div key={e.code} className="card" style={{ borderTop: `10px solid ${SHELF[i]}` }}>
            <h3 style={{ marginBottom: 4 }}>📘 {e.date}</h3>
            <div className="controls" style={{ marginBottom: 0 }}>
              <a className="btn small" href={`${EXAMS_URL}${e.dir}/FE-${e.code}.pdf`} target="_blank" rel="noreferrer">📝 Questions</a>
              <a className="btn small secondary" href={`${EXAMS_URL}${e.dir}/FE-${e.code}-Sol.pdf`} target="_blank" rel="noreferrer">✅ Solutions</a>
              <a className="btn small secondary" href={`${EXAMS_URL}${e.dir}/Info-${e.code}.pdf`} target="_blank" rel="noreferrer">ℹ️ Info</a>
            </div>
          </div>
        ))}
      </div>
      <p className="center" style={{ marginTop: 18 }}>
        <a href={EXAMS_URL} target="_blank" rel="noreferrer" className="btn secondary">🗄 Full archive (1998 → now) ↗</a>
      </p>

      <div className="grid grid-2" style={{ marginTop: 50 }}>
        <div className="card" data-reveal>
          <h2>🍃 How to use a past exam (the cozy way)</h2>
          <ol>
            <li><b>Print it</b> or open it on paper-like mode. Handwriting helps you remember, and it&apos;s how the real exam works.</li>
            <li><b>Do ONE part</b> (like Section I-A) per brew timer. Not the whole exam at once.</li>
            <li><b>Try every question before peeking.</b> Stuck for 10 minutes? Write what you <i>do</i> know, then look.</li>
            <li><b>Grade yourself with the solutions</b> and write the topic of every miss on a sticky note.</li>
            <li><b>Sticky notes → this café.</b> Open that topic here, do the worked problem and quiz, then retry the question tomorrow.</li>
          </ol>
        </div>
        <div className="card" data-reveal>
          <h2>🎒 Exam-day checklist</h2>
          <ul>
            <li>😴 Sleep beats a last-minute cram. Review the <Link href="/cheatsheet">cheat sheet</Link> the night before, then stop.</li>
            <li>🥐 Eat something! Brains run on glucose.</li>
            <li>👀 Skim the whole part first and start with the question you feel best about.</li>
            <li>✍️ Partial credit is real. Write the base case, the loop, the formula, even if you can&apos;t finish.</li>
            <li>🧊 Blank out? Draw a picture: the linked list, the tree, the stack. Pictures unlock memory.</li>
            <li>🧘 Box breathing: in 4, hold 4, out 4, hold 4. Then continue.</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 40 }} data-reveal>
        <h2>🔗 More places to practice</h2>
        <div className="grid grid-3">
          <a className="topic-card" href={FEPREP_URL} target="_blank" rel="noreferrer">
            <span className="emoji">🧪</span>
            <h3>feprep.net ↗</h3>
            <p>Practice problems by category with progress tracking. Pair it with this café: learn here, drill there.</p>
          </a>
          <a className="topic-card" href={MATERIAL_URL} target="_blank" rel="noreferrer">
            <span className="emoji">📓</span>
            <h3>COP3502 course material ↗</h3>
            <p>Every lecture PDF and sample program. Each topic page here links to the matching notes.</p>
          </a>
          <a className="topic-card" href="http://www.cs.ucf.edu/~dmarino/ucf/transparency/cop3502/exam" target="_blank" rel="noreferrer">
            <span className="emoji">🗂</span>
            <h3>COP3502 past course exams ↗</h3>
            <p>Old midterms and finals from the course. More practice in the same style.</p>
          </a>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <Callout kind="info" title="About the format">
          The exam site notes that recent exams follow a consistent format, but the department can change it. Always read the <b>Info</b> sheet from the most recent exam for the current rules, timing and point values.
        </Callout>
      </div>
    </div>
  );
}
