/**
 * POINTER — mouse/trackpad-only effects. Never required to understand
 * anything; skipped on touch and under reduced motion.
 *
 *   data-tilt="8"        3D tilt toward the pointer (max degrees). Sets --rx/--ry,
 *                        plus --mx/--my (0–100%) for a glare highlight.
 *                        Put it on an INNER wrapper, not on a [data-reveal] element.
 *   data-magnetic="0.3"  Element leans toward the pointer (buttons). Uses the
 *                        `translate` property so it composes with transforms.
 *   data-spotlight       Sets --mx/--my in px for a radial light that follows
 *                        the pointer (glass cards, grid backgrounds).
 */
import { $$, finePointer, motionAllowed, num } from "./env";

export function initPointer() {
  if (!finePointer() || !motionAllowed()) return;

  for (const el of $$("[data-tilt]")) {
    const max = num(el.dataset.tilt, 8);
    let raf = 0;
    el.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.classList.add("is-tilting");
        el.style.setProperty("--ry", `${((px - 0.5) * max * 2).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-(py - 0.5) * max * 2).toFixed(2)}deg`);
        el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      });
    });
    el.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  }

  for (const el of $$("[data-magnetic]")) {
    const strength = num(el.dataset.magnetic, 0.3);
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.classList.add("is-pulling");
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
    el.addEventListener("pointerleave", () => {
      el.classList.remove("is-pulling");
      el.style.translate = "0px 0px";
    });
  }

  for (const el of $$("[data-spotlight]")) {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(0)}px`);
      el.style.setProperty("--my", `${(e.clientY - r.top).toFixed(0)}px`);
      el.classList.add("is-lit");
    });
    el.addEventListener("pointerleave", () => el.classList.remove("is-lit"));
  }
}
