# Principles

What separates the reference sites from the thousand interchangeable SaaS
pages. Each principle comes from something you can see in the references
(`references/reference-sites.md`). Read this before every project.

## 1. One idea, made visible

Every great site here has a single visual metaphor drawn from its promise:

| Site | Promise | Metaphor | What you see |
|---|---|---|---|
| Safe Start | Protected from day one | A castle, built up as you set up protections | Castle illustration; blocks extrude as steps complete; the sky turns to dusk and the windows light up |
| Topper | Get paid to switch, then keep getting paid | Balloons: lift, celebration, money rising | Balloon bouquet with physics; a "Payday Boost" row lands with sparkles |
| Financial Edge | Finds the money you're missing | A highlighter on a statement | Hand-drawn circles, highlights and strikethroughs; graph paper |
| Friends & Family | Accelerate | Driving: a cockpit, a speedometer | Wireframe road; scroll is the accelerator |

The metaphor isn't decoration. It decides the illustration, the texture, the
motion and even the button style (FE's keycap buttons belong to the
highlighter/notebook world). If you can't say the idea in five words, there
isn't one yet.

## 2. The headline is the design

- One headline per screen, set big: 72–106px on desktop, tight tracking
  (−0.03 to −0.05em), tight leading (0.94–1.0), balanced wrapping.
- One accent phrase per headline: italic serif in color (Safe Start),
  highlighter (FE), color (Topper). Exactly one, never two.
- The rest of the screen gets quieter so the headline can be loud: lead text
  at 18–22px, generous whitespace, one primary button.

## 3. Show the product, not people at laptops

Heroes and proof sections show *artifacts*: a believable slice of the
product with real-looking data (a balance, a transaction landing, a report,
a checklist). They're built in HTML/CSS, so they're crisp, animatable and
accessible. Stock photography is a last resort. See `design/artifacts.md`.

## 4. Motion explains; it doesn't decorate

Every notable animation demonstrates a claim:
- Numbers count up because money is being added.
- A circle gets drawn around $3,200 because that's the money you're missing.
- The castle builds as protections are switched on.
- The sticky card changes state as the story moves to the next chapter.

Budget per page: **one signature set-piece**, **two or three supporting
patterns**, and quiet defaults (reveals) for everything else. If everything
moves, nothing means anything. See `motion/motion.md`.

## 5. Restraint in color, richness in light

- One brand color carries action. One small vivid "pop" for moments of
  delight. Neutrals tinted toward the brand hue, never pure gray.
- Depth comes from light, not more colors: soft gradient atmospheres, layered
  shadows tinted with the brand hue, glass edges, a whisper of grain.
- Flat white with gray cards is the default of the internet. Avoid it.

## 6. Rhythm and whitespace

Sections breathe (≈160–190px apart on desktop). Copy blocks stay narrow
(≤ 36rem). Layouts are asymmetric (7/5 splits, offset headlines), not
everything-centered. Alternate dense and airy sections so scrolling has a pulse.

## 7. A system, not a pile of choices

One easing family, three durations. One radius per role. A type scale of
seven roles. Tokens only. Consistency is what makes a site feel expensive;
it's why these four look designed even though they're very different.

## 8. Craft is in the states

Hover, focus-visible, active/pressed, loading, success and error states.
Nav that turns to glass on scroll. Buttons whose arrows swap. Tabular
numerals in tables. Hanging punctuation on quotes. People feel these even
when they can't name them.

## 9. Fast and accessible is part of premium

Static HTML, self-hosted fonts, < 350KB JS, no layout shift. Reduced motion
respected (content never hidden). Keyboard-navigable. AA contrast. A pause
control for anything that loops. A beautiful site that stutters or excludes
people isn't premium.

## 10. Never fake it

No invented testimonials, logos, statistics, awards or certifications. Use
the brief's facts, keep every number in `site.config.ts`, and mark
illustrative figures as illustrative (financial and health sites especially).
