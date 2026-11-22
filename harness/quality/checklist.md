# Pre-launch checklist

Run before hand-off. Most items are verified by `npm run qa`; the rest
are manual.

## Content
- [ ] No placeholders anywhere (QA)
- [ ] Every number and claim traces to `brief-original.md` or the user; numbers live in `site.config.ts` `facts`
- [ ] Required disclosures in footer `legal`; illustrative figures marked
- [ ] CTA labels consistent; all CTAs point to the real destination (not `#start` unless that's the form)
- [ ] Spelling and grammar pass; brand name capitalized consistently

## SEO and sharing
- [ ] Unique `<title>` (30–60 chars) and meta description (120–160) per page (QA)
- [ ] One `<h1>` per page, no skipped heading levels (QA)
- [ ] `site` URL set in `astro.config.mjs` and `site.config.ts`; `robots.txt` sitemap URL updated
- [ ] OG image generated (`npm run og -- <slug>`) and looks right at 1200×630
- [ ] Favicon replaced with the brand mark
- [ ] `/styleguide` is noindex (default); delete it if the client prefers

## Accessibility
- [ ] QA: 0 axe serious/critical; reduced-motion and no-JS states readable
- [ ] Keyboard: Tab through the whole page; focus is always visible and in a sensible order; mobile menu opens/closes with keyboard and Esc
- [ ] Images have meaningful `alt` or `alt=""` if decorative; decorative artifacts `aria-hidden`
- [ ] Form: labels, errors announced, success focus moves to the message
- [ ] Pause motion control present if anything loops

## Performance
- [ ] QA: CLS ≤ 0.05; JS < 350KB raw; fonts < 300KB; images < 1.5MB
- [ ] Hero image (if any) uses `<Image>` with `fetchpriority="high"`, not lazy
- [ ] No unused fonts/weights in `astro.config.mjs`

## Wiring
- [ ] Form endpoint set and a real submission tested (or `forms.mode: "netlify"`)
- [ ] Analytics IDs set; `?debug=1` shows `cta_click` / `section_view` events in the console
- [ ] External links have the right `href`; legal pages linked (privacy, terms) if required

## Deploy
- [ ] `npm run build -- <slug>` succeeds; deploy `sites/<slug>/dist`
- [ ] Netlify/Vercel/Cloudflare: build command `npm run build`, output `dist`, base dir `sites/<slug>` (or deploy the folder directly)
- [ ] Custom domain + HTTPS; test the live URL on a real phone
