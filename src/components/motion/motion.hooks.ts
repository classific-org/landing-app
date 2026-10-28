import { useEffect, useRef } from "react";

export function prefersReducedMotion(): boolean {
    return (
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

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
 * Moves a child a few percent against the scroll direction while its frame is on screen.
 * Writes one CSS variable per frame; the stylesheet turns it into a transform.
 */
export function useParallax<T extends HTMLElement>(strength = 8) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element || prefersReducedMotion()) {
            return;
        }

        let frame = 0;
        let visible = false;

        const update = () => {
            frame = 0;
            const rect = element.getBoundingClientRect();
            const viewport = window.innerHeight || 1;
            const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
            const clamped = Math.max(-1, Math.min(1, progress));
            element.style.setProperty("--parallax", `${(-clamped * strength).toFixed(2)}%`);
        };
        const schedule = () => {
            if (visible && frame === 0) {
                frame = requestAnimationFrame(update);
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                visible = entry?.isIntersecting ?? false;
                schedule();
            },
            { rootMargin: "10% 0px" },
        );
        observer.observe(element);
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule, { passive: true });
        update();

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            cancelAnimationFrame(frame);
            element.style.removeProperty("--parallax");
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
        const check = () => {
            const limit = typeof offset === "function" ? offset() : offset;
            const next = window.scrollY > limit;
            if (next !== last) {
                last = next;
                callback.current(next);
            }
        };
        check();
        window.addEventListener("scroll", check, { passive: true });
        return () => window.removeEventListener("scroll", check);
    }, [offset]);
}

/**
 * Writes `--hero-p` (0 at the top of the page, 1 once the element has scrolled out of view) on
 * the element. CSS turns it into the sideways drift of the hero lines.
 */
export function useScrollProgress<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element || prefersReducedMotion()) {
            return;
        }

        let frame = 0;
        const update = () => {
            frame = 0;
            const height = element.offsetHeight || 1;
            const progress = Math.max(0, Math.min(1, window.scrollY / height));
            element.style.setProperty("--hero-p", progress.toFixed(3));
        };
        const schedule = () => {
            if (frame === 0) {
                frame = requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule, { passive: true });
        return () => {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            cancelAnimationFrame(frame);
            element.style.removeProperty("--hero-p");
        };
    }, []);

    return ref;
}

/**
 * Drives the sideways drift of a giant heading's lines. Writes `--drift` on the element: 0 when
 * the heading is centred in the viewport, towards +1 as it enters from below and -1 as it leaves
 * above. CSS moves alternate lines in opposite directions, like the home hero's lines do.
 */
export function useLineDrift<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element || prefersReducedMotion()) {
            return;
        }

        let frame = 0;
        let visible = false;

        const update = () => {
            frame = 0;
            const rect = element.getBoundingClientRect();
            const viewport = window.innerHeight || 1;
            const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
            element.style.setProperty("--drift", Math.max(-1, Math.min(1, progress)).toFixed(3));
        };
        const schedule = () => {
            if (visible && frame === 0) {
                frame = requestAnimationFrame(update);
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                visible = entry?.isIntersecting ?? false;
                schedule();
            },
            { rootMargin: "25% 0px" },
        );
        observer.observe(element);
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule, { passive: true });
        update();

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            cancelAnimationFrame(frame);
            element.style.removeProperty("--drift");
        };
    }, []);

    return ref;
}
