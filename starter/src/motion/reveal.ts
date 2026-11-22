/**
 * REVEAL — one-shot entrance transitions, CSS-driven.
 *
 *   <div data-reveal>                       fade + rise (default "up")
 *   <div data-reveal="blur" data-delay="200">
 *   <ul data-reveal-group data-stagger="80" data-delay="100">
 *     <li data-reveal>…</li>                stagger is applied by index
 *   </ul>
 *
 * Variants: up | fade | rise | scale | blur | left | right | mask | rule
 * The transition itself lives in motion.css; this file only sets delays and
 * adds `.is-in` when the element enters the viewport.
 */
import { $$, motionAllowed, num } from "./env";

export function initReveal() {
  for (const group of $$("[data-reveal-group]")) {
    const step = num(group.dataset.stagger, 90);
    const base = num(group.dataset.delay, 0);
    $$("[data-reveal]", group).forEach((el, i) => {
      el.style.setProperty("--d", `${base + i * step}ms`);
    });
  }
  for (const el of $$("[data-reveal][data-delay]")) {
    if (el.hasAttribute("data-reveal-group")) continue;
    el.style.setProperty("--d", `${num(el.dataset.delay, 0)}ms`);
  }

  const els = $$("[data-reveal]");
  if (!motionAllowed()) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  els.forEach((el) => io.observe(el));
}
