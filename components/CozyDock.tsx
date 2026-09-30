"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Mochi } from "./characters";

type Mode = { id: string; label: string; mins: number; msg: string };
const MODES: Mode[] = [
  { id: "brew", label: "☕ Brew", mins: 25, msg: "Focus brew time. One topic, one cup." },
  { id: "sip", label: "🍪 Sip break", mins: 5, msg: "Stretch, drink water, look out a window 🌿" },
  { id: "nap", label: "😴 Cozy rest", mins: 15, msg: "Long break! You earned a snack." },
];

function chime() {
  try {
    const ctx = new AudioContext();
    [880, 1175, 1568].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.18);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + i * 0.18 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 1.4);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.18);
      o.stop(ctx.currentTime + i * 0.18 + 1.5);
    });
  } catch {}
}

/** Soft rain made from filtered brown noise, no audio files needed. */
function useRain() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [on, setOn] = useState(false);
  const [vol, setVol] = useState(0.35);

  const start = () => {
    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        d[i] = last * 3.5 + white * 0.04 * (Math.random() < 0.002 ? 8 : 1);
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1400;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 120;
    const g = ctx.createGain();
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 1.5);
    src.connect(lp).connect(hp).connect(g).connect(ctx.destination);
    src.start();
    gainRef.current = g;
    ctx.resume();
    setOn(true);
  };

  const stop = () => {
    const ctx = ctxRef.current;
    const g = gainRef.current;
    if (ctx && g) {
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
      setTimeout(() => ctx.suspend().then(() => ctx.close()), 900);
    }
    ctxRef.current = null;
    gainRef.current = null;
    setOn(false);
  };

  useEffect(() => {
    if (gainRef.current && ctxRef.current) gainRef.current.gain.linearRampToValueAtTime(vol, ctxRef.current.currentTime + 0.2);
  }, [vol]);

  return { on, toggle: () => (on ? stop() : start()), vol, setVol };
}

export default function CozyDock() {
  const [panel, setPanel] = useState<"timer" | "rain" | null>(null);
  const [mode, setMode] = useState<Mode>(MODES[0]);
  const [left, setLeft] = useState(MODES[0].mins * 60);
  const [running, setRunning] = useState(false);
  const [focus, setFocus] = useState(false);
  const [done, setDone] = useState(0);
  const rain = useRain();

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          chime();
          confetti({ particleCount: 90, spread: 70, origin: { x: 0.9, y: 0.9 }, colors: ["#f2c95f", "#7fae74", "#ec9f9f", "#86c3d7"] });
          if (mode.id === "brew") setDone((d) => d + 1);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode.id]);

  const origTitle = useRef("");
  useEffect(() => {
    if (running) {
      if (!origTitle.current) origTitle.current = document.title;
      document.title = `${fmt(left)} ☕ ${origTitle.current}`;
    } else if (origTitle.current) {
      document.title = origTitle.current;
      origTitle.current = "";
    }
  }, [left, running]);

  useEffect(() => {
    document.documentElement.dataset.focus = String(focus);
  }, [focus]);

  const pick = (m: Mode) => {
    setMode(m);
    setLeft(m.mins * 60);
    setRunning(false);
  };

  const total = mode.mins * 60;
  const pct = 1 - left / total;
  const R = 62;
  const C = 2 * Math.PI * R;

  return (
    <div className="dock">
      {panel === "timer" && (
        <div className="dock-panel pop-in" role="dialog" aria-label="Brew timer">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
            {MODES.map((m) => (
              <button key={m.id} className="chip" style={{ cursor: "pointer", background: m.id === mode.id ? "var(--butter)" : undefined, color: m.id === mode.id ? "#2c1d42" : undefined }} onClick={() => pick(m)}>
                {m.label}
              </button>
            ))}
          </div>
          <svg className="timer-ring" viewBox="0 0 150 150" aria-hidden>
            <circle cx="75" cy="75" r={R} fill="none" stroke="var(--line)" strokeWidth="10" />
            <circle cx="75" cy="75" r={R} fill="none" stroke="var(--accent)" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 75 75)" style={{ transition: "stroke-dashoffset 1s linear" }} />
            <foreignObject x="35" y="30" width="80" height="80">
              <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
                <Mochi size={70} />
              </div>
            </foreignObject>
          </svg>
          <div className="timer-face" aria-live="polite">{fmt(left)}</div>
          <p className="muted center" style={{ fontSize: "0.9rem", margin: "0 0 10px" }}>
            {left === 0 ? "Ding! ✨ Timer's done. Great job!" : mode.msg}
          </p>
          <div className="controls" style={{ justifyContent: "center" }}>
            <button className="btn small" onClick={() => (left === 0 ? pick(mode) : setRunning(!running))}>
              {running ? "⏸ Pause" : left === 0 ? "↺ Again" : "▶ Start"}
            </button>
            <button className="btn small secondary" onClick={() => pick(mode)}>↺ Reset</button>
          </div>
          <p className="center muted" style={{ fontSize: "0.85rem", margin: 0 }}>
            Cups brewed today: {done > 0 ? "☕".repeat(Math.min(done, 8)) : "none yet"}
          </p>
        </div>
      )}
      {panel === "rain" && (
        <div className="dock-panel pop-in" role="dialog" aria-label="Rain sounds">
          <strong>🌧 Rainy window</strong>
          <p className="muted" style={{ fontSize: "0.9rem" }}>Soft rain on the café window. Background noise can help ADHD brains focus.</p>
          <button className="btn small" onClick={rain.toggle}>{rain.on ? "⏹ Stop rain" : "▶ Start rain"}</button>
          <label style={{ display: "block", marginTop: 12, fontSize: "0.9rem", fontWeight: 700 }}>
            Volume
            <input className="range" type="range" min={0} max={1} step={0.01} value={rain.vol} onChange={(e) => rain.setVol(+e.target.value)} />
          </label>
        </div>
      )}
      <div className="dock-bar" role="toolbar" aria-label="Cozy study tools">
        <button className="icon-btn" aria-pressed={panel === "timer"} onClick={() => setPanel(panel === "timer" ? null : "timer")} title="Brew timer (pomodoro)" aria-label="Brew timer">
          {running ? "⏳" : "🍅"}
        </button>
        <button className="icon-btn" aria-pressed={panel === "rain" || rain.on} onClick={() => setPanel(panel === "rain" ? null : "rain")} title="Rain sounds" aria-label="Rain sounds">
          🌧
        </button>
        <button className="icon-btn" aria-pressed={focus} onClick={() => setFocus(!focus)} title="Focus mode: hides decorations and dims sections you aren't reading" aria-label="Focus mode">
          🎯
        </button>
      </div>
    </div>
  );
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
