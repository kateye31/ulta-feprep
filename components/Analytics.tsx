"use client";

import Link from "next/link";
import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { ARCADE_EXAMS } from "@/content/arcade";
import { analyze, SECTION_NAMES, weakest, type Analytics as Data, type SectionId, type TopicStat } from "@/lib/analytics";
import { saveStore } from "@/lib/arcade/store";

/** one color per section, checked for colorblind separation on the cream card (see the dataviz validator) */
const SEC_COLOR: Record<SectionId, string> = { A: "#b3262c", B: "#3f5fb0", C: "#c98a10", D: "#8a4bab" };
const SECS: SectionId[] = ["A", "B", "C", "D"];
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

// ── a tiny shared tooltip: follows the mark you hover or focus ──
type Tip = { x: number; y: number; body: ReactNode } | null;
function useTip() {
  const host = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip>(null);
  const on = (body: ReactNode) => ({
    onMouseEnter: (e: React.MouseEvent) => place(e.currentTarget, body),
    onFocus: (e: React.FocusEvent) => place(e.currentTarget, body),
    onMouseLeave: () => setTip(null),
    onBlur: () => setTip(null),
  });
  const place = (el: Element, body: ReactNode) => {
    const h = host.current?.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (h) setTip({ x: r.left + r.width / 2 - h.left, y: r.top - h.top, body });
  };
  const view = tip && (
    <div className="an-tip" style={{ left: tip.x, top: tip.y }} role="status">
      {tip.body}
    </div>
  );
  return { host, on, view };
}

function Card({ title, sub, children, className = "" }: { title: string; sub?: string; children: ReactNode; className?: string }) {
  const { host, on, view } = useTip();
  return (
    <section className={`an-card ${className}`} ref={host}>
      <h2>{title}</h2>
      {sub && <p className="an-sub">{sub}</p>}
      <TipCtx.Provider value={on}>{children}</TipCtx.Provider>
      {view}
    </section>
  );
}
const TipCtx = createContext<(b: ReactNode) => object>(() => ({}));
const useOn = () => useContext(TipCtx);

