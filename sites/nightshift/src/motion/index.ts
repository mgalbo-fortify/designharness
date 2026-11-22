/**
 * MOTION ENGINE — boot. Loaded once by BaseLayout.
 *
 * Pages declare motion with data attributes; each module is only downloaded
 * if the page uses it. Catalog and usage rules: harness/motion/motion.md.
 *
 *   data-reveal / data-reveal-group   entrances (CSS transitions)
 *   data-split                        headline line/word/char reveals (GSAP SplitText)
 *   data-count                        count-ups and odometers
 *   data-mark                         hand-drawn highlight/circle/underline/strike/box
 *   data-sequence + data-seq          self-playing UI demos
 *   data-story (+ step/view)          sticky scrollytelling
 *   data-scrub / data-parallax        scroll-linked (GSAP ScrollTrigger)
 *   data-atmos                        background color shifts between sections
 *   data-tilt / data-magnetic / data-spotlight   pointer effects
 *   data-scramble                     glyph-resolve text
 *   data-motion-toggle                pause control
 *
 * Page-specific choreography goes in the page's own <script>, listening to
 * the events these modules dispatch: story:change, sequence:step, scrub,
 * split:done, motion:pause.
 */
import { initReveal } from "./reveal";
import { initNav } from "./nav";
import { initStory } from "./story";
import { initMotionToggle, initScramble } from "./extras";
import { initAnalytics } from "../lib/analytics";
import { motionAllowed, root } from "./env";

const has = (sel: string) => document.querySelector(sel) !== null;

async function boot() {
  // Stable ids for marks before SplitText records the original markup.
  document.querySelectorAll<HTMLElement>("[data-mark]").forEach((el, i) => (el.dataset.markId ||= `m${i}`));

  initMotionToggle();
  initReveal();
  initStory();
  initAnalytics();
  root.classList.add("motion-ready");

  const tasks: Promise<unknown>[] = [];
  const load = <M>(cond: boolean, mod: () => Promise<M>, run: (m: M) => unknown) => {
    if (cond) tasks.push(mod().then(run).catch((err) => console.error("[motion]", err)));
  };

  // Scroll modules first: Lenis must exist before nav wires up the menu lock.
  const scrollNeeded = has("[data-scrub],[data-parallax]") || root.dataset.smooth === "true";
  if (scrollNeeded && motionAllowed()) {
    const scroll = await import("./scroll");
    await scroll.initSmoothScroll();
    scroll.initScrub();
    scroll.initParallax();
    scroll.refreshOnLoad();
  } else if (has("[data-scrub]")) {
    (await import("./scroll")).initScrub(); // sets resting --p values
  }
  initNav();

  load(has("[data-split]") && motionAllowed(), () => import("./split"), (m) => m.initSplit());
  load(has("[data-atmos]"), () => import("./atmosphere"), (m) => m.initAtmosphere());
  load(has("[data-count]"), () => import("./count"), (m) => m.initCount());
  load(has("[data-mark]"), () => import("./marks"), (m) => m.initMarks());
  load(has("[data-sequence]"), () => import("./sequence"), (m) => m.initSequence());
  if (has("[data-scramble]")) initScramble();
  load(has("[data-tilt],[data-magnetic],[data-spotlight]"), () => import("./pointer"), (m) => m.initPointer());

  await Promise.allSettled(tasks);
  document.dispatchEvent(new CustomEvent("motion:ready"));
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
else boot();
