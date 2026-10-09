"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import CodeEditor, { type EditorMark } from "./CodeEditor";
import FileTree from "./FileTree";
import Terminal, { type TLine } from "./Terminal";
import type { RunResult } from "@/lib/runner";
import { ready } from "@/lib/persist";
import {
  baseName,
  fetchStarter,
  isFile,
  isFolder,
  listDir,
  loadFS,
  makeFolder,
  movePath,
  parentOf,
  removePath,
  resolvePath,
  saveFS,
  seedFS,
  starterList,
  validName,
  writeFile,
  type StudioFS,
} from "@/lib/studio-fs";

const HELP: TLine[] = [
  { kind: "info", text: "🌸 FE Café terminal. Your files live in this browser." },
  { kind: "out", text: "  run [file]        compile + run with real gcc (or press Ctrl+Enter)" },
  { kind: "out", text: "  ls [dir] · tree   list files        cd <dir> · pwd   move around" },
  { kind: "out", text: "  cat <file>        print a file      open <file>      open it in the editor" },
  { kind: "out", text: "  touch <file.c>    new file          mkdir <dir>      new folder" },
  { kind: "out", text: "  mv <from> <to>    rename/move       cp <from> <to>   copy" },
  { kind: "out", text: "  rm <file> · rm -r <dir>             delete (careful, no undo!)" },
  { kind: "out", text: "  memcheck on|off   leak & crash detector (on = recommended)" },
  { kind: "out", text: "  restore [file]    reset a starter drill to its original" },
  { kind: "out", text: "  raw               show the full raw error report from the last run" },
  { kind: "out", text: "  clear (Ctrl+L)    wipe the screen" },
  { kind: "dim", text: "  Program input (scanf) goes in the 📥 Input tab." },
];

