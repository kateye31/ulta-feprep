"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fillOne, hintFor, judge, nextWord, tokenize, type Verdict } from "@/lib/arcade/check";
import { slotPoints, slotRight, typePoints } from "@/lib/arcade/score";
import type { StepRec } from "@/lib/arcade/store";
import type { ChoiceStep, InfoStep, Mood, SlotsStep, Step, TypeStep } from "@/lib/arcade/types";
import { inline } from "./Rich";
import { TreeView } from "./TreeView";

export type StepProps<S extends Step> = {
  step: S;
  rec: StepRec | undefined;
  patch: (p: Partial<StepRec>) => void;
  finish: (p: Partial<StepRec>) => void;
  say: (text: string, mood?: Mood, sticky?: boolean) => void;
  ask: (q: string) => void;
};

const KEYS = ["A", "B", "C", "D", "E"];

// ───────────────────────── multiple choice ─────────────────────────

export function ChoiceView({ step, rec, patch, finish, say }: StepProps<ChoiceStep>) {
  const picked = rec?.picked ?? [];
  const [shake, setShake] = useState(-1);
  const done = !!rec?.done;

  const pick = (i: number) => {
    if (done || picked.includes(i)) return;
    const o = step.options[i];
    const next = [...picked, i];
    if (o.ok) {
      const firstTry = !rec?.tries;
      finish({ picked: next, pts: firstTry ? step.pts ?? 0 : 0 });
      say(o.why, firstTry ? "proud" : "happy");
    } else {
      patch({ picked: next, tries: (rec?.tries ?? 0) + 1 });
      setShake(i);
      setTimeout(() => setShake(-1), 450);
      say(o.why, "worry", true);
    }
  };

  // number keys 1–5 pick an option
  useEffect(() => {
    if (done) return;
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (el && /^(INPUT|TEXTAREA)$/.test(el.tagName)) return;
      const n = Number(e.key) - 1;
      if (n >= 0 && n < step.options.length) pick(n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="ch-list" role="group" aria-label="Choices">
      {step.options.map((o, i) => {
        const state = picked.includes(i) ? (o.ok ? "right" : "wrong") : done && o.ok ? "right" : "";
        return (
          <button key={i} className={`ch-opt ${step.mono ? "mono" : ""} ${state} ${shake === i ? "shake" : ""}`} disabled={done || picked.includes(i)} onClick={() => pick(i)}>
            <span className="key">{KEYS[i]}</span>
            <span className="txt">{inline(o.t)}</span>
          </button>
        );
      })}
    </div>
  );
}

// ───────────────────────── type it yourself ─────────────────────────

export function TypeView({ step, rec, patch, finish, say, ask }: StepProps<TypeStep>) {
  const done = !!rec?.done;
  const [text, setText] = useState(rec?.text ?? "");
  const [settled, setSettled] = useState(false);
  const [showLen, setShowLen] = useLenDots();
  const fills = rec?.fills ?? 0;
  const miss = useRef<Record<string, string[]>>(rec?.miss ?? {});
  const lastWrong = useRef("");
  const box = useRef<HTMLTextAreaElement>(null);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);

  const v: Verdict = useMemo(() => judge(text, step.answers, { loose: step.loose, settled }), [text, step, settled]);

  // grow the textarea with its content
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [text]);

  useEffect(() => {
    if (!done) box.current?.focus({ preventScroll: true });
  }, [done]);

  // react to the verdict: finish, hint, or fill in one word after two misses
  useEffect(() => {
    if (done) return;
    if (v.state === "done") {
      const pts = typePoints(step, fills);
      finish({ text, pts, fills, miss: miss.current });
      say(fills ? "There it is! Every line you finish makes the next one easier." : PRAISE[Math.floor(Math.random() * PRAISE.length)], "proud");
      return;
    }
    if (v.state !== "wrong") return;
    const key = `${v.at}:${v.typed.t}`;
    if (key === lastWrong.current) return;
    lastWrong.current = key;
    const seen = miss.current[v.at] ?? [];
    if (!seen.includes(v.typed.t)) miss.current = { ...miss.current, [v.at]: [...seen, v.typed.t] };
    const count = miss.current[v.at].length;
    if (count >= 2 && v.want != null) {
      const fixed = fillOne(text, v);
      setText(fixed);
      setSettled(false);
      lastWrong.current = "";
      patch({ text: fixed, fills: fills + 1, miss: miss.current });
      say(`Let me fill in just this bit for you: \`${v.want}\`. Keep going from there!`, "calm", true);
      requestAnimationFrame(() => {
        const el = box.current;
        if (el) {
          el.focus();
          el.setSelectionRange(fixed.length, fixed.length);
        }
      });
    } else {
      patch({ miss: miss.current });
      const h = hintFor(v, step.hints, step.nudge);
      say(h.say, h.mood, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v]);

  const onChange = (val: string) => {
    setText(val);
    setSettled(false);
    patch({ text: val });
    if (idle.current) clearTimeout(idle.current);
    // pausing for a few seconds counts as "I'm done with this word"
    idle.current = setTimeout(() => setSettled(true), 2600);
  };
  useEffect(() => () => void (idle.current && clearTimeout(idle.current)), []);

  const giveNext = () => {
    const next = nextWord(text, step.answers, step.loose);
    setText(next);
    setSettled(false);
    lastWrong.current = "";
    patch({ text: next, fills: fills + 1 });
    say("Here's the next piece. Read it out loud and think about *why* it goes there.", "explain");
    box.current?.focus();
  };

  // live word chips under the input
  const typed = tokenize(text).filter((t) => !(step.loose && t.t === ","));
  const total = v.state === "empty" ? tokenize(step.answers[0]).filter((t) => !(step.loose && t.t === ",")).length : v.state === "done" ? v.total : v.total;
  const good = v.state === "done" ? typed.length : v.state === "empty" ? 0 : v.matched;

  return (
    <div>
      <div className="ty-box">
        <span className="ty-prompt" aria-hidden>
          ›
        </span>
        <textarea
          ref={box}
          className={`ty-input ${v.state === "wrong" ? "bad" : ""} ${done ? "good" : ""}`}
          value={done ? rec?.text ?? text : text}
          rows={1}
          readOnly={done}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          aria-label={step.title}
          placeholder={step.placeholder ?? "type it here…"}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              setSettled(true);
            }
          }}
        />
      </div>
      <div className="ty-strip" aria-live="polite">
        {typed.map((t, i) => (
          <span key={i} className={`ty-tok ${i < good ? "" : v.state === "wrong" && i === v.at ? "bad" : "pending"}`}>
            {t.t}
          </span>
        ))}
        {showLen ? (
          <button type="button" className="ty-dots" onClick={() => setShowLen(false)} title={`${good} of ${total} pieces · click to hide`} aria-label={`${good} of ${total} pieces correct. Hide the answer length`}>
            {Array.from({ length: Math.min(total, 40) }, (_, i) => (
              <i key={i} className={i < good ? "on" : ""} />
            ))}
          </button>
        ) : (
          <button type="button" className="ty-dots-peek" onClick={() => setShowLen(true)} title="Show how long the answer is" aria-label="Show how long the answer is">
            •••
          </button>
        )}
      </div>
      {!done && (
        <div className="st-actions">
          <button className="a-btn small ghost" onClick={() => setSettled(true)} title="Enter">
            Check ⏎
          </button>
          <button className="a-btn small ghost" onClick={giveNext}>
            Show me the next piece
          </button>
          <button className="a-btn small ghost" onClick={() => ask(`I'm stuck on this step: "${step.prompt.replace(/\n+/g, " ")}". So far I typed: ${text || "(nothing yet)"}`)}>
            Ask Juni
          </button>
          {fills > 0 && <span className="a-faint" style={{ fontSize: "0.82rem" }}>{fills} piece{fills > 1 ? "s" : ""} filled in</span>}
        </div>
      )}
    </div>
  );
}

