import Link from "next/link";
import type { Resource, Topic } from "@/lib/types";
import { NOTES_BASE, SECTIONS } from "@/lib/sections";
import { Character, MASCOT_NAMES } from "./characters";
import Code from "./Code";
import Levels from "./Levels";
import Quiz from "./Quiz";
import StepReveal from "./StepReveal";
import Toc from "./Toc";
import ReadingProgress from "./ReadingProgress";
import { StampButton } from "./Stamp";
import { Widget } from "./widgets";

const KIND: Record<Resource["kind"], { label: string; icon: string }> = {
  video: { label: "Watch it", icon: "🎬" },
  visual: { label: "Play with it", icon: "🔬" },
  read: { label: "Read it another way", icon: "📖" },
  practice: { label: "Practice it", icon: "🏋️" },
};

function Sec({ id, icon, title, sub, bg, children }: { id: string; icon: string; title: string; sub?: string; bg?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="tsec" data-reveal>
      <div className="tsec-head">
        <span className="tsec-icon" style={bg ? { background: `var(--${bg}-soft)`, borderColor: `var(--${bg})` } : undefined} aria-hidden>
          {icon}
        </span>
        <div>
          <h2>{title}</h2>
          {sub && <p>{sub}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function TopicView({ topic: t, prev, next }: { topic: Topic; prev?: Topic; next?: Topic }) {
  const sec = SECTIONS[t.section];
  const toc = [
    { id: "tldr", label: "🍵 TL;DR" },
    { id: "picture", label: "🖼 Picture it" },
    { id: "levels", label: "🪜 Level up" },
    ...(t.widgets?.length ? [{ id: "play", label: "🎮 Play" }] : []),
    ...(t.code?.length ? [{ id: "code", label: "💻 Code" }] : []),
    { id: "memory", label: "🧠 Memory tricks" },
    { id: "missing", label: "🧩 Missing pieces" },
    { id: "traps", label: "🚨 Exam traps" },
    ...(t.example ? [{ id: "example", label: "📝 Worked problem" }] : []),
    { id: "quiz", label: "✅ Quick check" },
    { id: "deeper", label: "📚 Go deeper" },
  ];
  const groups = (Object.keys(KIND) as Resource["kind"][]).map((k) => ({ k, items: t.resources.filter((r) => r.kind === k) })).filter((g) => g.items.length);

  return (
    <>
      <ReadingProgress />
      <div className="wrap">
        <header className="topic-hero">
          <div className="topic-hero-grid">
            <div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <Link href="/menu" className="chip" style={{ textDecoration: "none" }}>← Menu</Link>
                <span className={`chip ${t.section}`}>
                  {sec.emoji} {sec.name} · {sec.part}
                </span>
                <span className="chip">⏱ ~{t.minutes} min</span>
              </div>
              <h1>
                <span className="topic-emoji bob" aria-hidden>{t.emoji}</span> {t.title}
              </h1>
              <div style={{ marginTop: 16 }}>
                <StampButton slug={t.slug} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, maxWidth: 380 }}>
              <div style={{ flexShrink: 0 }}>
                <Character name={t.mascot} size={110} className="bob" />
              </div>
              <div className="bubble" style={{ marginBottom: 24 }}>
                <span className="muted" style={{ fontSize: "0.8rem", display: "block" }}>{MASCOT_NAMES[t.mascot]} says:</span>
                {t.tagline}
              </div>
            </div>
          </div>
        </header>

        <div className="topic-layout">
          <Toc items={toc} />
          <div style={{ minWidth: 0 }}>
            <Sec id="tldr" icon="🍵" title="TL;DR" sub="The whole topic in a few sips." bg="matcha">
              <ol className="tldr">
                {t.tldr.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ol>
            </Sec>

            <Sec id="picture" icon="🖼" title="Picture it" sub="Before the code, a picture from real life." bg="sky">
              <div className="card picture">
                <div className="scene">
                  <div>
                    {t.picture.scene}
                    {t.picture.caption && <span className="scene-cap">{t.picture.caption}</span>}
                  </div>
                </div>
                <div>
                  <h3>{t.picture.title}</h3>
                  {t.picture.body}
                </div>
              </div>
            </Sec>

            <Sec id="levels" icon="🪜" title="Level up" sub="Start at Sprout. Only level up when it clicks." bg="matcha">
              <Levels levels={t.levels} />
            </Sec>

            {t.widgets?.length ? (
              <Sec id="play" icon="🎮" title="Play with it" sub="Poke it until it makes sense. You can't break anything." bg="butter">
                <div className="grid" style={{ gap: 24 }}>
                  {t.widgets.map((w) => (
                    <Widget key={w} id={w} />
                  ))}
                </div>
                {t.drills?.length ? (
                  <div className="callout fun" style={{ marginTop: 22 }}>
                    <span className="callout-icon">✍️</span>
                    <span className="callout-title">Now write it yourself: no notes, no AI</span>
                    <p style={{ margin: "0 0 10px" }}>Playing builds the picture. Typing it from memory builds the exam skill. Each drill tells you ✅ / ❌ and catches memory leaks.</p>
                    <div className="controls" style={{ margin: 0 }}>
                      {t.drills.map(([label, path]) => (
                        <Link key={path} href={`/studio?open=${path}`} className="btn small">
                          💻 {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Sec>
            ) : null}

            {t.code?.length ? (
              <Sec id="code" icon="💻" title="The code" sub="C, the way you'll write it on the exam." bg="lavender">
                {t.code.map((c, i) => (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <Code src={c.src} title={c.title} />
                    {c.note && <div className="muted" style={{ fontSize: "0.95rem" }}>{c.note}</div>}
                  </div>
                ))}
              </Sec>
            ) : null}

            <Sec id="memory" icon="🧠" title="Memory tricks" sub="Silly on purpose. Silly sticks." bg="lavender">
              <div className="grid grid-2">
                {t.mnemonics.map((m, i) => (
                  <div className="mnemonic" key={i}>
                    <span className="mnemonic-hook">{m.hook}</span>
                    {m.body}
                  </div>
                ))}
              </div>
            </Sec>

            <Sec id="missing" icon="🧩" title="Missing puzzle pieces" sub="Stuff the lecture assumes you already know (or skips entirely)." bg="sky">
              <div className="grid grid-2" style={{ gap: 26 }}>
                {t.missing.map((m, i) => (
                  <div className="puzzle" key={i}>
                    <span className="puzzle-num">🧩 piece {i + 1}</span>
                    <h3 style={{ marginTop: 6 }}>{m.title}</h3>
                    {m.body}
                  </div>
                ))}
              </div>
            </Sec>

            <Sec id="traps" icon="🚨" title="Exam traps" sub="Tofu the owl has seen every one of these cost people points." bg="blush">
              {t.traps.map((x, i) => (
                <div className="trap" key={i}>
                  <span aria-hidden>🦉</span>
                  <div>{x}</div>
                </div>
              ))}
            </Sec>

            {t.example && (
              <Sec id="example" icon="📝" title={t.example.title} sub="An FE-style problem, revealed one step at a time. Try each step yourself first!" bg="butter">
                <StepReveal prompt={t.example.prompt} steps={t.example.steps} />
              </Sec>
            )}

            <Sec id="quiz" icon="✅" title="Quick check" sub="No grades. Just vibes (and learning)." bg="matcha">
              <Quiz items={t.quiz} />
            </Sec>

            <Sec id="deeper" icon="📚" title="Go deeper" sub="Hand-picked extra help: another voice, another picture." bg="accent">
              <div className="grid grid-2">
                {groups.map((g) => (
                  <div key={g.k} className="res-group">
                    <h3>
                      {KIND[g.k].icon} {KIND[g.k].label}
                    </h3>
                    <ul className="res-list">
                      {g.items.map((r) => (
                        <li className="res-item" key={r.url}>
                          <a href={r.url} target="_blank" rel="noreferrer">
                            <span aria-hidden>↗</span>
                            <span>
                              <b>{r.label}</b>
                              {r.note && <span className="res-note">{r.note}</span>}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {t.notes.length > 0 && (
                  <div className="res-group">
                    <h3>📓 From your COP3502 class</h3>
                    <ul className="res-list">
                      {t.notes.map((n) => (
                        <li className="res-item" key={n.file}>
                          <a href={n.file.startsWith("http") ? n.file : NOTES_BASE + n.file} target="_blank" rel="noreferrer">
                            <span aria-hidden>📄</span>
                            <span>
                              <b>{n.label}</b>
                              <span className="res-note">Official lecture notes (PDF)</span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Sec>

            <div className="card" style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              {prev ? (
                <Link href={`/topics/${prev.slug}`} className="btn secondary small">← {prev.emoji} {prev.short}</Link>
              ) : <span />}
              <StampButton slug={t.slug} />
              {next ? (
                <Link href={`/topics/${next.slug}`} className="btn small">{next.emoji} {next.short} →</Link>
              ) : (
                <Link href="/exams" className="btn small">📚 Try a past exam →</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
