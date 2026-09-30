/** A tiny virtual file system for the Code Studio, saved in this browser's localStorage. */

export type StudioFS = {
  version: 1;
  files: Record<string, { content: string; updated: number }>;
  folders: string[];
  stdin: Record<string, string>;
  open: string | null;
  cwd: string;
  memcheck: boolean;
};

const KEY = "fe-cafe-studio-v1";

export function loadFS(): StudioFS | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const fs = JSON.parse(raw) as StudioFS;
    return fs && fs.version === 1 && fs.files ? fs : null;
  } catch {
    return null;
  }
}

export function saveFS(fs: StudioFS): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(fs));
    return true;
  } catch {
    return false;
  }
}

type Manifest = { version: number; folders: string[]; files: string[] };

export async function fetchStarter(path: string): Promise<string | null> {
  try {
    const res = await fetch(`/starters/${path}`, { cache: "no-store" });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

export async function starterList(): Promise<string[]> {
  try {
    const m = (await (await fetch("/starters/manifest.json", { cache: "no-store" })).json()) as Manifest;
    return m.files;
  } catch {
    return [];
  }
}

export async function seedFS(): Promise<StudioFS> {
  const fs: StudioFS = { version: 1, files: {}, folders: [], stdin: { "scratch/hello.c": "7" }, open: "scratch/hello.c", cwd: "", memcheck: true };
  try {
    const m = (await (await fetch("/starters/manifest.json", { cache: "no-store" })).json()) as Manifest;
    fs.folders = [...m.folders];
    const texts = await Promise.all(m.files.map(fetchStarter));
    m.files.forEach((p, i) => {
      if (texts[i] != null) fs.files[p] = { content: texts[i]!, updated: Date.now() };
    });
  } catch {
    fs.folders = ["my-code"];
    fs.files["my-code/main.c"] = { content: "", updated: Date.now() };
    fs.open = "my-code/main.c";
  }
  return fs;
}

/** Resolve a path typed in the terminal (supports ~, /, ., ..) against cwd. "" is the root. */
export function resolvePath(cwd: string, input: string): string {
  const raw = input.trim();
  const abs = raw.startsWith("/") || raw.startsWith("~");
  const parts = (abs ? raw.replace(/^~\/?|^\//, "") : (cwd ? cwd + "/" : "") + raw).split("/");
  const out: string[] = [];
  for (const p of parts) {
    if (!p || p === ".") continue;
    if (p === "..") out.pop();
    else out.push(p);
  }
  return out.join("/");
}

export const parentOf = (p: string) => (p.includes("/") ? p.slice(0, p.lastIndexOf("/")) : "");
export const baseName = (p: string) => p.slice(p.lastIndexOf("/") + 1);
export const isFolder = (fs: StudioFS, p: string) => p === "" || fs.folders.includes(p);
export const isFile = (fs: StudioFS, p: string) => p in fs.files;
export const validName = (n: string) => /^[\w.\- ]+$/.test(n) && n !== "." && n !== "..";

export function listDir(fs: StudioFS, dir: string) {
  const inDir = (p: string) => parentOf(p) === dir;
  return {
    folders: fs.folders.filter(inDir).sort(),
    files: Object.keys(fs.files).filter(inDir).sort(),
  };
}

function ensureParents(fs: StudioFS, p: string): string[] {
  const folders = [...fs.folders];
  let cur = parentOf(p);
  while (cur) {
    if (!folders.includes(cur)) folders.push(cur);
    cur = parentOf(cur);
  }
  return folders;
}

export function writeFile(fs: StudioFS, p: string, content: string): StudioFS {
  return { ...fs, folders: ensureParents(fs, p), files: { ...fs.files, [p]: { content, updated: Date.now() } } };
}

export function makeFolder(fs: StudioFS, p: string): StudioFS {
  const folders = ensureParents(fs, p);
  if (!folders.includes(p)) folders.push(p);
  return { ...fs, folders };
}

export function removePath(fs: StudioFS, p: string): StudioFS {
  const under = (x: string) => x === p || x.startsWith(p + "/");
  const files = Object.fromEntries(Object.entries(fs.files).filter(([k]) => !under(k)));
  const stdin = Object.fromEntries(Object.entries(fs.stdin).filter(([k]) => !under(k)));
  return {
    ...fs,
    files,
    stdin,
    folders: fs.folders.filter((f) => !under(f)),
    open: fs.open && under(fs.open) ? null : fs.open,
    cwd: under(fs.cwd) ? parentOf(p) : fs.cwd,
  };
}

export function movePath(fs: StudioFS, from: string, to: string): StudioFS {
  const re = (x: string) => (x === from ? to : x.startsWith(from + "/") ? to + x.slice(from.length) : x);
  const files = Object.fromEntries(Object.entries(fs.files).map(([k, v]) => [re(k), v]));
  const stdin = Object.fromEntries(Object.entries(fs.stdin).map(([k, v]) => [re(k), v]));
  const moved = { ...fs, files, stdin, folders: fs.folders.map(re), open: fs.open ? re(fs.open) : null, cwd: re(fs.cwd) };
  return { ...moved, folders: ensureParents(moved, to) };
}
