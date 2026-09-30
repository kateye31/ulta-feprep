"use client";

import { useEffect, useRef, useState } from "react";

export type TLine = { kind: "cmd" | "out" | "err" | "warn" | "ok" | "info" | "dim" | "hint"; text: string; line?: number };

type Props = {
  lines: TLine[];
  prompt: string;
  busy: boolean;
  onCommand: (cmd: string) => void;
  onJump: (line: number) => void;
};

export default function Terminal({ lines, prompt, busy, onCommand, onJump }: Props) {
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [lines, busy]);

  const submit = () => {
    const cmd = input;
    setInput("");
    setHi(-1);
    if (cmd.trim()) setHist((h) => [...h.slice(-49), cmd]);
    onCommand(cmd);
  };

  return (
    <div className="term" ref={box} onClick={(e) => (e.target as HTMLElement).tagName !== "BUTTON" && window.getSelection()?.isCollapsed && field.current?.focus()} data-lenis-prevent>
      {lines.map((l, i) =>
        l.kind === "cmd" ? (
          <div key={i} className="term-line">
            <span className="term-prompt">{l.line === undefined ? prompt : ""}</span>
            {l.text}
          </div>
        ) : (
          <div key={i} className={`term-line t-${l.kind}`}>
            {l.line ? (
              <button className="term-jump" onClick={() => onJump(l.line!)} title={`Jump to line ${l.line}`}>
                {l.text}
              </button>
            ) : (
              l.text
            )}
          </div>
        ),
      )}
      {busy ? (
        <div className="term-line t-dim">
          <span className="term-spin">🍳</span> cooking your code on gcc…
        </div>
      ) : (
        <div className="term-line term-input-row">
          <span className="term-prompt">{prompt}</span>
          <input
            ref={field}
            className="term-input"
            value={input}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal command"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "ArrowUp" && hist.length) {
                e.preventDefault();
                const k = hi === -1 ? hist.length - 1 : Math.max(0, hi - 1);
                setHi(k);
                setInput(hist[k]);
              }
              if (e.key === "ArrowDown" && hi !== -1) {
                e.preventDefault();
                const k = hi + 1;
                if (k >= hist.length) {
                  setHi(-1);
                  setInput("");
                } else {
                  setHi(k);
                  setInput(hist[k]);
                }
              }
              if (e.key === "l" && e.ctrlKey) {
                e.preventDefault();
                onCommand("clear");
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
