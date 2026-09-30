import type { Metadata } from "next";
import Link from "next/link";
import RuntimeGym from "@/components/RuntimeGym";
import { Tofu } from "@/components/characters";
import { GYM } from "@/content/runtime-gym";

export const metadata: Metadata = { title: "⏱ Runtime Gym", description: "Look at code, name its Big-O. Short reps until you can see runtime at a glance." };

export default function RuntimePage() {
  return (
    <div className="wrap" style={{ padding: "40px 0 80px" }}>
      <div className="center" style={{ marginBottom: 20 }}>
        <Tofu size={90} className="bob" />
        <span className="eyebrow">reps, not lectures</span>
        <h1 style={{ margin: 0 }}>⏱ Runtime Gym</h1>
        <p className="muted" style={{ maxWidth: 620, margin: "8px auto 0" }}>
          Look at the code, pick the Big-O. The secret is always the same question: <b>how many times does the innermost line run?</b> Press 1–4 to answer, Enter for next.
        </p>
      </div>

      <details className="card" style={{ maxWidth: 760, margin: "0 auto 20px" }}>
        <summary style={{ cursor: "pointer", fontWeight: 700 }}>🧠 The 6 rules (peek if you&apos;re new!)</summary>
        <ol style={{ marginTop: 10 }}>
          <li><b>Loop to n</b> → n. <b>Nested</b> loops → multiply. <b>One after another</b> → add, keep the biggest.</li>
          <li><b>i *= 2</b> or <b>i /= 2</b> (doubling/halving) → log n.</li>
          <li>Inner loop depends on the outer one (<code>j &lt; i</code>)? Add up the counts: 0+1+2+…+n = n²/2 → n².</li>
          <li>A variable that <b>never resets</b> only moves n times in TOTAL.</li>
          <li><b>Constants</b> (like 100, or a break at 5) don&apos;t grow, so they drop out.</li>
          <li>Recursion: write <code>T(n) = (calls) × T(smaller) + (work)</code>. See <Link href="/topics/recurrences">Recurrences</Link>.</li>
        </ol>
      </details>

      <RuntimeGym questions={GYM} />

      <p className="center muted" style={{ marginTop: 30 }}>
        Want to SEE it? Open <Link href="/studio?open=professor-drills/5-runtime-lab.c">the runtime lab in Code Studio</Link>, where real code counts its own steps.
      </p>
    </div>
  );
}
