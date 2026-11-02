"use client";

import Link from "next/link";
import { ARCADE_EXAMS } from "@/content/arcade";
import { fmtPts } from "@/lib/arcade/score";
import { beanBalance } from "@/lib/arcade/shop";
import { examStats, notesStore, questionStats, saveStore } from "@/lib/arcade/store";
import { Art, Peep } from "./Art";
import { inline } from "./Rich";
import { Room } from "./Room";

export default function Lobby() {
  const save = saveStore.use();
  const notes = notesStore.use();
  const balance = beanBalance(save);
  const anyDone = Object.values(save.steps).some((r) => r.done);
  const last = save.last && ARCADE_EXAMS.find((e) => e.id === save.last!.exam);

  const greet = !anyDone
    ? "Hi, I'm **Bea**! Grab an apron. Tonight we work through real exams one tiny step at a time, and you'll *type* the code yourself. I'll be right here with hints."
    : `Welcome back! You've got **${balance} beans** to spend.${last ? ` Want to pick up at **${save.last!.q}**?` : ""}`;

  const noteList = Object.entries(notes)
    .filter(([, n]) => n.text.trim())
    .sort((a, b) => b[1].t - a[1].t);

  return (
    <div className="lb-wrap">
      <section className="lb-hero">
        <div>
          <h1>
            The night <span className="squiggle">shift</span>
          </h1>
          <p>
            Real past Foundation Exams, broken into bite-size steps. You read the struct, name every piece, then <b>type the answer yourself</b>. Every word is checked as you go. Points match the official rubric, and every step earns coffee beans for decorating your café.
          </p>
          <div className="lb-greet">
            <Peep who="bea" mood={anyDone ? "love" : "happy"} size={84} />
            <div className="bea-bubble">
              <span className="bea-name">Bea</span>
              {inline(greet)}
            </div>
          </div>
          {last && (
            <div style={{ marginTop: 18 }}>
              <Link className="a-btn" href={`/arcade/${last.id}?q=${save.last!.q}`}>
                Continue {last.term} · {save.last!.q} →
              </Link>
            </div>
          )}
        </div>
        <Art name="doodle-coffee" className="doodle" label="Someone enjoying a coffee" />
      </section>

      <section className="lb-section">
        <div className="lb-section-head">
          <h2>Tonight&apos;s exams</h2>
          <span className="a-faint" style={{ fontSize: "0.9rem" }}>
            Every point on the paper is in here. Nothing skipped.
          </span>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          {ARCADE_EXAMS.map((e) => {
            const st = examStats(e, save.steps);
            const totalSteps = e.sections.reduce((t, s) => t + s.questions.reduce((u, q) => u + q.steps.length, 0), 0);
            const doneSteps = e.sections.reduce((t, s) => t + s.questions.reduce((u, q) => u + questionStats(e, q, save.steps).done, 0), 0);
            const resume = e.sections.flatMap((s) => s.questions).find((q) => !questionStats(e, q, save.steps).finished);
            return (
              <article key={e.id} className="a-panel ex-card">
                <div>
                  <span className="a-eyebrow">{e.date}</span>
                  <h3>{e.practice ? e.term : `${e.term} Foundation Exam`}</h3>
                  <p className="a-muted" style={{ margin: 0 }}>
                    {e.blurb}
                  </p>
                  <div className="ex-bar" aria-label={`${doneSteps} of ${totalSteps} steps done`}>
                    <i style={{ width: `${(doneSteps / totalSteps) * 100}%` }} />
                  </div>
                  <div className="ex-secs">
                    {e.sections.map((s) => {
                      const pts = s.questions.reduce((t, q) => t + questionStats(e, q, save.steps).pts, 0);
                      const max = s.questions.reduce((t, q) => t + q.pts, 0);
                      return (
                        <span key={s.id} className="ex-sec">
                          {s.id} · {s.name}: <b>{fmtPts(pts)}</b>/{max}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
                  <div className="recap-score" style={{ justifyContent: "flex-end" }}>
                    <b style={{ fontSize: "2.6rem" }}>{fmtPts(st.pts)}</b>
                    <span>/ {st.max}</span>
                  </div>
                  <Link className="a-btn" href={`/arcade/${e.id}${resume ? `?q=${resume.id}` : ""}`}>
                    {doneSteps ? (resume ? `Continue at ${resume.id}` : "Review") : "Start shift"} →
                  </Link>
                  {e.questionsPdf && (
                    <a className="a-btn ghost small" href={e.questionsPdf} target="_blank" rel="noreferrer">
                      Original PDF ↗
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="lb-section">
        <div className="lb-section-head">
          <h2>Your café</h2>
          <span className="a-faint" style={{ fontSize: "0.9rem" }}>
            Beans: a few per step, more for real exam points, and a bonus for each finished question.
          </span>
        </div>
        <Room />
      </section>

      <section className="lb-section">
        <div className="lb-section-head">
          <h2>Notebook</h2>
          <span className="a-faint" style={{ fontSize: "0.9rem" }}>
            Saved to <code>data/fe-cafe-save.json</code>, so they&apos;re still here every time you run the site.
          </span>
        </div>
        {noteList.length ? (
          <div className="nb-grid">
            {noteList.map(([id, n]) => {
              const [exam, q] = id.split("/");
              const href = q ? `/arcade/${exam}?q=${q}` : undefined;
              const title = q ? `${ARCADE_EXAMS.find((e) => e.id === exam)?.term ?? exam} · ${q}` : "General notes";
              const body = (
                <>
                  <h4>{title}</h4>
                  <p>{n.text}</p>
                </>
              );
              return href ? (
                <Link key={id} href={href} className="nb-card">
                  {body}
                </Link>
              ) : (
                <div key={id} className="nb-card">
                  {body}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="a-callout">No notes yet. Inside any question, open the ✎ Notes tab and jot down what tripped you up. It saves as you type.</p>
        )}
      </section>
    </div>
  );
}
