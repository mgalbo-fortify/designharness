# Site Harness

A system for designing and building high-end, motion-rich marketing
websites from a brief. Quality bar: the reference sites in
`harness/references/reference-sites.md`.

## When the user wants a website

Use the **build-site** skill (`.claude/skills/build-site/SKILL.md`). It runs
brief → strategy → concept → system → build → QA loop → hand-off, and writes
its decisions to `sites/<slug>/design/`. Read `harness/principles.md` first.

## Layout

```
harness/            design knowledge: principles, process, typography, color,
                    layout, artifacts, copy, motion, rubric, anti-patterns
starter/            Astro 7 + Tailwind 4 + GSAP template (never edit for one site)
  src/styles/       theme.css (per-site tokens), base.css, motion.css
  src/motion/       declarative motion engine (data-* attributes)
  src/components/   layout, ui, artifacts (product UI), sections, visual
  src/site.config.ts  single source of truth for facts, nav, CTA, analytics
sites/<slug>/       one folder per site, copied from starter/
scripts/            new-site, run (dev/build), qa, og
```

## Commands

```bash
npm run new-site -- <slug> "Name"   # scaffold sites/<slug> from starter
npm run dev -- <slug>               # dev server
npm run build -- <slug>             # static build → sites/<slug>/dist
npm run qa -- <slug> [--quick] [--pages=/,/pricing/] [--no-build]
npm run og -- <slug>                # social image from the hero → public/og.png
```

QA writes `sites/<slug>/qa/report.md` plus screenshots. Always look at the
screenshots (Read the PNGs) before calling anything done.

## Rules

- Tokens only: colors, sizes, radii, shadows, easings come from `theme.css`.
  Tailwind's default palette and sizes are disabled on purpose.
- Motion through the engine's data attributes or bespoke code that follows
  `harness/motion/motion.md` (transform/opacity only, reduced-motion safe,
  pausable loops).
- Never invent facts, testimonials, logos or numbers. Facts live in `site.config.ts`.
- Scoped styles: a page's `<style>` only reaches a child component's root if
  that component spreads `{...rest}` onto it (Astro passes the scope attribute
  as a prop). Every starter component does; new components must too. For
  elements deeper inside a child component, use `:global()` under a local class.
- Fix the starter (and the docs) when you find a bug that would affect every
  site; then mention it to the user. Keep site-specific changes in `sites/<slug>`.
- Don't commit `dist/`, `qa/`, or `node_modules/`.
