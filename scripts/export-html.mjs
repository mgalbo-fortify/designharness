#!/usr/bin/env node
/**
 * Export one page of a built site as a single self-contained .html file
 * (CSS, fonts, JS and favicon inlined). Handy for emailing a preview or
 * opening without a server. For production, deploy dist/ instead: the
 * multi-file build caches better and loads motion modules on demand.
 *
 *   npm run export-html -- <slug> [--path=/]
 * Writes <site>/export/<page>.html
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { rolldown } from "rolldown";
import { build, resolveSite } from "./lib.mjs";

const args = process.argv.slice(2);
const siteDir = resolveSite(args.find((a) => !a.startsWith("--")));
const pagePath = (args.find((a) => a.startsWith("--path=")) ?? "--path=/").split("=")[1];
// Separate build into .export-build/ (see astro.config.mjs), so dist/ stays deployable.
build(siteDir, { HARNESS_EXPORT: "1" });

const dist = path.join(siteDir, ".export-build");
const htmlFile = path.join(dist, pagePath.replace(/^\//, ""), pagePath.endsWith(".html") ? "" : "index.html");
if (!existsSync(htmlFile)) throw new Error(`No built page at ${htmlFile}`);
let html = readFileSync(htmlFile, "utf8");
const fromDist = (url) => path.join(dist, decodeURIComponent(url.split(/[?#]/)[0]).replace(/^\//, ""));

const MIME = { ".woff2": "font/woff2", ".woff": "font/woff", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif" };
const dataUri = (file) => `data:${MIME[path.extname(file)] ?? "application/octet-stream"};base64,${readFileSync(file).toString("base64")}`;
// Inline any local asset referenced with url(...) (fonts, images in CSS).
const inlineUrls = (css) =>
  css.replace(/url\((['"]?)(\/[^)'"]+)\1\)/g, (m, q, url) => (existsSync(fromDist(url)) ? `url("${dataUri(fromDist(url))}")` : m));

// 1. Stylesheets → one <style>
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, href) => `<style>${inlineUrls(readFileSync(fromDist(href), "utf8"))}</style>`);
// Inline <style> blocks (e.g. Astro's @font-face) may also reference assets.
html = html.replace(/<style>([\s\S]*?)<\/style>/g, (_, css) => `<style>${inlineUrls(css)}</style>`);
// Font preloads point at files that no longer exist separately.
html = html.replace(/<link rel="preload"[^>]*as="font"[^>]*>/g, "");
// Favicon
html = html.replace(/<link rel="icon" href="([^"]+)"/, (m, href) => (existsSync(fromDist(href)) ? `<link rel="icon" href="${dataUri(fromDist(href))}"` : m));
html = html.replace(/<link rel="sitemap"[^>]*>/, "");

// 2. Module scripts → one bundle with dynamic imports inlined
const srcs = [...html.matchAll(/<script type="module" src="([^"]+)"><\/script>/g)].map((m) => m[1]);
html = html.replace(/<script type="module" src="[^"]+"><\/script>/g, "");
if (srcs.length) {
  // Everything gets inlined, so Vite's module-preload lists must go: a call like
  // __vite__mapDeps([0,1,2]) would otherwise fetch the now-missing chunk files.
  for (const f of readdirSync(path.join(dist, "_astro")).filter((f) => f.endsWith(".js"))) {
    const file = path.join(dist, "_astro", f);
    writeFileSync(file, readFileSync(file, "utf8").replace(/__vite__mapDeps\(\[[\d,\s]*\]\)/g, "[]"));
  }
  const entry = path.join(dist, "_astro", `__export_entry_${Date.now()}.js`);
  writeFileSync(entry, srcs.map((s) => `import ${JSON.stringify("./" + path.relative(path.dirname(entry), fromDist(s)))};`).join("\n"));
  try {
    const bundle = await rolldown({
      input: entry,
      logLevel: "silent",
      // Built chunks import each other by root-absolute URL (/_astro/x.js); map those to dist/.
      plugins: [{ name: "dist-root", resolveId: (id) => (id.startsWith("/") && existsSync(fromDist(id)) ? fromDist(id) : null) }],
    });
    const { output } = await bundle.generate({ format: "esm", codeSplitting: false, minify: true });
    const js = output
      .find((o) => o.type === "chunk")
      .code
      .replace(/<\/script/gi, "<\\/script");
    // Safety net: never let a failed preload cancel an import.
    const guard = `addEventListener("vite:preloadError",(e)=>e.preventDefault());`;
    html = html.replace("</body>", `<script type="module">${guard}${js}</script></body>`);
  } finally {
    rmSync(entry, { force: true });
  }
}

rmSync(dist, { recursive: true, force: true });
const outDir = path.join(siteDir, "export");
mkdirSync(outDir, { recursive: true });
const name = pagePath === "/" ? "index" : pagePath.replace(/^\/|\/$/g, "").replaceAll("/", "_");
const out = path.join(outDir, `${path.basename(siteDir)}-${name}.html`);
writeFileSync(out, html);
console.log(`Wrote ${path.relative(process.cwd(), out)} (${Math.round(html.length / 1024)}KB, self-contained)`);
