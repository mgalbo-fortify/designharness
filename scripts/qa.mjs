#!/usr/bin/env node
/**
 * QA — builds a site, opens it in a real browser at three widths, and writes
 * everything a design review needs to <site>/qa/:
 *
 *   report.md                 issues to fix (blocking first) + images to review
 *   <page>/desktop-hero.png   first impression at 1440×900
 *   <page>/<vp>-sheet.png     contact sheet: the page scrolled screen by screen,
 *                             so scroll reveals have fired (desktop, tablet, mobile)
 *   <page>/<vp>-full.png      full-page capture after scrolling
 *   <page>/filmstrip.png      the hero's entrance choreography over ~2.5s
 *   <page>/reduced-hero.png   hero with prefers-reduced-motion
 *   <page>/nojs-hero.png      hero with JavaScript disabled
 *
 * Checks: console/page errors, failed requests, horizontal overflow (with
 * culprits), content left hidden, axe-core WCAG 2.1 AA, heading outline,
 * missing alt text, dead links, placeholder text, meta/OG tags, tap targets
 * and tiny text on mobile, page weight, LCP and CLS.
 *
 * Usage: npm run qa -- <slug|starter|path> [--pages=/,/pricing] [--no-build] [--quick]
 *   --quick   desktop + mobile only, no filmstrip (fast iteration)
 * Exit code 1 when blocking issues exist.
 */
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { build, launch, listPages, resolveSite, serve } from "./lib.mjs";

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
const siteDir = resolveSite(args.find((a) => !a.startsWith("--")));
const quick = !!flag("quick");
const outDir = path.join(siteDir, "qa");

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 834, height: 1112, isMobile: true, hasTouch: true },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
].filter((v) => !quick || v.name !== "tablet");

const issues = []; // { severity: "blocking"|"warn", page, where, msg }
const add = (severity, page, where, msg) => issues.push({ severity, page, where, msg });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (p) => (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replaceAll("/", "_"));

if (!flag("no-build")) build(siteDir);
const dist = path.join(siteDir, "dist");
const { server, origin } = await serve(dist);
const pages = flag("pages") ? flag("pages").split("=")[1].split(",") : listPages(dist);
mkdirSync(outDir, { recursive: true });

const browser = await launch();
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const metrics = {};

/** Compose screenshots into one image using the browser itself. */
async function composite(images, file, { cols, cellWidth, label }) {
  const page = await browser.newPage({ viewport: { width: cols * cellWidth + (cols + 1) * 16, height: 400 } });
  const cells = images
    .map((buf, i) => `<figure><img src="data:image/png;base64,${buf.toString("base64")}"><figcaption>${label(i)}</figcaption></figure>`)
    .join("");
  await page.setContent(`<style>
    body{margin:0;padding:16px;background:#1d1f24;font:12px/1.2 ui-monospace,monospace;color:#9aa0aa}
    main{display:grid;grid-template-columns:repeat(${cols},${cellWidth}px);gap:16px}
    figure{margin:0} img{width:100%;display:block;border-radius:4px;box-shadow:0 0 0 1px #000}
    figcaption{padding-top:6px}</style><main>${cells}</main>`);
  await page.waitForLoadState("load");
  await page.screenshot({ path: file, fullPage: true });
  await page.close();
}

async function newPage(vp, extra = {}) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: vp.isMobile ?? false,
    hasTouch: vp.hasTouch ?? false,
    reducedMotion: "no-preference",
    ...extra,
  });
  const page = await ctx.newPage();
  return { ctx, page };
}

