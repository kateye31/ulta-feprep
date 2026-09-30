import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import { Mochi, Pip, Tofu } from "@/components/characters";
import { LoyaltyCard } from "@/components/Stamp";
import { topicSummaries, topicsBySection } from "@/content";
import { EXAMS_URL, SECTIONS } from "@/lib/sections";

const STEPS = [
  { e: "🍵", t: "Sip the TL;DR", d: "The whole topic in 5 lines. If that's all you have energy for today, that's okay." },
  { e: "🖼", t: "Picture it", d: "A real-life comparison (trains, pancakes, coat checks) before any code." },
  { e: "🪜", t: "Level up", d: "Sprout → Sapling → Tree. Only climb when the last level clicks." },
  { e: "🎮", t: "Play with it", d: "Poke a live playground until it makes sense in your hands." },
  { e: "🧩", t: "Fill the gaps", d: "Missing puzzle pieces, memory tricks, and exam traps." },
  { e: "🐾", t: "Stamp it", d: "Quick quiz, then stamp your loyalty card. Collect all 18!" },
];

export default function Home() {
  const groups = topicsBySection();
  return (
    <>
      <HomeHero />

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">your corner of the café</span>
            <h2>Pick up where you left off 💜</h2>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))" }} data-stagger>
            {[
              { href: "/plan", e: "🧭", t: "My Plan", d: "Built from your Fall '26 scores + your professor's notes." },
              { href: "/studio", e: "💻", t: "Code Studio", d: "Write & run real C. No AI. Drills with ✅/❌ tests and leak detection." },
              { href: "/runtime", e: "⏱", t: "Runtime Gym", d: "25 snippets → name the Big-O. Reps until you just SEE it." },
              { href: "/journal", e: "📓", t: "Journal", d: "Your question log, with a redo button for every question." },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="topic-card">
                <span className="emoji" aria-hidden>{c.e}</span>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">how this café works</span>
            <h2>Every topic is served the same cozy way</h2>
            <p className="muted">Predictable structure = less brain energy spent figuring out where things are.</p>
          </div>
          <div className="grid grid-3 how" data-stagger>
            {STEPS.map((s, i) => (
              <div key={i} className="card">
                <span className="big" aria-hidden>{s.e}</span>
                <h3>{i + 1}. {s.t}</h3>
                <p className="muted" style={{ margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">the whole exam on one table</span>
            <h2>🧭 What&apos;s on the Foundation Exam?</h2>
            <p className="muted">
              Two sections, each split into Part A and Part B, and every part counts. The exact point values and passing rules are on the Info sheet posted with each{" "}
              <a href={EXAMS_URL} target="_blank" rel="noreferrer">past exam</a>.
            </p>
          </div>
          <div className="grid grid-2" data-stagger>
            {groups.map((g) => {
              const s = SECTIONS[g.id];
              return (
                <div key={g.id} className={`exam-part ${g.id}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <h3 style={{ margin: 0 }}>{s.emoji} {s.name}</h3>
                    <span className="hand">{s.menuName}</span>
                  </div>
                  <strong>{s.part}</strong>
                  <p className="muted" style={{ margin: "4px 0 0", fontSize: "0.95rem" }}>{s.blurb}</p>
                  <ul>
                    {g.topics.map((t) => (
                      <li key={t.slug}>
                        <Link href={`/topics/${t.slug}`}>{t.emoji} {t.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">meet the staff</span>
            <h2>Your study buddies</h2>
          </div>
          <div className="grid grid-3" data-stagger>
            <div className="card center">
              <Mochi size={120} className="bob" />
              <h3>Mochi 🐱</h3>
              <p className="muted" style={{ margin: 0 }}>Runs the café. Explains everything with food, because everything is better with food.</p>
            </div>
            <div className="card center">
              <Pip size={120} className="bob" />
              <h3>Pip 🌰</h3>
              <p className="muted" style={{ margin: 0 }}>A tiny acorn sprite. Loves baby steps and says &ldquo;it&apos;s okay to start small!&rdquo; a lot.</p>
            </div>
            <div className="card center">
              <Tofu size={120} className="bob" />
              <h3>Tofu 🦉</h3>
              <p className="muted" style={{ margin: 0 }}>The librarian owl. Has read every past exam and knows all the traps. Hoo.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap-narrow" data-reveal>
          <LoyaltyCard topics={topicSummaries()} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap-narrow" data-reveal>
          <div className="card card-tape" style={{ background: "var(--matcha-soft)", borderColor: "var(--matcha)" }}>
            <h2>🍃 A gentle study plan</h2>
            <ol>
              <li><b>One topic per brew.</b> Start the 🍅 timer (bottom-right), pick one topic, and read only the TL;DR + picture.</li>
              <li><b>Play before you code.</b> Poke the playground until you could predict what it does next.</li>
              <li><b>Sip break.</b> 5 minutes away from the screen. Seriously, your brain files things away during breaks.</li>
              <li><b>Come back for the levels + worked problem.</b> Try each step yourself before revealing it.</li>
              <li><b>Stamp it</b>, then do the matching question from a <Link href="/exams">real past exam</Link>.</li>
              <li><b>Review with <Link href="/flashcards">flashcards</Link></b> the next day. Spaced repetition beats cramming.</li>
            </ol>
            <p className="hand" style={{ margin: 0, color: "var(--cocoa)" }}>You don&apos;t have to do it all today. Just the next small step. 🌱</p>
          </div>
        </div>
      </section>
    </>
  );
}
