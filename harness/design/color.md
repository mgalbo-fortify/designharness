# Color, light and material

## The palette shape

Every site uses the same roles (see `starter/src/styles/theme.css`); only
the values change:

| Role | Tokens | Rule |
|---|---|---|
| Surfaces | paper, surface, sunken | Paper is the page; surface is cards (usually white); sunken is wells/alt sections |
| Lines | line, line-strong | Hairlines; tinted toward the brand hue |
| Text | ink, ink-2, ink-3 | Ink for headings; ink-2 for body; ink-3 for meta. Never pure black |
| Brand | accent, accent-ink, accent-soft, accent-deep | Accent = primary action + key data. Soft = tinted fills. Deep = text on soft |
| Pop | pop, pop-ink | One vivid color for small delightful moments: a highlight, a badge, a sparkle. ≤ 5% of the page |
| Semantic | positive, negative | Gains/losses, success/error |
| Atmosphere | atmos-1/2/3 | Background light fields |
| Marks | mark, mark-line | Highlighter and pen colors |

## Method

1. **Start from the concept**, not from a color wheel. Safe Start = sky and
   meadow (blue/green) + coral flag. Topper = one blue ramp + aqua/iris
   balloons. FE = paper + ink + cobalt/lime/orange with fixed meanings.
2. **Write colors in OKLCH.** Lightness is perceptual, so ramps stay even
   and contrast is predictable. `oklch(L% C H)`: L 0–100%, C 0–0.37, H 0–360.
3. **Tint the neutrals**: take the accent hue, chroma 0.005–0.02. Ink:
   L 18–24%, C 0.02–0.03. Paper: L 97–99%, C 0.003–0.01.
4. **Accent**: L 50–60%, C 0.15–0.22 for a saturated action color that keeps
   white text at ≥ 4.5:1. Check it.
5. **Give colors meanings and keep them.** FE never uses orange for text
   because orange means "missing". Write the meanings in concept.md.
6. **Dark sections** (`tone="dark"`) need their own values; tweak `.tone-dark`
   in theme.css for the brand (deep navy, forest, aubergine; not #000).

## Contrast (WCAG 2.1 AA) — non-negotiable

| Pair | Minimum |
|---|---|
| Body text (ink-2) on paper, surface, sunken | 4.5:1 |
| Meta text (ink-3) on paper and surface | 4.5:1 |
| Large text ≥ 24px or ≥ 18.7px bold | 3:1 |
| Button label on accent | 4.5:1 |
| UI boundaries (inputs, focus ring) | 3:1 |

Rough OKLCH guide on near-white paper: ink-3 must be L ≤ 54%; accent with
white text needs L ≤ 58% (hue-dependent: yellows/limes never carry white
text, so pair them with dark pop-ink). QA runs axe-core and flags failures.
Text over gradients and glass: check against the *lightest* point behind it.

## Light: what makes it look expensive

- **Atmosphere**: `<Atmosphere variant="mesh">` gives three soft color fields
  that drift slowly. Keep chroma low (0.01–0.04); it should feel like light,
  not paint. Shift it per section with `atmos` for a time-of-day or mood
  arc (Safe Start goes from dawn to dusk to night).
- **Layered shadows** (in theme): a 1px contact shadow + a soft key shadow
  tinted with the brand hue + a long ambient shadow. Never one gray blur.
- **Glass** (`variant="glass"`): only over a colorful backdrop; opacity ≥ 0.7
  so text keeps contrast; bright inner top edge; `backdrop-filter` blur 18–22px.
- **Grain**: 0.12–0.22 opacity overlay on the atmosphere layer. It kills gradient
  banding and adds tactility. Never on text.
- **Gradients**: as light sources (radial, soft, low-chroma), not as
  decoration. Purple-to-blue diagonal gradient fills are an AI cliché.

## Materials by concept

| Material | Built from |
|---|---|
| Sky / atmospheric | mesh atmosphere + glass cards + grain + soft shadows |
| Paper / notebook | grid atmosphere + outline/hard cards + keycap buttons + marks |
| Instrument / technical | dots atmosphere or dark tone + mono type + hairlines + halftone |
| Gallery / premium | plain paper + thin rules + no shadows + large imagery |
| Playful / tactile | brighter atmosphere + springy motion + chunky radii + pop color |
