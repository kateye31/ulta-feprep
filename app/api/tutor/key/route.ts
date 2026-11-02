import Anthropic from "@anthropic-ai/sdk";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * One-time setup for Juni: paste your Anthropic API key in the tutor panel and this route
 * checks it, saves it to .env.local (git-ignored), and switches the tutor on without a restart.
 * Only works from this computer (localhost), so nobody else can set or read your key.
 */
export const dynamic = "force-dynamic";

const ENV_FILE = path.join(process.cwd(), ".env.local");

function fromThisComputer(req: Request) {
  const host = (req.headers.get("host") ?? "").split(":")[0];
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

export async function GET() {
  return Response.json({ connected: !!process.env.ANTHROPIC_API_KEY });
}

export async function POST(req: Request) {
  if (!fromThisComputer(req)) return Response.json({ error: "The key can only be set from this computer (localhost)." }, { status: 403 });

  let key = "";
  try {
    key = String((await req.json()).key ?? "").trim();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }
  if (!/^sk-ant-[\w-]{20,}$/.test(key)) return Response.json({ error: "That doesn't look like an Anthropic API key. It should start with sk-ant-" }, { status: 400 });

  // make sure the key actually works before saving it
  try {
    await new Anthropic({ apiKey: key }).models.list({ limit: 1 });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) return Response.json({ error: "Anthropic didn't accept that key. Double-check you copied all of it." }, { status: 400 });
    if (e instanceof Anthropic.PermissionDeniedError) return Response.json({ error: "That key isn't allowed to use the API. Check your Anthropic console." }, { status: 400 });
    if (e instanceof Anthropic.APIConnectionError) return Response.json({ error: "Couldn't reach Anthropic to check the key. Are you online?" }, { status: 502 });
    // other errors (rate limits, etc.) don't mean the key is bad
  }

  // write ANTHROPIC_API_KEY into .env.local, keeping any other lines
  let lines: string[] = [];
  try {
    lines = (await fs.readFile(ENV_FILE, "utf8")).split(/\r?\n/).filter((l) => !/^\s*ANTHROPIC_API_KEY\s*=/.test(l));
  } catch {
    /* no file yet */
  }
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  lines.push(`ANTHROPIC_API_KEY=${key}`);
  await fs.writeFile(ENV_FILE, lines.join("\n") + "\n", "utf8");

  // live right away, no restart needed
  process.env.ANTHROPIC_API_KEY = key;
  return Response.json({ connected: true });
}
