"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { JOURNAL_SEED, type JournalEntry } from "@/content/me";
import { loadFS, saveFS, seedFS, writeFile } from "@/lib/studio-fs";

const KEY = "fe-cafe-journal-v1";
const FIELDS: { k: keyof JournalEntry; label: string; ph: string; wide?: boolean }[] = [
  { k: "category", label: "Category", ph: "DSN / ALG / ANL" },
  { k: "subcat", label: "Sub cat", ph: "Linked List" },
  { k: "term", label: "Term & Yr", ph: "Summer 2026" },
  { k: "points", label: "Points", ph: "10" },
  { k: "date", label: "Date done", ph: "9/29" },
  { k: "difficulty", label: "Difficulty", ph: "Easy" },
  { k: "grades", label: "Attempt grades", ph: "2/10; 6/10" },
  { k: "link", label: "Link to Q", ph: "https://…" },
  { k: "comments", label: "What I learned (in my own words)", ph: "Read the return type!", wide: true },
  { k: "code", label: "Code (optional)", ph: "paste or type your answer", wide: true },
];

const blank = (): JournalEntry => ({ id: `e${Date.now()}`, category: "", subcat: "", term: "", points: "", date: "", link: "", difficulty: "", grades: "", comments: "", code: "" });

/** Last attempt as 0..1, e.g. "2/10; 6/10" → 0.6 */
function lastScore(g: string) {
  const all = [...g.matchAll(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/g)];
  if (!all.length) return null;
  const [, a, b] = all[all.length - 1];
  return +b ? +a / +b : null;
}

const tone = (x: number | null) => (x == null ? "" : x >= 0.8 ? "var(--matcha)" : x >= 0.5 ? "var(--butter)" : "var(--blush)");

