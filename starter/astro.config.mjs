// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

/**
 * FONTS — the only place typefaces are declared.
 * Each family maps to one CSS variable: --ff-display, --ff-text, --ff-mono.
 * src/styles/theme.css maps these into the type roles. Astro downloads and
 * self-hosts the files at build time (no third-party requests at runtime)
 * and generates metric-matched fallbacks to prevent layout shift.
 *
 * Pick families from harness/design/typography.md. Use variable fonts and a
 * weight range ("300 900") when available; otherwise list exact weights.
 * Providers: fontProviders.fontsource() (default), .google(), .fontshare().
 */
const fonts = [
  {
    provider: fontProviders.fontsource(),
    name: "Inter Tight",
    cssVariable: "--ff-display",
    weights: ["400 800"],
    styles: ["normal"],
    subsets: ["latin"],
    fallbacks: ["sans-serif"],
  },
  {
    provider: fontProviders.fontsource(),
    name: "Inter",
    cssVariable: "--ff-text",
    weights: ["400 600"],
    styles: ["normal"],
    subsets: ["latin"],
    fallbacks: ["sans-serif"],
  },
  {
    provider: fontProviders.fontsource(),
    name: "JetBrains Mono",
    cssVariable: "--ff-mono",
    weights: ["400 600"],
    styles: ["normal"],
    subsets: ["latin"],
    fallbacks: ["monospace"],
  },
];

/** `npm run export-html` builds a one-file preview into its own folder, leaving dist/ untouched. */
const exporting = process.env.HARNESS_EXPORT === "1";

export default defineConfig({
  // Production URL (canonical links, sitemap, OG tags). Keep in sync with site.config.ts.
  site: "https://example.com",
  trailingSlash: "ignore",
  outDir: exporting ? "./.export-build" : "./dist",
  integrations: [
    sitemap({ filter: (page) => !page.includes("/styleguide") }),
  ],
  fonts,
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
  vite: {
    plugins: [tailwindcss()],
  },
});
