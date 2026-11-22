# Review — Nightshift

## Round 1
QA: 1 blocking (contrast: dimmed story chapters; amber eyebrows), 6 warnings.

| Dimension | Score | Evidence |
|---|---|---|
| Concept | 5 | Dusk → night → morning carries every section; skyline, lamp window, timestamps |
| First impression | 3 | Striking, but the skyline sat on top of the secondary link and fact line |
| Typography | 5 | Newsreader display with italic amber accent; mono timestamps |
| Color and light | 4 | Dusk atmosphere strong; hard cut from night to morning |
| Layout and rhythm | 3 | Page-scoped section styles weren't applying (scoping bug, see below) |
| Artifacts | 4 | Shift log and incident card convincing; log looked empty while loading |
| Motion | 5 | Filmstrip: headline by 400ms, artifact 600ms, log entries + clock from 1.3s, windows switching off |
| Copy | 4 | Sharp; facts sourced; scenario labelled illustrative |
| Mobile | 4 | Story collapses to inline cards correctly |
| Craft | 4 | States good; footer links too small to tap |
| A11y and perf | 3 | Contrast failures; fonts 356KB |
| **Total** | **44** | |

Fixes: skyline space reserved in hero padding; first log entry static; sunrise band
between night and morning; inactive chapters dim via ink-3 (AA) not opacity;
eyebrows default to accent-deep; footer links 40px; micro text 12px; Newsreader
trimmed to 400/500 (356KB → 177KB).

**Harness bug found and fixed in the starter:** components didn't forward rest
props, so a page's scoped styles on `<Section class="…">` never reached the
section. All components now spread `{...rest}` onto their root.

## Round 2
QA: 0 blocking, 1 warning (OG image, generated afterwards).

| Dimension | Score |
|---|---|
| Concept | 5 |
| First impression | 5 |
| Typography | 5 |
| Color and light | 5 |
| Layout and rhythm | 4 |
| Artifacts | 5 |
| Motion | 5 |
| Copy | 4 |
| Mobile | 4 |
| Craft | 4 |
| A11y and perf | 5 |
| **Total** | **51 / 55**: pass |

Anti-patterns hit: none.
Next if continuing: give the mobile hero a peek of the shift log above the
fold; tighten the gap between "How it works" and "Coverage"; real testimonial
when available.