export default function Journal() {
  const [items, setItems] = useState<JournalEntry[] | null>(null);
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<JournalEntry>(blank());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setItems(raw ? (JSON.parse(raw) as JournalEntry[]) : JOURNAL_SEED);
    } catch {
      setItems(JOURNAL_SEED);
    }
  }, []);

  useEffect(() => {
    if (!items) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const cats = useMemo(() => ["All", ...Array.from(new Set((items ?? []).map((i) => i.category.toUpperCase()).filter(Boolean)))], [items]);

  if (!items) return <p className="center muted hand">📓 opening your journal…</p>;

  const shown = items.filter((i) => filter === "All" || i.category.toUpperCase() === filter);
  const scored = items.map((i) => lastScore(i.grades)).filter((x): x is number => x != null);
  const avg = scored.length ? Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 100) : null;
  const readCount = items.filter((i) => /read|careful|take your time/i.test(i.comments)).length;
  const bySub = new Map<string, number[]>();
  items.forEach((i) => {
    const s = lastScore(i.grades);
    if (s != null && i.subcat) bySub.set(i.subcat.toUpperCase(), [...(bySub.get(i.subcat.toUpperCase()) ?? []), s]);
  });
  const weakest = [...bySub.entries()].map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length] as const).sort((a, b) => a[1] - b[1])[0];

  const startEdit = (e: JournalEntry) => {
    setDraft({ ...e });
    setEditing(e.id);
  };
  const saveDraft = () => {
    setItems((list) => {
      const l = list ?? [];
      return l.some((x) => x.id === draft.id) ? l.map((x) => (x.id === draft.id ? draft : x)) : [draft, ...l];
    });
    setEditing(null);
  };

  const openInStudio = async (e: JournalEntry) => {
    let fs = loadFS() ?? (await seedFS());
    let path = e.redo;
    if (!path || !fs.files[path]) {
      path = `my-code/journal-${(e.subcat || "question").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${e.id}.c`;
      if (!fs.files[path]) fs = writeFile(fs, path, `// From my journal: ${e.category} · ${e.subcat} · ${e.term}\n// ${e.comments.slice(0, 180)}\n\n${e.code}\n`);
    }
    saveFS({ ...fs, open: path });
    location.href = `/studio?open=${encodeURIComponent(path)}`;
  };

  const exportCsv = () => {
    const cols: (keyof JournalEntry)[] = ["category", "subcat", "term", "points", "date", "link", "difficulty", "grades", "comments", "code"];
    const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
    const csv = ["Question #," + cols.join(","), ...items.map((e, i) => [i + 1, ...cols.map((c) => esc(String(e[c] ?? "")))].join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "fe-journal.csv";
    a.click();
  };

  const Form = (
    <div className="card pop-in" style={{ borderColor: "var(--accent)", marginBottom: 20 }}>
      <h3>{items.some((x) => x.id === draft.id) ? "✏️ Edit entry" : "🌱 New entry"}</h3>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))", gap: 10 }}>
        {FIELDS.map((f) => (
          <label key={f.k} style={{ gridColumn: f.wide ? "1 / -1" : undefined, fontSize: "0.85rem", fontWeight: 700 }}>
            {f.label}
            {f.wide ? (
              <textarea
                className="input"
                rows={f.k === "code" ? 6 : 3}
                style={{ width: "100%", display: "block", marginTop: 4, fontFamily: f.k === "code" ? "var(--font-mono)" : undefined }}
                placeholder={f.ph}
                value={String(draft[f.k] ?? "")}
                onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value })}
              />
            ) : (
              <input className="input" style={{ width: "100%", display: "block", marginTop: 4 }} placeholder={f.ph} value={String(draft[f.k] ?? "")} onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value })} />
            )}
          </label>
        ))}
      </div>
      <div className="controls" style={{ marginTop: 12 }}>
        <button className="btn" onClick={saveDraft}>💾 Save</button>
        <button className="btn secondary" onClick={() => setEditing(null)}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="grid grid-3" style={{ marginBottom: 20 }}>
        <div className="card center">
          <div style={{ fontSize: "2rem", fontFamily: "var(--font-display)", fontWeight: 800 }}>{items.length}</div>
          <div className="muted">questions logged</div>
        </div>
        <div className="card center">
          <div style={{ fontSize: "2rem", fontFamily: "var(--font-display)", fontWeight: 800, color: tone(avg == null ? null : avg / 100) }}>{avg == null ? "–" : `${avg}%`}</div>
          <div className="muted">average (latest attempt){weakest ? ` · weakest: ${weakest[0]}` : ""}</div>
        </div>
        <div className="card center" style={{ background: "var(--blush-soft)", borderColor: "var(--blush)" }}>
          <div style={{ fontSize: "2rem", fontFamily: "var(--font-display)", fontWeight: 800 }}>{readCount} / {items.length}</div>
          <div className="muted">of your notes say &ldquo;read carefully&rdquo;. That&apos;s your #1 point-saver 👀</div>
        </div>
      </div>

      <div className="controls" style={{ justifyContent: "space-between" }}>
        <span className="controls" style={{ margin: 0 }}>
          {cats.map((c) => (
            <button key={c} className={`btn small ${filter === c ? "" : "secondary"}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </span>
        <span className="controls" style={{ margin: 0 }}>
          <button className="btn small matcha" onClick={() => { setDraft(blank()); setEditing("new"); }}>＋ Log a question</button>
          <button className="btn small secondary" onClick={exportCsv}>⬇ CSV</button>
        </span>
      </div>

      {editing && Form}

      <div className="grid grid-2" style={{ marginTop: 10 }}>
        {shown.map((e) => {
          const n = items.indexOf(e) + 1;
          const s = lastScore(e.grades);
          return (
            <article key={e.id} className="card" style={{ borderTop: `8px solid ${tone(s) || "var(--line)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
                <h3 style={{ margin: 0 }}>
                  #{n} · {e.subcat || "Untitled"}
                </h3>
                <span className="muted" style={{ fontSize: "0.85rem" }}>{e.date && `📅 ${e.date}`}</span>
              </div>
              <div className="controls" style={{ margin: "8px 0" }}>
                {e.category && <span className="chip">{e.category}</span>}
                {e.term && <span className="chip">🗓 {e.term}</span>}
                {e.points && <span className="chip">{e.points} pts</span>}
                {e.difficulty && <span className="chip">{e.difficulty}</span>}
                {e.grades && (
                  <span className="chip" style={{ background: "var(--card)", borderColor: tone(s) }}>
                    {e.grades.split(";").map((g) => g.trim()).join(" → ")}
                  </span>
                )}
              </div>
              {e.comments ? <p style={{ fontSize: "0.95rem" }}>{e.comments}</p> : <p className="muted hand">(no notes yet, fill me in after you try it!)</p>}
              {e.code && (
                <details>
                  <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}>💻 my code</summary>
                  <div className="code">
                    <pre>
                      <code style={{ background: "none", border: "none", padding: 0, color: "inherit", fontSize: "inherit" }}>{e.code}</code>
                    </pre>
                  </div>
                </details>
              )}
              <div className="controls" style={{ marginBottom: 0 }}>
                {(e.redo || e.code) && (
                  <button className="btn small" onClick={() => openInStudio(e)}>
                    💻 {e.redo ? "Redo it in Studio" : "Open in Studio"}
                  </button>
                )}
                {e.link && (
                  <a className="btn small secondary" href={e.link} target="_blank" rel="noreferrer">🔗 Question</a>
                )}
                <button className="btn small secondary" onClick={() => startEdit(e)}>✏️ Edit</button>
                <button className="btn small secondary" onClick={() => confirm("Delete this entry?") && setItems(items.filter((x) => x.id !== e.id))}>🗑</button>
              </div>
            </article>
          );
        })}
      </div>

      <p className="center muted" style={{ marginTop: 30, fontSize: "0.9rem" }}>
        Saved in this browser. Want a new question to log? Grab one from the <Link href="/exams">past exams shelf</Link>.
        {" "}
        <button className="btn small secondary" onClick={() => confirm("Reset the journal back to your original 8 entries?") && setItems(JOURNAL_SEED)}>↺ reset to my original log</button>
      </p>
    </div>
  );
}
