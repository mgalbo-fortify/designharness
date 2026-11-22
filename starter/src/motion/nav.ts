/**
 * NAV — scroll state, hide-on-scroll, current-section highlighting and the
 * accessible mobile menu. Works with <Nav />.
 *
 *   [data-nav]               gets .is-scrolled after 12px
 *   [data-nav][data-nav-hide] also hides while scrolling down, returns on up
 *   [data-nav-toggle]        the menu button (aria-controls → panel id)
 *   [data-nav-link]          in-page links get aria-current when their section is in view
 */
import { $$ } from "./env";

type LenisLike = { stop(): void; start(): void };
const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

export function initNav() {
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  if (!nav) return;

  // --- scroll state ---------------------------------------------------------
  const hide = nav.hasAttribute("data-nav-hide");
  let lastY = scrollY;
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY;
    nav.classList.toggle("is-scrolled", y > 12);
    if (hide && !nav.classList.contains("is-open") && !nav.matches(":focus-within")) {
      if (y > 420 && y - lastY > 6) nav.classList.add("is-hidden");
      else if (lastY - y > 6 || y < 420) nav.classList.remove("is-hidden");
    }
    lastY = y;
  };
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();

  // --- mobile menu ----------------------------------------------------------
  const toggle = nav.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const panel = toggle ? document.getElementById(toggle.getAttribute("aria-controls") ?? "") : null;
  if (toggle && panel) {
    const setOpen = (open: boolean) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      panel.toggleAttribute("inert", !open);
      document.documentElement.classList.toggle("nav-open", open);
      if (open) lenis()?.stop();
      else lenis()?.start();
    };
    panel.setAttribute("inert", "");
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    panel.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).closest("a")) setOpen(false);
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    matchMedia("(min-width: 900px)").addEventListener("change", (m) => m.matches && setOpen(false));
  }

  // --- current section ------------------------------------------------------
  const links = $$<HTMLAnchorElement>("[data-nav-link]").filter((a) => a.hash.length > 1);
  const targets = links
    .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
    .filter((t): t is HTMLElement => !!t);
  if (targets.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const id = en.target.id;
          links.forEach((a) => {
            if (a.hash === `#${id}`) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
  }
}
