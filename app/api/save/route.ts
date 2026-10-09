import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Saves everything you type in the café to a real file in the project folder:
 *   data/fe-cafe-save.json   (+ one backup copy per day in data/backups/)
 * So your work survives a new port, a new browser, or cleared browser data.
 */
export const dynamic = "force-dynamic";

type Rec = { value: string; updated: number };
type Store = Record<string, Rec>;

const DIR = process.env.FE_CAFE_DATA_DIR || path.join(process.cwd(), "data");
const FILE = path.join(DIR, "fe-cafe-save.json");
const BACKUPS = path.join(DIR, "backups");
const KEEP_BACKUPS = 30;

let lock: Promise<unknown> = Promise.resolve();

async function readStore(): Promise<Store> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Store;
  } catch {
    return {};
  }
}

async function writeStore(store: Store) {
  await fs.mkdir(BACKUPS, { recursive: true });
  const text = JSON.stringify(store, null, 1);
  const tmp = FILE + ".tmp";
  await fs.writeFile(tmp, text, "utf8");
  await fs.rename(tmp, FILE);
  // one backup per day, newest 30 kept
  await fs.writeFile(path.join(BACKUPS, `fe-cafe-save-${new Date().toISOString().slice(0, 10)}.json`), text, "utf8");
  const old = (await fs.readdir(BACKUPS)).filter((f) => f.startsWith("fe-cafe-save-")).sort();
  for (const f of old.slice(0, Math.max(0, old.length - KEEP_BACKUPS))) await fs.unlink(path.join(BACKUPS, f)).catch(() => {});
}

export async function GET() {
  return NextResponse.json(await readStore(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  let incoming: Store;
  try {
    incoming = JSON.parse(await req.text()) as Store;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const job = lock.then(async () => {
    const store = await readStore();
    for (const [key, rec] of Object.entries(incoming ?? {})) {
      if (!rec || typeof rec.value !== "string" || typeof rec.updated !== "number") continue;
      if (rec.value.length > 5_000_000) continue;
      if (!store[key] || rec.updated >= store[key].updated) store[key] = rec;
    }
    await writeStore(store);
  });
  lock = job.catch(() => {});
  try {
    await job;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "write failed" }, { status: 500 });
  }
}
