/**
 * STORY — sticky scrollytelling: copy scrolls past a pinned visual whose
 * state changes with each chapter (the Topper pattern).
 *
 *   <div data-story>
 *     <div> <article data-story-step="a">…</article> <article data-story-step="b">…</article> </div>
 *     <div class="sticky …"> <div data-story-view="a" class="is-active">…</div> <div data-story-view="b">…</div> </div>
 *   </div>
 *
 * The current step is the last one whose top has crossed 52% of the viewport.
 * Views cross-fade (motion.css). Each change dispatches `story:change`
 * ({ id, index }) on the [data-story] element, and anything inside a view
 * that uses whenShown() (counts, marks, sequences) replays on activation.
 * Works the same under reduced motion; only the transitions are instant.
 * Use the <StickyStory> component rather than writing this markup by hand.
 */
import { $$ } from "./env";

export function initStory() {
  for (const story of $$("[data-story]")) {
    const steps = $$("[data-story-step]", story);
    const views = $$("[data-story-view]", story);
    if (!steps.length) continue;
    let current = "";

    const set = (id: string, index: number) => {
      if (id === current) return;
      current = id;
      story.dataset.active = id;
      views.forEach((v) => v.classList.toggle("is-active", v.dataset.storyView === id));
      steps.forEach((s) => {
        const on = s.dataset.storyStep === id;
        s.classList.toggle("is-current", on);
        if (on) s.setAttribute("aria-current", "step");
        else s.removeAttribute("aria-current");
      });
      story.dispatchEvent(new CustomEvent("story:change", { detail: { id, index } }));
    };

    let ticking = false;
    const update = () => {
      ticking = false;
      const line = innerHeight * 0.52;
      let idx = 0;
      steps.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= line) idx = i;
      });
      set(steps[idx].dataset.storyStep!, idx);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    update();
  }
}
