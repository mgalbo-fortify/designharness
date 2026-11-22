#!/usr/bin/env node
/**
 * Generate the 1200×630 social share image from the site's hero.
 *   npm run og -- <slug> [--path=/] [--no-build]
 * Writes <site>/public/og.png. Rebuild afterwards so dist/ includes it.
 * For a bespoke OG card, create src/pages/og-card.astro (noindex, bare layout,
 * 1200×630 composition) and run with --path=/og-card/.
 */
import path from "node:path";
import { build, launch, resolveSite, serve } from "./lib.mjs";

const args = process.argv.slice(2);
const siteDir = resolveSite(args.find((a) => !a.startsWith("--")));
const pagePath = (args.find((a) => a.startsWith("--path=")) ?? "--path=/").split("=")[1];
if (!args.includes("--no-build")) build(siteDir);

const { server, origin } = await serve(path.join(siteDir, "dist"));
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
await page.goto(origin + pagePath, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const out = path.join(siteDir, "public", "og.png");
await page.screenshot({ path: out, scale: "css" });
await browser.close();
server.close();
console.log(`Wrote ${path.relative(process.cwd(), out)} (1200×630). Rebuild to include it in dist/.`);
