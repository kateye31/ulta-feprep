import Anthropic from "@anthropic-ai/sdk";
import { getExam } from "@/content/arcade";
import type { Item, Question, Step } from "@/lib/arcade/types";

/**
 * Juni, the Exam Arcade tutor. Streams Claude's answer back as plain text.
 * Needs ANTHROPIC_API_KEY in .env.local (restart `npm run dev` after adding it).
 */
export const dynamic = "force-dynamic";

const PERSONA = `You are Juni, a warm, patient tutor inside "FE Café", a cozy study game for UCF's Computer Science Foundation Exam (COP 3502, C programming).

The student is retaking the exam. They're good at tracing code but struggle with writing code from scratch, heaps, binary trees and runtime. They want to learn to write the code themselves, without AI writing it for them. Many of their lost points come from misreading the prompt (return type, malloc size, NULL checks, free order, dot vs arrow).

How to tutor:
- Nudge, don't spoil. Ask a guiding question or give a hint aimed at the exact step they're on. Never paste a full solution line for the current step unless they explicitly ask to see the answer after trying; even then, explain each piece.
- Keep replies short: 2–6 sentences, or a tiny list. Plain text only. Use \`backticks\` for code and **bold** sparingly. No headings or tables.
- Use everyday analogies when they help (cafés, trains, stacks of pancakes).
- If their typed attempt is wrong, name the specific part that's off and why, in C terms.
- Be encouraging but honest. Never make up exam rules; the official answer and rubric below are the source of truth.`;

function itemText(it: Item) {
  if (it.kind === "tree" && it.tree) {
    const v = Object.fromEntries(it.tree.nodes.map((n) => [n.id, n.v ?? `[${n.slot}]`]));
    return `${it.title} (tree, parent → child): ${it.tree.edges.map(([a, b]) => `${v[a]}→${v[b]}`).join(", ")}`;
  }
  if (it.kind === "table" && it.table) return `${it.title}:\n${[it.table.head, ...it.table.rows].map((r) => r.join(" | ")).join("\n")}`;
  return `${it.title}:\n${it.body ?? ""}`;
}

function stepText(s: Step) {
  const base = `Current step: "${s.title}" (${s.pts ?? 0} exam pts)\nPrompt: ${s.prompt}`;
  if (s.kind === "choice") return `${base}\nOptions: ${s.options.map((o, i) => `${i + 1}) ${o.t}${o.ok ? " [correct]" : ""}`).join(" · ")}`;
  if (s.kind === "type") return `${base}\nAccepted answers: ${s.answers.slice(0, 4).join("   OR   ")}`;
  if (s.kind === "slots") return `${base}\nBoxes and answers: ${s.slots.map((x) => `${x.label ?? x.id} = ${Array.isArray(x.answer) ? x.answer[0] : x.answer || "(empty)"}`).join(", ")}`;
  return base;
}

function context(q: Question, stepId: string | null, typed: string) {
  const step = q.steps.find((s) => s.id === stepId);
  return [
    `QUESTION ${q.id} (${q.pts} pts, ${q.category}: ${q.topic}): ${q.title}`,
    q.story,
    `What the student has been given:\n${q.given.map(itemText).join("\n\n")}`,
    step ? stepText(step) : "The student has finished every step of this question and is reviewing it.",
    typed ? `What the student has typed so far for this step: ${typed}` : "",
    `Official answer (for your reference; don't hand it over unprompted):\n${q.answer}`,
    `Exam-day takeaway: ${q.takeaway}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  let body: { exam?: string; q?: string; step?: string | null; typed?: string; messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }
  const exam = getExam(body.exam ?? "");
  const q = exam?.sections.flatMap((s) => s.questions).find((x) => x.id === body.q);
  if (!exam || !q) return Response.json({ error: "Unknown question." }, { status: 404 });

  const messages = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  if (!messages.length || messages[0].role !== "user") return Response.json({ error: "Ask Juni something first." }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Juni needs an API key. Paste one in the Connect box above.", needsKey: true },
      { status: 501 },
    );
  }

  const client = new Anthropic();
  const stream = client.beta.messages.stream({
    model: "claude-opus-5-5",
    max_tokens: 4000,
    output_config: { effort: "low" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [
      { type: "text", text: PERSONA },
      { type: "text", text: context(q, body.step ?? null, (body.typed ?? "").slice(0, 2000)), cache_control: { type: "ephemeral" } },
    ],
    messages,
  });

  const enc = new TextEncoder();
  const out = new ReadableStream<Uint8Array>({
    async start(ctrl) {
      try {
        for await (const ev of stream) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") ctrl.enqueue(enc.encode(ev.delta.text));
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") ctrl.enqueue(enc.encode("\n\n(I can't help with that one. Try asking about the C concept behind this step.)"));
      } catch (e) {
        let msg = "Juni lost the thread. Try again in a moment.";
        if (e instanceof Anthropic.AuthenticationError) msg = "That API key didn't work. Check ANTHROPIC_API_KEY in .env.local.";
        else if (e instanceof Anthropic.RateLimitError) msg = "Juni's a bit busy (rate limit). Wait a few seconds and ask again.";
        else if (e instanceof Anthropic.APIConnectionError) msg = "Couldn't reach the AI service. Are you online?";
        ctrl.enqueue(enc.encode(`\n\n(${msg})`));
      } finally {
        ctrl.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(out, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
