# Typography

Type does most of the work. A great pairing, set big with the right
tracking, carries a site even with no images.

## Rules

1. **Two families, three at most** (display, text, optional mono). One
   family in several weights is often best (Topper uses only Manrope).
2. **Display sizes are big.** Hero headline 64–106px desktop, 40–48px
   mobile (`type-display`). Use `type-figure` (up to 128px) for one hero
   number. Section headlines `type-title` (≈56px).
3. **Track tight as size grows**: display −0.03 to −0.05em, title −0.028em,
   heading −0.015em, body 0. Uppercase labels +0.08 to +0.12em.
4. **Lead tight as size grows**: display 0.92–1.0, title 1.04, body 1.55–1.65.
5. **Balance and pretty**: headings `text-wrap: balance`, paragraphs
   `pretty` (already in base.css). Glue short phrases with `&nbsp;` ("day&nbsp;one").
6. **Measure**: body 55–75 characters (`measure` utility = 36rem).
7. **Numbers**: `nums` (tabular, lining) anywhere numbers update or align.
   Mono for data inside artifacts reads as "real system output".
8. **Pin variable axes** for display (e.g. Fraunces `"opsz" 110, "SOFT" 100`
   via `--display-axes`) so line breaks don't shift between sizes.
9. **Weights**: display 600–850 for grotesks, 300–400 for serifs (serifs
   look heavier). Body 400; emphasis 600. Avoid 300 body text.
10. **Accent word**: set in theme via `--accent-word-color`, `-style`, `-family`.
    E.g. sans headline with italic serif accent: `--accent-word-family:
    var(--ff-accent)` (add a 4th font) and `--accent-word-style: italic`.

## Pairing library (all free, available via Fontsource/Google/Fontshare)

Pick by personality (concept.md), not habit. Don't default to Inter.

### Editorial, warm, trustworthy
- **Fraunces** (soft serif, opsz/SOFT axes) + **Geist**: Safe Start. Display weight ~360.
- **Newsreader** (display opsz) + **Inter Tight**: calm, literate, fintech/health.
- **Instrument Serif** (one weight, italic) + **Instrument Sans**: premium, minimal; serif only for big type.
- **Source Serif 4** + **Source Sans 3**: dependable, institutional (insurance, legal).
- **Gloock** (high-contrast display) + **Figtree**: confident consumer.

### Confident, modern, product
- **Manrope** 500–800 alone: Topper. Friendly geometric, great numerals.
- **Plus Jakarta Sans** 400–800 alone: polished SaaS/fintech.
- **General Sans** (Fontshare) + **Geist Mono**: crisp startup.
- **Satoshi** (Fontshare) alone: clean, slightly warm.
- **Onest** + **JetBrains Mono**: neutral, technical-friendly.

### Bold, graphic, expressive
- **Archivo** (wdth 62–125, wght 100–900; display at wdth 112, 850) + **Geist Mono**: Financial Edge.
- **Bricolage Grotesque** (opsz, wdth) + **Inter**: quirky-premium.
- **Cabinet Grotesk** (Fontshare) + **Satoshi**: agency/creative.
- **Clash Display** (Fontshare) + **General Sans**: loud launch pages (use sparingly).
- **Unbounded** (display only) + **Manrope**: playful tech.

### Technical, B2B, security
- **Inter Tight** 800 + **JetBrains Mono**: Friends & Family. Engineered, fast.
- **IBM Plex Sans** + **IBM Plex Mono**: enterprise, infrastructure.
- **Geist** + **Geist Mono**: developer tools.
- **Space Grotesk** + **Space Mono**: retro-tech (overused; only with a strong concept).
- **Hanken Grotesk** + **Martian Mono**: serious but not cold.

### Calm, premium, human
- **Cormorant Garamond** (display ≥ 48px only) + **Hanken Grotesk**: wellness, luxury.
- **EB Garamond** + **Inter**: heritage, advisory.
- **DM Serif Display** + **DM Sans**: warm editorial.

Check the exact family name on fontsource.org before use: the build fails
if a name doesn't resolve.

## Setting fonts up

In `astro.config.mjs` each family maps to `--ff-display`, `--ff-text`,
`--ff-mono` (add `--ff-accent` if needed and reference it in theme.css).
Variable fonts: `weights: ["300 900"]`. Static fonts: list only weights you use.
Preload display and text (BaseLayout already does). Keep total font weight
under 300KB (QA warns).

If a site has no mono font, remove the `<Font cssVariable="--ff-mono" />`
line from BaseLayout (the build fails on an unknown variable), and drop
`--font-mono` usage.

## Scale (in theme.css; fluid from 390px to 1440px)

| Role | Mobile → Desktop | Use |
|---|---|---|
| figure | 56 → 128px | One huge number (hero stat, report total) |
| display | 40 → 88px | Hero headline, final CTA headline |
| title | 30 → 56px | Section headlines |
| heading | 21 → 28px | Card titles, steps, FAQ questions |
| lead | 18 → 22px | Subheads, intro paragraphs |
| body | 16 → 17px | Copy |
| small | 14px | Captions, meta, nav links |
| label | 12px uppercase | Eyebrows, tags |
| micro | 11px | Only inside product artifacts and legal fine print |

Adjust the clamp endpoints per concept: an editorial serif site may push
display to 106px; a dense B2B site may cap it at 72px.
