# Artifacts and imagery

## Hierarchy of visuals

1. **Product artifacts** (HTML/CSS): the best option. A slice of the
   product: balance card, transaction feed, report, checklist, alert,
   dashboard tile, chat, email, calendar invite. Crisp at any size,
   animatable, accessible, zero image weight.
2. **Code-drawn illustration** (inline SVG): geometric, isometric or
   line-art scenes built from simple shapes in the palette (the castle is
   ~20 polygons). Animatable per part.
3. **Generative/procedural scenes** (canvas or CSS): terrain, particles,
   grids, flows, for bold/tech concepts. Cap DPR at 2 and pause off-screen.
4. **Supplied or generated art** (raster/3D): only for things code can't do
   well (glossy 3D balloons, photography). Use slots and a prompt (below).
5. **Stock photos**: last resort. Never generic office/laptop/handshake shots.

## Making artifacts convincing

- **Real-looking data.** Specific names ("Acme Inc. payroll", "Netflix",
  "Aug 22"), plausible non-round amounts ($5,837.40, +$3,240.00), recent
  dates relative to launch. All illustrative figures marked illustrative in
  the legal copy if the category is regulated.
- **Consistent with the copy.** If the hero says "$25 every payday", the
  artifact shows +$25. Read numbers from `site.config.ts` `facts`.
- **Hierarchy inside the artifact.** One big number (`type-title`/`figure`),
  2–4 rows, one highlighted "feature" row. Don't cram a whole app.
- **States tell the story.** An artifact has a before and after: a row
  lands, a total ticks up, a checkbox fills, a status chip changes. Use
  `data-sequence` for self-playing demos and `StickyStory` views for
  chapter states.
- **Mono for system data** (dates, IDs, amounts in tables), sans for labels.
- **Scale**: artifacts read as objects, so 360–520px wide on desktop. A
  little 3D (tilt), a strong shadow, and an overlap make them feel physical.
- **Accessibility**: if the adjacent copy says the same thing, mark the
  artifact `decorative` (aria-hidden). If it carries unique information,
  keep it readable and in DOM order.

## Components

- `UIWindow`: the shell (variants: glass, surface, paper, ink; chrome: app,
  browser, none; brand + status chip; progress dots; tilt glare).
- `UIRow`: line item (icon, title, meta, value, tone, check, seq).
- `Counter`: animated figures. `Mark`: annotations.
- Compose bespoke ones per site (phone frame, notification stack, card
  front, chart): put them in `src/components/artifacts/`.

## Code-drawn SVG illustration tips

- Build from 3–5 shape primitives in palette colors; 2 tones per face
  (light/shadow) for isometric depth.
- Give each moving part its own `<g>` with `transform-box: fill-box;
  transform-origin: …` so it can scale/rise from its base.
- Animate with CSS (rise, extrude, sway) triggered by classes, or JS for
  continuous motion that pauses when off-screen.
- Keep it under ~15KB inline. `aria-hidden="true"` unless it carries meaning.

## Slots for supplied or generated art

When the concept needs art code can't make well (3D objects, photography),
build a placeholder of the right size and shape in code (a soft-gradient
blob in the palette) with a comment block, and list it under "Needed from
you" in the brief. Write a generation prompt that keeps the art on-system:

```
Prompt: a cluster of seven glossy 3D foil balloons, one shaped like a dollar
sign, in cobalt #2B59F2, aqua #3FD8E0 and soft violet #8E7CF0, floating, studio
lighting from top-left, soft shadow, transparent background, isometric-ish
three-quarter view, clean, no text, 2400×2400 PNG
```

Then use `<Image src={…} widths={[480, 960, 1440]} sizes="…" alt="" />` from
`astro:assets` (AVIF/WebP, lazy below the fold, `fetchpriority="high"` for the hero).

## Icons

Lucide (`@lucide/astro`) at 1.75px stroke for UI. Same set everywhere. Icons
support labels; they never replace them. Avoid icon-in-a-colored-circle
grids as a primary layout (see anti-patterns).
