/**
 * SITE CONFIG — the single source of truth for facts that appear in more
 * than one place: name, URLs, navigation, the primary CTA, offer numbers,
 * legal copy, analytics IDs and form endpoints.
 *
 * Rule: if a number or claim appears twice on the site, it lives here and
 * both places read it. They can then never disagree.
 */

export type NavLink = { label: string; href: string };

export const site = {
  name: "Nightshift",
  legalName: "Nightshift Security",
  url: "https://nightshift.example",
  titleTemplate: "%s · Nightshift",
  description:
    "Nightshift is a 24/7 security team for businesses without one. US-based analysts watch your devices, email and logins and stop attacks before they become incidents.",
  locale: "en_US",
  themeColor: "#f9f6f1",

  nav: [
    { label: "A night on shift", href: "#night" },
    { label: "Coverage", href: "#coverage" },
    { label: "Reports", href: "#report" },
    { label: "FAQ", href: "#faq" },
  ] satisfies NavLink[],

  navSecondary: null as NavLink | null,

  cta: {
    label: "Get a free security check",
    href: "#check",
  },

  /** Every figure used on the page. Source: design/brief-original.md. */
  facts: {
    coverage: "24/7/365",
    containMinutes: 18,
    containSource: "Median time to contain a threat, 2025 customer data.",
    setupMinutes: 30,
    pricePerUser: 12,
    startTermMonths: 3,
  },

  footer: {
    columns: [
      {
        title: "Nightshift",
        links: [
          { label: "A night on shift", href: "#night" },
          { label: "Coverage", href: "#coverage" },
          { label: "Monthly reports", href: "#report" },
          { label: "Free security check", href: "#check" },
        ],
      },
    ] as { title: string; links: NavLink[] }[],
    legal: [
      "The overnight incident shown on this page is an illustrative scenario. Times, names and details are examples.",
      "Median time to contain is calculated from Nightshift customer incidents in 2025. Pricing starts at $12 per user per month; a 3-month initial term applies, then month to month.",
    ] as string[],
  },

  social: {} as Partial<Record<"x" | "linkedin" | "instagram" | "github" | "youtube", string>>,

  motion: {
    smoothScroll: true,
    pauseControl: true,
  },

  analytics: {
    plausibleDomain: "",
    ga4: "",
    metaPixel: "",
    posthogKey: "",
    posthogHost: "https://us.i.posthog.com",
  },

  forms: {
    endpoint: "",
    mode: "fetch" as "fetch" | "netlify",
  },
} as const;

export type Site = typeof site;
