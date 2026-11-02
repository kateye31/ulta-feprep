// Lets plain `node` run the project's .ts files: resolves "@/..." and extensionless relative imports.
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
const ROOT = fileURLToPath(new URL("..", import.meta.url));
export async function resolve(spec, ctx, next) {
  let p = null;
  if (spec.startsWith("@/")) p = ROOT + spec.slice(2);
  else if ((spec.startsWith("./") || spec.startsWith("../")) && ctx.parentURL?.startsWith("file:") && !/\.\w+$/.test(spec)) p = fileURLToPath(new URL(spec, ctx.parentURL));
  if (p) for (const ext of [".ts", "/index.ts"]) if (existsSync(p + ext)) return next(pathToFileURL(p + ext).href, ctx);
  return next(spec, ctx);
}
