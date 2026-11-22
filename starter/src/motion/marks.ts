/**
 * MARKS — hand-drawn annotations that draw themselves on.
 *
 *   <span data-mark="highlight">the money you're missing</span>
 *   <span data-mark="circle" data-delay="600">$3,200</span>
 *   <span data-mark="underline">every payday</span>
 *   <span data-mark="strike">-$32.00</span>
 *   <span data-mark="box">Off</span>
 *
 * Geometry comes from getClientRects(), so highlights and underlines follow
 * wrapped lines. Jitter is seeded from the text, so a resize redraws the same
 * "hand" without replaying. Highlights sit under the text; other marks over it.
 *
 * Colors: --color-mark (highlighter) and --color-mark-line (pen), or override
 * one mark with data-mark-color="var(--color-pop)".
 * Inside a data-split headline, marks wait for the split entrance to finish.
 */
import { $$, motionAllowed, num, seeded, wait, whenShown } from "./env";

type Kind = "highlight" | "underline" | "circle" | "strike" | "box";
const SVG = "http://www.w3.org/2000/svg";

type Box = { x: number; y: number; w: number; h: number };

function hostFor(el: HTMLElement) {
  // SplitText rewrites the inside of a split headline on re-split, so marks in
  // one draw into a layer on the headline's parent instead.
  const split = el.closest<HTMLElement>("[data-split]");
  let node = split ? split.parentElement : el.parentElement;
  while (node && getComputedStyle(node).display === "inline") node = node.parentElement;
  const host = node ?? document.body;
  if (getComputedStyle(host).position === "static") host.classList.add("mark-host");
  else host.style.isolation = "isolate";
  return host;
}

function layer(host: HTMLElement, which: "under" | "over") {
  let svg = host.querySelector<SVGSVGElement>(`:scope > svg.mark-layer--${which}`);
  if (!svg) {
    svg = document.createElementNS(SVG, "svg");
    svg.classList.add("mark-layer", `mark-layer--${which}`);
    svg.setAttribute("aria-hidden", "true");
    host.append(svg);
  }
  return svg;
}

function lineBoxes(el: HTMLElement, host: HTMLElement): Box[] {
  const hr = host.getBoundingClientRect();
  const rects = Array.from(el.getClientRects()).filter((r) => r.width > 2 && r.height > 2);
  // Merge fragments that share a line (nested spans can produce several).
  const lines: Box[] = [];
  for (const r of rects) {
    const box = { x: r.left - hr.left, y: r.top - hr.top, w: r.width, h: r.height };
    const same = lines.find((l) => Math.abs(l.y + l.h / 2 - (box.y + box.h / 2)) < box.h * 0.4);
    if (same) {
      const x1 = Math.min(same.x, box.x);
      const x2 = Math.max(same.x + same.w, box.x + box.w);
      same.x = x1;
      same.w = x2 - x1;
      same.h = Math.max(same.h, box.h);
    } else lines.push(box);
  }
  return lines;
}

function pathEl(d: string, stroke: string, width: number, opts: { cap?: string; opacity?: number } = {}) {
  const p = document.createElementNS(SVG, "path");
  p.setAttribute("d", d);
  p.setAttribute("fill", "none");
  p.setAttribute("stroke", stroke);
  p.setAttribute("stroke-width", width.toFixed(2));
  p.setAttribute("stroke-linecap", opts.cap ?? "round");
  p.setAttribute("stroke-linejoin", "round");
  if (opts.opacity != null) p.setAttribute("opacity", String(opts.opacity));
  return p;
}