function splitArgs(s: string) {
  return (s.match(/"[^"]*"|\S+/g) ?? []).map((a) => a.replace(/^"|"$/g, ""));
}

export default function Studio() {
  const [fs, setFs] = useState<StudioFS | null>(null);
  const [lines, setLines] = useState<TLine[]>([]);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"term" | "input">("term");
  const [marks, setMarks] = useState<Record<string, EditorMark[]>>({});
  const [jump, setJump] = useState<{ line: number; n: number } | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const [starters, setStarters] = useState<string[]>([]);
  const lastRaw = useRef("");
  const fsRef = useRef<StudioFS | null>(null);
  fsRef.current = fs;

  const print = useCallback((...l: TLine[]) => setLines((x) => [...x, ...l].slice(-600)), []);

  // Load (or create) the file system once.
  useEffect(() => {
    document.documentElement.dataset.page = "studio";
    (async () => {
      await ready();
      let f = loadFS();
      const fresh = !f;
      if (!f) f = await seedFS();
      const want = new URLSearchParams(location.search).get("open");
      if (want && isFile(f, want)) f = { ...f, open: want, cwd: parentOf(want) };
      setFs(f);
      setStarters(await starterList());
      setLines([
        { kind: "info", text: fresh ? "🌸 Welcome to your Code Studio! I set up your practice folders." : "🌸 Welcome back! Everything you wrote is right where you left it." },
        { kind: "dim", text: "Type `help` for commands, or press ▶ Run. No AI in here, just you + gcc 💜" },
      ]);
    })();
    return () => {
      delete document.documentElement.dataset.page;
    };
  }, []);

  // Autosave (debounced).
  useEffect(() => {
    if (!fs) return;
    const id = setTimeout(() => {
      const ok = saveFS(fs);
      setSaveFailed(!ok);
      if (ok) setSavedAt(Date.now());
    }, 350);
    return () => clearTimeout(id);
  }, [fs]);

  const update = (f: (s: StudioFS) => StudioFS) => setFs((s) => (s ? f(s) : s));

  const run = useCallback(
    async (target?: string) => {
      const s = fsRef.current;
      if (!s || busy) return;
      const path = target ?? s.open;
      if (!path || !isFile(s, path)) {
        print({ kind: "err", text: "🙈 Open a .c file first (or: run <file>)." });
        return;
      }
      setTab("term");
      print({ kind: "cmd", text: `gcc ${baseName(path)} -o program && ./program`, line: 0 });
      setBusy(true);
      let r: RunResult;
      try {
        const res = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: s.files[path].content, stdin: s.stdin[path] ?? "", memcheck: s.memcheck }),
        });
        r = await res.json();
      } catch {
        setBusy(false);
        print({ kind: "err", text: "🌧 Couldn't reach the run server. Is `npm run dev` still running?" });
        return;
      }
      setBusy(false);
      lastRaw.current = r.stderr;
      const out: TLine[] = [];
      const newMarks: EditorMark[] = [];

      if (r.stage === "network") {
        r.problems.forEach((p) => out.push({ kind: "err", text: p.message }));
      } else if (r.stage === "compile") {
        const errs = r.diagnostics.filter((d) => d.severity === "error");
        out.push({ kind: "err", text: `🧁 It didn't compile. ${errs.length} error${errs.length === 1 ? "" : "s"} (click one to jump to it):` });
        for (const d of r.diagnostics) {
          if (d.severity === "note") continue;
          out.push({ kind: d.severity === "error" ? "err" : "warn", text: `  line ${d.line}: ${d.severity}: ${d.message}`, line: d.line });
          if (d.hint) out.push({ kind: "hint", text: `     💡 ${d.hint}` });
          newMarks.push({ line: d.line, severity: d.severity === "error" ? "error" : "warning", message: d.message + (d.hint ? `\n💡 ${d.hint}` : "") });
        }
        r.problems.forEach((p) => out.push({ kind: "err", text: p.message }));
        out.push({ kind: "dim", text: "  Tip: fix the FIRST error first. Later errors are often caused by it." });
      } else {
        const warns = r.diagnostics.filter((d) => d.severity === "warning");
        for (const d of warns) {
          out.push({ kind: "warn", text: `  ⚠ line ${d.line}: ${d.message}`, line: d.line });
          if (d.hint) out.push({ kind: "hint", text: `     💡 ${d.hint}` });
          newMarks.push({ line: d.line, severity: "warning", message: d.message });
        }
        if (r.stdout) r.stdout.replace(/\n$/, "").split("\n").forEach((t) => out.push({ kind: "out", text: t }));
        else out.push({ kind: "dim", text: "(your program printed nothing)" });
        for (const p of r.problems) {
          out.push({ kind: p.severity === "error" ? "err" : "warn", text: p.message, line: p.line });
          if (p.line) newMarks.push({ line: p.line, severity: p.severity, message: p.message });
        }
        if (!r.problems.length && r.stderr.trim()) r.stderr.trim().split("\n").slice(0, 20).forEach((t) => out.push({ kind: "err", text: t }));
        if (r.problems.length && r.stderr.trim()) out.push({ kind: "dim", text: "  (type `raw` to see the full memory report)" });
        out.push(
          r.ok
            ? { kind: "ok", text: `✨ finished · exit code 0 · ${(r.ms / 1000).toFixed(1)}s${s.memcheck ? " · 🔍 no memory problems found" : ""}` }
            : { kind: "err", text: `exit code ${r.exitCode ?? "?"} · ${(r.ms / 1000).toFixed(1)}s` },
        );
        if (r.ok && /(\d+) \/ \1 passed/.test(r.stdout)) confetti({ particleCount: 110, spread: 75, origin: { y: 0.8 }, colors: ["#c2a9f2", "#f39cbd", "#f7d77f", "#7fcbad"] });
      }
      print(...out);
      setMarks((m) => ({ ...m, [path]: newMarks }));
    },
    [busy, print],
  );

  const exec = async (raw: string) => {
    const s = fsRef.current;
    if (!s) return;
    print({ kind: "cmd", text: raw });
    const [cmd, ...args] = splitArgs(raw.trim());
    if (!cmd) return;
    const P = (x: string) => resolvePath(s.cwd, x);

    switch (cmd) {
      case "help":
        return print(...HELP);
      case "clear":
        return setLines([]);
      case "pwd":
        return print({ kind: "out", text: "~/" + s.cwd });
      case "ls":
      case "dir": {
        const d = args[0] ? P(args[0]) : s.cwd;
        if (!isFolder(s, d)) return print({ kind: "err", text: `ls: no folder named ${args[0]}` });
        const { folders, files } = listDir(s, d);
        if (!folders.length && !files.length) return print({ kind: "dim", text: "(empty)" });
        return print(...folders.map((f) => ({ kind: "info" as const, text: `📁 ${baseName(f)}/` })), ...files.map((f) => ({ kind: "out" as const, text: `📄 ${baseName(f)}` })));
      }
      case "tree": {
        const out: TLine[] = [{ kind: "info", text: "~" }];
        const walk = (d: string, pad: string) => {
          const { folders, files } = listDir(s, d);
          folders.forEach((f) => {
            out.push({ kind: "info", text: `${pad}📁 ${baseName(f)}/` });
            walk(f, pad + "   ");
          });
          files.forEach((f) => out.push({ kind: "out", text: `${pad}📄 ${baseName(f)}` }));
        };
        walk("", "  ");
        return print(...out);
      }
      case "cd": {
        const d = args[0] ? P(args[0]) : "";
        if (!isFolder(s, d)) return print({ kind: "err", text: `cd: no folder named ${args[0]}` });
        return update((x) => ({ ...x, cwd: d }));
      }
      case "cat": {
        const f = args[0] && P(args[0]);
        if (!f || !isFile(s, f)) return print({ kind: "err", text: `cat: no file named ${args[0] ?? ""}` });
        return print(...s.files[f].content.split("\n").slice(0, 300).map((t) => ({ kind: "out" as const, text: t })));
      }
      case "open":
      case "code":
      case "vim":
      case "nano":
      case "vi": {
        const f = args[0] && P(args[0]);
        if (!f || !isFile(s, f)) return print({ kind: "err", text: `${cmd}: no file named ${args[0] ?? ""}` });
        if (cmd !== "open" && cmd !== "code") print({ kind: "dim", text: `(${cmd} lives in a different café 😸 opening it in the editor instead)` });
        return update((x) => ({ ...x, open: f }));
      }
      case "touch": {
        if (!args[0]) return print({ kind: "err", text: "touch: which file? e.g. touch mylist.c" });
        const f = P(args[0]);
        if (!validName(baseName(f))) return print({ kind: "err", text: "touch: use letters, numbers, - _ . only" });
        if (isFolder(s, f)) return print({ kind: "err", text: "touch: that's a folder" });
        if (!isFile(s, f)) update((x) => ({ ...writeFile(x, f, `// ${baseName(f)}\n`), open: f }));
        return print({ kind: "ok", text: `📄 created ${f}` });
      }
      case "mkdir": {
        if (!args[0]) return print({ kind: "err", text: "mkdir: name? e.g. mkdir week1" });
        const d = P(args[args.length - 1]);
        if (isFile(s, d)) return print({ kind: "err", text: "mkdir: a file already has that name" });
        update((x) => makeFolder(x, d));
        return print({ kind: "ok", text: `📁 made ${d}/` });
      }
      case "rm": {
        const recursive = args.includes("-r") || args.includes("-rf");
        const name = args.filter((a) => !a.startsWith("-"))[0];
        if (!name) return print({ kind: "err", text: "rm: what should I delete?" });
        const p = P(name);
        if (p === "") return print({ kind: "err", text: "rm: I won't delete everything 🙅" });
        if (isFolder(s, p) && !recursive) return print({ kind: "err", text: `rm: ${name} is a folder (use rm -r ${name})` });
        if (!isFolder(s, p) && !isFile(s, p)) return print({ kind: "err", text: `rm: nothing named ${name}` });
        update((x) => removePath(x, p));
        return print({ kind: "ok", text: `🗑 removed ${p}` });
      }
      case "mv":
      case "cp": {
        if (args.length < 2) return print({ kind: "err", text: `${cmd}: usage: ${cmd} <from> <to>` });
        const from = P(args[0]);
        let to = P(args[1]);
        if (!isFile(s, from) && !(cmd === "mv" && isFolder(s, from) && from !== "")) return print({ kind: "err", text: `${cmd}: nothing named ${args[0]}` });
        if (isFolder(s, to)) to = to ? `${to}/${baseName(from)}` : baseName(from);
        if (isFile(s, to) || (isFolder(s, to) && to !== "")) return print({ kind: "err", text: `${cmd}: ${to} already exists` });
        if (cmd === "cp") update((x) => writeFile(x, to, x.files[from].content));
        else update((x) => movePath(x, from, to));
        return print({ kind: "ok", text: `${cmd === "cp" ? "📋 copied" : "🚚 moved"} ${from} → ${to}` });
      }
      case "run":
      case "gcc":
      case "./a.out":
      case "./program":
      case "make": {
        const f = args.find((a) => a.endsWith(".c"));
        if (f && !isFile(s, P(f))) return print({ kind: "err", text: `run: no file named ${f}` });
        return run(f ? P(f) : undefined);
      }
      case "memcheck": {
        const on = args[0] ? args[0] === "on" : !s.memcheck;
        update((x) => ({ ...x, memcheck: on }));
        return print({ kind: "ok", text: on ? "🔍 memory check ON: leaks, use-after-free & NULL crashes get explained with line numbers." : "memory check OFF (runs a bit faster)" });
      }
      case "raw":
        return print(...(lastRaw.current.trim() ? lastRaw.current.trim().split("\n").map((t) => ({ kind: "dim" as const, text: t })) : [{ kind: "dim" as const, text: "(nothing)" }]));
      case "restore": {
        const f = args[0] ? P(args[0]) : s.open;
        if (!f || !starters.includes(f)) return print({ kind: "err", text: "restore: that isn't one of the starter drills" });
        if (!confirm(`Reset ${f} to the original? Your version will be replaced.`)) return print({ kind: "dim", text: "cancelled" });
        const text = await fetchStarter(f);
        if (text == null) return print({ kind: "err", text: "restore: couldn't load the original" });
        update((x) => writeFile(x, f, text));
        return print({ kind: "ok", text: `↺ restored ${f}` });
      }
      case "echo":
        return print({ kind: "out", text: args.join(" ") });
      case "whoami":
        return print({ kind: "out", text: "a future Foundation Exam passer 💜" });
      case "sudo":
        return print({ kind: "out", text: "nice try 😸 Mochi is the only admin here." });
      case "exit":
        return print({ kind: "out", text: "there is no escape from the cozy café ☕ (just close the tab!)" });
      default:
        return print({ kind: "err", text: `${cmd}: command not found. Type help 🌸` });
    }
  };

  if (!fs) {
    return (
      <div className="center muted hand" style={{ padding: "80px 0" }}>
        🍵 brewing your studio…
      </div>
    );
  }

  const open = fs.open && isFile(fs, fs.open) ? fs.open : null;
  const newFile = (dir: string) => {
    const n = prompt("New file name (like mylist.c):", "practice.c");
    if (!n) return;
    const name = n.includes(".") ? n.trim() : n.trim() + ".c";
    if (!validName(name)) return alert("Use letters, numbers, - _ . only");
    const p = dir ? `${dir}/${name}` : name;
    if (isFile(fs, p)) return alert("That file already exists.");
    update((x) => ({ ...writeFile(x, p, `// ${name}\n`), open: p }));
  };
  const newFolder = (dir: string) => {
    const n = prompt("New folder name:", "week1");
    if (!n || !validName(n.trim())) return;
    update((x) => makeFolder(x, dir ? `${dir}/${n.trim()}` : n.trim()));
  };
  const rename = (p: string) => {
    const n = prompt("Rename to:", baseName(p));
    if (!n || n === baseName(p)) return;
    if (!validName(n)) return alert("Use letters, numbers, - _ . only");
    const to = parentOf(p) ? `${parentOf(p)}/${n}` : n;
    if (isFile(fs, to) || isFolder(fs, to)) return alert("Something already has that name.");
    update((x) => movePath(x, p, to));
  };
  const del = (p: string) => {
    if (!confirm(`Delete ${p}${isFolder(fs, p) ? " and everything inside it" : ""}? This can't be undone.`)) return;
    update((x) => removePath(x, p));
  };
  const backup = () => {
    const blob = new Blob([JSON.stringify(fs, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fe-cafe-code-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const restoreBackup = (file: File) => {
    file.text().then((t) => {
      try {
        const data = JSON.parse(t) as StudioFS;
        if (data.version !== 1 || !data.files) throw new Error();
        if (!confirm("Replace ALL your current files with this backup?")) return;
        setFs(data);
        print({ kind: "ok", text: `⬆ restored backup (${Object.keys(data.files).length} files)` });
      } catch {
        alert("That doesn't look like an FE Café backup file.");
      }
    });
  };

  const prompt$ = `you@fe-cafe:~${fs.cwd ? "/" + fs.cwd : ""}$ `;

  return (
    <div className="studio">
      <aside className="studio-side">
        <FileTree fs={fs} onOpen={(p) => update((x) => ({ ...x, open: p }))} onNewFile={newFile} onNewFolder={newFolder} onRename={rename} onDelete={del} />
        <div className="studio-backup">
          <button className="ft-btn" onClick={backup} title="Download all your code as one file">⬇ Backup</button>
          <label className="ft-btn" title="Load a backup file">
            ⬆ Load
            <input type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && restoreBackup(e.target.files[0])} />
          </label>
        </div>
        <p className="studio-note">
          💾 Saves automatically to <code>data/fe-cafe-save.json</code> in your project folder (+ a daily backup){saveFailed ? " (⚠ browser storage is full or blocked!)" : ""}.
        </p>
      </aside>

      <section className="studio-main">
        <div className="studio-bar">
          <span className="studio-file">
            📄 {open ?? "no file open"}
            <span className="studio-saved">{savedAt ? "· saved ✓" : ""}</span>
          </span>
          <span style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <label className="studio-toggle" title="Detects leaks, use-after-free, double free, NULL crashes and out-of-bounds, with line numbers">
              <input type="checkbox" checked={fs.memcheck} onChange={(e) => update((x) => ({ ...x, memcheck: e.target.checked }))} /> 🔍 memory check
            </label>
            {open && starters.includes(open) && (
              <button className="btn small secondary" onClick={() => exec(`restore ${"/" + open}`)} title="Reset this drill to the original">↺ Reset</button>
            )}
            <button className="btn small" disabled={!open || busy} onClick={() => run()}>
              {busy ? "⏳ Running…" : "▶ Run"} <kbd style={{ background: "transparent", borderColor: "currentColor", color: "inherit" }}>Ctrl+⏎</kbd>
            </button>
          </span>
        </div>

        {open ? (
          <CodeEditor
            path={open}
            value={fs.files[open].content}
            onChange={(text) => update((x) => (x.files[open] ? { ...x, files: { ...x.files, [open]: { content: text, updated: Date.now() } } } : x))}
            onRun={() => run()}
            marks={marks[open] ?? []}
            jump={jump}
          />
        ) : (
          <div className="studio-editor studio-empty">
            <div>
              <div style={{ fontSize: "2.5rem" }}>🗂</div>
              Pick a file on the left, or type <code>touch mycode.c</code> in the terminal.
            </div>
          </div>
        )}

        <div className="studio-bottom">
          <div className="studio-tabs" role="tablist">
            <button role="tab" aria-selected={tab === "term"} onClick={() => setTab("term")}>💻 Terminal</button>
            <button role="tab" aria-selected={tab === "input"} onClick={() => setTab("input")}>
              📥 Input {open && fs.stdin[open] ? "•" : ""}
            </button>
            <span style={{ flex: 1 }} />
            <button onClick={() => setLines([])} title="Clear terminal">🧹</button>
          </div>
          {tab === "term" ? (
            <Terminal lines={lines} prompt={prompt$} busy={busy} onCommand={exec} onJump={(line) => setJump({ line, n: Date.now() })} />
          ) : (
            <div className="studio-input">
              <p className="muted" style={{ margin: "0 0 6px", fontSize: "0.85rem" }}>
                Whatever you type here is fed to <code>scanf</code> when the program runs (saved per file).
              </p>
              <textarea
                className="input mono"
                data-lenis-prevent
                disabled={!open}
                value={open ? fs.stdin[open] ?? "" : ""}
                onChange={(e) => open && update((x) => ({ ...x, stdin: { ...x.stdin, [open]: e.target.value } }))}
                placeholder={"5\n3 8 1 9 2"}
                spellCheck={false}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