// ── 🎯 concentric section rings ──
function Rings({ data }: { data: Data }) {
  const on = useOn();
  const all = SECS.reduce((t, s) => ({ steps: t.steps + data.sections[s].steps, done: t.done + data.sections[s].done }), { steps: 0, done: 0 });
  const R = [92, 74, 56, 38];
  return (
    <div className="an-rings">
      <svg viewBox="0 0 220 220" role="img" aria-label={`Sections covered: ${SECS.map((s) => `${s} ${pct(data.sections[s].done, data.sections[s].steps)}%`).join(", ")}`}>
        {SECS.map((s, i) => {
          const v = pct(data.sections[s].done, data.sections[s].steps);
          return (
            <g key={s} {...on(<><b>Section {s}</b> · {SECTION_NAMES[s]}<br />{data.sections[s].done} of {data.sections[s].steps} steps ({v}%)</>)} tabIndex={0}>
              <circle cx="110" cy="110" r={R[i]} fill="none" stroke="var(--an-track)" strokeWidth="13" />
              {v > 0 && (
                <circle cx="110" cy="110" r={R[i]} fill="none" stroke={SEC_COLOR[s]} strokeWidth="13" strokeLinecap="round" pathLength={100} strokeDasharray={`${Math.max(v, 1.5)} 100`} transform="rotate(-90 110 110)" />
              )}
              <circle cx="110" cy="110" r={R[i]} fill="none" stroke="transparent" strokeWidth="18" />
            </g>
          );
        })}
        <text x="110" y="110" textAnchor="middle" className="an-ring-big">
          {pct(all.done, all.steps)}%
        </text>
        <text x="110" y="132" textAnchor="middle" className="an-ring-small">
          {all.done}/{all.steps} steps
        </text>
      </svg>
      <ul className="an-legend">
        {SECS.map((s) => (
          <li key={s}>
            <i style={{ background: SEC_COLOR[s] }} />
            <b>{s}</b> {SECTION_NAMES[s]} <span>{pct(data.sections[s].done, data.sections[s].steps)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── 📊 topics covered: one bar per recipe, colored by its section ──
function Coverage({ topics }: { topics: TopicStat[] }) {
  const on = useOn();
  return (
    <div className="an-bars">
      {SECS.map((s) => {
        const rows = topics.filter((t) => t.recipe.section === s);
        if (!rows.length) return null;
        return (
          <div key={s} className="an-bar-group">
            <div className="an-bar-sec">
              <i style={{ background: SEC_COLOR[s] }} /> Section {s}
            </div>
            {rows.map((t) => {
              const v = pct(t.done, t.steps);
              return (
                <Link key={t.recipe.id} href={`/recipes#${t.recipe.id}`} className="an-bar-row" {...on(<><b>{t.recipe.name}</b><br />{t.done} of {t.steps} steps · {t.earned}/{t.tried} pts on what you&apos;ve done</>)}>
                  <span className="an-bar-label">
                    {t.recipe.emoji} {t.recipe.name}
                  </span>
                  <span className="an-bar-track">
                    <span className="an-bar-fill" style={{ width: `${v}%`, background: SEC_COLOR[s] }} />
                  </span>
                  <span className="an-bar-val">{v}%</span>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── 🚩 the topics you lose the most on ──
function Misses({ topics }: { topics: TopicStat[] }) {
  const on = useOn();
  const w = weakest(topics);
  if (!w.length) return <p className="an-empty">Nothing yet. Finish a few steps and the topics that trip you up show up here.</p>;
  const max = Math.max(...w.map((t) => Math.max(t.tried - t.earned, 0.5)));
  return (
    <ol className="an-miss">
      {w.map((t, i) => {
        const lost = t.tried - t.earned;
        return (
          <li key={t.recipe.id}>
            <span className="an-miss-rank">{i + 1}</span>
            <div className="an-miss-body">
              <div className="an-miss-head">
                <b>
                  {t.recipe.emoji} {t.recipe.name}
                </b>
                <Link href={`/recipes#${t.recipe.id}`}>🧾 recipe →</Link>
              </div>
              <span className="an-bar-track" {...on(<>lost <b>{+lost.toFixed(1)}</b> of {t.tried} pts · {t.slips} slips over {t.done} steps</>)} tabIndex={0}>
                <span className="an-bar-fill" style={{ width: `${(Math.max(lost, 0.5) / max) * 100}%`, background: "var(--cherry)" }} />
              </span>
              <span className="an-miss-note">
                {t.tried ? `lost ${+lost.toFixed(1)} of ${t.tried} pts` : "no points on the line yet"} · {t.slips} slip{t.slips === 1 ? "" : "s"}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// ── 🔤 the exact words you mix up ──
function Slips({ data }: { data: Data }) {
  const top = data.slips.slice(0, 8);
  if (!top.length) return <p className="an-empty">No wrong words logged yet. When you type one, it lands here.</p>;
  return (
    <ul className="an-slips">
      {top.map((s) => (
        <li key={s.typed + s.want}>
          <code className="bad">{s.typed}</code>
          <span aria-hidden>→</span>
          <span className="sr-only">where it should be</span>
          <code className="good">{s.want}</code>
          <span className="an-slip-n">×{s.n}</span>
        </li>
      ))}
    </ul>
  );
}

// ── 📈 steps finished per day ──
function Line({ days }: { days: Data["days"] }) {
  const on = useOn();
  const W = 900, H = 230, L = 34, Rr = 14, T = 22, B = 30;
  const max = Math.max(4, ...days.map((d) => d.steps));
  const top = Math.ceil(max / 4) * 4;
  const x = (i: number) => L + (i * (W - L - Rr)) / (days.length - 1);
  const y = (v: number) => T + (1 - v / top) * (H - T - B);
  const peak = days.reduce((b, d, i) => (d.steps > days[b].steps ? i : b), 0);
  const label = (d: string) => new Date(d + "T12:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="an-line" role="img" aria-label={`Steps per day, last ${days.length} days. Most: ${days[peak].steps} on ${label(days[peak].day)}.`}>
      {[0, top / 2, top].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - Rr} y1={y(g)} y2={y(g)} stroke="var(--an-grid)" strokeWidth="1" />
          <text x={L - 8} y={y(g) + 4} textAnchor="end" className="an-axis">
            {g}
          </text>
        </g>
      ))}
      <polyline fill="none" stroke="var(--cherry)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={days.map((d, i) => `${x(i)},${y(d.steps)}`).join(" ")} />
      {days.map((d, i) => (
        <g key={d.day} tabIndex={0} {...on(<><b>{label(d.day)}</b><br />{d.steps} step{d.steps === 1 ? "" : "s"}</>)}>
          <circle cx={x(i)} cy={y(d.steps)} r="14" fill="transparent" />
          <circle cx={x(i)} cy={y(d.steps)} r="4.5" fill={d.steps ? "var(--cherry)" : "var(--card)"} stroke={d.steps ? "var(--card)" : "var(--cherry)"} strokeWidth="2" />
          {i % 2 === (days.length - 1) % 2 && (
            <text x={x(i)} y={H - 8} textAnchor="middle" className="an-axis">
              {label(d.day)}
            </text>
          )}
        </g>
      ))}
      {days[peak].steps > 0 && (
        <text x={x(peak)} y={y(days[peak].steps) - 11} textAnchor="middle" className="an-peak">
          {days[peak].steps}
        </text>
      )}
    </svg>
  );
}

// ── 🟠 pictogram: one circle per question ──
function Picto({ exams }: { exams: Data["exams"] }) {
  const on = useOn();
  return (
    <div className="an-picto">
      {exams.map((e) => (
        <div key={e.id} className="an-picto-row">
          <Link href={`/arcade/${e.id}`} className="an-picto-name">
            {e.term}
          </Link>
          <div className="an-picto-dots">
            {e.questions.map((q) => (
              <Link key={q.id} href={`/arcade/${e.id}?q=${q.id}`} className={`an-dot ${q.state}`} {...on(<><b>{e.term} · {q.id}</b><br />{q.state === "done" ? "finished" : q.state === "started" ? "started" : "not started"}</>)} aria-label={`${q.id}: ${q.state}`} />
            ))}
          </div>
        </div>
      ))}
      <div className="an-key">
        Key: <span className="an-dot done" /> finished <span className="an-dot started" /> started <span className="an-dot todo" /> not yet
      </div>
    </div>
  );
}

export default function Analytics() {
  const save = saveStore.use();
  const data = useMemo(() => analyze(ARCADE_EXAMS, save.steps), [save.steps]);
  const { totals } = data;
  const active = data.days.filter((d) => d.steps).length;

  return (
    <>
      <div className="an-tiles">
        <div className="an-tile">
          <b>{totals.done}</b>
          <span>steps done</span>
        </div>
        <div className="an-tile">
          <b>{pct(totals.earned, totals.tried)}%</b>
          <span>of points kept</span>
        </div>
        <div className="an-tile">
          <b>
            {totals.finished}
            <small>/{totals.questions}</small>
          </b>
          <span>questions finished</span>
        </div>
        <div className="an-tile">
          <b>
            {active}
            <small>/{data.days.length}</small>
          </b>
          <span>days active</span>
        </div>
      </div>

      <div className="an-grid">
        <Card title="🎯 Sections covered" sub="Steps finished in each exam section, across every set." className="an-span-1">
          <Rings data={data} />
        </Card>
        <Card title="🚩 Topics you tend to miss" sub="Ranked by points lost, then slips. Read the recipe before the next one." className="an-span-1">
          <Misses topics={data.topics} />
        </Card>
        <Card title="📈 Your last two weeks" sub="Steps finished per day." className="an-span-2">
          <Line days={data.days} />
        </Card>
        <Card title="📊 Topics covered" sub="How much of each topic you've worked through. Tap one for its recipe." className="an-span-2">
          <Coverage topics={data.topics} />
        </Card>
        <Card title="🔤 Words you mix up" sub="What you typed → what goes there." className="an-span-1">
          <Slips data={data} />
        </Card>
        <Card title="🟠 Questions done" sub="One circle per question. Tap one to jump in." className="an-span-1">
          <Picto exams={data.exams} />
        </Card>
      </div>

      <details className="an-table">
        <summary>Show the numbers as a table</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Topic</th>
              <th scope="col">Section</th>
              <th scope="col">Steps done</th>
              <th scope="col">Points kept</th>
              <th scope="col">Slips</th>
            </tr>
          </thead>
          <tbody>
            {data.topics.map((t) => (
              <tr key={t.recipe.id}>
                <td>
                  {t.recipe.emoji} {t.recipe.name}
                </td>
                <td>{t.recipe.section}</td>
                <td>
                  {t.done}/{t.steps}
                </td>
                <td>
                  {+t.earned.toFixed(1)}/{t.tried}
                </td>
                <td>{t.slips}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </>
  );
}
