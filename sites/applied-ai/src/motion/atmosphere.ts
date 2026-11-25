/**
 * ATMOSPHERE — the page background shifts color as you move between
 * sections (Safe Start's morning-to-dusk sky).
 *
 *   <Atmosphere />  renders the fixed [data-atmosphere] layer once per page.
 *   <Section atmos="oklch(95% .03 230) | oklch(97% .02 160) | oklch(98% .03 90)">
 *
 * Each data-atmos holds three color stops separated by "|". While a section
 * is current, the layer shows its stops; during the last 40% of the section
 * the colors blend toward the next section's (smoothstepped). The blend is
 * done in CSS with color-mix(in oklch, …), so any CSS color format works.
 * Color change isn't motion, so it runs under reduced motion too.
 */
import { $$, clamp, smoothstep } from "./env";

export function initAtmosphere() {
  const layer = document.querySelector<HTMLElement>("[data-atmosphere]");
  const sections = $$("[data-atmos]");
  if (!layer || !sections.length) return;

  const stops = sections.map((s) => {
    const parts = s.dataset.atmos!.split("|").map((x) => x.trim()).filter(Boolean);
    return [parts[0], parts[1] ?? parts[0], parts[2] ?? parts[1] ?? parts[0]];
  });

  let lastKey = "";
  const apply = (i: number, t: number) => {
    const a = stops[i];
    const b = stops[Math.min(i + 1, stops.length - 1)];
    const key = `${i}:${t.toFixed(3)}`;
    if (key === lastKey) return;
    lastKey = key;
    for (let k = 0; k < 3; k++) {
      layer.style.setProperty(`--from-${k + 1}`, a[k]);
      layer.style.setProperty(`--to-${k + 1}`, b[k]);
    }
    layer.style.setProperty("--t", t.toFixed(3));
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    const line = innerHeight * 0.55;
    let i = 0;
    sections.forEach((s, k) => {
      if (s.getBoundingClientRect().top <= line) i = k;
    });
    const r = sections[i].getBoundingClientRect();
    const p = clamp((line - r.top) / Math.max(1, r.height));
    apply(i, i === sections.length - 1 ? 0 : smoothstep((p - 0.6) / 0.4));
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
