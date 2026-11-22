#!/usr/bin/env node
// Run an Astro command for a site: `npm run dev -- <slug>`, `npm run build -- <slug>`
import { spawnSync } from "node:child_process";
import { resolveSite } from "./lib.mjs";

const [cmd, target, ...rest] = process.argv.slice(2);
const dir = resolveSite(target);
const r = spawnSync("npx", ["astro", cmd, ...rest], { cwd: dir, stdio: "inherit" });
process.exit(r.status ?? 0);
