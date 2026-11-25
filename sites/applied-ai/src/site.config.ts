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
  name: "Applied AI",
  legalName: "Applied AI",
  url: "https://withappliedai.com",
  titleTemplate: "%s · Applied AI",
  description:
    "Applied AI sits with your team to learn how your firm works, then designs and builds AI workflows inside the tools you already use. Fixed fees. Your people stay in charge.",
  locale: "en_US",
  themeColor: "#f7f6f2",

  nav: [
    { label: "Method", href: "#method" },
    { label: "Industries", href: "#industries" },
    { label: "Engagements", href: "#engage" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
  ] satisfies NavLink[],

  navSecondary: null as NavLink | null,

  cta: {
    label: "Book a free 20-minute call",
    href: "#contact",
  },

  /** Every fact used on the page. Source: design/brief-original.md. */
  facts: {
    introCallMinutes: 20,
    founder: "Mike",
    founderTitle: "Founder",
    region: "Connecticut",
    serviceArea: "Fairfield County, Westchester, North Jersey and New York City",
    followUpDays: 30,
  },

  footer: {
    columns: [
      {
        title: "Firm",
        links: [
          { label: "Method", href: "#method" },
          { label: "Industries", href: "#industries" },
          { label: "Engagements", href: "#engage" },
          { label: "About", href: "#about" },
        ],
      },
      {
        title: "Start",
        links: [
          { label: "Book a free call", href: "#contact" },
          { label: "Questions", href: "#faq" },
        ],
      },
    ] as { title: string; links: NavLink[] }[],
    legal: [
      "Workflow examples, names and figures shown in diagrams on this page are illustrative.",
      "Every engagement is scoped and priced in writing before work begins. Third-party software subscriptions are billed by the vendor.",
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
