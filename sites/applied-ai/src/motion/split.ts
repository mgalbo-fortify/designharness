/**
 * SPLIT — headline text reveals with GSAP SplitText.
 *
 *   <h1 data-split="lines">…</h1>   lines slide up out of masks (editorial)
 *   <h2 data-split="words">…</h2>   words blur and rise in (soft, friendly)
 *   <p  data-split="chars">…</p>    characters rise (use sparingly: short labels)
 *
 * Options: data-delay (ms), data-stagger (ms), data-duration (ms).
 * SplitText re-splits on resize and font load (autoSplit), keeps nested
 * elements like <em> and data-mark spans, and sets aria-label on the
 * original element so screen readers read the full sentence.
 *
 * Dispatches `split:done` on the element when its entrance finishes, so
 * annotation marks inside can wait for the text to settle before measuring.
 */
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $$, num } from "./env";

gsap.registerPlugin(SplitText, ScrollTrigger);

type Kind = "lines" | "words" | "chars";

const PRESETS: Record<Kind, { type: string; mask?: "lines" | "words"; stagger: number; duration: number; from: gsap.TweenVars }> = {
  lines: { type: "lines", mask: "lines", stagger: 90, duration: 1100, from: { yPercent: 108 } },
  words: { type: "words,lines", stagger: 45, duration: 1000, from: { opacity: 0, yPercent: 35, filter: "blur(10px)" } },
  chars: { type: "chars,words", mask: "words", stagger: 18, duration: 800, from: { yPercent: 100 } },
};

export async function initSplit() {
  const els = $$("[data-split]");
  if (!els.length) return;
  await document.fonts.ready;

  for (const el of els) {
    const kind = (el.dataset.split as Kind) in PRESETS ? (el.dataset.split as Kind) : "lines";
    const p = PRESETS[kind];
    const delay = num(el.dataset.delay, 0) / 1000;
    const stagger = num(el.dataset.stagger, p.stagger) / 1000;
    const duration = num(el.dataset.duration, p.duration) / 1000;
    let done = false;

    SplitText.create(el, {
      type: p.type,
      mask: p.mask,
      autoSplit: true,
      aria: "auto",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char",
      onSplit(self) {
        el.classList.add("is-split");
        if (done) {
          // Re-split after the entrance (resize/font swap): stay put, don't replay.
          requestAnimationFrame(() => el.dispatchEvent(new CustomEvent("split:resplit", { bubbles: true })));
          return;
        }
        const targets = kind === "lines" ? self.lines : kind === "words" ? self.words : self.chars;
        return gsap.from(targets, {
          ...p.from,
          duration,
          delay,
          stagger,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onComplete() {
            done = true;
            el.classList.add("is-split-done");
            gsap.set(targets, { clearProps: "filter" });
            el.dispatchEvent(new CustomEvent("split:done"));
          },
        });
      },
    });
  }
}
