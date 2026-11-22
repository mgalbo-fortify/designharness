#!/usr/bin/env node
// Scaffold a new site from the starter: `npm run new-site -- <slug> ["Site Name"]`
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { ROOT } from "./lib.mjs";

const [slug, nameArg] = process.argv.slice(2);
if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error('Usage: npm run new-site -- <slug> ["Site Name"]   (slug: lowercase, digits, hyphens)');
  process.exit(1);
}
const dest = path.join(ROOT, "sites", slug);
if (existsSync(dest)) {
  console.error(`sites/${slug} already exists.`);
  process.exit(1);
}

const skip = new Set(["node_modules", "dist", ".astro", "qa"]);
cpSync(path.join(ROOT, "starter"), dest, {
  recursive: true,
  filter: (src) => !skip.has(path.basename(src)),
});

const name = nameArg || slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const pkgPath = path.join(dest, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.name = `site-${slug}`;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

const cfgPath = path.join(dest, "src/site.config.ts");
writeFileSync(
  cfgPath,
  readFileSync(cfgPath, "utf8")
    .replace('name: "Starter"', `name: ${JSON.stringify(name)}`)
    .replace('legalName: "Starter, Inc."', `legalName: ${JSON.stringify(name)}`)
    .replace('titleTemplate: "%s · Starter"', `titleTemplate: ${JSON.stringify(`%s · ${name}`)}`),
);

mkdirSync(path.join(dest, "design"), { recursive: true });
writeFileSync(
  path.join(dest, "design", "README.md"),
  `# ${name}: design record

| File | Phase | Contents |
|---|---|---|
| brief-original.md | 0 | The user's brief and copy, verbatim. Never edited. |
| brief.md | 1 | Structured brief, assumptions, open questions |
| strategy.md | 2 | Message hierarchy, narrative arc, section plan |
| concept.md | 3 | Three directions, the choice, tokens and the motion budget |
| review.md | 6 | Rubric scores and fixes per QA round |
`,
);

console.log(`Created sites/${slug}. Linking workspace dependencies…`);
const r = spawnSync("npm", ["install", "--no-audit", "--no-fund"], { cwd: ROOT, stdio: "inherit" });
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`
Next:
  npm run dev -- ${slug}        live preview
  npm run qa -- ${slug}         build + screenshots + checks → sites/${slug}/qa/report.md
`);
