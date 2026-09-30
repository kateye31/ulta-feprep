/** Compiles & runs C with real gcc on Compiler Explorer (godbolt.org), then explains the results kindly. */

export type Diagnostic = { line: number; col: number; severity: "error" | "warning" | "note"; message: string; hint?: string };
export type Problem = { line?: number; message: string; severity: "error" | "warning" };
export type RunResult = {
  ok: boolean;
  stage: "compile" | "run" | "network";
  diagnostics: Diagnostic[];
  problems: Problem[];
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  ms: number;
};

const COMPILER = "cg142"; // x86-64 gcc 14.2
const GODBOLT = `https://godbolt.org/api/compiler/${COMPILER}/compile`;

// Appended at the END so your line numbers never shift. Makes printf show up even if the program crashes.
const UNBUFFER = `\n#include <stdio.h>\n__attribute__((constructor)) static void fe_cafe_unbuffer_(void) { setvbuf(stdout, NULL, _IONBF, 0); }\n`;

const ANSI = /\x1b\[[0-9;]*[A-Za-z]/g;
const clean = (s: string) => s.replace(ANSI, "");
const join = (arr?: { text: string }[]) => clean((arr ?? []).map((x) => x.text).join("\n"));

const HINTS: [RegExp, string][] = [
  [/implicit declaration of function '(malloc|calloc|realloc|free|rand|srand|abs|exit)'/, "Add #include <stdlib.h> at the top."],
  [/implicit declaration of function '(printf|scanf|puts|getchar)'/, "Add #include <stdio.h> at the top."],
  [/implicit declaration of function '(strcmp|strcpy|strlen|strcat|strncpy|memcpy|memset)'/, "Add #include <string.h> at the top."],
  [/implicit declaration of function/, "C doesn't know this function yet. Typo? Or it's defined BELOW where you call it (move it up, or add a prototype)."],
  [/expected .*';'/, "Missing semicolon, usually at the END of the line just above."],
  [/is a pointer; did you mean to use '->'/, "It's a POINTER, so use -> (p->x), not a dot."],
  [/expected declaration or statement at end of input/, "A { is missing its closing } somewhere."],
  [/incompatible pointer type/, "The pointer types don't match. Compare the type on the LEFT with the RIGHT (e.g. CartPoint* vs int*)."],
  [/invalid type argument of '->'/, "You used -> on something that is NOT a pointer. Use a dot (.) instead."],
  [/request for member .* in something not a structure or union/, "You used . on a POINTER. Use -> instead (p->field means (*p).field)."],
  [/has no member named/, "That field name doesn't exist in this struct. Typo, or the wrong struct?"],
  [/unknown type name/, "C doesn't know this type. With no typedef you must write `struct name` every time."],
  [/storage size of .* isn't known/, "C doesn't know this struct's size. Without a typedef, write `struct name`."],
  [/control reaches end of non-void function/, "Some path through this function never hits a return. Every path needs one!"],
  [/'(\w+)' undeclared/, "This name doesn't exist here. Typo? Or it was declared inside a different { } block?"],
  [/makes pointer from integer|makes integer from pointer/, "You're mixing up a pointer and an int. Check your types, * and &."],
  [/too few arguments|too many arguments/, "Wrong number of arguments in this function call."],
  [/format '%[a-z]+' expects argument of type '[a-z ]+ \*'/, "scanf needs the ADDRESS: scanf(\"%d\", &x)."],
  [/conflicting types for/, "This function is declared twice with different types."],
  [/return makes|returning '.*' from a function with (incompatible )?return type/, "What you return doesn't match the return type. Re-read the function header! 🔍"],
  [/unused variable/, "You declared this but never used it. Harmless, but maybe a sign of a typo."],
  [/suggest parentheses around/, "Add parentheses to make the order clear, e.g. (x & mask) == 0."],
];

function parseDiagnostics(text: string): Diagnostic[] {
  const out: Diagnostic[] = [];
  for (const raw of text.split("\n")) {
    const m = raw.match(/^<source>:(\d+):(\d+): (error|warning|note): (.*)$/);
    if (!m) continue;
    const message = m[4].replace(/\s*\[-W[^\]]+\]$/, "");
    const hint = HINTS.find(([re]) => re.test(message))?.[1];
    out.push({ line: +m[1], col: +m[2], severity: m[3] as Diagnostic["severity"], message, hint });
  }
  return out;
}

function lineAfter(text: string, idx: number) {
  const m = text.slice(idx).match(/example\.c:(\d+)/);
  return m ? +m[1] : undefined;
}

function explainRuntime(err: string, timedOut: boolean): Problem[] {
  const out: Problem[] = [];
  const at = (n?: number) => (n ? ` (line ${n})` : "");
  const find = (needle: string) => err.indexOf(needle);

  if (timedOut) out.push({ severity: "error", message: "⏰ Took too long. Infinite loop? Or scanf waiting for input you didn't type in the 📥 Input tab?" });

  let i: number;
  if ((i = find("heap-use-after-free")) >= 0) out.push({ severity: "error", line: lineAfter(err, i), message: `👻 Use after free${at(lineAfter(err, i))}: this line touched memory that was already free()'d. Save what you need (like ->next) BEFORE freeing.` });
  if ((i = find("attempting double-free")) >= 0) out.push({ severity: "error", line: lineAfter(err, i), message: `💥 Double free${at(lineAfter(err, i))}: this memory was already freed once.` });
  if ((i = find("heap-buffer-overflow")) >= 0) out.push({ severity: "error", line: lineAfter(err, i), message: `📏 Out of bounds${at(lineAfter(err, i))}: went past the end of a malloc'd array. Forgot a +1 (like for '\\0' or a sentinel)? Used <= instead of <?` });
  if ((i = find("stack-buffer-overflow")) >= 0) out.push({ severity: "error", line: lineAfter(err, i), message: `📏 Out of bounds on a local array${at(lineAfter(err, i))}. Check your loop bounds.` });
  if ((i = find("global-buffer-overflow")) >= 0) out.push({ severity: "error", line: lineAfter(err, i), message: `📏 Out of bounds on a global array${at(lineAfter(err, i))}.` });
  if ((i = find("attempting free on address which was not malloc")) >= 0) out.push({ severity: "error", line: lineAfter(err, i), message: `🙅 free() on something that wasn't malloc'd${at(lineAfter(err, i))}.` });
  if ((i = find("stack-overflow")) >= 0) out.push({ severity: "error", line: lineAfter(err, i), message: `🌀 Stack overflow${at(lineAfter(err, i))}: probably infinite recursion. Can your base case actually be reached?` });
  if ((i = find("SEGV on unknown address")) >= 0) {
    const addr = err.slice(i).match(/address (0x[0-9a-f]+|\(nil\))/)?.[1] ?? "";
    const isNull = addr === "(nil)" || /^0x0+[0-9a-f]{0,3}$/.test(addr);
    out.push({
      severity: "error",
      line: lineAfter(err, i),
      message: isNull
        ? `🕳 Crash: NULL pointer${at(lineAfter(err, i))}. Something was NULL when you used -> or [ ]. Check for NULL first!`
        : `🕳 Crash (segfault)${at(lineAfter(err, i))}: used an invalid pointer. Uninitialized? Already freed?`,
    });
  } else if (/Segmentation fault|SIGSEGV/.test(err)) {
    out.push({ severity: "error", message: "🕳 Crash (segfault): used a bad pointer (NULL, uninitialized, or freed). Turn on 🔍 memory check to get the line number." });
  }

  const leakRe = /(Direct|Indirect) leak of (\d+) byte\(s\) in (\d+) object\(s\) allocated from:([\s\S]*?)(?=\n\s*\n|(?:Direct|Indirect) leak|SUMMARY|$)/g;
  let m: RegExpExecArray | null;
  const leaks = new Map<string, { bytes: number; objs: number; line?: number }>();
  while ((m = leakRe.exec(err))) {
    const line = m[4].match(/example\.c:(\d+)/)?.[1];
    const key = line ?? "?";
    const prev = leaks.get(key) ?? { bytes: 0, objs: 0, line: line ? +line : undefined };
    prev.bytes += +m[2];
    prev.objs += +m[3];
    leaks.set(key, prev);
  }
  for (const L of leaks.values()) {
    out.push({
      severity: "warning",
      line: L.line,
      message: `💧 Memory leak: ${L.bytes} bytes in ${L.objs} block${L.objs > 1 ? "s" : ""} malloc'd${L.line ? ` on line ${L.line}` : ""} never got free()'d.`,
    });
  }

  const ub = /example\.c:(\d+):\d+: runtime error: ([^\n]+)/g;
  while ((m = ub.exec(err))) out.push({ severity: "warning", line: +m[1], message: `⚠️ Undefined behavior on line ${m[1]}: ${m[2]}` });

  return out;
}

export async function runC(source: string, stdin: string, memcheck: boolean): Promise<RunResult> {
  const t0 = Date.now();
  const flags = memcheck
    ? "-O0 -g -Wall -fno-omit-frame-pointer -fsanitize=address,undefined -fdiagnostics-color=never -lm"
    : "-O0 -g -Wall -fdiagnostics-color=never -lm";
  const body = {
    source: source + UNBUFFER,
    options: {
      userArguments: flags,
      executeParameters: { args: [], stdin },
      compilerOptions: { executorRequest: true },
      filters: { execute: true },
      tools: [],
      libraries: [],
    },
    lang: "c",
    allowStoreCodeDebug: false,
  };

  let j: {
    code?: number;
    didExecute?: boolean;
    timedOut?: boolean;
    buildResult?: { code?: number; stderr?: { text: string }[]; stdout?: { text: string }[] };
    stdout?: { text: string }[];
    stderr?: { text: string }[];
  };
  try {
    const res = await fetch(GODBOLT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) throw new Error(`Compiler service answered ${res.status}`);
    j = await res.json();
  } catch (e) {
    return {
      ok: false,
      stage: "network",
      diagnostics: [],
      problems: [{ severity: "error", message: `🌧 Couldn't reach the compiler (${e instanceof Error ? e.message : "network error"}). Are you online? Try again in a moment.` }],
      stdout: "",
      stderr: "",
      exitCode: null,
      timedOut: false,
      ms: Date.now() - t0,
    };
  }

  const buildErr = join(j.buildResult?.stderr);
  const diagnostics = parseDiagnostics(buildErr);
  const buildFailed = (j.buildResult?.code ?? 0) !== 0 || diagnostics.some((d) => d.severity === "error");

  if (buildFailed) {
    return {
      ok: false,
      stage: "compile",
      diagnostics,
      problems: diagnostics.length ? [] : [{ severity: "error", message: buildErr || "Build failed." }],
      stdout: "",
      stderr: buildErr,
      exitCode: null,
      timedOut: false,
      ms: Date.now() - t0,
    };
  }

  const stdout = join(j.stdout);
  const stderr = join(j.stderr);
  const timedOut = !!j.timedOut;
  const problems = explainRuntime(stderr, timedOut);
  const exitCode = typeof j.code === "number" ? j.code : null;
  return {
    ok: exitCode === 0 && !problems.some((p) => p.severity === "error") && !timedOut,
    stage: "run",
    diagnostics,
    problems,
    stdout,
    stderr,
    exitCode,
    timedOut,
    ms: Date.now() - t0,
  };
}
