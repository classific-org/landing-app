import { useEffect, useRef } from "react";
import { requestScrollFrame, subscribeToScroll } from "@/components/motion/scroll-driver";

export function prefersReducedMotion(): boolean {
    return (
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));

type RevealOptions = {
    /** Fraction of the viewport height to hold back before the element counts as visible. */
    inset?: number;
    /**
     * Which element the observer watches. A fully clipped element (the "clip" reveal) counts as
     * not intersecting, so it would never reveal itself; watch its parent instead.
     */
    watch?: "self" | "parent";
};

/**
 * Scroll reveal. Content is fully visible on the server and without JavaScript. After mount the
 * element is "armed" (hidden) and flips to "in" once it enters the viewport; CSS in global.css
 * owns the transition. Reduced-motion visitors never see the armed state.
 */
export function useReveal<T extends HTMLElement>({
    inset = 0.08,
    watch = "self",
}: RevealOptions = {}) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element || prefersReducedMotion() || !("IntersectionObserver" in window)) {
            return;
        }

        element.dataset.motion = "armed";
        let frame = 0;
        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) {
                    return;
                }
                observer.disconnect();
                // Two frames so the armed styles paint before the transition starts.
                frame = requestAnimationFrame(() => {
                    frame = requestAnimationFrame(() => {
                        element.dataset.motion = "in";
                    });
                });
            },
            { rootMargin: `0px 0px -${Math.round(inset * 100)}% 0px`, threshold: 0.01 },
        );
        observer.observe(watch === "parent" ? (element.parentElement ?? element) : element);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
            delete element.dataset.motion;
        };
    }, [inset, watch]);

    return ref;
}

/**
 * Tracks whether an element is near the viewport, so scroll-linked work is skipped while it is
 * far away. The returned getter is read inside the shared scroll loop.
 */
function observeVisibility(element: HTMLElement, margin: string) {
    let visible = false;
    const observer = new IntersectionObserver(
        ([entry]) => {
            visible = entry?.isIntersecting ?? false;
            if (visible) {
                requestScrollFrame();
            }
        },
        { rootMargin: margin },
    );
    observer.observe(element);
    return { isVisible: () => visible, stop: () => observer.disconnect() };
}

/**
 * Moves the `.parallax-image` children a few percent against the scroll direction while their
 * frame is on screen. Writes the transform directly on those images.
 */
export function useParallax<T extends HTMLElement>(strength = 8) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element || prefersReducedMotion()) {
            return;
        }
        const images = Array.from(element.querySelectorAll<HTMLElement>(".parallax-image"));
        if (images.length === 0) {
            return;
        }

        const visibility = observeVisibility(element, "10% 0px");
        const unsubscribe = subscribeToScroll(
            () => {
                if (!visibility.isVisible()) {
                    return null;
                }
                const rect = element.getBoundingClientRect();
                const viewport = window.innerHeight || 1;
                return -clamp((rect.top + rect.height / 2 - viewport / 2) / viewport, -1, 1);
            },
            (progress) => {
                if (progress === null) {
                    return;
                }
                const offset = `translate3d(0, ${(progress * strength).toFixed(2)}%, 0)`;
                images.forEach((image) => (image.style.transform = offset));
            },
        );

        return () => {
            unsubscribe();
            visibility.stop();
            images.forEach((image) => image.style.removeProperty("transform"));
        };
    }, [strength]);

    return ref;
}

/**
 * Reports whether the page has scrolled past `offset` pixels. The offset may be a function so
 * viewport-relative thresholds are read at scroll time. Used for the header hairline and tone.
 */
export function useScrolled(
    offset: number | (() => number),
    onChange: (scrolled: boolean) => void,
) {
    const callback = useRef(onChange);
    callback.current = onChange;

    useEffect(() => {
        let last: boolean | null = null;
        return subscribeToScroll(
            () => window.scrollY > (typeof offset === "function" ? offset() : offset),
            (scrolled) => {
                if (scrolled !== last) {
                    last = scrolled;
                    callback.current(scrolled);
                }
            },
        );
    }, [offset]);
}

/**
 * Slides alternate lines of a heading sideways: even lines one way, odd lines the other. Writes
 * the transform on each line directly, so nothing else in the subtree is restyled.
 */
function shiftLines(lines: HTMLElement[], amount: number) {
    lines.forEach((line) => {
        const direction = Number(line.dataset.line ?? 0) % 2 === 0 ? 1 : -1;
        line.style.transform = `translate3d(${(direction * amount).toFixed(1)}px, 0, 0)`;
    });
}

const collectLines = (element: HTMLElement) =>
    Array.from(element.querySelectorAll<HTMLElement>("[data-line]"));

/**
 * Drives the hero's sideways drift: the lines slide in opposite directions as the page scrolls
 * away from the top (0 at the top, full drift once the element has scrolled out of view).
 */
export function useScrollProgress<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element || prefersReducedMotion()) {
            return;
        }
        const lines = collectLines(element);
        if (lines.length === 0) {
            return;
        }

        let last = -1;
        const unsubscribe = subscribeToScroll(
            () => clamp(window.scrollY / (element.offsetHeight || 1), 0, 1),
            (progress) => {
                if (progress === last) {
                    return;
                }
                last = progress;
                // Even lines drift left, odd lines right, up to 7vw.
                shiftLines(lines, -progress * window.innerWidth * 0.07);
            },
        );

        return () => {
            unsubscribe();
            lines.forEach((line) => line.style.removeProperty("transform"));
        };
    }, []);

    return ref;
}

/**
 * Drives the sideways drift of a giant heading's lines: aligned when the heading is centred in
 * the viewport, spreading apart as it enters from below and leaves above (up to 5vw).
 */
export function useLineDrift<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element || prefersReducedMotion()) {
            return;
        }
        const lines = collectLines(element);
        if (lines.length === 0) {
            return;
        }

        const visibility = observeVisibility(element, "25% 0px");
        const unsubscribe = subscribeToScroll(
            () => {
                if (!visibility.isVisible()) {
                    return null;
                }
                const rect = element.getBoundingClientRect();
                const viewport = window.innerHeight || 1;
                return clamp((rect.top + rect.height / 2 - viewport / 2) / viewport, -1, 1);
            },
            (progress) => {
                if (progress === null) {
                    return;
                }
                shiftLines(lines, progress * window.innerWidth * 0.05);
            },
        );

        return () => {
            unsubscribe();
            visibility.stop();
            lines.forEach((line) => line.style.removeProperty("transform"));
        };
    }, []);

    return ref;
}
