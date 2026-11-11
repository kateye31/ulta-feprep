"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ARCADE_EXAMS } from "@/content/arcade";
import { Rich } from "@/components/arcade/Rich";
import { TreeView } from "@/components/arcade/TreeView";
import { saveStore } from "@/lib/arcade/store";
import type { Item } from "@/lib/arcade/types";
import { allPicks, forPaper, paperKey, paperStore, pickId, shuffle, type Pick } from "@/lib/paper";
import { recipeFor } from "@/lib/recipes";
import { ymd } from "@/lib/studylog";
import { chapter, chLabel, RECIPE_BOOK } from "@/lib/standish";

type Source = "all" | "fe100" | "exams" | "daily";
type Sec = "any" | "A" | "B" | "C" | "D";

const SOURCES: [Source, string][] = [
  ["all", "Everything"],
  ["exams", "Real exams"],
  ["fe100", "FE 100"],
  ["daily", "Daily Problems"],
];
const SECS: [Sec, string][] = [
  ["any", "Any section"],
  ["A", "A · Basic data structures"],
  ["B", "B · Advanced data structures"],
  ["C", "C · Algorithm analysis"],
  ["D", "D · Algorithms"],
];
const PICKED = "fe-cafe-paper-picked";

const inSource = (p: Pick, s: Source) =>
  s === "all" || (s === "fe100" ? p.exam.id === "fe100" : s === "daily" ? p.exam.id === "daily" : p.exam.id !== "fe100" && p.exam.id !== "daily");
const secOf = (p: Pick) => recipeFor(p.q)?.section ?? p.section;

function ItemView({ it }: { it: Item }) {
  return (
    <figure className="pp-item">
      <figcaption>{it.title}</figcaption>
      {it.kind === "code" && <pre>{it.body}</pre>}
      {(it.kind === "text" || it.kind === "file") && <pre className="pp-file">{it.body}</pre>}
      {it.kind === "tree" && it.tree && <TreeView tree={it.tree} locked />}
      {it.kind === "table" && it.table && (
        <table>
          <tbody>
            {[it.table.head, ...it.table.rows].map((r, i) => (
              <tr key={i}>{r.map((c, j) => (i === 0 || j === 0 ? <th key={j}>{c}</th> : <td key={j}>{c}</td>))}</tr>
            ))}
          </tbody>
        </table>
      )}
    </figure>
  );
}

