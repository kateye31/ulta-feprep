"use client";

import { useEffect, useRef, useState } from "react";
import { highlight } from "@/components/Code";
import { getExam } from "@/content/arcade";
import { offlineReply } from "@/lib/arcade/offline-tutor";
import { chatStore, notesStore, setChat, setNote, type ChatMsg } from "@/lib/arcade/store";
import type { Item } from "@/lib/arcade/types";
import type { Recipe } from "@/lib/recipes";
import { RecipeCard } from "@/components/RecipeCard";
import { Peep } from "./Art";
import { inline } from "./Rich";
import { TreeView } from "./TreeView";

// ───────────────────────── inventory ─────────────────────────

export type ScaffoldLine = { text: string; state: "done" | "now" | "todo" | "plain" };

export function Inventory({ items, fresh, scaffold, recipe }: { items: Item[]; fresh: Set<string>; scaffold?: { title: string; lines: ScaffoldLine[] }; recipe?: Recipe }) {
  return (
    <div className="inv-list">
      {scaffold && (
        <div className="icard" style={{ background: "var(--a-paper)" }}>
          <h4>
            <span>{scaffold.title}</span>
            <span>✎ live</span>
          </h4>
          <div className="sc-code">
            {scaffold.lines.map((l, i) => (
              <div key={i} className={`sc-line ${l.state}`}>
                {l.state === "done" || l.state === "plain" ? highlight(l.text) : l.text || " "}
              </div>
            ))}
          </div>
        </div>
      )}
      {items.map((it) => (
        <div key={it.id} className={`icard ${fresh.has(it.id) ? "fresh" : ""}`}>
          <h4>
            <span>{it.title}</span>
            <span>{it.kind === "code" ? "C" : it.kind === "tree" ? "tree" : it.kind === "table" ? "array" : "note"}</span>
          </h4>
          {it.kind === "code" && <pre>{highlight(it.body ?? "")}</pre>}
          {(it.kind === "text" || it.kind === "file") && <div className="txt">{it.body}</div>}
          {it.kind === "tree" && it.tree && <TreeView tree={it.tree} />}
          {it.kind === "table" && it.table && (
            <table>
              <tbody>
                {[it.table.head, ...it.table.rows].map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (i === 0 || j === 0 ? <th key={j}>{c}</th> : <td key={j}>{c}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
      {!items.length && !scaffold && <p className="inv-empty">Nothing in your satchel yet.</p>}
      {recipe && <RecipeCard key={recipe.id} recipe={recipe} remember="fe-recipe-inventory" />}
    </div>
  );
}

// ───────────────────────── notes ─────────────────────────

export function Notes({ id, label }: { id: string; label: string }) {
  const notes = notesStore.use();
  const [scope, setScope] = useState<"q" | "all">("q");
  const key = scope === "q" ? id : "general";
  const saved = notes[key]?.text ?? "";
  const [text, setText] = useState(saved);
  const [status, setStatus] = useState<"" | "saving" | "saved">("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // what's typed but not written yet: { key, text }
  const pending = useRef<{ key: string; text: string } | null>(null);

  const flush = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    setNote(p.key, p.text);
    setStatus("saved");
  };

  // switching question/scope: save what's pending, then load the other note
  useEffect(() => {
    flush();
    setText(notesStore.read()[key]?.text ?? "");
    setStatus("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  // the save file finished syncing (or another tab wrote): show it, unless we're mid-typing
  useEffect(() => {
    if (!pending.current) setText(saved);
  }, [saved]);
  // never lose the last keystrokes when leaving the page
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => flush, []);

  const change = (v: string) => {
    setText(v);
    pending.current = { key, text: v };
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 400);
  };

  return (
    <div>
      <div className="nt-bar">
        <div style={{ display: "flex", gap: 4 }}>
          <button className={`a-btn tiny ${scope === "q" ? "lav" : "ghost"}`} onClick={() => setScope("q")}>
            {label}
          </button>
          <button className={`a-btn tiny ${scope === "all" ? "lav" : "ghost"}`} onClick={() => setScope("all")}>
            General
          </button>
        </div>
        <span className="nt-saved" aria-live="polite">
          {status === "saving" ? "saving…" : status === "saved" ? "✓ saved to your save file" : ""}
        </span>
      </div>
      <textarea
        className="nt-area"
        value={text}
        placeholder={scope === "q" ? "What tripped you up here? What will you remember on exam day?" : "Anything you want to keep: tricks, reminders, questions for office hours…"}
        onChange={(e) => change(e.target.value)}
        onBlur={flush}
        spellCheck
      />
      <p className="a-faint" style={{ fontSize: "0.8rem", marginTop: 10 }}>
        Notes live in <code>data/fe-cafe-save.json</code>, so they&apos;re still here next time you run the site.
      </p>
    </div>
  );
}

// ───────────────────────── tutor chat ─────────────────────────

/** One-time setup: paste a key, the server checks it and saves it to .env.local. */
function ConnectKey({ onDone }: { onDone: () => void }) {
  const [key, setKey] = useState("");
  const [state, setState] = useState<"" | "checking" | "error">("");
  const [msg, setMsg] = useState("");

  const connect = async () => {
    setState("checking");
    setMsg("");
    try {
      const r = await fetch("/api/tutor/key", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key }) });
      const j = await r.json();
      if (!r.ok || !j.connected) throw new Error(j.error ?? "That didn't work.");
      setKey("");
      onDone();
    } catch (e) {
      setState("error");
      setMsg(e instanceof Error ? e.message : "That didn't work.");
    }
  };

  return (
    <form
      className="a-callout"
      style={{ borderStyle: "solid", borderColor: "var(--a-lav)", display: "grid", gap: 10 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (key.trim()) connect();
      }}
    >
      <b style={{ color: "var(--a-ink)" }}>Connect Juni (one time)</b>
      <span>
        Get a key at{" "}
        <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" style={{ color: "var(--a-lav)" }}>
          console.anthropic.com → API Keys ↗
        </a>
        , paste it here, and you&apos;re done. It&apos;s saved only on this computer, in <code>.env.local</code>.
      </span>
      <input
        type="password"
        className="sl-in"
        style={{ textAlign: "left", width: "100%", fontSize: "0.9rem" }}
        placeholder="sk-ant-…"
        value={key}
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => setKey(e.target.value)}
        aria-label="Anthropic API key"
      />
      <button className="a-btn lav small" type="submit" disabled={!key.trim() || state === "checking"} style={{ justifySelf: "start" }}>
        {state === "checking" ? "Checking key…" : "Connect"}
      </button>
      {state === "error" && <span style={{ color: "var(--a-coral)" }}>{msg}</span>}
    </form>
  );
}

export function Tutor({ chatId, context, prefill, onPrefillUsed }: { chatId: string; context: Record<string, unknown>; prefill?: string; onPrefillUsed?: () => void }) {
  const chats = chatStore.use();
  const msgs: ChatMsg[] = chats[chatId]?.msgs ?? [];
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState("");
  const [err, setErr] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefill) {
      setDraft(prefill);
      onPrefillUsed?.();
    }
  }, [prefill, onPrefillUsed]);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [msgs.length, live]);

  // is a key set up yet? (null = still checking)
  const [connected, setConnected] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/tutor/key")
      .then((r) => r.json())
      .then((j) => setConnected(!!j.connected))
      .catch(() => setConnected(false));
  }, []);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const history: ChatMsg[] = [...msgs, { role: "user", content: q }];
    setChat(chatId, history);
    setDraft("");
    await answer(history);
  };

  const [showConnect, setShowConnect] = useState(false);

  /** Offline Juni: answers from the question itself, typed out like a chat. */
  const answerOffline = async (history: ChatMsg[]) => {
    const exam = getExam(String(context.exam));
    const q = exam?.sections.flatMap((s) => s.questions).find((x) => x.id === context.q);
    if (!q) return;
    const step = q.steps.find((s) => s.id === context.step);
    const reply = offlineReply(q, step, String(context.typed ?? ""), history[history.length - 1].content, (context.picked as number[]) ?? []);
    const words = reply.split(/(\s+)/);
    let acc = "";
    for (let i = 0; i < words.length; i += 6) {
      acc += words.slice(i, i + 6).join("");
      setLive(acc);
      await new Promise((r) => setTimeout(r, 35));
    }
    setChat(chatId, [...history, { role: "assistant", content: reply }]);
  };

  /** Juni's reply to a conversation that ends with the student's message */
  const answer = async (history: ChatMsg[]) => {
    setBusy(true);
    setErr("");
    setLive("");
    try {
      if (connected !== true) {
        await answerOffline(history);
        return;
      }
      const r = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...context, messages: history.slice(-20) }) });
      if (!r.ok || !r.body) {
        const j = await r.json().catch(() => ({ error: "The tutor couldn't answer." }));
        if (j.needsKey) {
          setConnected(false);
          await answerOffline(history);
          return;
        }
        throw new Error(j.error ?? "The tutor couldn't answer.");
      }
      const reader = r.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setLive(acc);
      }
      setChat(chatId, [...history, { role: "assistant", content: acc.trim() || "(no answer)" }]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
      setLive("");
    }
  };

  return (
    <div className="tu">
      <div className="tu-intro">
        <Peep who="juni" mood={busy ? "think" : "explain"} size={58} />
        <div style={{ fontSize: "0.9rem" }}>
          <b>Juni</b> <span className="a-faint">· your tutor</span>
          <div className="a-muted">
            Ask anything about this question. I&apos;ll nudge, not spoil.{" "}
            {connected !== true && <span className="a-faint">(Offline mode: no key or internet needed.)</span>}
          </div>
        </div>
      </div>
      {connected === false && !showConnect && (
        <button className="tu-chip" style={{ alignSelf: "flex-start" }} onClick={() => setShowConnect(true)}>
          ✨ Optional: connect an AI key for smarter answers
        </button>
      )}
      {connected === false && showConnect && <ConnectKey onDone={() => setConnected(true)} />}
      <div className="tu-msgs">
        {msgs.map((m, i) => (
          <div key={i} className={`tu-msg ${m.role}`}>
            {m.role === "assistant" ? inline(m.content) : m.content}
          </div>
        ))}
        {busy && <div className="tu-msg assistant">{live ? inline(live) : <span className="tu-typing" aria-label="Juni is typing"><i /><i /><i /></span>}</div>}
        {err && <div className="tu-msg assistant err">{err}</div>}
        {!busy && msgs.length > 0 && msgs[msgs.length - 1].role === "user" && (
          <button className="a-btn tiny ghost" style={{ alignSelf: "flex-start" }} onClick={() => answer(msgs)}>
            ↻ Get Juni&apos;s answer
          </button>
        )}
        <div ref={end} />
      </div>
      {!busy && (
        <div className="tu-chips">
          {["Explain this step simply", "Give me an analogy", "Why is my answer wrong?", "What's the trap here?"].map((c) => (
            <button key={c} className="tu-chip" onClick={() => send(c)}>
              {c}
            </button>
          ))}
        </div>
      )}
      <form
        className="tu-form"
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
      >
        <textarea
          value={draft}
          placeholder="Ask Juni…"
          rows={2}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(draft);
            }
          }}
        />
        <button className="a-btn lav small" disabled={busy || !draft.trim()} type="submit">
          Send
        </button>
      </form>
      {msgs.length > 0 && (
        <button className="a-btn tiny ghost" style={{ alignSelf: "flex-start" }} onClick={() => setChat(chatId, [])}>
          Clear this chat
        </button>
      )}
    </div>
  );
}
