"use client";

import { useMemo, useState } from "react";

type Frame = { tok: string; stack: string[]; out: string[]; msg: string };

const PREC: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2, "^": 3 };
const isOp = (t: string) => t in PREC;

function tokenize(s: string) {
  return s.match(/\d+|[A-Za-z]|[-+*/%^()]/g) ?? [];
}

function evalFrames(expr: string): Frame[] {
  const toks = expr.trim().split(/\s+/).filter(Boolean);
  const st: string[] = [];
  const frames: Frame[] = [];
  for (const t of toks) {
    if (/^-?\d+$/.test(t)) {
      st.push(t);
      frames.push({ tok: t, stack: [...st], out: [], msg: `🔢 ${t} is a number, so push it.` });
    } else if (isOp(t)) {
      if (st.length < 2) {
        frames.push({ tok: t, stack: [...st], out: [], msg: `💥 Need 2 numbers for "${t}" but the stack has ${st.length}. Invalid postfix!` });
        return frames;
      }
      const b = +st.pop()!;
      const a = +st.pop()!;
      let r: number;
      switch (t) {
        case "+": r = a + b; break;
        case "-": r = a - b; break;
        case "*": r = a * b; break;
        case "/": r = b === 0 ? NaN : Math.trunc(a / b); break;
        case "%": r = a % b; break;
        default: r = a ** b;
      }
      st.push(String(r));
      frames.push({ tok: t, stack: [...st], out: [], msg: `🧮 Operator! Pop ${b} (that's the RIGHT side), pop ${a} (LEFT side). ${a} ${t} ${b} = ${r}. Push ${r}.` });
    } else {
      frames.push({ tok: t, stack: [...st], out: [], msg: `🤷 "${t}" isn't a number or operator. Put spaces between tokens, like 3 4 +` });
      return frames;
    }
  }
  frames.push({
    tok: "✓",
    stack: [...st],
    out: [],
    msg: st.length === 1 ? `🎉 End of input. The one thing left on the stack, ${st[0]}, is the answer!` : `😬 End of input but ${st.length} things are left, so this postfix was invalid.`,
  });
  return frames;
}

function convertFrames(expr: string): Frame[] {
  const st: string[] = [];
  const out: string[] = [];
  const frames: Frame[] = [];
  for (const t of tokenize(expr)) {
    if (/^\w+$/.test(t)) {
      out.push(t);
      frames.push({ tok: t, stack: [...st], out: [...out], msg: `🍓 Operand ${t} goes straight to the output.` });
    } else if (t === "(") {
      st.push(t);
      frames.push({ tok: t, stack: [...st], out: [...out], msg: "🫧 Open paren: always push it. It acts like a wall." });
    } else if (t === ")") {
      const popped: string[] = [];
      while (st.length && st[st.length - 1] !== "(") {
        popped.push(st.pop()!);
        out.push(popped[popped.length - 1]);
      }
      st.pop();
      frames.push({ tok: t, stack: [...st], out: [...out], msg: `🫧 Close paren: pop to output until we hit "(" ${popped.length ? `(popped ${popped.join(" ")})` : ""}, then throw both parens away.` });
    } else {
      const popped: string[] = [];
      while (st.length && isOp(st[st.length - 1]) && (PREC[st[st.length - 1]] > PREC[t] || (PREC[st[st.length - 1]] === PREC[t] && t !== "^"))) {
        popped.push(st.pop()!);
        out.push(popped[popped.length - 1]);
      }
      st.push(t);
      frames.push({
        tok: t,
        stack: [...st],
        out: [...out],
        msg: popped.length
          ? `👑 "${t}": first pop anything on top with HIGHER or EQUAL priority (${popped.join(" ")}), then push "${t}".`
          : `👑 "${t}": nothing on top outranks it, so just push it.`,
      });
    }
  }
  const rest = [...st].reverse().filter((x) => x !== "(");
  out.push(...rest);
  frames.push({ tok: "✓", stack: [], out: [...out], msg: `🎉 End of input: pop everything left${rest.length ? ` (${rest.join(" ")})` : ""}. Postfix = ${out.join(" ")}` });
  return frames;
}

