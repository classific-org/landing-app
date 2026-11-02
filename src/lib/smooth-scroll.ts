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
