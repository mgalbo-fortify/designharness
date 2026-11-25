/**
 * Shared helpers for the motion engine.
 *
 * Classes on <html> (set by the inline script in BaseLayout <head>):
 *   .js            JavaScript is running.
 *   .motion        Motion is allowed (no reduced-motion preference). Hidden
 *                  initial states in motion.css only apply under this class.
 *   .motion-paused The visitor pressed "Pause motion": ambient loops,
 *                  marquees and self-playing demos stop. One-shot reveals still run.
 *   .motion-ready  The engine booted (cancels the CSS failsafe).
 */

export const root = document.documentElement;

/** True when the visitor allows motion (no reduced-motion preference). */
export const motionAllowed = () => root.classList.contains("motion");

/** True when the visitor paused ambient motion with the footer control. */
export const isPaused = () => root.classList.contains("motion-paused");

/** Mouse/trackpad. Pointer effects (tilt, magnetic, spotlight) only run here. */
export const finePointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;

export const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T & Element>(sel)) as T[];

export const num = (v: string | undefined | null, fallback: number) => {
  if (v == null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
export const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * Run `cb` once when `el` first enters the viewport.
 * Elements inside a sticky story view are instead triggered every time their
 * view becomes active (see story.ts), so demos replay when you scroll back.
 */
export function whenShown(
  el: HTMLElement,
  cb: () => void,
  opts: { threshold?: number; rootMargin?: string } = {},
) {
  const view = el.closest<HTMLElement>("[data-story-view]");
  if (view) {
    const story = view.closest<HTMLElement>("[data-story]");
    const id = view.dataset.storyView;
    let last = -Infinity;
    const fire = () => {
      if (!view.classList.contains("is-active")) return;
      const now = performance.now();
      if (now - last < 400) return; // de-dupe IO + story:change firing together
      last = now;
      cb();
    };
    story?.addEventListener("story:change", (e) => {
      if ((e as CustomEvent).detail?.id === id) fire();
    });
    // Also fire if this view is already active once the stage is on screen.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          io.disconnect();
          fire();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(view);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          io.disconnect();
          cb();
        }
      }
    },
    { threshold: opts.threshold ?? 0.3, rootMargin: opts.rootMargin ?? "0px 0px -8% 0px" },
  );
  io.observe(el);
}

/** Track whether `el` is on screen; loops should only run while it is. */
export function visibility(el: Element, onChange?: (visible: boolean) => void) {
  const state = { visible: false };
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      state.visible = en.isIntersecting;
      onChange?.(state.visible);
    }
  });
  io.observe(el);
  return state;
}

/** Deterministic PRNG so hand-drawn marks redraw identically on resize. */
export function seeded(seedText: string) {
  let h = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i++) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
