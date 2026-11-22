/**
 * COUNT — numbers that count up when shown.
 *
 * Always server-render the FINAL value as the element's text: it's what
 * search engines, no-JS visitors and reduced-motion visitors see.
 *
 *   <span data-count="3240" data-count-format='{"style":"currency","currency":"USD"}'>$3,240.00</span>
 *   <span data-count="96" data-count-mode="roll">96</span>      odometer digits
 *   <span data-count="12" data-count-suffix="k+">12k+</span>
 *
 * Options: data-count-from (0), data-count-duration (ms, 1600),
 *          data-count-prefix, data-count-suffix, data-count-locale,
 *          data-count-format (Intl.NumberFormat options as JSON),
 *          data-delay (ms).
 * Inside a sticky story view it replays each time the view becomes active.
 */
import { $$, easeOutQuart, motionAllowed, num, wait, whenShown } from "./env";

function formatter(el: HTMLElement) {
  let opts: Intl.NumberFormatOptions = {};
  try {
    opts = el.dataset.countFormat ? JSON.parse(el.dataset.countFormat) : {};
  } catch {
    console.warn("[count] invalid data-count-format JSON", el);
  }
  // Intermediate frames keep the target's precision (no "296.808" mid-count).
  if (opts.maximumFractionDigits == null && opts.style !== "currency" && opts.style !== "percent") {
    const decimals = (el.dataset.count?.split(".")[1] ?? "").length;
    opts = { ...opts, minimumFractionDigits: decimals, maximumFractionDigits: decimals };
  }
  const nf = new Intl.NumberFormat(el.dataset.countLocale || "en-US", opts);
  const prefix = el.dataset.countPrefix ?? "";
  const suffix = el.dataset.countSuffix ?? "";
  return (n: number) => `${prefix}${nf.format(n)}${suffix}`;
}

/** Screen readers get the final value once; the animated digits are hidden. */
function split(el: HTMLElement, finalText: string) {
  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = finalText;
  const vis = document.createElement("span");
  vis.setAttribute("aria-hidden", "true");
  el.replaceChildren(sr, vis);
  return vis;
}

function tween(el: HTMLElement) {
  const to = num(el.dataset.count, 0);
  const from = num(el.dataset.countFrom, 0);
  const duration = num(el.dataset.countDuration, 1600);
  const fmt = formatter(el);
  const finalText = fmt(to);
  const vis = split(el, finalText);
  vis.textContent = fmt(from);

  return async () => {
    vis.textContent = fmt(from);
    await wait(num(el.dataset.delay, 0));
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      vis.textContent = t < 1 ? fmt(from + (to - from) * easeOutQuart(t)) : finalText;
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
}

function roll(el: HTMLElement) {
  const to = num(el.dataset.count, 0);
  const finalText = formatter(el)(to);
  const wrap = split(el, finalText);
  wrap.className = "count-roll";

  const strips: { strip: HTMLElement; digit: number }[] = [];
  for (const ch of finalText) {
    if (/\d/.test(ch)) {
      const col = document.createElement("span");
      col.className = "count-roll__col";
      const strip = document.createElement("span");
      strip.className = "count-roll__strip";
      for (let d = 0; d <= 9; d++) {
        const s = document.createElement("span");
        s.textContent = String(d);
        strip.append(s);
      }
      col.append(strip);
      wrap.append(col);
      strips.push({ strip, digit: Number(ch) });
    } else {
      const s = document.createElement("span");
      s.textContent = ch;
      wrap.append(s);
    }
  }
  // Stagger from the right, like a mechanical counter.
  strips.forEach(({ strip }, i) => strip.style.setProperty("--k", `${(strips.length - 1 - i) * 45}ms`));

  return async () => {
    strips.forEach(({ strip }) => {
      strip.style.transition = "none";
      strip.style.setProperty("--digit", "0");
    });
    void wrap.offsetWidth; // commit the reset before animating
    strips.forEach(({ strip }) => (strip.style.transition = ""));
    await wait(num(el.dataset.delay, 0) + 30);
    strips.forEach(({ strip, digit }) => strip.style.setProperty("--digit", String(digit)));
  };
}

export function initCount() {
  if (!motionAllowed()) return; // final values are already in the markup
  for (const el of $$("[data-count]")) {
    const play = el.dataset.countMode === "roll" ? roll(el) : tween(el);
    whenShown(el, play, { threshold: 0.6 });
  }
}
