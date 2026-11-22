# Intake

Turn whatever the user provides (a paragraph, a copy deck, a product doc,
a competitor link) into a complete brief. Fill `templates/brief.md`.

## What you need to know

| Need | Why it changes the design | If missing |
|---|---|---|
| **Who it's for** (role, situation, sophistication) | Tone, density, type personality, how much to explain | Infer from product + copy; record the assumption |
| **The one action** (open account, book a call, join waitlist, buy) | Every section points at it; CTA copy | Ask: blocking |
| **The offer and key numbers** ($200 bonus, 4.5% APY, 14-day trial) | Hero, counters, artifacts, legal copy | Use only what's in the brief; never invent |
| **Proof** (customers, logos, ratings, security, press, team) | Proof sections; what's allowed to be claimed | Leave proof sections out; list in "Needed from you" |
| **Objections** (cost, trust, effort, switching pain) | FAQ, section order, microcopy near CTA | Infer from category; record |
| **Brand assets** (logo, colors, fonts, guidelines) | Constrains the concept | Design freely; say so |
| **Constraints** (regulated copy, disclosures, accessibility needs, CMS) | Legal blocks, fine print, tech | Ask if the category is regulated (finance, health, insurance, legal) |
| **Site type and pages** | Single-page arc vs. sitemap | Default: single landing page |
| **Where traffic comes from** (ads, outbound, search, referral) | Lead-gen pages need message match and fewer exits | Ask only for campaign pages |
| **References** (sites they like, sites they don't) | Calibrates taste | Use `references/reference-sites.md` |
| **Destination of the CTA** (URL, form endpoint, calendar link) | Wiring | Use `#start` and list it under "Needed from you" |

## Asking questions

Ask only what's blocking, all at once, multiple-choice where possible. Good:

> Before I design, three quick things:
> 1. Where should "Open account" go: your application URL, or a form on the page?
> 2. Can I use these numbers in the hero: $200 bonus, no monthly fees, 5-minute setup? Any disclosures required?
> 3. Any brand colors or logo I must use, or am I free to set the visual direction?

Don't ask about things you can decide well yourself (layout, fonts,
animation, section order). That's your job.

## Site-type defaults

- **Single-page product landing**: 6–9 sections, one CTA repeated 3–4 times,
  nav links to in-page anchors. Signature moment in the first two screens.
- **Multi-page marketing site**: Home, Product/Features, Pricing, About,
  Contact (+ Security, Customers as needed). Shared system, per-page hero.
  Nav links to pages; one global CTA in the nav.
- **Lead-gen / campaign page**: no nav links (logo + CTA only) or `bare`
  layout; message-matched headline (the ad's promise, word for word); form
  above the fold or one click away; 4–6 sections; proof near the form; set
  `smoothScroll: false`; analytics IDs required.
- **Agency / B2B services**: capabilities, approach/process, proof (case
  studies, logos, outcomes with numbers), team, contact form. The "artifact"
  is often the work itself or a diagram of the process.
