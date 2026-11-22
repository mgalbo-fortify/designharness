# Motion

Motion on these sites does three jobs, in this order of importance:

1. **Explain**: demonstrate the claim (the total ticks up, the finding gets
   circled, the castle builds, the card changes state as the story advances).
2. **Direct**: lead the eye in the right order (headline → proof → action).
3. **Delight**: a moment of craft that makes the brand feel alive (balloons
   that respond to the cursor, a satisfying button press).

Anything that does none of these gets cut.

## The motion budget (per page)

| Tier | How many | Examples |
|---|---|---|
| **Signature** | 1 (2 on long pages) | Sticky story with a state-changing artifact; scroll-scrubbed scene; self-playing hero demo; atmosphere arc; annotated diagnosis |
| **Supporting** | 2–3 patterns, reused | Count-ups, marks, sequences, tilt, odometers, rule draws |
| **Default** | Everything else | Line-split headlines, block reveals: quiet, consistent |
| **Ambient** | 0–1 | Drifting atmosphere, marquee, idle float. Must pause (pause control) |

Write the budget into `design/concept.md` before building.

## Tokens (theme.css)

- Curves: `--ease-out` cubic-bezier(.16,1,.3,1) for entrances; `--ease-in-out`
  for moves and state changes; `--ease-snap` for presses; `--ease-spring` /
  `--ease-spring-soft` (CSS `linear()` springs) for playful arrivals.
- Durations: `--dur-ui` 240ms (hover, press), `--dur-move` 520ms (state
  changes), `--dur-reveal` 1000ms (scroll reveals).
- GSAP equivalents: `power4.out` ≈ ease-out; `power2.inOut` ≈ ease-in-out.
- Stagger: 40–60ms for words, 80–100ms for lines and list items,
  120–160ms for cards and steps. Total group stagger ≤ 600ms.

## Choreography: the hero entrance

The first 1.5 seconds set the tone. Sequence it explicitly with delays:

```
   0ms  nav visible (no animation)
  80ms  headline lines rise (split="lines"; ~1.1s; stagger 90ms)
 350ms  lead fades up                          data-reveal data-delay="350"
 500ms  CTA row fades up                       data-reveal data-delay="500"
 600ms  artifact rises/scales in               data-reveal="rise" data-delay="600"
1200ms  artifact comes alive: sequence starts, number counts, mark draws
        (data-sequence-start / data-delay ≈ 1200)
```

Rules: the headline is never later than 150ms; nothing important waits more
than 1.2s; the artifact's internal demo starts after the layout settles.
Check `qa/<page>/filmstrip.png`: frames 1–3 should show the headline,
frame 4 the full layout, frames 5–7 the artifact demonstrating something.

## Catalog (data attributes; see starter/src/motion/*.ts headers)

### Entrances
| Attribute | Effect | Use |
|---|---|---|
| `data-reveal` (up) | fade + 24px rise | Default for blocks |
| `data-reveal="fade"` / `"blur"` / `"scale"` / `"rise"` / `"left"` / `"right"` | variants | blur = soft brands; rise = artifacts; scale = badges |
| `data-reveal="mask"` | clip from bottom | Images, color blocks |
| `data-reveal="rule"` | line draws from left | Section dividers, step connectors |
| `data-reveal-group` + `data-stagger` | staggers child reveals | Lists, grids |
| `data-delay` | ms delay | Choreography |
| `data-split="lines"` | lines slide up out of masks | Editorial headlines (default) |
| `data-split="words"` | words blur/rise in | Soft, friendly brands |
| `data-split="chars"` | characters rise | One short word, max once per page |

### Demonstration
| Attribute | Effect | Use |
|---|---|---|
| `Counter` / `data-count` | count up (tween) | Money, stats |
| `Counter mode="roll"` | odometer digits | Totals that "tick" (balances, scores) |
| `Mark` / `data-mark` | hand-drawn highlight, circle, underline, strike, box | Pointing at the key phrase/number |
| `data-sequence` + `data-seq` | items appear in order, optionally loop | Notifications, checklists, chat, feeds |
| `data-scramble` | glyphs resolve to text | Codes, short technical labels |

### Scroll-linked
| Attribute | Effect | Use |
|---|---|---|
| `StickyStory` (`data-story`) | pinned visual changes state per chapter | The classic scrollytelling signature |
| `data-scrub` → `--p` | progress 0→1 as CSS var | Anything: progress bars, rotations, reveals, scene parameters |
| `data-scrub="pin"` | progress through a tall wrapper | Pinned scenes (wrapper 200–400vh + `sticky top-0 h-svh` child) |
| `data-parallax="0.1–0.3"` | drift against scroll | Decorative layers only |
| `Section atmos="a | b | c"` | background colors shift between sections | Mood/time arc (dawn → dusk) |

