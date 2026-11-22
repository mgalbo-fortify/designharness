/**
 * ANALYTICS — one `track()` that fans out to whatever providers are loaded
 * (Plausible, GA4, Meta Pixel, PostHog, dataLayer). Providers are injected
 * by <Analytics /> only when their ID is set in site.config.ts.
 *
 * Automatic events:
 *   cta_click        any [data-track="where"] element is clicked
 *   section_view     a [data-section="name"] is 35% on screen (once)
 *   scroll_depth     25 / 50 / 75 / 90 %
 *   form_submit      emitted by <LeadForm />
 *
 * Attribution: UTM params and click ids (gclid, fbclid, msclkid, ttclid, li_fat_id)
 * are kept for the session (first touch) and copied into any form's hidden
 * fields named the same, so leads arrive with their source.
 *
 * Add ?debug=1 to the URL to log events to the console instead of sending.
 */

type Props = Record<string, string | number | boolean | undefined>;
type W = Window & {
  plausible?: (e: string, o?: { props?: Props }) => void;
  gtag?: (...a: unknown[]) => void;
  fbq?: (...a: unknown[]) => void;
  posthog?: { capture: (e: string, p?: Props) => void };
  dataLayer?: unknown[];
};

const ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "msclkid", "ttclid", "li_fat_id"];
const debug = () => new URLSearchParams(location.search).has("debug");

export function track(name: string, props: Props = {}) {
  if (debug()) {
    console.info("[track]", name, props);
    return;
  }
  const w = window as W;
  try {
    w.plausible?.(name, { props });
    w.gtag?.("event", name, props);
    w.fbq?.("trackCustom", name, props);
    w.posthog?.capture(name, props);
    w.dataLayer?.push({ event: name, ...props });
  } catch (err) {
    console.warn("[track] provider error", err);
  }
}

export function attribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem("attribution") || "{}");
  } catch {
    return {};
  }
}

function captureAttribution() {
  const params = new URLSearchParams(location.search);
  const found: Record<string, string> = {};
  for (const k of ATTR_KEYS) {
    const v = params.get(k);
    if (v) found[k] = v.slice(0, 200);
  }
  if (document.referrer && !document.referrer.startsWith(location.origin)) found.referrer = document.referrer.slice(0, 300);
  found.landing_page = location.pathname;
  try {
    if (!sessionStorage.getItem("attribution") && Object.keys(found).length) {
      sessionStorage.setItem("attribution", JSON.stringify(found));
    }
  } catch {}
  const data = attribution();
  document.querySelectorAll<HTMLInputElement>("form input[type=hidden]").forEach((input) => {
    if (data[input.name] && !input.value) input.value = data[input.name];
  });
}

export function initAnalytics() {
  captureAttribution();

  document.addEventListener("click", (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track]");
    if (!el) return;
    track("cta_click", { where: el.dataset.track, label: el.textContent?.trim().slice(0, 60) });
  });

  const seen = new Set<string>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        const name = (en.target as HTMLElement).dataset.section!;
        if (en.isIntersecting && !seen.has(name)) {
          seen.add(name);
          track("section_view", { section: name });
        }
      }
    },
    { threshold: 0.35 },
  );
  document.querySelectorAll<HTMLElement>("[data-section]").forEach((s) => io.observe(s));

  const marks = [25, 50, 75, 90];
  let last = 0;
  // Throttled scroll listener, not IO: IO is skipped in background/occluded tabs.
  addEventListener(
    "scroll",
    () => {
      const now = performance.now();
      if (now - last < 250) return;
      last = now;
      const max = document.documentElement.scrollHeight - innerHeight;
      const pct = max > 0 ? (scrollY / max) * 100 : 100;
      while (marks.length && pct >= marks[0]) track("scroll_depth", { percent: marks.shift()! });
    },
    { passive: true },
  );
}
