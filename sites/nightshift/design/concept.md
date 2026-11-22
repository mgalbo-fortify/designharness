# Concept — Nightshift

## Three directions

### A — "The Night Shift"
Big idea: the page is one night. You go home at dusk; Nightshift's lamp stays on; by morning there's a plain-English note waiting.
Signature: StickyStory of one incident at 2:14 AM: the pinned card moves through detect → investigate → contain → report, timestamps ticking.
Supporting: office windows switching off at dusk (the amber one stays on); count-ups on the facts; amber underline marks.
Type: Newsreader (editorial serif, italic accent) + Inter Tight + JetBrains Mono for timestamps.
Palette: dusk lavender/peach → night navy → warm morning paper; amber "lamp" accent for action.
Material: soft atmospheric light, night-navy panels with hairlines, mono logs, grain.
Hero: headline left over a dusk sky, shift-log card right, skyline silhouette along the bottom that becomes the next section's night.

### B — "Tripwire"
Big idea: your business as a blueprint; every way in has a tripwire.
Signature: pinned scroll scene where a network diagram lights up as threats trip wires and get cut.
Type: Archivo expanded + Geist Mono. Palette: blueprint paper, ink, signal red, cyan.
Risk: diagram-heavy, technical; reads as "for IT people", not owners.

### C — "Quiet"
Big idea: 1,000 alerts become one sentence.
Signature: a wall of noisy alerts collapses into a single calm message card as you scroll.
Type: Instrument Serif + Instrument Sans. Palette: near-white, gray noise, one calm green.
Risk: strong hero moment but thin across nine sections.

## Scores
| | Fit | Distinct | Motion | Feasible | Range | Trust | Total |
|---|---|---|---|---|---|---|---|
| A | 5 | 5 | 5 | 4 | 5 | 5 | **29** |
| B | 3 | 4 | 5 | 3 | 4 | 4 | 23 |
| C | 4 | 4 | 4 | 5 | 2 | 4 | 23 |

## Chosen: A, "The Night Shift"
Why: the name already makes the promise ("someone's on while you're off"), and a night that runs from dusk to morning gives every section a place in time and gives motion a job (time passing, a threat handled). It also avoids the category's clichés (padlocks, code rain, red alarms) for something calm and human, which suits owners rather than engineers.

### Tokens
- paper `oklch(98.2% 0.008 80)` warm morning white · surface white · sunken `oklch(95.5% 0.012 80)`
- ink `oklch(21% 0.045 268)` night navy · ink-2 `oklch(39% 0.035 268)` · ink-3 `oklch(50% 0.03 268)`
- accent (lamp) `oklch(80% 0.15 72)` with accent-ink = ink (amber never carries white text)
- accent-deep `oklch(47% 0.11 58)` (amber-brown, for text on light) · accent-soft `oklch(94% 0.05 80)`
- night (tone-dark) paper `oklch(17.5% 0.04 268)`, surface `oklch(22% 0.045 268)`
- threat coral `oklch(66% 0.17 30)` (badges only on dark; never body text on light) · contained green `oklch(48% 0.12 155)`
- Atmosphere: hero dusk `oklch(87% 0.05 300) | oklch(90% 0.05 20) | oklch(92% 0.07 65)`; morning `oklch(97% 0.02 80) | oklch(96.5% 0.025 60) | oklch(96% 0.02 230)`
- Radii: control pill; card 1rem; artifact 1.25rem. Shadows tinted navy; button glow amber.
- Accent word: italic Newsreader in accent-deep (on light) / lamp amber (on dark).

### Type
Display Newsreader 400 (variable opsz/wght, italic for accent), −0.03em, line-height 0.98. Text Inter Tight 400/500/600. Mono JetBrains Mono for times, IDs, counts.

### Motion vocabulary
- **Signature:** the night StickyStory. Four chapters at 2:14, 2:16, 2:21 and 7:58. The pinned incident card cross-fades between states, rows sequence in, a containment check-list ticks, and an elapsed timer counts.
- **Supporting:** (1) hero skyline: windows switch off one by one while visible (pausable); the Nightshift window stays amber and glows. (2) Count-ups and roll for the facts. (3) Amber underline marks on 1–2 key phrases.
- **Defaults:** headlines `split="lines"`; blocks `data-reveal`; artifacts `rise`; rules draw.
- **Ambient:** atmosphere drift + skyline windows → pause control on.

### Hero (in words)
Dusk gradient atmosphere. Left: eyebrow "On shift tonight" with a pulsing amber dot; headline "Cybersecurity that works the *night shift*." in Newsreader display; subhead; CTA + "See a night on the shift" link; reassurance line "24/7/365 · US-based analysts · 30-minute setup". Right: ink "Shift log" UIWindow with status "On shift", a ticking 6:02 PM clock and log rows sequencing in. Bottom: full-bleed skyline silhouette in night navy, so the hero melts into section 2.
Entrance: headline 80ms; lead 350; CTA 500; artifact 600; log rows from 1200; windows begin switching off at 1.5s.
