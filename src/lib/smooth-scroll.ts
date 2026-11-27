import Lenis from "lenis";

/**
 * Inertial page scrolling (Lenis). The wheel sets a target and the page eases towards it, so
 * scrolling glides instead of stepping. It drives the native scroll position, so every
 * scroll-linked effect keeps reading window.scrollY as before. Skipped for reduced motion.
 */
let lenis: Lenis | null = null;

export function startSmoothScroll(): void {
    if (lenis || typeof window === "undefined") {
        return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
    const frame = (time: number) => {
        lenis?.raf(time);
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    if (document.documentElement.classList.contains("hero-playing")) {
        lenis.stop();
    }
}

/**
 * Puts the page back at the very top, natively and in Lenis, so a reload of the home page
 * always starts from the beginning even after the router restores an old position.
 */
export function resetScrollToTop(): void {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true, force: true });
}

/**
 * Holds the page at the top while the hero plays (index.html sets `hero-playing` before the
 * app loads); call once the hero's thread has finished drawing.
 */
export function releaseHeroScrollLock(): void {
    document.documentElement.classList.remove("hero-playing");
    lenis?.start();
}

/** The id of each home section a link can jump to (see the scenes' `anchor`). */
export const HOME_SECTIONS = [
    "services",
    "web-applications",
    "mobile-applications",
    "desktop-applications",
    "crm-cms-erp",
    "custom-software",
    "process",
    "about",
    "work",
    "contact",
] as const;

/**
 * Glides to a home section by id (Lenis when it is running, else a native smooth scroll),
 * stopping with the section's top just under the sticky header. Returns false if the section
 * is not on this page, so a link can fall back to navigating.
 */
export function scrollToSection(id: string, immediate = false): boolean {
    const target = document.getElementById(id);
    if (!target) {
        return false;
    }
    const header = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 72;
    if (lenis) {
        // Right after load Lenis may not have measured the page yet and would clamp to 0.
        lenis.resize();
        lenis.scrollTo(target, { offset: -header, immediate, force: true });
    } else {
        const top = target.getBoundingClientRect().top + window.scrollY - header;
        window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
    }
    history.replaceState(null, "", `#${id}`);
    return true;
}

/** Asks the home page's closing scene to open the enquiry form (see ClosingScene). */
export function openEnquiry(): void {
    window.dispatchEvent(new Event("classific:enquire"));
}

/** Glides back to the top of the page. */
export function scrollToTop(): void {
    if (lenis) {
        lenis.scrollTo(0);
    } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    history.replaceState(null, "", window.location.pathname);
}
