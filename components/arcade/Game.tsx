"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import confetti from "canvas-confetti";
import { getExam } from "@/content/arcade";
import { fmtPts } from "@/lib/arcade/score";
import { beanBalance } from "@/lib/arcade/shop";
import { examStats, patchStep, questionStats, saveStore, stepKey } from "@/lib/arcade/store";
import type { Item, Mood, Step } from "@/lib/arcade/types";
import { Art } from "./Art";
import { Bea, type BeaMsg } from "./Bea";
import { Rich } from "./Rich";
import { Inventory, Notes, Tutor, type ScaffoldLine } from "./Side";
import { recipeFor } from "@/lib/recipes";
import { ChoiceView, InfoView, SlotsView, TypeView, type StepProps } from "./steps";

const STORY_DOODLE: Record<string, string> = { A: "doodle-reading", B: "doodle-plant", C: "doodle-meditating", D: "doodle-sittingreading" };
const RECAP_DOODLE = ["doodle-dancing", "doodle-jumping", "doodle-levitate", "doodle-loving"];

function Ring({ value }: { value: number }) {
  const r = 11;
  const c = 2 * Math.PI * r;
  return (
    <svg className="ring" viewBox="0 0 28 28" aria-hidden>
      <circle cx="14" cy="14" r={r} fill="none" stroke="var(--a-line-2)" strokeWidth="3" />
      <circle cx="14" cy="14" r={r} fill="none" stroke={value >= 1 ? "var(--a-mint)" : "var(--a-amber)"} strokeWidth="3" strokeDasharray={`${c * value} ${c}`} strokeLinecap="round" transform="rotate(-90 14 14)" />
    </svg>
  );
}

