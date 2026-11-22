# Brief — Nightshift

## Snapshot
- **What it is:** Managed detection and response (a 24/7 security team as a service) for 10–200 person businesses without a security team.
- **Site type:** single landing page (lead-gen leaning: ads + referrals + search)
- **Pages:** `/` (+ 404, styleguide)
- **Primary action:** "Get a free security check" → form on the page (`#check`): name, work email, company, employees
- **Secondary action:** "See a night on the shift" → `#night`

## Audience
- **Who:** owners, COOs, and the one "IT person" at accounting firms, clinics, law offices, manufacturers.
- **Trigger:** a near-miss (phishing, a peer hit by ransomware), a cyber-insurance questionnaire, a client's security review.
- **What they want:** "Someone competent watching, who acts and tells me in plain English."
- **Sophistication:** know the threat exists; can't evaluate tools; burned by noisy alerts.
- **Top objections:**
  1. "We can't afford a security team." → from $12/user/month, no hires
  2. "We don't have IT staff to run another tool." → we work with whoever manages your computers
  3. "Another tool that floods us with alerts." → we act first, then explain
  4. "Long contract / disruption." → 30-minute setup, lightweight agent, month to month after 3 months

## Offer and facts
| Fact | Value | Source | Disclosure |
|---|---|---|---|
| Coverage | 24/7/365, US-based SOC | brief | — |
| Median time to contain | 18 minutes | brief (2025 customer data) | cite "2025 customer data" |
| Setup time | about 30 minutes | brief | — |
| Price | from $12 per user per month | brief | "from" |
| Term | 3 months, then month to month | brief | — |
| Platforms | Microsoft 365, Google Workspace | brief | — |

## Proof available
- No testimonials, logos or ratings → proof comes from mechanism (the story), facts, and the report artifact. No invented social proof.

## Brand
- **Existing assets:** none. Free to set direction.
- **Personality:** calm, vigilant, plain-spoken.
- **Must avoid:** hacker clichés (hooded figures, green code rain, padlocks, red alarm UI).

## Constraints
- The night scenario in the story is illustrative: label it.
- Form endpoint not provided → `site.forms.endpoint` empty (form shows an error on submit until set).

## Assumptions
- The lead form lives on the page rather than linking to a scheduling tool.
- "Nightshift" wordmark and logo designed here.
- Domain placeholder `nightshift.example`.

## Needed from the user (before launch)
- Form endpoint (or Netlify forms) and analytics IDs
- Real customer quote + permission, and logos if available
- Legal: privacy policy URL, company legal name
- Confirmation of the "18 minutes" figure's wording