export default function PostfixLab() {
  const [mode, setMode] = useState<"eval" | "conv">("conv");
  const [expr, setExpr] = useState("A + B * (C - D) / E");
  const [i, setI] = useState(0);
  const frames = useMemo(() => (mode === "eval" ? evalFrames(expr) : convertFrames(expr)), [mode, expr]);
  const f = i > 0 ? frames[i - 1] : null;

  const switchMode = (m: "eval" | "conv") => {
    setMode(m);
    setExpr(m === "eval" ? "7 3 4 + 2 * -" : "A + B * (C - D) / E");
    setI(0);
  };

  return (
    <div className="widget">
      <div className="widget-title">🧪 Postfix Potion Lab</div>
      <div className="widget-sub">The FE loves this: convert infix → postfix, or evaluate postfix, showing the stack as you go.</div>
      <div className="controls">
        <button className={`btn small ${mode === "conv" ? "" : "secondary"}`} onClick={() => switchMode("conv")}>Infix → Postfix</button>
        <button className={`btn small ${mode === "eval" ? "" : "secondary"}`} onClick={() => switchMode("eval")}>Evaluate Postfix</button>
      </div>
      <div className="controls">
        <input className="input mono" style={{ width: "min(100%, 340px)" }} value={expr} onChange={(e) => { setExpr(e.target.value); setI(0); }} aria-label="Expression" />
        <button className="btn small secondary" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>◀</button>
        <button className="btn small" onClick={() => setI(Math.min(frames.length, i + 1))} disabled={i >= frames.length}>Step ▶</button>
        <button className="btn small secondary" onClick={() => setI(frames.length)}>⏭ End</button>
        <button className="btn small secondary" onClick={() => setI(0)}>↺</button>
      </div>
      <div className="stage" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "end" }}>
        <div>
          <div className="muted" style={{ fontSize: "0.8rem", fontWeight: 800 }}>stack</div>
          <div style={{ display: "flex", flexDirection: "column-reverse", gap: 4, minHeight: 150, width: 80, borderLeft: "3px solid var(--ink)", borderRight: "3px solid var(--ink)", borderBottom: "3px solid var(--ink)", borderRadius: "0 0 14px 14px", padding: 6 }}>
            {(f?.stack ?? []).map((s, k, arr) => (
              <div key={k} className="cell" style={{ width: "100%", height: 32, background: k === arr.length - 1 ? "var(--butter)" : undefined, color: k === arr.length - 1 ? "#2c1d42" : undefined }}>{s}</div>
            ))}
          </div>
        </div>
        <div>
          <div className="muted" style={{ fontSize: "0.8rem", fontWeight: 800 }}>reading token</div>
          <div className="mono" style={{ fontSize: "1.05rem", marginBottom: 10, wordBreak: "break-word" }}>
            {(mode === "eval" ? expr.trim().split(/\s+/) : tokenize(expr)).map((t, k) => (
              <span key={k} style={{ padding: "2px 5px", borderRadius: 6, background: k === i - 1 ? "var(--butter)" : k < i - 1 ? "var(--matcha-soft)" : undefined, color: k === i - 1 ? "#2c1d42" : undefined, marginRight: 2 }}>{t}</span>
            ))}
          </div>
          {mode === "conv" && (
            <>
              <div className="muted" style={{ fontSize: "0.8rem", fontWeight: 800 }}>output</div>
              <div className="mono" style={{ fontSize: "1.2rem", fontWeight: 800, minHeight: 30 }}>{f?.out.join(" ") || "…"}</div>
            </>
          )}
        </div>
      </div>
      <div className="log" aria-live="polite">{f ? f.msg : "Press Step ▶ to read the first token."}</div>
    </div>
  );
}