function watch(page, pagePath, vpName) {
  const bytes = { js: 0, css: 0, font: 0, image: 0, other: 0 };
  page.on("console", (m) => {
    if (m.type() === "error") add("blocking", pagePath, vpName, `Console error: ${m.text().slice(0, 200)}`);
  });
  page.on("pageerror", (e) => add("blocking", pagePath, vpName, `Uncaught exception: ${e.message.slice(0, 200)}`));
  page.on("response", async (res) => {
    const url = res.url();
    if (res.status() >= 400 && url.startsWith(origin)) add("blocking", pagePath, vpName, `HTTP ${res.status()}: ${url.replace(origin, "")}`);
    try {
      const len = (await res.body()).length;
      const t = res.request().resourceType();
      const k = t === "script" ? "js" : t === "stylesheet" ? "css" : t === "font" ? "font" : t === "image" ? "image" : "other";
      bytes[k] += len;
    } catch {}
  });
  return bytes;
}

async function scrollThrough(page, vp, pagePath, dir) {
  const frames = [];
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const step = Math.round(vp.height * 0.85);
  const limit = vp.name === "desktop" ? 30 : 40;
  frames.push(await page.screenshot());
  for (let y = step; y < max + step && frames.length < limit; y += step) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), Math.min(y, max));
    await sleep(950);
    frames.push(await page.screenshot());
  }
  const cols = vp.name === "mobile" ? 5 : vp.name === "tablet" ? 4 : 3;
  const cellWidth = vp.name === "mobile" ? 260 : vp.name === "tablet" ? 300 : 480;
  await composite(frames, path.join(dir, `${vp.name}-sheet.png`), { cols, cellWidth, label: (i) => `${vp.name} · screen ${i + 1}` });
  if (frames.length >= limit) add("warn", pagePath, vp.name, `Page is very long (${frames.length}+ screens). Consider cutting.`);
}

async function layoutChecks(page, vp, pagePath) {
  const r = await page.evaluate((isMobile) => {
    const vw = document.documentElement.clientWidth;
    const out = { overflow: [], hidden: [], tiny: [], taps: [], scrollWidth: document.documentElement.scrollWidth, vw };
    const visible = (el) => {
      const s = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return s.display !== "none" && s.visibility !== "hidden" && rect.width > 0 && rect.height > 0 && !el.closest("[aria-hidden=true],[inert]");
    };
    const label = (el) => {
      const cls = typeof el.className === "string" ? el.className.split(" ").filter(Boolean).slice(0, 2).join(".") : "";
      const txt = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
      return `<${el.tagName.toLowerCase()}${cls ? "." + cls : ""}>${txt ? ` "${txt}"` : ""}`;
    };
    if (out.scrollWidth > vw + 1) {
      for (const el of document.querySelectorAll("body *")) {
        const rect = el.getBoundingClientRect();
        if (rect.right > vw + 1 && rect.width > 0 && !el.closest("[data-atmosphere]")) {
          if (!el.parentElement || el.parentElement.getBoundingClientRect().right <= vw + 1) out.overflow.push(label(el));
        }
        if (out.overflow.length >= 6) break;
      }
    }
    // Content that should be revealed by now but isn't.
    for (const el of document.querySelectorAll("[data-reveal]:not(.is-in), [data-split]:not(.is-split)")) {
      // Skip things that aren't rendered at this width (display:none ancestors) or inactive story views.
      if (el.getClientRects().length && !el.closest("[data-story-view]:not(.is-active)")) out.hidden.push(label(el));
    }
    if (isMobile) {
      for (const el of document.querySelectorAll("p, li, span, a, label, small, figcaption, td, th, dd")) {
        if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        if (!visible(el)) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < 12) out.tiny.push(`${label(el)} ${fs}px`);
      }
      for (const el of document.querySelectorAll("a[href], button, summary, input:not([type=hidden]), select, textarea, [role=button]")) {
        if (!visible(el)) continue;
        if (el.closest("p, li p, .prose")) continue; // inline text links are exempt (WCAG 2.5.8)
        const rect = el.getBoundingClientRect();
        if (rect.height < 40 || rect.width < 40) out.taps.push(`${label(el)} ${Math.round(rect.width)}×${Math.round(rect.height)}`);
      }
    }
    return out;
  }, !!vp.isMobile);

  if (r.overflow.length || r.scrollWidth > r.vw + 1)
    add("blocking", pagePath, vp.name, `Horizontal overflow (${r.scrollWidth}px > ${r.vw}px). Culprits: ${r.overflow.join(", ") || "unknown"}`);
  if (r.hidden.length) add("blocking", pagePath, vp.name, `Content never revealed after scrolling through: ${r.hidden.slice(0, 6).join(", ")}`);
  if (r.tiny.length) add("warn", pagePath, vp.name, `Text under 12px: ${r.tiny.slice(0, 5).join(", ")}${r.tiny.length > 5 ? ` (+${r.tiny.length - 5})` : ""}`);
  if (r.taps.length) add("warn", pagePath, vp.name, `Tap targets under 40px: ${r.taps.slice(0, 5).join(", ")}${r.taps.length > 5 ? ` (+${r.taps.length - 5})` : ""}`);
}

