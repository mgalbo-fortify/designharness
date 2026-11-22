# Design review rubric

Score every dimension 1–5 from the QA screenshots (desktop hero, filmstrip,
desktop/tablet/mobile sheets, reduced-motion and no-JS heroes). Write scores,
evidence and fixes to `design/review.md`. Be a harsh critic: score what's on
screen, not what you intended.

**Pass:** every dimension ≥ 4 and total ≥ 44/55, with nothing blocking in
`qa/report.md`.

| # | Dimension | 5 looks like | 3 looks like | 1 looks like |
|---|---|---|---|---|
| 1 | **Concept** | One clear idea you can name; it shapes visuals, motion and texture | A nice theme, but it's only in the hero | Generic SaaS; swap the logo and it's anyone's |
| 2 | **First impression** (desktop hero) | Striking in 3 seconds: headline, artifact and CTA in perfect hierarchy | Clear but forgettable | Cluttered, or weak and empty |
| 3 | **Typography** | Big confident display, right tracking, beautiful line breaks, consistent roles | Correct but timid sizes; some awkward breaks | Default sizes, orphans, too many styles |
| 4 | **Color and light** | Restrained palette with meaning; atmosphere/light gives depth; AA everywhere | Pleasant but flat or slightly noisy | Gray template, or rainbow; contrast failures |
| 5 | **Layout and rhythm** | Asymmetric, purposeful, breathing; density alternates; depth via overlap | Orderly but monotonous (same block repeated) | Cramped or adrift; misaligned |
| 6 | **Artifacts and imagery** | Believable product slices with real-looking data that prove claims | Present but generic or static | Stock imagery, icon grids, placeholders |
| 7 | **Motion** (filmstrip + sheets) | Signature moment explains the product; choreography is intentional; restrained elsewhere | Smooth but uniform fade-ups everywhere | Distracting, janky, or none |
| 8 | **Copy** | Specific, sharp, benefit-led; every line earns its place; CTA verb + outcome | Accurate but wordy or vague in places | Buzzwords, filler, invented claims |
| 9 | **Mobile** (mobile sheet) | Designed, not squeezed: hierarchy holds, artifacts scale, taps easy | Works but cramped or overly long | Broken layout, overflow, tiny text |
| 10 | **Craft and states** | Hover/focus/press states, nav behavior, details polished; no rough edges | Mostly polished, a few defaults showing | Unstyled states, misalignments, jank |
| 11 | **Accessibility and performance** | 0 blocking issues; reduced-motion and no-JS fully readable; budgets met | Minor warnings | Hidden content, contrast or keyboard failures |

## How to review

1. Open `desktop-hero.png`. Squint: what do you see first, second, third?
   It should be headline → artifact/proof → CTA. Is the idea obvious?
2. Open `filmstrip.png`. Is the entrance ordered and finished by ~1.4s? Does
   the artifact come alive after?
3. Open `desktop-sheet.png` screen by screen. For each: one idea? clear
   headline? enough air? Does the page have a pulse (variety)?
4. `mobile-sheet.png`: same questions, plus line breaks of display type,
   artifact scale, CTA reachability.
5. `reduced-hero.png`, `nojs-hero.png`: everything readable?
6. Run the anti-pattern list (`anti-patterns.md`) explicitly; any hit caps
   the relevant dimension at 3.
7. Write the top 5 fixes, ordered by impact on the overall impression. Fix,
   re-run QA, re-score. Don't stop at "fine".

## review.md format

```
# Review: round 2
| Dimension | Score | Evidence |
|---|---|---|
| Concept | 4 | Ledger idea is clear in hero and findings; fades out after section 4 |
…
Total: 46/55
Anti-patterns hit: none / "three identical icon cards" in features (fixed → FeatureList)
Top fixes next round:
1. …
```
