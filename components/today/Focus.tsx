"use client";

import { useState } from "react";
import { IconPause, IconPlay, IconReset } from "@/components/icons";

/** Lofi Girl's live radios (hand-drawn, human-made art). Live stream ids change when a stream restarts. */
export const STREAMS = [
  { id: "rFZHOHl-L8A", label: "Study beats" },
  { id: "0muHFBSiybw", label: "Summer" },
  { id: "3PFJ9SETS4M", label: "Lofi house" },
  { id: "VAlMDl00mYY", label: "Sleepy" },
];
export const DEFAULT_VIDEO = STREAMS[0].id;
const OLD_DEFAULTS = ["jfKfPfyJRdk"];

/** pull a YouTube id out of whatever link gets pasted */
export function videoId(input: string): string | null {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|\/embed\/|\/live\/|\/shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export const fmt = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export function Focus({
  len,
  remaining,
  running,
  phase,
  video,
  todayMinutes,
  onStart,
  onPause,
  onReset,
  onLen,
  onVideo,
}: {
  len: number;
  remaining: number;
  running: boolean;
  phase: "focus" | "break";
  video: string;
  todayMinutes: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLen: (m: number) => void;
  onVideo: (id: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [err, setErr] = useState("");

  return (
    <article className="focus" aria-labelledby="focus-title">
      <div className="focus-timer">
        <h2 id="focus-title" className="focus-phase">
          {phase === "focus" ? "Focus" : "Break"}
        </h2>
        <p className="focus-digits" aria-live="off" role="timer">
          {fmt(remaining)}
        </p>
        <div className="focus-controls">
          {running ? (
            <button className="pill pill-cherry big" onClick={onPause}>
              <IconPause /> Pause
            </button>
          ) : (
            <button className="pill pill-cherry big" onClick={onStart}>
              <IconPlay /> {remaining < (phase === "focus" ? len : 5) * 60000 ? "Resume" : "Start"}
            </button>
          )}
          <button className="pill pill-cream" onClick={onReset} aria-label="Reset the timer">
            <IconReset />
          </button>
        </div>
        <div className="focus-lens" role="group" aria-label="Focus length">
          {[25, 50].map((m) => (
            <button key={m} className={`pill pill-small ${len === m ? "pill-plum" : "pill-cream"}`} onClick={() => onLen(m)} disabled={running}>
              {m} min
            </button>
          ))}
        </div>
        <p className="focus-today">{todayMinutes ? `${todayMinutes} focused minutes today.` : "No focus sessions yet today."}</p>
      </div>

      <div className="focus-video">
        <div className="focus-frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${OLD_DEFAULTS.includes(video) ? DEFAULT_VIDEO : video}?rel=0&modestbranding=1`}
            title="Study video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div className="focus-presets" role="group" aria-label="Lofi Girl radios">
          {STREAMS.map((s) => (
            <button key={s.id} type="button" className={`pill pill-small ${video === s.id ? "pill-plum" : "pill-cream"}`} onClick={() => onVideo(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <form
          className="focus-swap"
          onSubmit={(e) => {
            e.preventDefault();
            const id = videoId(draft);
            if (!id) {
              setErr("That doesn't look like a YouTube link. Paste the whole address from your browser.");
              return;
            }
            setErr("");
            setDraft("");
            onVideo(id);
          }}
        >
          <label htmlFor="video-link" className="solve-label">
            Your own study-with-me video
          </label>
          <div className="solve-row">
            <input id="video-link" className="solve-input" placeholder="paste a YouTube link…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button className="pill pill-cream" type="submit" disabled={!draft.trim()}>
              Use it
            </button>
          </div>
          {err && <p className="solve-say">{err}</p>}
          <p className="focus-tip">Says &quot;video unavailable&quot;? Live streams get new links when they restart. Paste the new one from YouTube.</p>
        </form>
      </div>
    </article>
  );
}
