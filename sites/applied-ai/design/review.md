# Review — Applied AI Associates

## Round 1
QA: 3 blocking: accent word contrast in the dark Engagements section; a NaN path error from
circle marks inside elements hidden at tablet/mobile widths; logo sub-label at 11px.

| Dimension | Score | Evidence |
|---|---|---|
| Concept | 5 | Drawing-set language throughout: sheets, title blocks, sheet numbers; red pen = human review |
| First impression | 4 | Strong serif headline and WF-01 sheet; but the review payoff landed at ~3.5s and the sheet was empty for the first second |
| Typography | 5 | Instrument Serif display with drafting-blue italic accent; Plex Mono annotations |
| Color and light | 5 | Paper, graphite, one blue, red pen reserved for review |
| Layout and rhythm | 4 | Good alternation (story → tabs → dark ladder → ruled list → letter) |
| Artifacts | 5 | Week map, platform sheet, tested workflow, before/after with sign-off |
| Motion | 4 | Story sheets explain each stage; hero trace too slow |
| Copy | 4 | Plain and specific; sourced from Many Hands facts; examples labelled illustrative |
| Mobile | 4 | Story collapses cleanly; A-103 flow labels overflowed at 390px |
| Craft | 4 | Tabs keyboard-accessible; states consistent |
| A11y and perf | 4 | Contrast failure in dark section |
| **Total** | **48** | |

Fixes: tone-dark re-declares `--accent-word-color`; marks skip elements with no line boxes
(**starter bug, fixed in starter and both sites**); logo label 12px; first two hero steps
static and the rest traced faster (complete by ~2.6s); review circle enlarged to enclose
both lines; flow labels shortened with tighter spacing on phones.

## Round 2
QA: 0 blocking; the only warning was the OG image, generated afterwards.

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

Anti-patterns hit: none (no AI clichés, no gradient text, no icon-card grid, no invented proof;
the prospect list is used only to choose industries, never shown).
Next if continuing: founder headshot and full name; a real client result in the Run sheet
once one can be published; industry tabs could show a scroll hint on phones.
