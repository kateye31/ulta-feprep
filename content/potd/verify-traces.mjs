// Run with: node --import ./scripts/alias.mjs content/potd/verify-traces.mjs
import { POTD_BANK } from "./index.ts";

const traces = POTD_BANK.filter((p) => p.kind === "trace");
let failures = 0;
for (const item of traces) {
  const response = await fetch("https://godbolt.org/api/compiler/cg141/compile", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      source: item.code,
      options: {
        userArguments: "-O0",
        executeParameters: { args: [], stdin: "" },
        compilerOptions: { executorRequest: true },
        filters: { execute: true },
      },
    }),
  });
  if (!response.ok) throw new Error(`${item.id}: HTTP ${response.status}`);
  const result = await response.json();
  const stdout = (result.stdout ?? result.execResult?.stdout ?? [])
    .map((line) => typeof line === "string" ? line : line.text ?? "")
    .join("\n").trim();
  const expected = item.answers.map((s) => s.trim());
  const ok = expected.includes(stdout) && !result.code && !result.execResult?.code;
  console.log(`${ok ? "PASS" : "FAIL"} ${item.id}: ${JSON.stringify(stdout)} (expected ${expected.join(" | ")})`);
  if (!ok) {
    failures++;
    if (result.stderr?.length) console.log(result.stderr);
    if (result.execResult?.stderr?.length) console.log(result.execResult.stderr);
  }
}
if (failures) process.exitCode = 1;
