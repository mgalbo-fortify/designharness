/**
 * SCROLL — scroll-linked motion with GSAP ScrollTrigger, plus optional
 * Lenis smooth scrolling.
 *
 * data-scrub    Writes the element's scroll progress (0 → 1) to the CSS
 *               variable --p, so CSS can drive anything with calc():
 *                 transform: translateY(calc((1 - var(--p)) * 40px));
 *               Ranges (data-scrub value):
 *                 "through" (default) top enters bottom → bottom leaves top
 *                 "enter"   top enters bottom → top reaches 35%
 *                 "exit"    bottom reaches bottom → bottom leaves top
 *                 "pin"     top hits top → bottom hits bottom (tall wrapper
 *                           with a position: sticky child: a pinned scene)
 *               Under reduced motion --p is fixed at data-scrub-rest (1).
 *               Also dispatches `scrub` ({ progress }) for canvas/JS scenes.
 *
 * data-parallax="0.15"  Drifts the element against the scroll. Keep it to
 *               decorative layers, 0.05–0.3. Never on text people are reading.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $$, finePointer, motionAllowed, num, root } from "./env";

gsap.registerPlugin(ScrollTrigger);

const RANGES: Record<string, [string, string]> = {
  through: ["top bottom", "bottom top"],
  enter: ["top bottom", "top 35%"],
  exit: ["bottom bottom", "bottom top"],
  pin: ["top top", "bottom bottom"],
};

export function initScrub() {
  for (const el of $$("[data-scrub]")) {
    if (!motionAllowed()) {
      el.style.setProperty("--p", el.dataset.scrubRest ?? "1");
      continue;
    }
    const [start, end] = RANGES[el.dataset.scrub || "through"] ?? RANGES.through;
    const write = (p: number) => {
      el.style.setProperty("--p", p.toFixed(4));
      el.dispatchEvent(new CustomEvent("scrub", { detail: { progress: p } }));
    };
    write(0);
    ScrollTrigger.create({
      trigger: el,
      start,
      end,
      onUpdate: (self) => write(self.progress),
      onRefresh: (self) => write(self.progress),
    });
  }
}

export function initParallax() {
  if (!motionAllowed()) return;
  for (const el of $$("[data-parallax]")) {
    const speed = num(el.dataset.parallax, 0.15);
    gsap.fromTo(
      el,
      { y: () => innerHeight * speed * 0.5 },
      {
        y: () => -innerHeight * speed * 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("[data-parallax-root]") ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  }
}

export async function initSmoothScroll() {
  if (root.dataset.smooth !== "true" || !motionAllowed() || !finePointer()) return;
  const { default: Lenis } = await import("lenis");
  const navH = parseFloat(getComputedStyle(root).getPropertyValue("--nav-h")) * 16 || 72;
  const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -(navH + 16) }, autoRaf: false });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // Let other modules stop/start scrolling (e.g. open mobile menu).
  (window as unknown as { __lenis: typeof lenis }).__lenis = lenis;
}

/** Recalculate trigger positions after late layout changes (fonts, images). */
export function refreshOnLoad() {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}
