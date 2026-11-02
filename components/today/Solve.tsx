"use client";

import { useEffect, useRef, useState } from "react";
import { hintFor, judge } from "@/lib/arcade/check";
import { norm } from "@/lib/arcade/score";
import type { Potd } from "@/lib/potd/types";
import { highlight } from "@/components/Code";
import { inline } from "@/components/arcade/Rich";
import { Md } from "@/components/Md";
import { IconArrow, IconBulb, IconCheck, IconShuffle } from "@/components/icons";
import { RisoArt } from "@/components/RisoArt";
import { artTags, topicName } from "@/lib/potd/topics";
import { recipeForTopic } from "@/lib/recipes";
import { RecipeCard } from "@/components/RecipeCard";

export { artTags, topicName };

type Status = "idle" | "wrong" | "right" | "revealed";

export function Solve({
  problem,
  isToday,
  prior,
  onResult,
  onFocus,
  onAnother,
}: {
  problem: Potd;
  isToday: boolean;
  /** already answered earlier today: open straight to the walkthrough */
  prior?: { ok: boolean; tries: number; revealed?: boolean };
  onResult: (r: { ok: boolean; tries: number; revealed: boolean }) => void;
  onFocus: () => void;
  onAnother: () => void;
}) {
  const [text, setText] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const [tries, setTries] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [say, setSay] = useState("");
  const [hint, setHint] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const done = status === "right" || status === "revealed";
  const recipe = recipeForTopic(problem.topic);

  useEffect(() => {
    setText("");
    setPicked([]);
    setTries(prior?.tries ?? 0);
    setStatus(prior ? (prior.revealed ? "revealed" : "right") : "idle");
    setSay("");
    setHint(false);
    if (!prior) input.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem.id]);

  const finish = (ok: boolean, revealed: boolean, n: number) => {
    setStatus(revealed ? "revealed" : "right");
    onResult({ ok, tries: n, revealed });
  };

  const check = () => {
    if (done || !text.trim()) return;
    const answers = problem.answers ?? [];
    const ok = answers.some((a) => norm(a) === norm(text)) || (problem.kind === "code" && judge(text, answers, { settled: true }).state === "done");
    const n = tries + 1;
    setTries(n);
    if (ok) {
      setSay("");
      finish(true, false, n);
      return;
    }
    setStatus("wrong");
    if (problem.kind === "code") {
      const v = judge(text, answers, { settled: true });
      setSay(v.state === "wrong" ? hintFor(v).say : v.state === "typing" ? "Everything so far is right. It just isn't finished yet." : "Not quite yet.");
    } else setSay(n === 1 ? "Not quite. Take the hint, or redraw it on paper first." : "Still not it. You can open the walkthrough whenever you're ready.");
  };

  const choose = (i: number) => {
    if (done || picked.includes(i) || !problem.choices) return;
    const c = problem.choices[i];
    const next = [...picked, i];
    setPicked(next);
    const n = tries + 1;
    setTries(n);
    if (c.ok) {
      setSay(c.why);
      finish(n === 1, false, n);
    } else {
      setStatus("wrong");
      setSay(c.why);
    }
  };

  const reveal = () => {
    setSay("");
    finish(false, true, tries);
  };

  return (
    <article className="solve" aria-labelledby="solve-title">
      <div className="solve-body">
        <div className="solve-q">
          <h2 id="solve-title">{problem.title}</h2>
          <p className="solve-topic">
            {topicName(problem.topic)} · {"★".repeat(problem.level)}
            <span className="dim">{"★".repeat(3 - problem.level)}</span>
          </p>
          <p className="solve-prompt">{inline(problem.prompt)}</p>
          {problem.code && (
            <pre className="solve-code">
              <code>{highlight(problem.code)}</code>
            </pre>
          )}
        </div>
        <RisoArt tags={artTags(problem.topic)} seed={problem.id} ink="cherry" className="solve-art" />
      </div>

      {problem.kind === "choice" ? (
        <div className="solve-choices" role="group" aria-labelledby="choices-label">
          <p id="choices-label" className="solve-label">
            Pick one
          </p>
          {problem.choices!.map((c, i) => {
            const st = picked.includes(i) ? (c.ok ? "right" : "wrong") : done && c.ok ? "right" : "";
            return (
              <button key={i} className={`solve-choice ${st}`} disabled={done || picked.includes(i)} onClick={() => choose(i)}>
                <span className="key">{"ABCDE"[i]}</span>
                <span>{inline(c.t)}</span>
                {st === "wrong" && <span className="choice-mark">not this one</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="solve-answer">
          <label htmlFor="solve-input" className="solve-label">
            {problem.kind === "code" ? "Write the line" : problem.kind === "trace" ? "What does it give?" : "Your answer"}
          </label>
          <div className="solve-row">
            <textarea
              id="solve-input"
              ref={input}
              className={`solve-input ${status === "wrong" ? "bad" : ""} ${done ? "good" : ""}`}
              rows={problem.kind === "code" ? 2 : 1}
              value={done && status === "revealed" ? (problem.answers ?? [""])[0] : text}
              readOnly={done}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              data-gramm="false"
              placeholder={problem.kind === "code" ? "type the line of C…" : "type your answer…"}
              onChange={(e) => {
                setText(e.target.value);
                if (status === "wrong") setStatus("idle");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  check();
                }
              }}
            />
            {!done && (
              <button className="pill pill-cherry" onClick={check} disabled={!text.trim()}>
                Check <IconCheck size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="solve-feedback" aria-live="polite">
        {say && <p className={`solve-say ${status === "right" ? "ok" : ""}`}>{inline(say)}</p>}
        {status === "right" && <p className="solve-say ok">{tries <= 1 ? "First try. That's the one that counts on paper. 🎉" : `Got it in ${tries} tries. 🌱`}</p>}
      </div>

      {!done && (
        <div className="solve-tools">
          {hint ? (
            <p className="solve-hint">
              <IconBulb size={20} /> {inline(problem.hint)}
            </p>
          ) : (
            <button className="pill pill-cream" onClick={() => setHint(true)}>
              <IconBulb size={20} /> Hint
            </button>
          )}
          {tries >= 2 && (
            <button className="pill pill-cream" onClick={reveal}>
              Show the walkthrough
            </button>
          )}
        </div>
      )}

      {done && (
        <section className="solve-explain" aria-label="Walkthrough">
          <Md text={problem.explain} className="md" />
          <p className="solve-miss">
            <b>What people miss:</b> {inline(problem.miss)}
          </p>
          {problem.source && (
            <p className="solve-source">
              Based on {problem.source.url ? <a href={problem.source.url} target="_blank" rel="noreferrer">{problem.source.label}</a> : problem.source.label}
            </p>
          )}
          <div className="solve-next">
            {isToday && (
              <button className="pill pill-cherry" onClick={onFocus}>
                Start a focus session <IconArrow size={20} />
              </button>
            )}
            <button className="pill pill-cream" onClick={onAnother}>
              <IconShuffle size={20} /> One more problem
            </button>
          </div>
        </section>
      )}

      {recipe && (
        <div className="solve-recipe">
          <RecipeCard key={recipe.id} recipe={recipe} open={false} remember="fe-recipe-today" />
        </div>
      )}
    </article>
  );
}
