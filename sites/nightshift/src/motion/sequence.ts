/**
 * SEQUENCE — self-playing product demos: notifications stacking up, a
 * checklist ticking off, a chat conversation, a progress bar filling.
 *
 *   <div data-sequence data-sequence-interval="1200" data-sequence-loop>
 *     <div data-seq>Paycheck landed</div>
 *     <div data-seq>Boost added</div>
 *   </div>
 *
 * Options on the container:
 *   data-sequence-mode     "accumulate" (default: items stay on) | "cycle" (one at a time)
 *   data-sequence-interval ms between items (1200)
 *   data-sequence-start    ms before the first item (500)
 *   data-sequence-loop     replay after holding the final state
 *   data-sequence-hold     ms to hold before looping (3200)
 *
 * Plays only while on screen and not paused. Under reduced motion it shows
 * the final state. Dispatches `sequence:step` ({ index, item }) so page
 * scripts can sync other things (e.g. bump a total) to each step.
 * Inside a story view it restarts whenever that view becomes active.
 */
import { $$, isPaused, motionAllowed, num, visibility, whenShown } from "./env";

export function initSequence() {
  for (const box of $$("[data-sequence]")) {
    const items = $$("[data-seq]", box);
    if (!items.length) continue;
    const mode = box.dataset.sequenceMode === "cycle" ? "cycle" : "accumulate";

    if (!motionAllowed()) {
      items.forEach((it, i) => it.classList.toggle("is-on", mode === "accumulate" || i === 0));
      continue;
    }

    const interval = num(box.dataset.sequenceInterval, 1200);
    const startDelay = num(box.dataset.sequenceStart, 500);
    const hold = num(box.dataset.sequenceHold, 3200);
    const loop = box.hasAttribute("data-sequence-loop");
    const vis = visibility(box);
    let run = 0;

    // Waits that only count down while the demo is visible and unpaused.
    const tick = (ms: number, token: number) =>
      new Promise<boolean>((resolve) => {
        let left = ms;
        let last = performance.now();
        const step = (now: number) => {
          if (token !== run) return resolve(false);
          if (vis.visible && !isPaused()) left -= now - last;
          last = now;
          if (left <= 0) resolve(true);
          else requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });

    const play = async () => {
      const token = ++run;
      items.forEach((it) => it.classList.remove("is-on"));
      if (!(await tick(startDelay, token))) return;
      do {
        for (let i = 0; i < items.length; i++) {
          if (mode === "cycle") items.forEach((it, k) => it.classList.toggle("is-on", k === i));
          else items[i].classList.add("is-on");
          box.dispatchEvent(new CustomEvent("sequence:step", { detail: { index: i, item: items[i] } }));
          if (!(await tick(i === items.length - 1 ? hold : interval, token))) return;
        }
        if (loop) {
          items.forEach((it) => it.classList.remove("is-on"));
          if (!(await tick(450, token))) return;
        }
      } while (loop);
    };

    whenShown(box, play, { threshold: 0.4 });
  }
}