### Pointer (desktop only)
| Attribute | Effect |
|---|---|
| `data-tilt="6"` | 3D tilt + glare vars (`--mx/--my`) |
| `data-magnetic` / `Button magnetic` | leans toward the cursor |
| `data-spotlight` | radial light follows cursor (`--mx/--my`) |

### Events for page-specific choreography
`story:change` {id, index} · `sequence:step` {index, item} · `scrub` {progress}
· `split:done` · `motion:pause` {paused} · `motion:ready`

```astro
<script>
  const story = document.querySelector("[data-story]");
  story?.addEventListener("story:change", (e) => {
    const { id } = (e as CustomEvent).detail;
    // e.g. bump a total, swap a chip label, trigger sparkles
  });
</script>
```

## Recipes

**Pinned scene driven by scroll** (signature):
```astro
<section class="relative h-[300vh]" data-scrub="pin">
  <div class="sticky top-0 h-svh grid place-items-center overflow-hidden">
    <div class="scene" style="transform: scale(calc(0.8 + var(--p) * 0.2)); opacity: calc(0.3 + var(--p))">…</div>
  </div>
</section>
```
Use `--p` in `calc()` for transforms and opacity; for discrete stages,
listen to the `scrub` event and toggle classes at thresholds. Always design
the `--p: 1` resting state for reduced motion (`data-scrub-rest`).

**Self-playing artifact demo**:
```astro
<UIWindow brand="Acme" status="Live">
  <div class="grid gap-2" data-sequence data-sequence-start="1200" data-sequence-interval="1100" data-sequence-loop>
    <UIRow seq … /> <UIRow seq … /> <UIRow seq tone="feature" … />
  </div>
</UIWindow>
```

**Annotated headline**: `<Heading split="lines">Checking that finds <Mark>the money you're missing</Mark>.</Heading>`. The mark waits for the split to finish.

**Celebration on landing** (bespoke): when a `sequence:step` lands the
feature row, add a class that plays a radial bloom + 5–7 sparks (CSS
keyframes with random `--dx/--dy`), then remove the nodes after 2s.

## Writing bespoke motion

- Animate only `transform`, `opacity`, `filter`, `clip-path`, and
  `stroke-dashoffset`. Never width/height/top/left (layout thrash).
- CSS transitions/keyframes first; GSAP for scroll-linked and complex
  timelines; rAF loops only for physics/canvas, and they must stop when
  off-screen (`visibility()` from env.ts) and when paused.
- Restart CSS animations by toggling a class with a forced reflow between.
- Respect `motionAllowed()` and `isPaused()` from `src/motion/env.ts`.
- Durations under 1.2s for anything the user waits on.
- Canvas: cap `devicePixelRatio` at 2, size from the element, `{ alpha: false }`
  when opaque, frame-rate-independent smoothing: `x += (t - x) * (1 - Math.exp(-k * dt))`.

## Accessibility and safety (non-negotiable)

- Reduced motion: content is never hidden; demos show their final state;
  scrubbed scenes rest at `data-scrub-rest`; no parallax, tilt or smooth scroll.
  (The engine does this. Bespoke code must check `motionAllowed()`.)
- Anything that moves on its own for > 5s pauses with the footer
  "Pause motion" control (`html.motion-paused`).
- No flashing > 3 times per second. No large-area motion that starts
  without user action other than the hero entrance.
- Never scroll-jack: no hijacking wheel events to snap whole pages
  (Lenis smoothing is fine; it's disabled for reduced motion and touch).
- Animated numbers: screen readers get the final value (handled by `Counter`).
- QA verifies reduced-motion and no-JS states automatically.

## Performance

- Budget: JS < 350KB raw (GSAP + ScrollTrigger + SplitText + Lenis ≈ 160KB,
  loaded only when used). No other animation libraries without a reason.
- `will-change` only on elements that move continuously; remove after.
- Big blurred blobs: fixed layer, `will-change: transform`, low count (≤ 3).
- Use `IntersectionObserver` to start/stop work; ScrollTrigger for scroll math.
- Target 60fps on a mid-range laptop. If the filmstrip or a scroll looks
  janky in QA, simplify.
