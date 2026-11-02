"use client";

import { useRef, useState } from "react";
import { beanBalance, SHOP, type Decor } from "@/lib/arcade/shop";
import { saveStore, type Placed } from "@/lib/arcade/store";
import { Art } from "./Art";
import { DecorArt } from "./decor";

function Piece({ d }: { d: Decor }) {
  return d.art ? <Art name={d.art} /> : <DecorArt draw={d.draw!} />;
}

/** The café after hours. Buy things with beans, then drag them wherever you like. */
export function Room() {
  const save = saveStore.use();
  const balance = beanBalance(save);
  const room = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const grab = useRef<{ id: string; dx: number; dy: number; moved: boolean } | null>(null);

  const placed = (d: Decor): Placed => save.placed[d.id] ?? { x: d.x, y: d.y };
  const owned = SHOP.filter((d) => save.owned.includes(d.id));
  const shown = owned.filter((d) => !placed(d).hidden);
  // big flat things (rug) sit underneath, hanging things on top
  const order = (d: Decor) => (d.id === "rug" ? 0 : d.id === "lights" ? 3 : placed(d).y > 80 ? 2 : 1);

  const setPlaced = (id: string, p: Partial<Placed>) => {
    const s = saveStore.read();
    const d = SHOP.find((x) => x.id === id)!;
    const cur = s.placed[id] ?? { x: d.x, y: d.y };
    saveStore.write({ ...s, placed: { ...s.placed, [id]: { ...cur, ...p } } });
  };

  const buy = (d: Decor) => {
    if (balance < d.price) return;
    const s = saveStore.read();
    if (s.owned.includes(d.id)) return;
    saveStore.write({ ...s, owned: [...s.owned, d.id] });
  };

  const pct = (e: React.PointerEvent) => {
    const r = room.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
  };

  const down = (e: React.PointerEvent, d: Decor) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const p = pct(e);
    const at = placed(d);
    grab.current = { id: d.id, dx: at.x - p.x, dy: at.y - p.y, moved: false };
    setDrag({ id: d.id, x: at.x, y: at.y });
  };
  const move = (e: React.PointerEvent) => {
    const g = grab.current;
    if (!g) return;
    const p = pct(e);
    g.moved = true;
    setDrag({ id: g.id, x: Math.min(100, Math.max(0, p.x + g.dx)), y: Math.min(102, Math.max(8, p.y + g.dy)) });
  };
  const up = () => {
    const g = grab.current;
    if (g && drag && g.moved) setPlaced(g.id, { x: Math.round(drag.x * 10) / 10, y: Math.round(drag.y * 10) / 10 });
    grab.current = null;
    setDrag(null);
  };

  return (
    <div className="room-wrap">
      <div>
        <div className="room" ref={room} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <RoomBg />
          {[...shown]
            .sort((a, b) => order(a) - order(b))
            .map((d) => {
              const at = drag?.id === d.id ? drag : placed(d);
              return (
                <div
                  key={d.id}
                  className={`room-item ${drag?.id === d.id ? "drag" : ""}`}
                  style={{ left: `${at.x}%`, top: `${at.y}%`, width: `${d.w}%`, transform: `translate(-50%, -100%) ${placed(d).flip ? "scaleX(-1)" : ""}` }}
                  onPointerDown={(e) => down(e, d)}
                  onDoubleClick={() => setPlaced(d.id, { flip: !placed(d).flip })}
                  title={`${d.name}: drag to move, double-click to flip`}
                >
                  <Piece d={d} />
                </div>
              );
            })}
          {!owned.length && (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", padding: 20, color: "var(--a-soft)", fontFamily: "var(--a-hand)", fontSize: "1.5rem" }}>
              An empty café, waiting for you.
              <br />
              Earn beans by solving steps, then buy something cozy →
            </div>
          )}
          {owned.length > 0 && <span className="room-tip">drag to move · double-click to flip</span>}
        </div>
      </div>

      <div className="a-panel shop">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <b style={{ fontFamily: "var(--a-display)", fontSize: "1.2rem" }}>The shop</b>
          <span className="g-stat beans">
            <b>{balance}</b>
            <small>☕</small>
          </span>
        </div>
        <div className="shop-list">
          {SHOP.map((d) => {
            const has = save.owned.includes(d.id);
            const hidden = has && placed(d).hidden;
            return (
              <div key={d.id} className={`shop-item ${has ? "owned" : ""}`}>
                <div className="thumb">
                  <Piece d={d} />
                </div>
                <div>
                  <b>{d.name}</b>
                  <small>{d.blurb}</small>
                </div>
                {has ? (
                  <button className="a-btn tiny ghost" onClick={() => setPlaced(d.id, { hidden: !hidden })}>
                    {hidden ? "Place" : "Put away"}
                  </button>
                ) : (
                  <button className="a-btn tiny" disabled={balance < d.price} onClick={() => buy(d)} title={balance < d.price ? `You need ${d.price - balance} more beans` : `Buy for ${d.price} beans`}>
                    {d.price} ☕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RoomBg() {
  return (
    <svg className="bg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <pattern id="paper" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="18" r="1.4" fill="#3b2f4f" />
          <circle cx="42" cy="46" r="1.1" fill="#3b2f4f" />
        </pattern>
        <radialGradient id="moonglow">
          <stop offset="0" stopColor="#f1e7d4" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f1e7d4" stopOpacity="0" />
        </radialGradient>
        <filter id="roomink">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>
      </defs>
      {/* wall */}
      <rect width="1600" height="780" fill="#231a31" />
      <rect width="1600" height="780" fill="url(#paper)" />
      {/* wainscot */}
      <rect y="560" width="1600" height="220" fill="#2a2039" />
      <g stroke="#3b2f4f" strokeWidth="3" filter="url(#roomink)">
        <path d="M0 560 H1600" />
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M${50 + i * 100} 580 V760`} opacity="0.6" />
        ))}
      </g>
      {/* window */}
      <g filter="url(#roomink)">
        <rect x="560" y="90" width="480" height="360" rx="200" ry="180" fill="#151b38" stroke="#4a3d5e" strokeWidth="10" />
        <circle cx="900" cy="200" r="120" fill="url(#moonglow)" />
        <circle cx="900" cy="200" r="38" fill="#f1e7d4" />
        <circle cx="886" cy="190" r="6" fill="#e2d4b9" />
        <circle cx="912" cy="214" r="4" fill="#e2d4b9" />
        {[[640, 180], [700, 120], [760, 260], [690, 330], [980, 320], [820, 150], [1000, 240]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 6} V${y + 6} M${x - 6} ${y} H${x + 6}`} stroke="#f1e7d4" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
        ))}
        <path d="M800 92 V450 M562 280 H1038" stroke="#4a3d5e" strokeWidth="8" />
        <rect x="540" y="446" width="520" height="22" rx="6" fill="#3b2f4f" />
      </g>
      {/* floor */}
      <rect y="780" width="1600" height="220" fill="#2c2030" />
      <g stroke="#3a2a3c" strokeWidth="3" filter="url(#roomink)">
        <path d="M0 780 H1600" stroke="#4a3d5e" strokeWidth="8" />
        {[830, 890, 960].map((y) => (
          <path key={y} d={`M0 ${y} H1600`} opacity="0.7" />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${(i * 157) % 1600} ${[780, 830, 890, 960][i % 4]} v${[50, 60, 70, 40][i % 4]}`} opacity="0.6" />
        ))}
      </g>
    </svg>
  );
}