async function contentChecks(page, pagePath) {
  const r = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const text = document.body.innerText;
    const placeholders = [...text.matchAll(/\[[^\]\n]{3,80}\]|lorem ipsum|\bTODO\b|\bTBD\b|\bXXX\b|example\.com/gi)].map((m) => m[0]).slice(0, 8);
    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
    const skips = [];
    headings.forEach((l, i) => i && l > headings[i - 1] + 1 && skips.push(`h${headings[i - 1]}→h${l}`));
    return {
      title: document.title,
      desc: q('meta[name="description"]')?.content ?? "",
      canonical: q('link[rel="canonical"]')?.href ?? "",
      ogImage: q('meta[property="og:image"]')?.content ?? "",
      lang: document.documentElement.lang,
      h1: headings.filter((l) => l === 1).length,
      skips,
      noAlt: [...document.querySelectorAll("img:not([alt])")].map((i) => i.src.split("/").pop()).slice(0, 5),
      deadLinks: [...document.querySelectorAll('a[href="#"], a[href=""], a:not([href])')].filter((a) => !a.closest("[aria-hidden=true]")).map((a) => (a.textContent || "").trim().slice(0, 30)).slice(0, 6),
      placeholders,
      noindex: !!q('meta[name="robots"][content*="noindex"]'),
    };
  });
  const isStyleguide = pagePath.includes("styleguide");
  if (r.placeholders.length && !isStyleguide) add("blocking", pagePath, "content", `Placeholder text: ${r.placeholders.map((p) => `"${p}"`).join(", ")}`);
  if (r.h1 !== 1) add("blocking", pagePath, "content", `Expected exactly one <h1>, found ${r.h1}.`);
  if (r.skips.length) add("warn", pagePath, "content", `Heading levels skip: ${r.skips.join(", ")}`);
  if (r.noAlt.length) add("blocking", pagePath, "content", `Images missing alt (use alt="" if decorative): ${r.noAlt.join(", ")}`);
  if (r.deadLinks.length && !isStyleguide) add("blocking", pagePath, "content", `Dead links (href="#" or empty): ${r.deadLinks.map((t) => `"${t}"`).join(", ")}`);
  if (!r.lang) add("blocking", pagePath, "content", "Missing <html lang>.");
  if (!isStyleguide && !r.noindex) {
    if (r.title.length < 15 || r.title.length > 65) add("warn", pagePath, "seo", `Title is ${r.title.length} chars (aim 30–60): "${r.title}"`);
    if (r.desc.length < 70 || r.desc.length > 165) add("warn", pagePath, "seo", `Meta description is ${r.desc.length} chars (aim 120–160).`);
  }
  if (r.ogImage) {
    const ogPath = new URL(r.ogImage).pathname;
    const res = await fetch(origin + ogPath).catch(() => null);
    if (!res || !res.ok) add("warn", pagePath, "seo", `OG image ${ogPath} not found. Run \`npm run og -- <site>\` to generate one.`);
  }
}

