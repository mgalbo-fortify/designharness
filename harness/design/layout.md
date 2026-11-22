# Layout and composition

## Grid and widths

- Content width `--container` 76rem (1216px); wide 88rem; narrow 44rem.
  Gutter is fluid (20px → 64px).
- Think in a 12-column grid but write CSS grid with `fr` ratios:
  `lg:grid-cols-[7fr_5fr]` (copy/visual), `[5fr_7fr]`, `[1fr_1fr]`.
- Copy columns never exceed `measure` (36rem). Headlines may span wider
  (up to ~16 words per line at display size: control with `max-w-[…ch]`).

## Vertical rhythm

- Sections: `--space-section` (88px → 184px). Inside a section, blocks
  are separated by `--space-block` (40 → 72px) (`gap-block`).
- Eyebrow → headline: 16–20px. Headline → lead: 20–28px. Lead → CTA: 32–40px.
- Alternate density: a big airy statement section, then a denser feature
  section, then a breathing visual section. Monotony is the enemy.
- Hero fills the first viewport (`<Section hero>`) and its bottom edge should
  hint at what's next (a card peeking, a rule, a scroll cue in the artifact).

## Hero compositions

Choose one per concept; don't center everything by default.

1. **Split: statement + artifact** (Topper, FE, Safe Start). Headline left
   (7fr), artifact right (5fr), artifact overlapping its column or the next
   section slightly for depth. The most reliable for products.
2. **Statement over scene** (Friends & Family). One giant word or line across
   a full-bleed scene (canvas/SVG). For bold brands and agencies.
3. **Centered statement + artifact below.** Headline and CTA centered, a wide
   artifact (dashboard, browser) rising from below the fold. For platforms.
4. **Editorial stack.** Huge left-aligned headline over 2 rows, small lead +
   CTA in a right column below, image or artifact as a full-width band.
5. **Form-first** (lead-gen). Headline + 3 proof bullets left, form card right.

On mobile: headline → lead → CTA → artifact (artifact scaled, never
cropped mid-content). Headline at 40–48px, max 5–6 lines.

## Section patterns (pick what the argument needs)

| Pattern | When | Build with |
|---|---|---|
| Big statement | Tension/problem, transitions | `Heading size="display"` + a lead, lots of air, maybe an accent mark |
| Split with artifact | A reason + its proof | 2-col grid, artifact with `data-reveal="rise"` or tilt |
| Sticky story | 3–5 reasons that share one object | `StickyStory` + `StoryStep` + `StoryView` |
| Steps | How it works | `Steps` |
| Feature list | 4–8 secondary features | `FeatureList` (divided list, not cards) |
| Bento | Several features with mini-artifacts | CSS grid with varied spans (2×1, 1×2), each tile one idea + one tiny visual |
| Findings / annotated | Diagnostics, comparisons | Cards with `Mark type="circle"` on the number |
| Big numbers | Proof | 2–4 `Counter`s in `type-figure`/`type-title` with one-line labels and a source |
| Quote | Proof | `Quote` (only with real attribution) |
| Logo strip | Proof | Grayscale logos in a `Marquee` or static row (only real, permitted logos) |
| Comparison | Switching, pricing | Two-column table; "us" column highlighted; checkmarks drawn in |
| Pinned scene | Signature set-piece | Tall wrapper `data-scrub="pin"` (e.g. 300vh) + `sticky top-0 h-svh` child driven by `--p` |
| FAQ | Objections | `FAQ` |
| Final CTA | Close | Restated promise in `display`, one button, maybe the hero artifact in its "complete" state |

## Depth and overlap

Flat stacked boxes look like templates. Add depth deliberately:
- Artifacts overlap section boundaries (negative margin) or each other
  (a ticket over a statement, a notification over a phone).
- Use 2–3 z-layers in the hero: background light, the artifact, a small
  floating element (chip, badge, total) with `data-parallax="0.1"`.
- Rules (`data-reveal="rule"`) and registration marks give structure.

## Responsive rules

- Design desktop and mobile on purpose; tablet must not break (QA covers 834px).
- No horizontal scroll ever (QA blocks it). Watch wide artifacts, long words
  in display type, and absolutely positioned decorations: `main` clips x-overflow,
  but fix the cause.
- Touch targets ≥ 44px. Pointer effects (tilt, magnetic) are desktop-only.
- Sticky stories collapse to inline visuals per step on < 900px.
- Use `svh` for viewport heights (mobile browser chrome).
- Hide decoration, not content, on mobile.