export default function PaperPractice() {
  const save = saveStore.use();
  const paper = paperStore.use();
  const picks = useMemo(() => allPicks(ARCADE_EXAMS), []);
  const byId = useMemo(() => new Map(picks.map((p) => [pickId(p), p])), [picks]);

  const [mode, setMode] = useState<"cold" | "pick">("cold");
  const [source, setSource] = useState<Source>("all");
  const [sec, setSec] = useState<Sec>("any");
  const [count, setCount] = useState(2);
  const [chosen, setChosen] = useState<string[]>([]);
  const [withKey, setWithKey] = useState(true);
  const [note, setNote] = useState("");
  const [scores, setScores] = useState<Record<string, { score: string; cold: boolean }>>({});
  const [logged, setLogged] = useState(false);

  // the last set you dealt stays put after a refresh (this browser only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PICKED);
      if (raw) setChosen((JSON.parse(raw) as string[]).filter((id) => byId.has(id)));
    } catch {
      /* private window: start empty */
    }
  }, [byId]);
  const choose = (ids: string[]) => {
    setChosen(ids);
    setScores({});
    setLogged(false);
    try {
      localStorage.setItem(PICKED, JSON.stringify(ids));
    } catch {
      /* fine */
    }
  };

  const today = ymd();
  /** played in Night Shift, or done on paper before today. FE 100 reuses some real exam questions word for word, so a twin counts as seen too. */
  const seen = useMemo(() => {
    const ids = new Set<string>();
    for (const k of Object.keys(save.steps)) ids.add(k.split("/").slice(0, 2).join("/"));
    for (const r of Object.values(paper)) if (r.day !== today) ids.add(`${r.exam}/${r.q}`);
    const stories = new Set([...ids].map((id) => byId.get(id)?.q.story));
    return new Set(picks.filter((p) => stories.has(p.q.story)).map(pickId));
  }, [save.steps, paper, today, picks, byId]);
  const onPaper = useMemo(() => new Set(Object.values(paper).map((r) => `${r.exam}/${r.q}`)), [paper]);

  const pool = picks.filter((p) => inSource(p, source) && (sec === "any" || secOf(p) === sec));
  const coldPool = pool.filter((p) => !seen.has(pickId(p)));
  const coldLeft = new Set(coldPool.map((p) => p.q.story)).size;

  const deal = () => {
    const stories = new Set<string>();
    const got = shuffle(coldPool, Date.now() % 2147483647)
      .filter((p) => !stories.has(p.q.story) && !!stories.add(p.q.story))
      .slice(0, count);
    choose(got.map(pickId));
    setNote(
      got.length < count
        ? got.length
          ? `Only ${got.length} question${got.length > 1 ? "s" : ""} you haven't seen in that mix. Widen the section or source for more.`
          : "You've seen every question in that mix. Pick another section or source."
        : "",
    );
  };
  const toggle = (id: string) => choose(chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id]);

  const sheet = chosen.map((id) => byId.get(id)).filter((p): p is Pick => !!p);
  const totalPts = sheet.reduce((n, p) => n + p.q.pts, 0);

  const logScores = () => {
    const next = { ...paper };
    for (const p of sheet) {
      const id = pickId(p);
      const s = scores[id];
      if (!s || s.score.trim() === "") continue;
      const score = Math.max(0, Math.min(p.q.pts, Number(s.score)));
      if (Number.isNaN(score)) continue;
      next[paperKey(p.exam.id, p.q.id, today)] = { exam: p.exam.id, q: p.q.id, recipe: recipeFor(p.q)?.id, pts: p.q.pts, score, cold: s.cold, day: today, t: Date.now() };
    }
    paperStore.write(next);
    setLogged(true);
  };

  return (
    <div className="pp">
      <div className="pp-controls">
        <div className="pp-panel">
          <div className="pp-tabs" role="tablist">
            <button role="tab" aria-selected={mode === "cold"} className={mode === "cold" ? "on" : ""} onClick={() => setMode("cold")}>
              🎲 Cold set
            </button>
            <button role="tab" aria-selected={mode === "pick"} className={mode === "pick" ? "on" : ""} onClick={() => setMode("pick")}>
              ✋ Pick my own
            </button>
          </div>

          <div className="pp-row">
            <label>
              From{" "}
              <select value={source} onChange={(e) => setSource(e.target.value as Source)}>
                {SOURCES.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </label>
            <label>
              Section{" "}
              <select value={sec} onChange={(e) => setSec(e.target.value as Sec)}>
                {SECS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </label>
            {mode === "cold" && (
              <label>
                How many{" "}
                <select value={count} onChange={(e) => setCount(+e.target.value)}>
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {mode === "cold" ? (
            <>
              <p className="muted pp-help">
                Deals questions you&apos;ve <b>never played</b> in Night Shift or done on paper. {coldLeft} left in this mix. A cold score is the honest
                &ldquo;am I getting better?&rdquo; number.
              </p>
              <button className="btn small" onClick={deal}>
                🎲 Deal {count} cold question{count > 1 ? "s" : ""}
              </button>
              {note && <p className="pp-note">{note}</p>}
            </>
          ) : (
            <div className="pp-list">
              {ARCADE_EXAMS.map((e) => {
                const rows = pool.filter((p) => p.exam.id === e.id);
                if (!rows.length) return null;
                return (
                  <details key={e.id} open={e.id === "fe100"}>
                    <summary>
                      {e.term} <span className="muted">({rows.length})</span>
                    </summary>
                    {rows.map((p) => {
                      const id = pickId(p);
                      return (
                        <label key={id} className="pp-check">
                          <input type="checkbox" checked={chosen.includes(id)} onChange={() => toggle(id)} />
                          <span>
                            {p.q.id}. {p.q.title} <span className="muted">· {p.q.pts} pts</span>
                            {seen.has(id) && <span className="pp-tag">played</span>}
                            {onPaper.has(id) && <span className="pp-tag">on paper</span>}
                          </span>
                        </label>
                      );
                    })}
                  </details>
                );
              })}
            </div>
          )}

          <label className="pp-check" style={{ marginTop: 10 }}>
            <input type="checkbox" checked={withKey} onChange={(e) => setWithKey(e.target.checked)} />
            <span>Print the answer key and rubric at the end (on its own page, so you can tear it off)</span>
          </label>
          <div className="pp-actions">
            <button className="btn" disabled={!sheet.length} onClick={() => window.print()}>
              🖨 Print {sheet.length || ""} question{sheet.length === 1 ? "" : "s"}
            </button>
            {sheet.length > 0 && (
              <button className="btn secondary small" onClick={() => choose([])}>
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="pp-panel">
          <h2>📋 How to use it</h2>
          <ol className="pp-howto">
            <li>Print. Put the answer key face down.</li>
            <li>
              Set a timer: <b>{totalPts || "—"} min</b> (about 1 minute per point). No notes, no site, no compiler.
            </li>
            <li>Write everything, even a half answer. A blank gets 0, and a half answer often gets partial credit.</li>
            <li>Grade it with the rubric in red pen. Circle the line where you got stuck.</li>
            <li>Log the score below. Then read that topic&apos;s recipe and do the question in Night Shift.</li>
          </ol>
        </div>

        {sheet.length > 0 && (
          <div className="pp-panel">
            <h2>✍️ Graded it? Log your scores</h2>
            <p className="muted pp-help">Tick &ldquo;first time&rdquo; only if you&apos;d never seen the question. Those go on the cold-check chart in Analytics.</p>
            {sheet.map((p, i) => {
              const id = pickId(p);
              const s = scores[id] ?? { score: "", cold: !seen.has(id) };
              const set = (patch: Partial<typeof s>) => {
                setLogged(false);
                setScores({ ...scores, [id]: { ...s, ...patch } });
              };
              return (
                <div key={id} className="pp-score">
                  <span className="pp-score-name">
                    {i + 1}. {p.q.title}
                  </span>
                  <span>
                    <input type="number" min={0} max={p.q.pts} step={0.5} value={s.score} onChange={(e) => set({ score: e.target.value })} aria-label={`Score for ${p.q.title}`} /> / {p.q.pts}
                  </span>
                  <label className="pp-check">
                    <input type="checkbox" checked={s.cold} onChange={(e) => set({ cold: e.target.checked })} />
                    <span>first time</span>
                  </label>
                </div>
              );
            })}
            <div className="pp-actions">
              <button className="btn small matcha" onClick={logScores} disabled={!sheet.some((p) => (scores[pickId(p)]?.score ?? "").trim() !== "")}>
                Save scores
              </button>
              {logged && (
                <span className="pp-saved">
                  Saved ✓ <Link href="/analytics">See your cold checks →</Link>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pp-preview">
        {!sheet.length && <p className="pp-empty">Deal a cold set or pick questions, and the printout shows up here.</p>}
        {sheet.map((p, i) => {
          const later = p.q.steps.some((s) => s.give?.length);
          return (
            <article key={pickId(p)} className="pp-sheet">
              <header className="pp-head">
                <span>FE Café · Paper Practice · {today}</span>
                <span>Name ______________</span>
              </header>
              <h2 className="pp-qtitle">
                Question {i + 1} <span>({p.q.pts} pts)</span>
              </h2>
              <Rich text={forPaper(p.q.story)} className="pp-story" />
              {p.q.given.map((it) => (
                <ItemView key={it.id} it={it} />
              ))}
              {later && <p className="pp-small">(Later parts of this question have an extra picture. You&apos;ll see it when you play it in Night Shift.)</p>}
              <div className="pp-lines" style={{ height: `${Math.min(14, 2 + p.q.pts * 0.7)}cm` }} aria-label="space for your answer" />
              <p className="pp-grade">Score: ______ / {p.q.pts}</p>
            </article>
          );
        })}
        {withKey && sheet.length > 0 && (
          <article className="pp-sheet pp-key">
            <header className="pp-head">
              <span>✂ ANSWER KEY · don&apos;t peek until the timer&apos;s done</span>
            </header>
            {sheet.map((p, i) => {
              const r = recipeFor(p.q);
              return (
                <section key={pickId(p)} className="pp-key-q">
                  <h3>
                    {i + 1}. {p.q.title} <span className="muted">· {p.exam.term} #{p.q.id} · {p.q.topic} · {p.q.pts} pts</span>
                  </h3>
                  <div className="pp-rubric">
                    <b>Rubric:</b>{" "}
                    {p.q.steps
                      .filter((s) => s.pts)
                      .map((s) => `${s.title} (${s.pts})`)
                      .join(" · ")}
                  </div>
                  <pre>{p.q.answer}</pre>
                  <p>
                    <b>Remember:</b> {p.q.takeaway}
                  </p>
                  {r && (
                    <p className="pp-small">
                      Missed points? Reread the recipe <b>{r.emoji} {r.name}</b> (Recipes page)
                      {RECIPE_BOOK[r.id]?.length ? <> and Standish {RECIPE_BOOK[r.id].map((c) => `${chLabel(c)} (${chapter(c)?.title})`).join(", ")}</> : null}, then play this question in Night Shift: {p.exam.term} → #{p.q.id}.
                    </p>
                  )}
                </section>
              );
            })}
          </article>
        )}
      </div>
    </div>
  );
}