async function axeCheck(page, pagePath) {
  await page.addScriptTag({ content: axeSource });
  const res = await page.evaluate(async () =>
    // eslint-disable-next-line no-undef
    axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] }, resultTypes: ["violations"] }),
  );
  for (const v of res.violations) {
    if (v.id === "region" || v.id === "landmark-unique") continue; // noisy for marketing layouts
    const sev = v.impact === "critical" || v.impact === "serious" ? "blocking" : "warn";
    const nodes = v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ");
    add(sev, pagePath, "a11y", `${v.id} (${v.impact}, ${v.nodes.length}×): ${v.help}. e.g. ${nodes}`);
  }
}

async function vitals(page) {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        let lcp = 0;
        let cls = 0;
        new PerformanceObserver((l) => l.getEntries().forEach((e) => (lcp = e.startTime))).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (cls += e.value))).observe({ type: "layout-shift", buffered: true });
        setTimeout(() => resolve({ lcp: Math.round(lcp), cls: +cls.toFixed(3) }), 400);
      }),
  );
}

async function filmstrip(pagePath, dir) {
  const { ctx, page } = await newPage(VIEWPORTS[0]);
  const shots = [];
  const times = [150, 400, 700, 1000, 1400, 2000, 2800];
  await page.goto(origin + pagePath, { waitUntil: "domcontentloaded" });
  const t0 = Date.now();
  for (const t of times) {
    await sleep(Math.max(0, t - (Date.now() - t0)));
    shots.push(await page.screenshot());
  }
  await composite(shots, path.join(dir, "filmstrip.png"), { cols: 4, cellWidth: 420, label: (i) => `t ≈ ${times[i]}ms` });
  await ctx.close();
}

async function stateCheck(pagePath, dir, mode) {
  const opts = mode === "reduced" ? { reducedMotion: "reduce" } : { javaScriptEnabled: false };
  const { ctx, page } = await newPage(VIEWPORTS[0], opts);
  await page.goto(origin + pagePath, { waitUntil: "networkidle" });
  await sleep(mode === "reduced" ? 900 : 300);
  await page.screenshot({ path: path.join(dir, `${mode === "reduced" ? "reduced" : "nojs"}-hero.png`) });
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll("[data-reveal], [data-split], [data-seq], h1, h2, h3, p, .btn")]
      .filter((el) => !el.closest("[aria-hidden=true], [data-story-view]:not(.is-active), [hidden], .lead__success"))
      .filter((el) => {
        if (!el.getClientRects().length) return false; // not rendered at this width
        const s = getComputedStyle(el);
        return parseFloat(s.opacity) < 0.95 || s.visibility === "hidden";
      })
      .map((el) => `<${el.tagName.toLowerCase()}> "${(el.textContent || "").trim().slice(0, 40)}"`)
      .slice(0, 6),
  );
  if (hidden.length) add("blocking", pagePath, mode === "reduced" ? "reduced-motion" : "no-js", `Content invisible: ${hidden.join(", ")}`);
  await ctx.close();
}

// ---------------------------------------------------------------------------
for (const pagePath of pages) {
  const dir = path.join(outDir, slug(pagePath));
  rmSync(dir, { recursive: true, force: true }); // fresh images for pages being checked; others are kept
  mkdirSync(dir, { recursive: true });
  console.log(`\n▸ ${pagePath}`);

  for (const vp of VIEWPORTS) {
    const { ctx, page } = await newPage(vp);
    const bytes = watch(page, pagePath, vp.name);
    await page.goto(origin + pagePath, { waitUntil: "networkidle" });
    await sleep(2800); // let the hero choreography finish
    if (vp.name === "desktop") {
      await page.screenshot({ path: path.join(dir, "desktop-hero.png") });
      metrics[pagePath] = { ...(await vitals(page)), bytes };
    }
    if (vp.name === "mobile") await page.screenshot({ path: path.join(dir, "mobile-hero.png") });
    await scrollThrough(page, vp, pagePath, dir);
    await layoutChecks(page, vp, pagePath);
    if (vp.name !== "tablet") {
      await page.screenshot({ path: path.join(dir, `${vp.name}-full.png`), fullPage: true }).catch(() => {});
    }
    if (vp.name === "desktop") {
      await contentChecks(page, pagePath);
      await axeCheck(page, pagePath);
    }
    await ctx.close();
    console.log(`  ✓ ${vp.name}`);
  }

  if (!quick) {
    await filmstrip(pagePath, dir);
    console.log("  ✓ filmstrip");
  }
  await stateCheck(pagePath, dir, "reduced");
  await stateCheck(pagePath, dir, "nojs");
  console.log("  ✓ reduced-motion + no-JS");
}

