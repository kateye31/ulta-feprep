import { NextResponse } from "next/server";
import { runC } from "@/lib/runner";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { source?: unknown; stdin?: unknown; memcheck?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const source = typeof body.source === "string" ? body.source : "";
  const stdin = typeof body.stdin === "string" ? body.stdin : "";
  if (!source.trim()) return NextResponse.json({ error: "Nothing to run" }, { status: 400 });
  if (source.length > 100_000 || stdin.length > 50_000) return NextResponse.json({ error: "File too big" }, { status: 413 });
  return NextResponse.json(await runC(source, stdin, body.memcheck !== false));
}
