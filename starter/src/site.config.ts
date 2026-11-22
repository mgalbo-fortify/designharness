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
  name: "Starter",
  /** Short legal entity name for the footer. */
  legalName: "Starter, Inc.",
  /** Production origin, no trailing slash. Keep in sync with astro.config.mjs `site`. */
  url: "https://example.com",
  /** Default <title> suffix and meta description. Pages can override both. */
  titleTemplate: "%s · Starter",
  description: "One-sentence description of what this is and who it is for.",
  locale: "en_US",
  /** Browser UI color (mobile address bar). Usually the page background. */
  themeColor: "#f7f8fa",

  nav: [
    { label: "How it works", href: "#how" },
    { label: "Features", href: "#features" },
    { label: "FAQ", href: "#faq" },
  ] satisfies NavLink[],

  /** Secondary nav link shown beside the CTA (e.g. "Log in"). Optional. */
  navSecondary: null as NavLink | null,

  /** The one action the site exists to drive. */
  cta: {
    label: "Get started",
    href: "#start",
  },

  /** Facts and figures used in copy. Reference them; never retype them. */
  facts: {} as Record<string, string | number>,

  footer: {
    columns: [] as { title: string; links: NavLink[] }[],
    /** Fine print: disclosures, licensing, "illustrative" notes. Plain strings. */
    legal: [] as string[],
  },

  social: {} as Partial<Record<"x" | "linkedin" | "instagram" | "github" | "youtube", string>>,

  /**
   * Motion settings.
   * smoothScroll: Lenis inertial scrolling on desktop wheel/trackpad. Good for
   *   storytelling pages; turn off for form-heavy or utility pages.
   * pauseControl: shows the "Pause motion" control in the footer (WCAG 2.2.2).
   *   Required whenever anything moves for more than 5 seconds on its own.
   */
  motion: {
    smoothScroll: true,
    pauseControl: true,
  },

  /** Analytics. Leave a value empty to skip loading that provider. */
  analytics: {
    plausibleDomain: "",
    ga4: "",
    metaPixel: "",
    posthogKey: "",
    posthogHost: "https://us.i.posthog.com",
  },

  /** Lead form endpoint (Formspree, Basin, Netlify, your API). POST, FormData. */
  forms: {
    endpoint: "",
    /** "netlify" adds the data-netlify attributes; "fetch" posts via JS with a no-JS fallback. */
    mode: "fetch" as "fetch" | "netlify",
  },
} as const;

export type Site = typeof site;
