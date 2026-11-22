# Anti-patterns

The fingerprints of generic, template or AI-generated sites. Check every
page against this list during review. Any hit caps the related rubric
dimension at 3 until fixed.

## Visual
- [ ] Purple-to-blue (or teal-to-purple) gradient fills on buttons, text or hero backgrounds
- [ ] Gradient text on headlines
- [ ] Inter/Roboto/system font at default tracking for display type
- [ ] Tailwind default palette (slate/indigo/violet) colors, or pure #000 / #fff / gray neutrals
- [ ] Every section centered
- [ ] Three identical cards, each with an icon in a colored circle, as the main feature layout
- [ ] Everything in a card: rounded-2xl + shadow-lg on every block
- [ ] Glassmorphism on a plain white background (glass needs color behind it)
- [ ] Emoji as icons
- [ ] Generic stock photos (people at laptops, handshakes, abstract "technology" blue)
- [ ] Hero with a floating 3D blob or abstract shape unrelated to the product
- [ ] Dark mode "neon on black" for a category that needs trust (banking, health)
- [ ] Badge soup: many pills/chips competing near the headline
- [ ] Mixed icon styles; icons of different stroke weights
- [ ] Huge empty hero on mobile; tiny headline on desktop
- [ ] Decorative grid/dots/noise so strong it competes with content

## Motion
- [ ] Every element fades up identically, with no signature moment
- [ ] Motion that doesn't explain anything (spinning, pulsing, bouncing logos)
- [ ] Bouncy/elastic easing on serious brands
- [ ] Parallax on text people are reading
- [ ] Scroll-jacking (wheel hijacked to snap sections) or very long pinned sections with nothing happening
- [ ] Animations > 1.2s on anything the user waits on
- [ ] Loops that never stop and can't be paused
- [ ] Content invisible until JS runs (fails reduced-motion or no-JS QA)
- [ ] Layout shift from late-loading fonts, images without dimensions, or count-ups that change width

## Copy
- [ ] "Unlock / unleash / elevate / empower / supercharge / revolutionize / seamless / cutting-edge"
- [ ] "Welcome to {Brand}" or "{Brand} is a …" as the hero headline
- [ ] Headline that names the category instead of the outcome
- [ ] Lorem ipsum, [placeholders], TODO, "Acme" in public copy (inside product artifacts, fictional sample data is fine)
- [ ] Invented testimonials, logos, user counts, ratings, press or awards
- [ ] Two equal-weight primary buttons side by side ("Get started" + "Learn more" both filled)
- [ ] "Learn more" / "Click here" / "Submit" as CTA labels
- [ ] Walls of text; paragraphs > 3 sentences in marketing sections
- [ ] Unsupported superlatives ("the best", "#1", "the most secure")

## Structure
- [ ] Sections that don't advance the argument (a "Our values" block on a product landing)
- [ ] The CTA appears only once, or the final CTA is missing
- [ ] Nav with more than 5–6 items on a landing page
- [ ] FAQ with questions nobody asks ("Why is {Brand} so great?")
- [ ] Footer link columns full of dead links
