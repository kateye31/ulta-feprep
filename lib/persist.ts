/**
 * Saving that survives anything. Every value lives in TWO places:
 *   1. this browser's localStorage (fast, works offline)
 *   2. data/fe-cafe-save.json in the project folder, via /api/save
 * On page load we pull the file and MERGE it with what this browser has, so work typed
 * on a different port / browser / computer is never thrown away.
 */

import { JOURNAL_SEED } from "@/content/me";

export const KEYS = {
  studio: "fe-cafe-studio-v1",
  journal: "fe-cafe-journal-v1",
  stamps: "fe-cafe-stamps-v1",
  gymBest: "fe-cafe-gym-best",
  examDate: "fe-cafe-exam-date",
  theme: "fe-cafe-theme",
} as const;

type Rec = { value: string; updated: number };
const META = "fe-cafe-meta-v1"; // when each key last changed in this browser

const get = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const set = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
    return true;
  } catch {
    return false;
  }
};
function meta(): Record<string, number> {
  try {
    return JSON.parse(get(META) ?? "{}");
  } catch {
    return {};
  }
}
function setMeta(k: string, t: number) {
  const m = meta();
  m[k] = t;
  set(META, JSON.stringify(m));
}

// ── merging two copies of the same thing ──
type FileRec = { content: string; updated: number };
type FS = { files: Record<string, FileRec>; folders: string[]; stdin: Record<string, string>; [k: string]: unknown };
type Entry = { id: string; updated?: number; [k: string]: unknown };

function mergeValue(key: string, local: string, lt: number, server: string, st: number): string {
  if (local === server) return local;
  try {
    const a = JSON.parse(local);
    const b = JSON.parse(server);
    const newer = lt >= st ? a : b;
    const older = lt >= st ? b : a;
    if (key === KEYS.studio) {
      const A = newer as FS;
      const B = older as FS;
      const files: Record<string, FileRec> = { ...B.files };
      for (const [p, f] of Object.entries(A.files ?? {})) if (!files[p] || f.updated >= files[p].updated) files[p] = f;
      return JSON.stringify({
        ...A,
        files,
        folders: Array.from(new Set([...(B.folders ?? []), ...(A.folders ?? [])])),
        stdin: { ...(B.stdin ?? {}), ...(A.stdin ?? {}) },
      });
    }
    if (key === KEYS.journal) {
      // An entry that still matches the built-in starter log never beats one you edited.
      const seed = new Map(JOURNAL_SEED.map((e) => [e.id, JSON.stringify({ ...e, updated: undefined })]));
      const edited = (e: Entry) => seed.get(e.id) !== JSON.stringify({ ...e, updated: undefined });
      const byId = new Map<string, Entry>();
      const order: string[] = [];
      for (const e of [...(newer as Entry[]), ...(older as Entry[])]) {
        const cur = byId.get(e.id);
        if (!cur) {
          byId.set(e.id, e);
          order.push(e.id);
        } else if (edited(e) && !edited(cur)) byId.set(e.id, e);
        else if (edited(e) === edited(cur) && (e.updated ?? 0) > (cur.updated ?? 0)) byId.set(e.id, e);
      }
      return JSON.stringify(order.map((id) => byId.get(id)));
    }
    if (key === KEYS.stamps) return JSON.stringify(Array.from(new Set([...(a as string[]), ...(b as string[])])));
    if (key === KEYS.gymBest) return String(Math.max(+a || 0, +b || 0));
  } catch {
    /* not JSON: fall through to "newest wins" */
  }
  return lt >= st ? local : server;
}

// ── sync on load ──
let readyP: Promise<void> | null = null;
let serverOk = false;

/** Resolves once this browser and the save file agree. Read your data AFTER awaiting this. */
export function ready(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!readyP) readyP = boot();
  return readyP;
}

async function boot() {
  let server: Record<string, Rec> = {};
  try {
    const r = await fetch("/api/save", { cache: "no-store" });
    if (!r.ok) return;
    server = await r.json();
    serverOk = true;
  } catch {
    return; // offline or static hosting: browser storage only
  }
  const m = meta();
  const push: Record<string, Rec> = {};
  for (const key of Object.values(KEYS)) {
    const local = get(key);
    const s = server[key];
    const lt = m[key] ?? 0;
    let merged: string | null;
    if (local == null) merged = s?.value ?? null;
    else if (!s) merged = local;
    else merged = mergeValue(key, local, lt, s.value, s.updated);
    if (merged == null) continue;
    const changedFromServer = !s || merged !== s.value;
    const t = changedFromServer ? Math.max(Date.now(), lt) : s.updated;
    if (merged !== local) set(key, merged);
    setMeta(key, t);
    if (changedFromServer) push[key] = { value: merged, updated: t };
  }
  if (Object.keys(push).length) await post(push);
  window.dispatchEvent(new Event("fe-cafe-synced"));
}

// ── saving ──
let queue: Record<string, Rec> = {};
let timer: ReturnType<typeof setTimeout> | null = null;

async function post(body: Record<string, Rec>) {
  try {
    await fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true });
  } catch {
    /* will retry on the next change / next page load */
  }
}

function flush() {
  if (timer) clearTimeout(timer);
  timer = null;
  const body = queue;
  queue = {};
  if (Object.keys(body).length && serverOk) void post(body);
}

if (typeof window !== "undefined") {
  const beacon = () => {
    if (!Object.keys(queue).length || !serverOk) return;
    const body = JSON.stringify(queue);
    queue = {};
    if (!navigator.sendBeacon?.("/api/save", new Blob([body], { type: "application/json" }))) void post(JSON.parse(body));
  };
  window.addEventListener("pagehide", beacon);
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && beacon());
}

/** Save a value everywhere. Returns false if even browser storage refused it. */
export function persist(key: string, value: string): boolean {
  const ok = set(key, value);
  const t = Date.now();
  setMeta(key, t);
  queue[key] = { value, updated: t };
  if (timer) clearTimeout(timer);
  timer = setTimeout(flush, 700);
  return ok;
}

export const readLocal = get;
