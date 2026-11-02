"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { saveStore } from "@/lib/arcade/store";
import { KEYS, persist, readLocal, ready } from "@/lib/persist";
import { getProblem } from "@/lib/potd/pick";
import { activeDays, daysUntil, logStore, patchDay, streak, ymd } from "@/lib/studylog";
import { RisoArt } from "@/components/RisoArt";
import { Month } from "./Month";
import "./today.css";

/** longest run of consecutive study days */
function longest(days: Set<string>) {
  const sorted = [...days].sort();
  let best = 0;
  let run = 0;
  let prev = "";
  for (const d of sorted) {
    const p = new Date(d + "T12:00:00");
    p.setDate(p.getDate() - 1);
    run = prev === ymd(p) ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export default function CalendarView() {
  const log = logStore.use();
  const save = saveStore.use();
  const [now, setNow] = useState<Date | null>(null);
  const [exam, setExam] = useState("");
  const [picked, setPicked] = useState("");
  // which month is open at full size (the others show as slim strips)
  const [view, setView] = useState<[number, number] | null>(null);

  useEffect(() => {
    const d = new Date();
    setNow(d);
    setPicked(ymd(d));
    ready().then(() => setExam(readLocal(KEYS.examDate) ?? ""));
  }, []);

  const active = useMemo(() => activeDays(log, save.steps), [log, save.steps]);

  if (!now) return <div className="today-wrap" aria-busy="true" />;

  const today = ymd(now);
  const year = now.getFullYear();
  const left = daysUntil(exam);

  // January 1 of this year through the exam month (or December)
  const examD = exam ? new Date(exam + "T12:00:00") : null;
  const lastIndex = Math.min(23, Math.max(11, examD ? (examD.getFullYear() - year) * 12 + examD.getMonth() : 11));
  const months: [number, number][] = Array.from({ length: lastIndex + 1 }, (_, i) => [year + Math.floor(i / 12), i % 12]);

  const yearDays = [...active].filter((d) => d.startsWith(String(year))).length;
  const focusMin = Object.entries(log.days).reduce((t, [, v]) => t + (v.focus ?? 0), 0);
  const solved = Object.values(log.days).reduce((t, v) => t + (v.potd?.ok ? 1 : 0) + (v.extra ?? 0), 0);
  const stepsOn = (d: string) => Object.values(save.steps).filter((r) => r.done && r.t && ymd(new Date(r.t)) === d).length;

  const [vy, vm] = view ?? [now.getFullYear(), now.getMonth()];
  const empty = yearDays === 0 && focusMin === 0 && solved === 0;
  const day = log.days[picked];
  const potd = day?.potd ? getProblem(day.potd.id) : undefined;
  const steps = picked ? stepsOn(picked) : 0;

  return (
    <div className="today-wrap cal">
      <header className="cal-head">
        <div>
          <h1>Calendar</h1>
          {empty ? (
            <p className="cal-tally">Nothing stamped yet. Solve today&apos;s problem and this page starts filling in.</p>
          ) : (
            <p className="cal-tally">
              Since January 1 you studied <b>{yearDays}</b> {yearDays === 1 ? "day" : "days"}, focused for <b>{Math.round((focusMin / 60) * 10) / 10}</b> hours and solved{" "}
              <b>{solved}</b> {solved === 1 ? "problem" : "problems"}. Current streak <b>{streak(active)}</b>, longest <b>{longest(active)}</b>.
            </p>
          )}
        </div>
        <div className="cal-exam">
          <label htmlFor="cal-exam">Foundation Exam date</label>
          <input
            id="cal-exam"
            type="date"
            className="solve-input"
            value={exam}
            onChange={(e) => {
              setExam(e.target.value);
              persist(KEYS.examDate, e.target.value);
            }}
          />
          <p className="cal-left">{left == null ? "Set it and the countdown appears everywhere." : left >= 0 ? `${left} ${left === 1 ? "day" : "days"} to go.` : "That date has passed. Set the next one."}</p>
        </div>
      </header>

      <div className="cal-body">
        <div className="cal-main">
          <Month year={vy} month={vm} today={today} active={active} exam={exam} selected={picked} onPick={setPicked} label />
          <div className="cal-strips" aria-label="All months">
            {months.map(([y, m]) => {
              const count = new Date(y, m + 1, 0).getDate();
              const isOpen = y === vy && m === vm;
              return (
                <div key={`${y}-${m}`} className={`cal-strip ${isOpen ? "open" : ""}`}>
                  <button className="cal-strip-name" onClick={() => setView([y, m])} aria-pressed={isOpen}>
                    {new Date(y, m, 1).toLocaleDateString("en-US", { month: "short" })}
                    {m === 0 || (y !== year && m === 0) ? ` ${y}` : ""}
                  </button>
                  <span className="cal-dots">
                    {Array.from({ length: count }, (_, i) => {
                      const d = ymd(new Date(y, m, i + 1));
                      const cls = d === exam ? "exam" : active.has(d) ? "on" : d === today ? "today" : d > today ? "future" : "";
                      return (
                        <button
                          key={d}
                          className={`cal-dot ${cls}`}
                          aria-label={`${d}${active.has(d) ? ", studied" : ""}${d === exam ? ", exam day" : ""}`}
                          onClick={() => {
                            setView([y, m]);
                            setPicked(d);
                          }}
                        />
                      );
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="cal-day panel" aria-live="polite">
          <h2 className="cal-day-title">{new Date(picked + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h2>
          {picked === exam && <p className="cal-exam-day">Exam day. Sleep, eat, breathe. You've done the work. 💜</p>}
          {picked > today && picked !== exam ? (
            <p>Not here yet.</p>
          ) : (
            <>
              <ul className="cal-list">
                <li>
                  {potd ? (
                    <>
                      Problem of the day: <b>{potd.title}</b> · {day!.potd!.ok ? "solved ✅" : day!.potd!.revealed ? "read the walkthrough 📖" : "attempted"}
                    </>
                  ) : (
                    "No problem of the day logged."
                  )}
                </li>
                {!!day?.extra && <li>Extra problems solved: {day.extra}</li>}
                <li>{day?.focus ? `Focused for ${day.focus} minutes ⏱` : "No focus sessions."}</li>
                <li>{steps ? `${steps} Night Shift ${steps === 1 ? "step" : "steps"} finished 🌙` : "No Night Shift steps."}</li>
              </ul>
              {picked <= today && (
                <button className="pill pill-cream pill-small" onClick={() => patchDay(picked, { marked: !day?.marked })}>
                  {day?.marked ? "Remove my stamp" : "Stamp this day: I studied"}
                </button>
              )}
              {picked === today && (
                <p className="cal-go">
                  <Link href="/">Go to today&apos;s card →</Link>
                </p>
              )}
            </>
          )}
          <RisoArt tags={["moon", "night", "owl"]} seed={picked} ink="cornflower" className="cal-art" />
        </aside>
      </div>
    </div>
  );
}
