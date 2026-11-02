// Usage: node --import ./scripts/alias.mjs scripts/verify-exam.ts scripts/verify-fe100.ts
// (re-exports the FE 100 practice set so verify-exam can check it like any exam)
export { FE_100 } from "../content/arcade/fe100";