/** The dots under the box give away how long the answer is, so they start hidden. The choice is remembered. */
const LEN_KEY = "fe-arcade-show-length";
function useLenDots(): [boolean, (v: boolean) => void] {
  const [on, setOn] = useState(false);
  useEffect(() => {
    try {
      setOn(localStorage.getItem(LEN_KEY) === "1");
    } catch {}
  }, []);
  const set = (v: boolean) => {
    setOn(v);
    try {
      localStorage.setItem(LEN_KEY, v ? "1" : "0");
    } catch {}
  };
  return [on, set];
}

const PRAISE = [
  "Yes!! Typed it all by yourself. That's exactly what the grader wants to see.",
  "Look at you! Clean line, no help.",
  "Perfect. Your hands are learning this, not just your eyes.",
  "Nailed it. Write it like that on exam day.",
];

// ───────────────────────── fill in the boxes ─────────────────────────

export function SlotsView({ step, rec, patch, finish, say }: StepProps<SlotsStep>) {
  const done = !!rec?.done;
  const [vals, setVals] = useState<Record<string, string>>(rec?.slots ?? {});
  const [marks, setMarks] = useState<Record<string, "ok" | "bad" | undefined>>(() =>
    done ? Object.fromEntries(step.slots.map((s) => [s.id, "ok" as const])) : {},
  );
  const tries = rec?.tries ?? 0;
  const [firstPts, setFirstPts] = useState<number | null>(rec?.pts ?? null);

  const set = (id: string, v: string) => {
    const next = { ...vals, [id]: v };
    setVals(next);
    setMarks((m) => ({ ...m, [id]: undefined }));
    patch({ slots: next });
  };

  const check = () => {
    const m = Object.fromEntries(step.slots.map((s) => [s.id, slotRight(s.answer, vals[s.id] ?? "") ? ("ok" as const) : ("bad" as const)]));
    setMarks(m);
    const fp = firstPts ?? slotPoints(step, vals);
    if (firstPts == null) setFirstPts(fp);
    const wrong = step.slots.filter((s) => m[s.id] === "bad").length;
    if (!wrong) {
      finish({ slots: vals, pts: fp });
      say(tries ? "All boxes right now. Nice recovery!" : "Every box right on the first check!", "proud");
    } else {
      patch({ slots: vals, tries: tries + 1, pts: fp });
      say(
        wrong === 1 ? "Just one box is off. Find the red one and re-think it." : `${wrong} boxes aren't right yet (they're the red ones). Take another look${step.slots.some((s) => !s.answer) ? ", and remember some boxes may stay empty" : ""}.`,
        "think",
        true,
      );
    }
  };

  const reveal = () => {
    const all = Object.fromEntries(step.slots.map((s) => [s.id, Array.isArray(s.answer) ? s.answer[0] : s.answer]));
    setVals(all);
    setMarks(Object.fromEntries(step.slots.map((s) => [s.id, "ok" as const])));
    finish({ slots: all, pts: firstPts ?? 0 });
    say("Here are the answers. Study the boxes you missed, then try saying *why* each one is right.", "calm");
  };

  const input = (id: string, w?: number, label?: string) => {
    const slot = step.slots.find((s) => s.id === id)!;
    return (
      <input
        key={id}
        className={`sl-in ${marks[id] ?? ""}`}
        value={vals[id] ?? ""}
        disabled={done}
        autoComplete="off"
        spellCheck={false}
        aria-label={label ?? slot.label ?? id}
        style={w ? { width: `${w + 2}ch` } : undefined}
        onChange={(e) => set(id, e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !done && check()}
      />
    );
  };

  return (
    <div>
      {step.layout === "row" && (
        <div className="sl-row">
          {step.slots.map((s) => (
            <span key={s.id} style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              {s.label && <span className="lbl">{s.label}</span>}
              {input(s.id, s.w ?? 4)}
              {s.after && <span className="lbl">{s.after}</span>}
            </span>
          ))}
        </div>
      )}
      {step.layout === "array" && (
        <div className="sl-array">
          {step.slots.map((s, i) => (
            <div className="cell" key={s.id}>
              <span className="idx">{step.index?.[i] ?? i}</span>
              {input(s.id, undefined, `index ${step.index?.[i] ?? i}`)}
            </div>
          ))}
        </div>
      )}
      {step.layout === "stacks" && (
        <div className="sl-stacks" style={{ paddingBottom: 30 }}>
          {step.stacks?.map(([label, ids]) => (
            <div key={label}>
              <div className="sl-stack-hint">↑ top</div>
              <div className="sl-stack">
                {ids.map((id, i) => input(id, 3, `stack ${label}, position ${i + 1} from the bottom`))}
                <span className="sl-stack-label">{label}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {step.layout === "tree" && step.tree && <TreeView tree={step.tree} values={vals} onChange={set} marks={marks} locked={done} />}
      {!done && (
        <div className="st-actions">
          <button className="a-btn small" onClick={check}>
            Check
          </button>
          {tries >= 2 && (
            <button className="a-btn small ghost" onClick={reveal}>
              Show me the answers
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ───────────────────────── info ─────────────────────────

export function InfoView({ step, rec, finish }: StepProps<InfoStep>) {
  if (rec?.done) return null;
  return (
    <div className="st-actions">
      <button className="a-btn small" onClick={() => finish({ pts: 0 })}>
        {step.button ?? "Got it"}
      </button>
    </div>
  );
}
