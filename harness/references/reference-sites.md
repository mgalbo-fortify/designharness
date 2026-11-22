# Reference sites: teardown

The four sites that define the quality bar. Study them for technique, never
copy their identity. All four are hand-built static HTML/CSS/vanilla JS:
no frameworks, no animation libraries, fast.

- https://safestartchecking.com/
- https://topperbanking.com/
- https://financialedgechecking.com/
- https://friendsfamily.co/

## Shared traits

- **One big idea each** (castle, balloons, highlighter, cockpit); see principles.md.
- **Huge display type** with tight tracking: Safe Start 106px Fraunces at
  −0.028em / 0.94 leading; Topper 72px Manrope 800 at −0.035em; FE 72px
  Archivo 850 at −0.035em; F&F Inter Tight 800 at −0.032em / 0.78.
- **Product artifacts** as the hero visual: balance cards, statements,
  report cards with real-looking numbers.
- **One curve, two or three durations**: `cubic-bezier(.2,.8,.2,1)` or
  `(.16,1,.3,1)`, 240ms UI and 520–640ms reveals.
- **Content hidden only behind a `.js` / `.motion` class**, with a CSS
  failsafe (`animation: failsafe 0s 3s forwards`) so nothing stays hidden.
- **Reveals via IntersectionObserver**, unobserved after firing, threshold
  ~0.1–0.2, rootMargin −6 to −8% from the bottom.
- **rAF-throttled scroll passes** with a `ticking` flag; passive listeners.
- **Loops only run while visible** (IO) and stop in hidden tabs.
- **Fluid unit system**: `--u: clamp(11px, min(100vw/90, 100vh/50), 24px)`, so
  everything scales with whichever of width or height runs out first.
