# Site Harness

A Claude Code harness for designing and building professional, motion-rich
marketing websites from a brief and some initial copy. It handles single
product landings, multi-page marketing sites, lead-gen pages and agency/B2B sites.

It packages three things:

1. **A design process** (`.claude/skills/build-site`): brief → strategy →
   three concepts → system → build → screenshot-driven QA loop → hand-off.
   Every decision is written to `sites/<slug>/design/` so you can review it.
2. **Design knowledge** (`harness/`): principles distilled from the
   reference sites, type pairings, color and light, layout patterns, product
   artifacts, copywriting, a motion catalog with a budget and choreography
   rules, an 11-point review rubric, and an anti-pattern list.
3. **A production starter** (`starter/`): Astro 7 + Tailwind 4 + GSAP, with a
   token-only theme (Tailwind's default palette is disabled), a declarative
   motion engine, and components for heroes, product UI artifacts,
   scrollytelling, forms, FAQ, analytics and SEO.

## Quick start

```bash
nvm use               # Node 22.23+
npm install
npx playwright install chromium   # once, for QA screenshots
```

Then, in Claude Code from this folder:

> Build a site for this brief: … (paste what the site has to do + your copy)

Claude runs the build-site skill. Or drive it by hand:

```bash
npm run new-site -- acme "Acme"     # scaffold sites/acme
npm run dev -- acme                 # live preview at localhost:4321
npm run qa -- acme                  # build + screenshots + checks → sites/acme/qa/report.md
npm run og -- acme                  # social share image from the hero
npm run export-html -- acme         # single-file .html preview to email or open from disk
npm run build -- acme               # deploy sites/acme/dist anywhere static
```

## What to put in a brief

See `examples/briefs/nightshift.md`. The essentials:
- What the site has to do (the one action) and who it's for
- Initial copy (headline ideas, sections, FAQ), as rough as you like
- Facts and numbers you're allowed to use, plus any required disclosures
- Brand assets if any (or "open to direction")
- Where the CTA goes (URL, form endpoint, calendar link)

## The motion engine

Pages declare motion with attributes; modules load only when used, and
reduced-motion, no-JS and "pause motion" are handled centrally.

| Attribute / component | What it does |
|---|---|
| `data-reveal`, `data-reveal-group` | Entrances with stagger |
| `data-split="lines\|words\|chars"` | Headline reveals (GSAP SplitText) |
| `<Counter>` | Count-ups and odometer rolls |
| `<Mark>` | Hand-drawn highlight / circle / underline / strike / box |
| `data-sequence` | Self-playing product demos |
| `<StickyStory>` | Pinned visual that changes state per chapter |
| `data-scrub`, `data-parallax` | Scroll-linked progress (`--p`) and drift |
| `<Section atmos>` | Background light that shifts between sections |
| `data-tilt`, `data-magnetic`, `data-spotlight` | Pointer effects (desktop) |

Full catalog, recipes and rules: `harness/motion/motion.md`.

## QA

`npm run qa` opens the built site in Chromium at 1440, 834 and 390px and writes:
- a hero screenshot, a scroll-by-scroll contact sheet for each width, and full-page captures
- a filmstrip of the hero entrance (to judge choreography)
- reduced-motion and no-JS renders
- checks: console errors, 404s, horizontal overflow (with culprits), content left
  hidden, axe-core WCAG 2.1 AA, heading outline, alt text, dead links,
  placeholders, meta/OG, mobile tap targets and text size, JS/font/image
  budgets, LCP and CLS

Claude reads the images, scores them against `harness/quality/rubric.md`, and
iterates until the site passes (every dimension ≥ 4/5, total ≥ 44/55).

## Example

`sites/nightshift/` was built with the harness from `examples/briefs/nightshift.md`
(a fictional security company). Its `design/` folder shows the full record:
brief, strategy, three concepts and the choice, and two review rounds.

## Deploy

Each site builds to static files in `sites/<slug>/dist`. On Netlify, Vercel or
Cloudflare Pages, set the base directory to `sites/<slug>`, the build command
to `npm run build`, and the output directory to `dist`. Or upload `dist/`
anywhere.
