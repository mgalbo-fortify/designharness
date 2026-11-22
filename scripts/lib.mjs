// Shared helpers for harness scripts: resolve a site, build it, serve dist/,
// and launch Chromium.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** "my-site" → sites/my-site; "starter" → starter; or any path to an Astro project. */
export function resolveSite(arg) {
  if (!arg) throw new Error("Pass a site: `npm run qa -- <slug>` (folder in sites/), `starter`, or a path.");
  const candidates = [path.resolve(arg), path.join(ROOT, "sites", arg), path.join(ROOT, arg)];
  const dir = candidates.find((d) => existsSync(path.join(d, "astro.config.mjs")));
  if (!dir) throw new Error(`No Astro project found for "${arg}". Looked in:\n  ${candidates.join("\n  ")}`);
  return dir;
}

export function build(dir) {
  const r = spawnSync("npx", ["astro", "build"], { cwd: dir, stdio: "inherit", env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" } });
  if (r.status !== 0) throw new Error("Build failed. Fix the errors above, then run QA again.");
}

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif", ".ico": "image/x-icon", ".woff2": "font/woff2",
  ".woff": "font/woff", ".xml": "application/xml", ".txt": "text/plain", ".mp4": "video/mp4", ".webm": "video/webm",
};

/** Serve a static dist/ folder like a real host (clean URLs, 404 page). */
export function serve(dist) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    let p = path.join(dist, decodeURIComponent(url.pathname));
    if (!p.startsWith(dist)) return res.writeHead(403).end();
    if (existsSync(p) && statSync(p).isDirectory()) p = path.join(p, "index.html");
    else if (!existsSync(p) && existsSync(`${p}.html`)) p = `${p}.html`;
    if (!existsSync(p)) {
      const nf = path.join(dist, "404.html");
      res.writeHead(404, { "content-type": TYPES[".html"] });
      return res.end(existsSync(nf) ? readFileSync(nf) : "Not found");
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(p)] ?? "application/octet-stream" });
    res.end(readFileSync(p));
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve({ server, origin: `http://127.0.0.1:${server.address().port}` }));
  });
}

/** All HTML pages in dist as URL paths ("/", "/about/"). */
export function listPages(dist) {
  const out = [];
  const walk = (d) => {
    for (const f of readdirSync(d)) {
      const full = path.join(d, f);
      if (statSync(full).isDirectory()) walk(full);
      else if (f.endsWith(".html") && f !== "404.html") {
        const rel = path.relative(dist, full).replaceAll(path.sep, "/");
        out.push("/" + rel.replace(/index\.html$/, "").replace(/\.html$/, ""));
      }
    }
  };
  walk(dist);
  return out.sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)));
}

/** Launch Chromium from the project's Playwright, falling back to a preinstalled browser. */
export async function launch() {
  const { chromium } = await import("playwright");
  try {
    return await chromium.launch();
  } catch (err) {
    const fallbacks = [process.env.PW_CHROMIUM_PATH, "/opt/pw-browsers/chromium"].filter(Boolean);
    for (const executablePath of fallbacks) {
      if (existsSync(executablePath)) return chromium.launch({ executablePath, args: ["--no-sandbox"] });
    }
    throw new Error(`${err.message}\n\nInstall a browser once with: npx playwright install chromium`);
  }
}
