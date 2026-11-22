# Strategy: message and narrative

A marketing page is an argument with a single conclusion: the CTA. Design
the argument before the visuals.

## 1. Message hierarchy

Write these down in `design/strategy.md` before anything else:

1. **The promise** (hero headline): the outcome for the visitor, specific
   and believable. Not the category ("Smarter checking"), the result
   ("finds the money you're missing").
2. **The mechanism** (subhead): how the promise is kept, in one sentence.
3. **The reasons** (3, max 4): each one a section. Ordered by what the
   audience cares about most, not by what the company is proudest of.
4. **The proof**: what makes each reason believable.
5. **The objections**: what stops a yes (cost, risk, effort, trust), each
   answered somewhere specific.
6. **The ask**: CTA label = verb + outcome ("Start switching", "Find my edge",
   "Book a security review"). Not "Submit", "Learn more" or "Get started" if
   anything more specific is possible.

## 2. Narrative arcs

Pick one and adapt it. Every section must earn its place: if removing it
wouldn't weaken the argument, remove it.

**Promise → Proof (default product landing)**
1. Hero: promise + artifact + CTA
2. Tension: what's broken today (short, sharp, often a single big line)
3. How it works: 3 steps
4. Signature section: the main reason, shown with the concept's set-piece
5. Reasons 2–3 (feature list, bento, or story chapters)
6. Proof: numbers, quote, trust/security
7. FAQ (objections)
8. Final CTA: the promise restated, warmer

**Story chapters (scrollytelling, like Topper)**
1. Hero
2–5. Chapters in a StickyStory: each chapter is a reason, and the pinned
   artifact changes state to show it
6. Steps ("we make the move with you")
7. Final CTA + trust strip

**Problem → Diagnosis → Fix (like Financial Edge)**
1. Hero states what you're missing, and the artifact diagnoses it live
2. Findings: three specific things, each annotated (circled, highlighted)
3. The fix: next best move
4. The ongoing value (report, dashboard)
5. Final CTA

**Agency / B2B services (like Friends & Family)**
1. Hero: a bold one-word or one-line positioning + immersive scene
2. What we do (capabilities, 4–6)
3. How we work (approach/process)
4. Proof (case studies with outcomes, client logos)
5. Who we are (team, principles)
6. Engagement models
7. Contact (form)

**Lead-gen campaign**
1. Hero: message-matched headline + form (or CTA to form) + one proof point
2. What you get (3 bullets with icons, or a mini artifact)
3. Proof (quote/logos/rating) near the form
4. FAQ (3–5)
5. Repeat form/CTA

## 3. Section plan format

For each section in `design/strategy.md`:

```
### 3. How it works   (id: how · analytics: how)
Job: remove the "this sounds like work" objection.
Headline: "We make the move with you."
Copy: 3 steps: Open Topper · Start earning · Move your paycheck (one line each)
Proof: "5 minutes" fact
Visual: Steps component; line draws across; numbers pop in sequence
CTA: none (keeps momentum to the signature section)
```

## 4. CTA placement

- Hero (primary), nav (persistent), after the signature section, final.
- Lead-gen: also after the proof block.
- Secondary CTAs are text-style (`variant="link"`), never a second filled button
  of equal weight beside the primary.

## 5. Multi-page sitemaps

Each page has one job and one primary CTA. Keep the global CTA in the nav.
Typical B2B: Home (positioning + routes), Product or Services (depth),
Pricing (decision), Customers (proof), About (trust), Contact (action).
Make a `strategy.md` section plan per page, shorter for inner pages.