- **Single config file** for every figure and copy variant ("every figure
  renders from here, so the two can never disagree"), plus an A/B variant system.
- **Accessibility**: skip link, 3px focus ring with 3px offset, 44px mobile
  touch targets, sr-only copies of split text, `aria-hidden` decorative
  layers, visibility-delayed transitions so hidden panels can't take focus.

## Safe Start: "a castle that builds as you get protected"

- **Type**: Fraunces (pinned `opsz 110, SOFT 100, WONK 0`, weight ~360)
  with an *italic green accent phrase*; Geist for text; Geist Mono for data.
- **Atmosphere**: fixed gradient layer whose three stops are blended per
  section (`data-tone`). The current section is the last whose top ≤ 55%
  of the viewport; blending happens over the last 40% of the section,
  smoothstepped. The page goes from morning sky to dusk, and the final
  section is night with lit castle windows. Plus three 70vmax blurred blobs
  drifting on 38–52s alternate loops, and an SVG feTurbulence grain overlay.
- **Headline**: word blur-in, per word `opacity 0, blur(12px), translateY(.34em)`,
  0.9–1.1s, 55ms stagger, `&nbsp;` respected.
- **Hero illustration**: isometric SVG castle; layers rise from below with
  per-layer delays and a clip-path at the base; pointer parallax per depth;
  flags animated with travelling sine waves.
- **Self-playing demo**: five protection steps tick off; castle parts
  extrude (`scaleY` with spring, 120ms stagger); the protection score counts
  up one point at a time; a replay button; waits only count while visible.
- **Highlighter** via animated `background-size` on a gradient with
  `box-decoration-break: clone`.
- **Springs** as CSS `linear()` curves (~15% overshoot) on buttons and cards.
- **Pause motion** button that pauses all CSS animation.
- **Nav**: a pill that becomes glass after 24px of scroll.

## Topper: "balloons: get paid, then keep getting paid"

- **Type**: Manrope only (400–800); display 800 at −0.035em.
- **Pinned narrator panel** (the signature): a 7fr/5fr grid where the stage
  column is `position: sticky`. Each chapter is ~86svh. The active chapter
  is the last whose top ≤ 52% of the viewport. Every state of the glass
  panel is pre-rendered and stacked in one grid cell; states cross-fade
  (opacity + 16px + blur 6px) with a delayed `visibility` transition. Each
  state has an "enter" routine that resets first, so scrolling back
  replays it. Below 768px, inline copies per section replace the sticky panel.
- **Odometer digits**: digit columns (0–9) translate by `-d × 1.08em`,
  staggered 35ms from the right. Balances never roll backwards.
- **Reward landing**: radial bloom pulse, seven spark particles with random
  `--dx/--dy`, a shine sweep across the row, a chip label swap.
- **Balloon bouquet**: real physics (buoyancy, two-frequency wind, spring to
  rest, damping, collisions, pointer nudges, scroll velocity tug). Pauses
  off-screen; pre-settled and static under reduced motion.
- **Sky** brightens with page scroll; parallax clouds; PNG grain (SVG noise
  was too expensive on wide screens).
- **Glass**: two radial tints over a white gradient, opacity ≥ 0.7 for text
  contrast, bright inset top edge, pointer-following highlight.
- **Button**: hover shine sweep; `:active` translateY(1px) scale(.985); the arrow nudges 3px.

## Financial Edge: "your money, annotated"

- **Type**: Archivo at width 112, weight 850 for display; Geist Mono for figures.
- **Semantic color**: lime = gained, orange = missing (never text), cobalt = action/data, on paper and ink.
- **Hand-drawn marks engine**: geometry from `getClientRects()` per line;
  seeded jitter (mulberry32) so resizes redraw the same "hand";
  highlighter = two strokes per line; ring = 1.1 turns of a tilted wobbling
  ellipse; draw-in via stroke-dashoffset with `cubic-bezier(.35,.1,.25,1)`;
  the headline highlight waits for the line reveal to finish.
- **Line-mask text reveal**: lines slide up from 140% inside overflow-hidden
  wrappers, 820ms, 85ms stagger; sr-only copy for screen readers; waits for
  `document.fonts.ready`; re-splits on resize without replaying.
- **Hero scan**: a scanline passes over a statement; as it crosses each row
  the row gets marked and a forward-only ticker total counts up (+$311).
- **Graph paper**: four layered linear-gradients with a major line every
  four cells; ambient cells light up; a pointer spotlight reveals a darker
  grid; content snaps to grid lines; corner registration marks.
- **Keycap buttons**: hard 4px ink shadow; hover raises 1px; active sinks
  fully; 120ms snappy curve.

## Friends & Family: "accelerate"

- **Full-screen canvas hero**: a wireframe road through value-noise terrain,
  pines, a pixel deer, a cockpit frame, halftone dots, an LED speedometer.
  DPR capped at 2 and ≤ 5MP; frame-rate-independent smoothing; the pointer
  steers and the view banks.
- **Off/on switch** recolors the whole scene with a shutter wipe from the
  horizon (canvas clip + matching DOM `clip-path` layers, with semantics kept
  on an invisible top layer).
- **Headline fit**: each line is measured and scaled so the ink fills the
  measure exactly.
- **Hero exit "match cut"**: any scroll intent plays an 820ms transition in
  which the scene's nose drops and the page swings down to meet it.
- **Smear-in headlines**: horizontal `feGaussianBlur` animated to 0 while translating.
- **Gap to avoid**: no reduced-motion handling at all. The harness must not copy that.

## What the harness took from them

| Technique | Harness implementation |
|---|---|
| Motion gate + failsafe | BaseLayout inline script + `motion.css` |
| IO reveals with stagger | `motion/reveal.ts` (`data-reveal`, `data-reveal-group`) |
| Line-mask / word blur headlines | `motion/split.ts` (GSAP SplitText, `data-split`) |
| Count-ups and odometers | `motion/count.ts`, `Counter.astro` |
| Hand-drawn marks | `motion/marks.ts`, `Mark.astro` |
| Pinned narrator panel | `motion/story.ts`, `StickyStory` / `StoryStep` / `StoryView` |
| Self-playing demos | `motion/sequence.ts` (`data-sequence`) |
| Atmosphere arc | `motion/atmosphere.ts`, `Atmosphere.astro`, `Section atmos` |
| Tilt, glare, spotlight, magnetic | `motion/pointer.ts` |
| Glass nav on scroll, hide on scroll | `motion/nav.ts`, `Nav.astro` |
| Pause motion | `motion/extras.ts`, Footer |
| Single source of facts | `site.config.ts` |
| Springs via `linear()` | theme `--ease-spring`, `--ease-spring-soft` |
| Grain, mesh, graph paper | `Atmosphere.astro`, `.grain` |
| Keycap button | `Button variant="key"` |
| Analytics fan-out, UTM capture, scroll depth | `lib/analytics.ts` |
