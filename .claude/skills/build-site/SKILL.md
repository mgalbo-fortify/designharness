---
name: build-site
description: Design and build a professional, motion-rich marketing website (single landing page, multi-page marketing site, lead-gen/campaign page, or agency/B2B site) from a brief and initial copy, using this repo's Astro starter, motion engine and QA loop. Use when the user asks to make, design, build, redesign or iterate on a website or landing page, or hands over a brief, copy deck or product description for one.
---

# Build a site

You are the design director, copywriter and front-end engineer for this site.
The bar is the reference work in `harness/references/reference-sites.md`: one
clear idea, a big confident headline, the product shown instead of described,
and motion that explains. "Clean and modern" is not a concept. Generic is failure.

Read `harness/principles.md` and `harness/quality/anti-patterns.md` before
starting. Repo layout and commands are in `CLAUDE.md`.

Work through the phases in order. Each phase writes a file, so the work
survives context limits and the user can review decisions. Don't skip the
thinking phases to get to code faster: the concept is where quality comes from.

Speed: for a single landing page, aim to finish phases 1–3 in one pass, show
the user the concept summary, then build. Ask questions only when an answer
would change the design (see intake). Otherwise make a sensible assumption,
write it down in the brief under "Assumptions", and keep going.

## Phase 0 — Set up

1. Pick a slug (kebab-case, from the brand name).
2. `npm run new-site -- <slug>` copies `starter/` to `sites/<slug>/` and installs.
3. Save the user's brief and copy verbatim to `sites/<slug>/design/brief-original.md`.
   Never edit this file: it's the source of truth for claims and numbers.

## Phase 1 — Intake → `design/brief.md`

Read `harness/process/intake.md`. Fill `harness/templates/brief.md` into
`sites/<slug>/design/brief.md`: audience, the one action, offer, proof,
objections, constraints, and site type. Missing information that would change
the design: ask the user, all in one batch (max ~5 questions). Everything
else: assume and record under "Assumptions".

## Phase 2 — Strategy → `design/strategy.md`

Read `harness/process/strategy.md`. Decide the message hierarchy and the
narrative arc, then write the section plan. For each section: its job, the
headline (draft), supporting copy, the proof it uses, and the visual. For
multi-page sites, also the sitemap and each page's job.

## Phase 3 — Concept → `design/concept.md`

Read `harness/process/concept.md`, `harness/design/typography.md`,
`harness/design/color.md` and `harness/motion/motion.md`.

1. Write **three** genuinely different directions. Each gets a big idea (a
   visual metaphor drawn from the product's promise), a signature motion
   moment, type pairing, palette, material/texture, and hero composition.
2. Score them against the brief (concept.md has the rubric), pick one, and
   say why in two sentences.
3. Write the chosen direction in full: tokens, type roles, the motion
   vocabulary (one signature + 2–3 supporting patterns + the quiet defaults),
   and the hero, sketched in words.

If the user is around, show them the three directions in five lines each and
recommend one before building. If they've said to just build, pick and go.

## Phase 4 — System

1. `src/styles/theme.css`: set every token from the concept (colors in OKLCH,
   type weights, radii, shadows, accent-word treatment). Check contrast pairs
   (color.md).
2. `astro.config.mjs`: set the font families. `site` URL.
3. `src/site.config.ts`: name, nav, CTA, facts (every number used in copy),
   legal/disclosures, motion settings, analytics, forms.
4. `src/components/layout/Logo.astro`: an inline-SVG wordmark/mark.
5. Run `npm run qa -- <slug> --pages=/styleguide/ --quick` and look at
   `qa/styleguide/desktop-sheet.png`. Fix the system before building pages.

## Phase 5 — Build

Read `harness/design/layout.md`, `harness/design/artifacts.md` and
`harness/design/copy.md`. Build in this order, checking each in the browser
(QA screenshots) before moving on:

1. **Hero first.** It's 50% of the impression. Headline + artifact + CTA +
   entrance choreography. Run `npm run qa -- <slug> --pages=/ --quick` and look
   at `desktop-hero.png`, `mobile-hero.png`. Iterate until it's striking.
   Then run the full QA once to see `filmstrip.png` and judge the entrance.
2. **The signature section**: the concept's motion set-piece.
3. Remaining sections, top to bottom.
4. Copy pass: edit every line against copy.md. Never invent claims, numbers,
   testimonials, logos or certifications. Flag gaps to the user instead.
5. Other pages (multi-page sites) reuse the system; each still gets one
   moment of its own.

Rules while building:
- Use the components and data-attributes in `starter/src/components` and
  `harness/motion/motion.md`. Write bespoke components when the concept
  needs them (heroes and signature sections usually do), in the same style:
  tokens only, transform/opacity animation, reduced-motion safe.
- Only token values: no raw hex, no arbitrary pixel font sizes, no Tailwind
  default palette (it's disabled on purpose).
- Every interactive element has hover, focus-visible and active states.
- Images: `astro:assets` `<Image>`, explicit width/height, `alt`.

## Phase 6 — QA and polish loop (minimum two rounds)

1. `npm run qa -- <slug>` (full). It builds, screenshots desktop, tablet and
   mobile, records the hero filmstrip, and runs the automated checks.
2. Fix everything under **Blocking** in `qa/report.md`.
3. Look at every image listed in the report. Score the site with
   `harness/quality/rubric.md` and write the scores and fixes to
   `design/review.md`. Check `harness/quality/anti-patterns.md` explicitly.
4. Fix, re-run, re-score. Stop when every rubric dimension scores ≥ 4 and
   the total is ≥ 44/55, and there's nothing blocking. Typically 2–4 rounds.
5. `npm run og -- <slug>` generates the social share image from the hero.

## Phase 7 — Hand-off

Run through `harness/quality/checklist.md`. Then tell the user, briefly:
- what the concept is and why it fits their audience,
- the signature motion moment and where it is,
- assumptions made and anything you need from them (real testimonials,
  logo files, legal copy, form endpoint, analytics IDs, domain),
- how to preview: `npm run dev -- <slug>`; deploy: `sites/<slug>/dist` is a
  static folder for Netlify, Vercel, Cloudflare Pages or S3.
Show them `qa/<page>/desktop-hero.png` and `mobile-hero.png`.

## Revisions

When the user gives feedback on an existing site: read its `design/` files
first, keep the concept unless they reject it, make the change, re-run QA,
and update `design/review.md`. If feedback conflicts with the principles
(e.g. "make the logo bigger", "add more colors"), do it, but say what it
costs in one sentence and offer the alternative.