await browser.close();
server.close();

// ---------------------------------------------------------------------------
// Budgets (gzip is ~30% of these raw sizes).
for (const [p, m] of Object.entries(metrics)) {
  const kb = (n) => Math.round(n / 1024);
  if (kb(m.bytes.js) > 350) add("warn", p, "perf", `JavaScript is ${kb(m.bytes.js)}KB raw (budget 350KB).`);
  if (kb(m.bytes.image) > 1500) add("warn", p, "perf", `Images total ${kb(m.bytes.image)}KB (budget 1.5MB). Use <Image>/AVIF and lazy-load below the fold.`);
  if (kb(m.bytes.font) > 300) add("warn", p, "perf", `Fonts total ${kb(m.bytes.font)}KB (budget 300KB). Trim weights/families.`);
  if (m.cls > 0.05) add("blocking", p, "perf", `Cumulative Layout Shift ${m.cls} (must be ≤ 0.05).`);
  if (m.lcp > 2500) add("warn", p, "perf", `LCP ${m.lcp}ms on localhost (aim < 1500ms locally).`);
}

const blocking = issues.filter((i) => i.severity === "blocking");
const warns = issues.filter((i) => i.severity === "warn");
const fmt = (i) => `- **${i.page}** · ${i.where} — ${i.msg}`;
const rel = (p) => path.relative(siteDir, p);

let md = `# QA report — ${path.basename(siteDir)}\n\n`;
md += `${new Date().toISOString()} · ${pages.length} page(s) · ${blocking.length} blocking · ${warns.length} warnings\n\n`;
md += `## Blocking (fix all before review)\n\n${blocking.length ? blocking.map(fmt).join("\n") : "None."}\n\n`;
md += `## Warnings (fix or justify)\n\n${warns.length ? warns.map(fmt).join("\n") : "None."}\n\n`;
md += `## Metrics (desktop, localhost)\n\n| Page | LCP | CLS | JS | CSS | Fonts | Images |\n|---|---|---|---|---|---|---|\n`;
for (const [p, m] of Object.entries(metrics)) {
  const kb = (n) => `${Math.round(n / 1024)}KB`;
  md += `| ${p} | ${m.lcp}ms | ${m.cls} | ${kb(m.bytes.js)} | ${kb(m.bytes.css)} | ${kb(m.bytes.font)} | ${kb(m.bytes.image)} |\n`;
}
md += `\n## Review these images (in order)\n\nScore them against harness/quality/rubric.md.\n\n`;
for (const p of pages) {
  const d = path.join(outDir, slug(p));
  md += `**${p}**\n`;
  for (const f of ["desktop-hero.png", "filmstrip.png", "desktop-sheet.png", "mobile-hero.png", "mobile-sheet.png", "tablet-sheet.png", "reduced-hero.png", "nojs-hero.png", "desktop-full.png", "mobile-full.png"]) {
    if (existsSync(path.join(d, f))) md += `- ${rel(path.join(d, f))}\n`;
  }
  md += "\n";
}
writeFileSync(path.join(outDir, "report.md"), md);
writeFileSync(path.join(outDir, "report.json"), JSON.stringify({ issues, metrics }, null, 2));

console.log(`\n${blocking.length} blocking · ${warns.length} warnings → ${rel(path.join(outDir, "report.md"))}`);
for (const i of blocking) console.log(`  ✗ ${i.page} · ${i.where} — ${i.msg}`);
process.exit(blocking.length ? 1 : 0);
