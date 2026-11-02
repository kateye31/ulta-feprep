"use client";

import { IconStar } from "@/components/icons";
import { ymd } from "@/lib/studylog";

/** One month of the planner: studied days get a cherry star stamp, today is sunflower. */
export function Month({
  year,
  month,
  today,
  active,
  onPick,
  selected,
  exam,
  label,
}: {
  year: number;
  month: number;
  today: string;
  active: Set<string>;
  onPick: (d: string) => void;
  selected?: string;
  exam?: string;
  label?: boolean;
}) {
  const first = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  const name = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const cells: (string | null)[] = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => ymd(new Date(year, month, i + 1)))];
  return (
    <div className="month-block">
      {label && <h3 className="month-name">{name}</h3>}
      <div className="month" role="grid" aria-label={name}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="month-head" aria-hidden>
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const n = Number(d.slice(8));
          const on = active.has(d);
          const future = d > today;
          const isExam = d === exam;
          return (
            <button
              key={d}
              role="gridcell"
              className={`month-day ${on ? "on" : ""} ${d === today ? "today" : ""} ${future ? "future" : ""} ${isExam ? "exam" : ""} ${selected === d ? "picked" : ""}`}
              disabled={future && !isExam}
              onClick={() => onPick(d)}
              aria-label={`${d}${on ? ", studied" : ""}${d === today ? ", today" : ""}${isExam ? ", exam day" : ""}`}
              aria-selected={selected === d}
              style={on ? { ["--tilt" as string]: `${((n * 37) % 23) - 11}deg` } : undefined}
            >
              <span className="n">{n}</span>
              {on && <IconStar size={26} className="stamp" />}
              {isExam && <span className="exam-mark">FE</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
