# Concept: art direction

The concept is the single biggest lever on quality. Spend real thought here.

## 1. Find the metaphor

Start from the promise, not the category. Ask:

- **What does the outcome feel like?** Protected → fortress, shield, lock,
  harbor, umbrella. Paid more → lift, balloons, rising tide, a stack growing.
  Faster → road, runway, a dial, a launch. Clarity → highlighter, lens, map,
  receipt. Control → switchboard, dial, levers.
- **What physical object does the product resemble?** A statement (receipts,
  ledgers, annotations), a dashboard (instruments), a journey (map, route),
  a toolkit (keys, switches).
- **What would a great print ad do?** Then make it move.

Then test it: can it shape (a) the hero visual, (b) the signature motion,
(c) a texture or material, (d) one micro-interaction? If it only produces a
hero illustration, it's a decoration, not a concept. Try again.

Avoid the obvious first idea when it's a cliché for the category (padlocks
for security, rockets for growth, lightbulbs for ideas, handshakes for
partnership) unless you can render it in a fresh way. The castle works for
Safe Start because it's isometric, playful, and builds itself.

## 2. Write three directions

Make them genuinely different: different metaphors, not three palettes of
one idea. Use this template for each:

```
### Direction B — "The Ledger"
Big idea: Your money, annotated. The site is a bank statement someone smart marked up for you.
Signature moment: Hero statement scans line by line; findings get circled and the total ticks up (+$311).
Supporting motion: highlighter sweeps on key phrases; odometer totals; cards drop in and get ringed.
Type: Archivo (expanded, 850) for display + Geist Mono for figures.
Palette: paper #F6F7FB, ink #0A0E1A, cobalt (action), lime (gained), orange (missing; never text).
Material: graph paper, hard offset shadows, keycap buttons, registration marks.
Hero composition: left-aligned headline with highlighted phrase; statement card right, overlapping a ticket-style total.
Risk: busy; keep everything else very calm.
```

## 3. Choose

Score each direction 1–5 on:

| Criterion | Question |
|---|---|
| Fit | Does it express *this* promise for *this* audience? |
| Distinctiveness | Would it be mistaken for a competitor or a template? |
| Motion potential | Does the metaphor give motion a job (demonstrating the claim)? |
| Feasibility | Can it be built well in code (HTML/SVG/CSS/canvas) without art we don't have? |
| Range | Does it carry through 6–9 sections without repeating itself? |
| Trust | Does it feel credible for the category (finance and security need calm, precise)? |

Pick the highest total; break ties on Fit. Write two sentences on why.

## 4. Personality → system

Translate the direction into decisions (record all of these in concept.md):

| Personality | Type | Color | Shape | Motion feel |
|---|---|---|---|---|
| Warm, reassuring | Soft serif display (Fraunces, Newsreader) + humanist sans | Light atmospheric gradients, greens/blues, one warm pop | Generous radii (20–28px), pills | Slow, soft: blur-ins, springs, drift |
| Confident, rewarding | Heavy geometric/grotesk (Manrope 800, Plus Jakarta) | Single saturated blue ramp, white glass | Medium radii, glass panels | Bouncy rewards (springs, sparkles), odometers |
| Smart, precise | Expanded grotesk + mono (Archivo wdth, Geist Mono) | Paper + ink + two semantic accents | Square-ish, hard shadows | Snappy, linear draws, scans, ticks |
| Bold, technical | Condensed/tight grotesk + mono (Inter Tight 800, JetBrains Mono) | Near-monochrome + one acid accent | Outlines, halftones, instrument panels | Scroll-scrubbed, mechanical |
| Calm, premium | Light serif or refined sans (Instrument Serif, Geist) | Deep neutrals, low chroma | Minimal radii, thin rules | Slow fades, masks, long eases |
| Friendly, simple | Rounded grotesk (Figtree, Nunito Sans) | Brighter, 2 accents allowed | Big radii, soft shadows | Playful springs, wiggles (sparingly) |

## 5. Chosen direction: what to write in full

```
## Chosen: Direction B: "The Ledger"
Why: …two sentences…

### Tokens
paper, surface, sunken, line, ink, ink-2, ink-3, accent, accent-ink, accent-soft,
accent-deep, pop, pop-ink, positive, negative, atmos-1/2/3, mark, mark-line  (OKLCH)
Display weight / heading weight, radii (chip, control, card, artifact, inner),
shadows (card, lift, button, glass, hard), accent-word treatment.

### Type
Display: … (axes pinned if variable) · Text: … · Mono: …
Hero headline size on desktop/mobile; tracking.

### Motion vocabulary
Signature: …(where, trigger, duration, what it proves)
Supporting: 1) … 2) … 3) …
Defaults: reveal "up" for blocks, split "lines" for h2s, rule draws on dividers.
Ambient: atmosphere drift? marquee? Remember the pause control.

### Hero (in words)
Layout, headline (with accent), subhead, CTA, artifact (state, data), entrance timeline (ms).

### Section-by-section visual notes
1 … 2 … 3 …
```

## 6. Learn from the references

`references/reference-sites.md` has the full teardown. Steal *techniques*
(how the sticky card works, how marks are drawn, how the atmosphere shifts),
never *identity*. Each new site needs its own idea.