function build(kind: Kind, lines: Box[], rnd: () => number, color: string): SVGPathElement[] {
  const j = (amt: number) => (rnd() - 0.5) * 2 * amt;
  const out: SVGPathElement[] = [];

  if (kind === "highlight") {
    for (const l of lines) {
      const pad = l.h * 0.1;
      const y = l.y + l.h * 0.58;
      const x0 = l.x - pad;
      const x1 = l.x + l.w + pad;
      const sw = l.h * 0.6;
      const d = `M${x0} ${y + j(l.h * 0.05)} C${x0 + (x1 - x0) * 0.3} ${y + j(l.h * 0.06)}, ${x0 + (x1 - x0) * 0.7} ${y + j(l.h * 0.06)}, ${x1} ${y + j(l.h * 0.05)}`;
      out.push(pathEl(d, color, sw, { cap: "butt" }));
      const y2 = y + l.h * 0.12;
      const d2 = `M${x0 + pad} ${y2 + j(l.h * 0.04)} C${x0 + (x1 - x0) * 0.35} ${y2 + j(l.h * 0.05)}, ${x0 + (x1 - x0) * 0.65} ${y2 + j(l.h * 0.05)}, ${x1 - pad * 0.5} ${y2 + j(l.h * 0.04)}`;
      out.push(pathEl(d2, color, sw * 0.5, { cap: "butt", opacity: 0.6 }));
    }
  }

  if (kind === "underline" || kind === "strike") {
    for (const l of lines) {
      const y = kind === "underline" ? l.y + l.h * 0.94 : l.y + l.h * 0.56;
      const sw = Math.min(5, Math.max(2, l.h * 0.075));
      const x0 = l.x - l.h * 0.06;
      const x1 = l.x + l.w + l.h * 0.06;
      const d = `M${x0} ${y + j(1.5)} Q${(x0 + x1) / 2} ${y + j(l.h * 0.08)} ${x1} ${y + j(1.5)}`;
      out.push(pathEl(d, color, sw));
    }
  }

  if (kind === "circle" || kind === "box") {
    const x0 = Math.min(...lines.map((l) => l.x));
    const y0 = Math.min(...lines.map((l) => l.y));
    const x1 = Math.max(...lines.map((l) => l.x + l.w));
    const y1 = Math.max(...lines.map((l) => l.y + l.h));
    const lh = lines[0]?.h ?? 20;
    const sw = Math.min(4.5, Math.max(2, lh * 0.075));

    if (kind === "circle") {
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      const rx = (x1 - x0) / 2 + lh * 0.38;
      const ry = (y1 - y0) / 2 + lh * 0.3;
      const tilt = ((-4 + j(2)) * Math.PI) / 180;
      const start = -2.4 + j(0.3);
      const turns = 1.1;
      const steps = 72;
      const phase = rnd() * Math.PI * 2;
      let d = "";
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const th = start + t * turns * Math.PI * 2;
        const wobble = 1 + 0.035 * Math.sin(3 * th + phase);
        const spiral = 1 + 0.05 * t;
        const ex = Math.cos(th) * rx * wobble * spiral;
        const ey = Math.sin(th) * ry * wobble * spiral;
        const x = cx + ex * Math.cos(tilt) - ey * Math.sin(tilt);
        const y = cy + ex * Math.sin(tilt) + ey * Math.cos(tilt);
        d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      out.push(pathEl(d, color, sw));
    } else {
      const p = lh * 0.25;
      const o = lh * 0.12; // overshoot at corners
      const a = [x0 - p, y0 - p];
      const b = [x1 + p, y0 - p];
      const c = [x1 + p, y1 + p];
      const e = [x0 - p, y1 + p];
      const d =
        `M${a[0] - o} ${a[1] + j(2)} L${b[0] + o} ${b[1] + j(2)} ` +
        `M${b[0] + j(2)} ${b[1] - o} L${c[0] + j(2)} ${c[1] + o} ` +
        `M${c[0] + o} ${c[1] + j(2)} L${e[0] - o} ${e[1] + j(2)} ` +
        `M${e[0] + j(2)} ${e[1] + o} L${a[0] + j(2)} ${a[1] - o}`;
      out.push(pathEl(d, color, sw));
    }
  }
  return out;
}

class Mark {
  el: HTMLElement;
  kind: Kind;
  host: HTMLElement;
  group: SVGGElement;
  drawn = false;

  constructor(el: HTMLElement) {
    this.el = el;
    this.kind = (el.dataset.mark as Kind) || "highlight";
    this.host = hostFor(el);
    const svg = layer(this.host, this.kind === "highlight" ? "under" : "over");
    this.group = document.createElementNS(SVG, "g");
    svg.append(this.group);
  }

  color() {
    return (
      this.el.dataset.markColor ||
      (this.kind === "highlight" ? "var(--color-mark)" : "var(--color-mark-line)")
    );
  }

  render(animate: boolean) {
    // A re-split replaces the nodes inside the headline: find our span again.
    if (!this.el.isConnected) {
      const again = document.querySelector<HTMLElement>(`[data-mark-id="${this.el.dataset.markId}"]`);
      if (!again) return;
      this.el = again;
    }
    this.group.replaceChildren();
    const rnd = seeded(`${this.kind}:${this.el.textContent}`);
    const paths = build(this.kind, lineBoxes(this.el, this.host), rnd, this.color());
    paths.forEach((p) => this.group.append(p));
    if (!animate) return;

    let at = 0;
    for (const p of paths) {
      const len = p.getTotalLength();
      const dur = this.kind === "circle" ? 750 : this.kind === "highlight" ? Math.min(620, 160 + len * 0.7) : Math.min(520, 140 + len * 0.6);
      p.style.strokeDasharray = `${len}`;
      p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
        duration: dur,
        delay: at,
        easing: "cubic-bezier(.35,.1,.25,1)",
        fill: "both",
      });
      at += dur * 0.85;
    }
  }

  /** Element to watch for visibility. Inside a split headline, watch the
   *  headline itself: SplitText may replace our span when it re-splits. */
  get trigger() {
    return this.el.closest<HTMLElement>("[data-split]") ?? this.el;
  }

  async play() {
    const split = this.el.closest<HTMLElement>("[data-split]");
    if (split && motionAllowed() && !split.classList.contains("is-split-done")) {
      await new Promise<void>((resolve) => {
        split.addEventListener("split:done", () => resolve(), { once: true });
        setTimeout(resolve, 3500); // never wait forever
      });
    }
    await wait(num(this.el.dataset.delay, 0));
    this.render(true);
    this.drawn = true;
  }
}

/** Give every mark a stable id. Called at boot, before SplitText runs. */
export function tagMarks() {
  $$("[data-mark]").forEach((el, i) => (el.dataset.markId ||= `m${i}`));
}

export async function initMarks() {
  const els = $$("[data-mark]");
  if (!els.length) return;
  await document.fonts.ready;
  const marks = els.map((el) => new Mark(el));

  if (!motionAllowed()) {
    marks.forEach((m) => {
      m.render(false);
      m.drawn = true;
    });
  } else {
    marks.forEach((m) => whenShown(m.trigger, () => m.play(), { threshold: m.trigger === m.el ? 0.8 : 0.4 }));
  }

  // Redraw (without replaying) when layout changes.
  let raf = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => marks.forEach((m) => m.drawn && m.render(false)));
  });
  new Set(marks.map((m) => m.host)).forEach((h) => ro.observe(h));
  document.addEventListener("split:resplit", () => marks.forEach((m) => m.drawn && m.render(false)));
}
