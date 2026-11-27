import { resetScrollToTop } from "@/lib/smooth-scroll";

/** How long the signature stays on screen at minimum, measured from the start of the page load. */
const MINIMUM_VISIBLE_MS = 3450;

/**
 * Lifts the signature intro that index.html shows on the home page. It waits until the signature
 * has finished writing (and the app has started), then fades the overlay away and releases the
 * hero's entrance animations, which index.html holds back until now so they play from the start.
 * Safe to call on any page: without the intro it does nothing.
 */
export function releaseIntro(): void {
    const root = document.documentElement;
    const overlay = document.getElementById("intro");
    if (!overlay) {
        return;
    }
    if (!root.classList.contains("intro-pending")) {
        overlay.remove();
        return;
    }

    window.setTimeout(
        () => {
            // The hero always plays from the top: undo any restored scroll position before the
            // curtain reveals the page.
            if (root.classList.contains("hero-playing")) {
                resetScrollToTop();
            }
            overlay.classList.add("intro-exit");
            root.classList.remove("intro-pending");
            const remove = () => overlay.remove();
            overlay.addEventListener("transitionend", remove, { once: true });
            window.setTimeout(remove, 1000);
        },
        Math.max(0, MINIMUM_VISIBLE_MS - performance.now()),
    );
}