export default function Game({ examId }: { examId: string }) {
  const exam = getExam(examId)!;
  const save = saveStore.use();
  const router = useRouter();
  const params = useSearchParams();
  const all = useMemo(() => exam.sections.flatMap((s) => s.questions.map((q) => ({ q, sec: s.id }))), [exam]);

  const qid = params.get("q") ?? (save.last?.exam === exam.id ? save.last.q : all[0].q.id);
  const entry = all.find((e) => e.q.id === qid) ?? all[0];
  const q = entry.q;
  const recs = save.steps;
  const rec = (s: Step) => recs[stepKey(exam.id, q.id, s.id)];
  const cur = q.steps.findIndex((s) => !rec(s)?.done);
  const finished = cur === -1;

  const [open, setOpen] = useState<string | null>(null);
  const [tab, setTab] = useState<"inv" | "notes" | "tutor">("inv");
  const [prefill, setPrefill] = useState<string>();
  const [bea, setBea] = useState<BeaMsg | null>(null);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const [newItems, setNewItems] = useState(false);
  const beanRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const n = useRef(0);

  const say = useCallback((text: string, mood: Mood = "happy", sticky = false) => setBea({ text, mood, sticky, n: ++n.current }), []);
  const closeBea = useCallback(() => setBea(null), []);

  const go = (id: string) => {
    router.replace(`/arcade/${exam.id}?q=${id}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(null);
    setBea(null);
  };

  // remember where we are
  useEffect(() => {
    const s = saveStore.read();
    if (s.last?.exam !== exam.id || s.last.q !== q.id) saveStore.write({ ...s, last: { exam: exam.id, q: q.id } });
  }, [exam.id, q.id]);

  // the satchel: what you were given + what each step handed you so far
  const items: Item[] = useMemo(() => {
    const got = [...q.given];
    const upto = finished ? q.steps.length - 1 : cur;
    for (let i = 0; i <= upto; i++) for (const it of q.steps[i].give ?? []) if (!got.some((g) => g.id === it.id)) got.push(it);
    return got;
  }, [q, cur, finished]);

  // greet each step, and flag brand-new inventory items
  const seenStep = useRef("");
  useEffect(() => {
    const id = `${q.id}/${cur}`;
    if (seenStep.current === id) return;
    const first = seenStep.current === "";
    seenStep.current = id;
    const step = q.steps[cur];
    if (!step?.give?.length || first) return;
    setFresh(new Set(step.give.map((g) => g.id)));
    setNewItems(true);
    say(`I put something new in your inventory: **${step.give.map((g) => g.title).join(", ")}**.`, "explain");
  }, [q, cur, say]);

  const scaffold = useMemo(() => {
    if (!q.scaffold) return undefined;
    const lines: ScaffoldLine[] = q.scaffold.code.split("\n").map((line) => {
      const m = line.match(/^(\s*)\{\{([\w-]+)\}\}\s*$/);
      if (!m) return { text: line, state: "plain" };
      const [, pad, id] = m;
      const idx = q.steps.findIndex((s) => s.id === id);
      const r = idx >= 0 ? rec(q.steps[idx]) : undefined;
      if (r?.done) return { text: pad + (r.text ?? "").trim(), state: "done" };
      if (idx === cur) return { text: pad + "▸ ____________", state: "now" };
      return { text: pad + "· · ·", state: "todo" };
    });
    return { title: q.scaffold.title, lines };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, recs, cur]);

  const qStats = questionStats(exam, q, recs);
  const eStats = examStats(exam, recs);
  const balance = beanBalance(save);

  const popBeans = (amount: number) => {
    const el = beanRef.current;
    if (!el || amount <= 0) return;
    const r = el.getBoundingClientRect();
    const pop = document.createElement("div");
    pop.className = "bean-pop arcade-portal";
    pop.textContent = `+${amount} ☕`;
    pop.style.left = `${r.left + r.width / 2}px`;
    pop.style.top = `${r.top + r.height}px`;
    document.body.appendChild(pop);
    gsap.fromTo(pop, { y: 30, opacity: 0, scale: 0.8 }, { y: -6, opacity: 1, scale: 1.1, duration: 0.45, ease: "back.out(2)", onComplete: () => void gsap.to(pop, { opacity: 0, y: -26, delay: 0.7, duration: 0.5, onComplete: () => pop.remove() }) });
    gsap.fromTo(el, { scale: 1 }, { scale: 1.12, yoyo: true, repeat: 1, duration: 0.18 });
  };

  const stepProps = (s: Step): StepProps<Step> => {
    const key = stepKey(exam.id, q.id, s.id);
    return {
      step: s,
      rec: recs[key],
      patch: (p) => patchStep(key, p),
      finish: (p) => {
        const before = beanBalance(saveStore.read());
        patchStep(key, { ...p, done: true });
        const after = beanBalance(saveStore.read());
        popBeans(after - before);
        const last = q.steps.indexOf(s) === q.steps.length - 1;
        if (last) {
          setTimeout(() => {
            if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
              confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, colors: ["#f2b766", "#b9a1f2", "#8fd9b6", "#f1e7d4"], disableForReducedMotion: true });
          }, 350);
        }
        setTimeout(() => stepRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 450);
      },
      say,
      ask: (text) => {
        setPrefill(text);
        setTab("tutor");
      },
    };
  };

  const redo = () => {
    // keep the beans you earned, start the question fresh
    const s = saveStore.read();
    const earned = questionStats(exam, q, s.steps).beans;
    const steps = { ...s.steps };
    for (const st of q.steps) delete steps[stepKey(exam.id, q.id, st.id)];
    saveStore.write({ ...s, steps, bonus: (s.bonus ?? 0) + earned });
    seenStep.current = "";
    setOpen(null);
    say("Fresh start! Second runs are where it really sticks.", "driven");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const idx = all.findIndex((e) => e.q.id === q.id);
  const nextQ = all[idx + 1]?.q;

  const view = (s: Step) => {
    const p = stepProps(s);
    switch (s.kind) {
      case "choice":
        return <ChoiceView {...(p as StepProps<typeof s>)} />;
      case "type":
        return <TypeView key={s.id} {...(p as StepProps<typeof s>)} />;
      case "slots":
        return <SlotsView key={s.id} {...(p as StepProps<typeof s>)} />;
      default:
        return <InfoView {...(p as StepProps<typeof s>)} />;
    }
  };

  return (
    <div className="g-wrap">
      {/* HUD */}
      <div className="a-panel g-hud">
        <Link href="/arcade" className="a-btn tiny ghost" aria-label="Back to the arcade lobby">
          ← Lobby
        </Link>
        <div className="g-hud-title">
          <span className="a-eyebrow">Night shift · {exam.term}</span>
          <b>
            {q.id}. {q.title}
          </b>
        </div>
        <div className="g-stat pts" title="Points you'd have on the real exam">
          <b>{fmtPts(eStats.pts)}</b>
          <small>/ {eStats.max} {exam.practice ? "pts" : "exam pts"}</small>
        </div>
        <div className="g-stat" title="Questions finished">
          <b>{eStats.finished}</b>
          <small>/ {eStats.count} done</small>
        </div>
        <div className="g-stat beans" ref={beanRef} title="Coffee beans: spend them decorating your café">
          <b>{balance}</b>
          <small>☕ beans</small>
        </div>
      </div>

      <div className="g-grid">
        {/* question rail */}
        <nav className="a-panel g-rail" aria-label="Questions">
          {exam.sections.map((sec) => (
            <div className="g-sec" key={sec.id}>
              <div className="g-sec-name">
                {sec.id} · {sec.name}
              </div>
              {sec.questions.map((qq) => {
                const st = questionStats(exam, qq, recs);
                return (
                  <button key={qq.id} className={`g-q ${st.finished ? "done" : ""}`} aria-current={qq.id === q.id} onClick={() => go(qq.id)}>
                    <Ring value={st.done / st.total} />
                    <span>
                      {qq.id} <span className="a-faint" style={{ fontWeight: 500 }}>{exam.practice ? qq.title.split(" (")[0] : qq.topic.split(" (")[0]}</span>
                    </span>
                    <span className="qpts">
                      {st.done ? fmtPts(st.pts) : "–"}/{qq.pts}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* main */}
        <main className="g-main">
          <section className="a-panel g-qhead">
            <div className="tags">
              <span className="a-tag cat">{q.category}</span>
              <span className="a-tag">{q.topic}</span>
              <span className="a-tag">{q.pts} pts</span>
              <span className="a-tag">
                step {Math.min(finished ? q.steps.length : cur + 1, q.steps.length)} of {q.steps.length}
              </span>
            </div>
            <h2>
              {q.id}) {q.title}
            </h2>
            <Rich text={q.story} className="g-story" />
            <Art name={STORY_DOODLE[entry.sec] ?? "doodle-reading"} className="doodle" />
          </section>

          <div className="g-steps">
            {q.steps.map((s, i) => {
              const r = rec(s);
              if (r?.done) {
                const lost = (s.pts ?? 0) > 0 && (r.pts ?? 0) < (s.pts ?? 0);
                return (
                  <div key={s.id}>
                    <button className="st-done" onClick={() => setOpen(open === s.id ? null : s.id)} aria-expanded={open === s.id}>
                      <span className="tick">✓</span>
                      <span className="st-title">{s.title}</span>
                      {(s.pts ?? 0) > 0 && (
                        <span className={`st-pts ${lost ? "lost" : ""}`}>
                          {fmtPts(r.pts ?? 0)}/{s.pts}
                        </span>
                      )}
                    </button>
                    {open === s.id && (
                      <div className="st-detail">
                        {s.kind === "type" && <code style={{ display: "inline-block", marginBottom: 6 }}>{r.text}</code>}
                        {s.kind === "choice" && <div style={{ marginBottom: 6 }}>✓ {s.options.find((o) => o.ok)?.t}</div>}
                        {s.learn ? <Rich text={s.learn} /> : s.kind === "choice" ? <Rich text={s.options.find((o) => o.ok)?.why ?? ""} /> : null}
                      </div>
                    )}
                  </div>
                );
              }
              if (i !== cur) return null;
              return (
                <section key={`${q.id}-${s.id}`} ref={stepRef} className="a-panel st-card enter" aria-labelledby={`st-${s.id}`}>
                  <div className="st-head">
                    <span className="st-num">
                      STEP {i + 1}/{q.steps.length}
                    </span>
                    <h3 id={`st-${s.id}`} style={{ margin: 0, fontSize: "1.2rem" }}>
                      {s.title}
                    </h3>
                    <span className={`st-ptsbadge ${(s.pts ?? 0) > 0 ? "" : "warm"}`}>{(s.pts ?? 0) > 0 ? `${s.pts} exam pt${s.pts === 1 ? "" : "s"}` : "warm-up"}</span>
                  </div>
                  <Rich text={s.prompt} className="st-prompt" />
                  {view(s)}
                </section>
              );
            })}
          </div>

          {finished && (
            <section className="a-panel recap st-card enter" ref={stepRef}>
              <Art name={RECAP_DOODLE[idx % RECAP_DOODLE.length]} className="doodle" />
              <span className="a-eyebrow">Question complete</span>
              <div className="recap-score">
                <b>{fmtPts(qStats.pts)}</b>
                <span>/ {q.pts} points</span>
              </div>
              <p className="a-muted" style={{ maxWidth: "52ch" }}>
                {qStats.pts >= q.pts ? "Full marks. Write it exactly like this on exam day." : "Every point you missed is a note-to-self. Jot it down in Notes →"}
              </p>
              <h3 style={{ marginTop: 18 }}>The official answer</h3>
              <pre>{q.answer}</pre>
              <div className="st-learn" style={{ marginTop: 14 }}>
                <b>Exam-day takeaway:</b> <Rich text={q.takeaway} />
              </div>
              <div className="st-actions" style={{ marginTop: 18 }}>
                {nextQ ? (
                  <button className="a-btn" onClick={() => go(nextQ.id)}>
                    Next: {nextQ.id} {nextQ.title} →
                  </button>
                ) : (
                  <Link href="/arcade" className="a-btn">
                    Back to the café: go decorate ☕
                  </Link>
                )}
                <button className="a-btn ghost" onClick={redo}>
                  Redo this question
                </button>
                {exam.solutionsPdf && (
                  <a className="a-btn ghost" href={exam.solutionsPdf} target="_blank" rel="noreferrer">
                    Official solutions PDF ↗
                  </a>
                )}
              </div>
            </section>
          )}
        </main>

        {/* side: inventory / notes / tutor */}
        <aside className="a-panel g-side" aria-label="Your inventory, notes and tutor">
          <div className="g-tabs" role="tablist">
            <button
              role="tab"
              className="g-tab"
              aria-selected={tab === "inv"}
              onClick={() => {
                setTab("inv");
                setNewItems(false);
              }}
            >
              🎒 Inventory {newItems && tab !== "inv" && <span className="dot" />}
            </button>
            <button role="tab" className="g-tab" aria-selected={tab === "notes"} onClick={() => setTab("notes")}>
              ✎ Notes
            </button>
            <button role="tab" className="g-tab" aria-selected={tab === "tutor"} onClick={() => setTab("tutor")}>
              💬 Ask Juni
            </button>
          </div>
          <div className="g-pane">
            {tab === "inv" && <Inventory items={items} fresh={fresh} scaffold={scaffold} recipe={recipeFor(q)} />}
            {tab === "notes" && <Notes id={`${exam.id}/${q.id}`} label={`Notes for ${q.id}`} />}
            {tab === "tutor" && (
              <Tutor
                chatId={`${exam.id}/${q.id}`}
                prefill={prefill}
                onPrefillUsed={() => setPrefill(undefined)}
                context={{ exam: exam.id, q: q.id, step: finished ? null : q.steps[cur]?.id, typed: finished ? "" : rec(q.steps[cur])?.text ?? "", picked: finished ? [] : rec(q.steps[cur])?.picked ?? [] }}
              />
            )}
          </div>
        </aside>
      </div>

      <Bea msg={bea} onClose={closeBea} />
    </div>
  );
}

