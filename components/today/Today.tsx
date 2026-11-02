"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { saveStore } from "@/lib/arcade/store";
import { KEYS, persist, readLocal, ready } from "@/lib/persist";
import { anotherProblem, problemFor } from "@/lib/potd/pick";
import type { Potd } from "@/lib/potd/types";
import { activeDays, daysUntil, logStore, patchDay, setLogField, streak, ymd } from "@/lib/studylog";
import { IconArrow, IconStar } from "@/components/icons";
import { RisoArt } from "@/components/RisoArt";
import { DEFAULT_VIDEO, Focus, fmt } from "./Focus";
import { Month } from "./Month";
import { Solve, artTags, topicName } from "./Solve";
import "./today.css";

type Mode = "hand" | "solve" | "focus";
const BREAK = 5;
const calm = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** a soft two-note chime when a session ends (no audio files) */
function chime() {
  try {
    const ctx = new AudioContext();
    [660, 880].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = f;
      o.type = "sine";
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.22);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + i * 0.22 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.22 + 0.9);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.22);
      o.stop(ctx.currentTime + i * 0.22 + 1);
    });
  } catch {
    /* no sound available */
  }
}

export default function Today() {
  const log = logStore.use();
  const save = saveStore.use();
  const [now, setNow] = useState<Date | null>(null);
  const [exam, setExam] = useState<string>("");
  const [editingDate, setEditingDate] = useState(false);
  const [mode, setMode] = useState<Mode>("hand");
  const [extra, setExtra] = useState<Potd | null>(null);

  // timer
  const len = log.focusLen ?? 25;
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [remaining, setRemaining] = useState(len * 60000);
  const [running, setRunning] = useState(false);
  const endsAt = useRef(0);

  const handRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fromRect = useRef<DOMRect | null>(null);

  useEffect(() => {
    setNow(new Date());
    ready().then(() => setExam(readLocal(KEYS.examDate) ?? ""));
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const today = now ? ymd(now) : "";
  const day = today ? log.days[today] : undefined;
  const todays = useMemo(() => (today ? problemFor(today) : null), [today]);
  const current = extra ?? todays;
  const active = useMemo(() => activeDays(log, save.steps), [log, save.steps]);
  const streakN = streak(active);
  const left = daysUntil(exam);

  // ── timer ──
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const r = endsAt.current - Date.now();
      if (r > 0) {
        setRemaining(r);
        return;
      }
      setRunning(false);
      chime();
      if (phase === "focus") {
        const d = ymd();
        patchDay(d, { focus: (logStore.read().days[d]?.focus ?? 0) + len });
        setPhase("break");
        setRemaining(BREAK * 60000);
      } else {
        setPhase("focus");
        setRemaining(len * 60000);
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [running, phase, len]);

  useEffect(() => {
    if (!running) {
      document.title = "Today · FE Café";
      return;
    }
    document.title = `${fmt(remaining)} ${phase === "focus" ? "focus" : "break"} · FE Café`;
  }, [running, remaining, phase]);

  const start = () => {
    endsAt.current = Date.now() + remaining;
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setPhase("focus");
    setRemaining(len * 60000);
  };
  const changeLen = (m: number) => {
    setLogField({ focusLen: m });
    if (!running && phase === "focus") setRemaining(m * 60000);
  };

  // ── moving between the hand and a card's full view ──
  const open = useCallback((m: Mode, el?: HTMLElement | null) => {
    fromRect.current = el ? el.getBoundingClientRect() : null;
    setMode(m);
  }, []);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const from = fromRect.current;
    fromRect.current = null;
    if (!panel || calm()) return;
    if (mode === "hand") {
      // deal the hand back in
      gsap.fromTo(
        handRef.current?.querySelectorAll(".deal") ?? [],
        { y: 120, x: 80, rotate: 18, opacity: 0 },
        { y: 0, x: 0, rotate: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.08, clearProps: "transform,opacity" },
      );
      return;
    }
    if (!from) return;
    // the card grows into the full view (FLIP)
    const to = panel.getBoundingClientRect();
    gsap.fromTo(
      panel,
      { x: from.left - to.left, y: from.top - to.top, scaleX: from.width / to.width, scaleY: from.height / to.height, rotate: -2, transformOrigin: "0 0" },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, rotate: 0, duration: 0.6, ease: "expo.out", clearProps: "transform" },
    );
    gsap.fromTo(panel.children, { opacity: 0 }, { opacity: 1, duration: 0.35, delay: 0.18, clearProps: "opacity" });
  }, [mode, current?.id]);

  // the first deal when the page opens
  useEffect(() => {
    if (!now || calm()) return;
    gsap.fromTo(
      handRef.current?.querySelectorAll(".deal") ?? [],
      { y: 160, x: 120, rotate: 24, opacity: 0 },
      { y: 0, x: 0, rotate: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.1, delay: 0.15, clearProps: "transform,opacity" },
    );
    gsap.fromTo(".today-date .misprint", { x: 0, y: 0 }, { x: 6, y: 6, duration: 0.9, ease: "expo.out", delay: 0.2 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!now]);

  if (!now || !todays || !current) return <div className="today-wrap" aria-busy="true" />;

  const monthName = now.toLocaleDateString("en-US", { month: "short" });
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const issue = Math.floor((new Date(today + "T12:00:00").getTime() - new Date(now.getFullYear(), 0, 1, 12).getTime()) / 86400000) + 1;
  const solved = day?.potd;

  const points = solved ? (solved.ok && solved.tries <= 1 ? 100 : solved.ok ? 50 : 10) : 100;
  const resume = save.last
    ? { href: `/arcade/${save.last.exam}?q=${save.last.q}`, title: "Night Shift", line: `You were on question ${save.last.q}. Pick it back up.`, tags: ["lantern", "night"] }
    : { href: "/menu", title: "Topics", line: "Start with Pointers & Dynamic Memory, the first page of the zine.", tags: ["books", "reading"] };
  const others = [
    { href: "/arcade", title: "Night Shift", line: "Real past exams, step by step" },
    { href: "/menu", title: "Topics", line: "18 topics, the way Guha teaches them" },
    { href: "/studio", title: "Code Studio", line: "Blank-page C. No AI." },
  ].filter((o) => o.title !== resume.title).slice(0, 2);

  return (
    <div className="today-wrap">
      <section className="today" aria-label="Today">
        {/* left page, top: the date and the countdown */}
        <div className="today-head">
          <h1 className="today-date">
            <span className="misprint" aria-hidden>
              {monthName} {now.getDate()}
            </span>
            <span className="front">
              {monthName} {now.getDate()}
            </span>
          </h1>
          <p className="today-issue">
            {weekday} · issue #{issue}
          </p>

          <div className="countdown">
            {editingDate || !exam ? (
              <form
                className="countdown-edit"
                onSubmit={(e) => {
                  e.preventDefault();
                  setEditingDate(false);
                }}
              >
                <label htmlFor="exam-date">When is your Foundation Exam?</label>
                <div className="solve-row">
                  <input
                    id="exam-date"
                    type="date"
                    className="solve-input"
                    value={exam}
                    onChange={(e) => {
                      setExam(e.target.value);
                      persist(KEYS.examDate, e.target.value);
                    }}
                  />
                  {exam && (
                    <button className="pill pill-plum pill-small" type="submit">
                      Done
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <button className="countdown-tag" onClick={() => setEditingDate(true)} title="Change the exam date">
                <b>{left != null && left >= 0 ? left : "?"}</b>
                <span>{left != null && left >= 0 ? (left === 1 ? "day to your FE" : "days to your FE") : "that date passed: set the next one"}</span>
              </button>
            )}
          </div>
        </div>

        {/* left page, bottom: the month */}
        <div className="today-month">
          <Month year={now.getFullYear()} month={now.getMonth()} today={today} active={active} exam={exam} onPick={(d) => d <= today && patchDay(d, { marked: !log.days[d]?.marked })} />
          <p className="month-note">
            <IconStar size={16} className="star-ink" /> = a day you studied. Tap a past day to stamp it yourself.
          </p>
        </div>

        {/* right page: the day, dealt as cards */}
        <div className="today-right" ref={handRef}>
          {mode === "hand" ? (
            <div className="deal-hand" ref={panelRef}>
              <Link className="card-z card-bonus deal" href="/calendar" aria-label={`Bonus card: ${streakN}-day streak. Open the calendar`}>
                <span className="card-top">
                  <span>Bonus</span>
                  <span>{streakN}🔥</span>
                </span>
                <RisoArt tags={["fox", "playful"]} seed="bonus" ink="plum" className="card-window small" credit={false} />
                <span className="card-pill">{streakN === 1 ? "1-day" : `${streakN}-day`} streak</span>
              </Link>

              <button className="card-z card-side deal" onClick={(e) => open("focus", e.currentTarget)} aria-label="Side card: open the focus timer">
                <span className="card-top">
                  <span>Side</span>
                  <span>{running ? fmt(remaining) : `${len}m`}</span>
                </span>
                <RisoArt tags={["owl", "night"]} seed="focus" ink="cornflower" className="card-window small" credit={false} />
                <span className="card-pill">{running ? (phase === "focus" ? "focusing…" : "on a break") : `${len}-minute focus`}</span>
              </button>

              <div className="card-z card-main deal">
                <span className="card-top">
                  <span>Main</span>
                  <span aria-label={solved ? `earned ${points} points` : `worth ${points} points`}>+{points}</span>
                </span>
                <RisoArt tags={artTags(todays.topic)} seed={todays.id} ink="cherry" className="card-window" />
                <span className="card-meta">
                  <span className="card-pill">{topicName(todays.topic)}</span>
                  <span className="card-stars" aria-label={`difficulty ${todays.level} of 3`}>
                    {"★".repeat(todays.level)}
                    <span className="dim">{"★".repeat(3 - todays.level)}</span>
                  </span>
                </span>
                <span className="card-title">{todays.title}</span>
                {solved && (
                  <span className="card-stamp" aria-hidden>
                    {solved.ok ? `+${points}` : "read"}
                  </span>
                )}
              </div>

              <button className="pill pill-cherry big solve-btn deal" onClick={(e) => open("solve", (e.currentTarget.previousElementSibling as HTMLElement) ?? null)}>
                {solved ? "See the walkthrough" : "Solve it"} <IconArrow />
              </button>
            </div>
          ) : (
            <div className="panel" ref={panelRef}>
              <button className="back-btn" onClick={() => (setExtra(null), open("hand"))}>
                ← Back to today
              </button>
              {mode === "solve" ? (
                <Solve
                  problem={current}
                  isToday={!extra}
                  prior={!extra ? solved : undefined}
                  onResult={(r) => {
                    if (!extra) patchDay(today, { potd: { id: current.id, ok: r.ok, tries: r.tries, revealed: r.revealed } });
                    else if (r.ok) patchDay(today, { extra: (day?.extra ?? 0) + 1 });
                  }}
                  onFocus={() => open("focus", null)}
                  onAnother={() => setExtra(anotherProblem([todays.id, current.id]))}
                />
              ) : (
                <Focus
                  len={len}
                  remaining={remaining}
                  running={running}
                  phase={phase}
                  video={log.video ?? DEFAULT_VIDEO}
                  todayMinutes={day?.focus ?? 0}
                  onStart={start}
                  onPause={pause}
                  onReset={reset}
                  onLen={changeLen}
                  onVideo={(id) => setLogField({ video: id })}
                />
              )}
            </div>
          )}
        </div>
      </section>

      <section className="pickup" aria-labelledby="pickup-title">
        <h2 id="pickup-title">Pick up where you left off</h2>
        <div className="pickup-deal">
          <Link className="resume-card" href={resume.href}>
            <RisoArt tags={resume.tags} seed={`resume-${resume.title}`} ink="cherry" className="resume-print" credit={false} />
            <span className="resume-text">
              <b>{resume.title}</b>
              <span>{resume.line}</span>
              <span className="pill pill-cream resume-go">
                Continue <IconArrow size={20} />
              </span>
            </span>
          </Link>
          <div className="pickup-tabs">
            {others.map((o) => (
              <Link key={o.href} className="mini-tab" href={o.href}>
                <b>{o.title}</b>
                <span>{o.line}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
