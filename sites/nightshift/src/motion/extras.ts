/**
 * EXTRAS — small one-off effects.
 *
 *   data-motion-toggle   The "Pause motion" button (WCAG 2.2.2). Toggles
 *                        html.motion-paused and remembers the choice.
 *   data-scramble        Text resolves from random glyphs, left to right, when
 *                        shown. For short labels/figures only (≤ 24 chars).
 */
import { $$, motionAllowed, num, root, wait, whenShown } from "./env";

export function initMotionToggle() {
  const buttons = $$<HTMLButtonElement>("[data-motion-toggle]");
  const sync = () => {
    const paused = root.classList.contains("motion-paused");
    buttons.forEach((b) => {
      b.setAttribute("aria-pressed", String(paused));
      const label = b.querySelector("[data-motion-label]");
      if (label) label.textContent = paused ? "Play motion" : "Pause motion";
    });
  };
  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      const paused = root.classList.toggle("motion-paused");
      try {
        localStorage.setItem("motion", paused ? "paused" : "");
      } catch {}
      document.dispatchEvent(new CustomEvent("motion:pause", { detail: { paused } }));
      sync();
    }),
  );
  sync();
}

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789$#%&";

export function initScramble() {
  if (!motionAllowed()) return;
  for (const el of $$("[data-scramble]")) {
    const final = el.textContent ?? "";
    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = final;
    const vis = document.createElement("span");
    vis.setAttribute("aria-hidden", "true");
    vis.textContent = final;
    el.replaceChildren(sr, vis);
    const duration = num(el.dataset.scrambleDuration, 820);
    whenShown(el, async () => {
      await wait(num(el.dataset.delay, 0));
      const start = performance.now();
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const settled = Math.floor(t * final.length);
        let out = final.slice(0, settled);
        for (let i = settled; i < final.length; i++) {
          out += final[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        vis.textContent = out;
        if (t < 1) requestAnimationFrame(frame);
        else vis.textContent = final;
      };
      requestAnimationFrame(frame);
    });
  }
}
