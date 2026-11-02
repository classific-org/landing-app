import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/motion.hooks";
import { subscribeToScroll } from "@/components/motion/scroll-driver";
import { pointAt, samplePath, type Sample } from "@/lib/thread/geometry";
import {
    genericRoute,
    routes,
    type Light,
    type Rect,
    type RouteContext,
} from "@/components/home/thread-routes";

/** Share of the viewport height at which the drawn line's head sits while scrolling. */
const HEAD_AT = 0.64;
/**
 * How much scroll a unit of sideways (or upward) line costs, relative to a unit of downward
 * line. Below 1, loops and horizontal runs draw faster than the page moves, so the head stays
 * on screen; above 0, they still take some scrolling and are seen being drawn.
 */
const SIDEWAYS_COST = 0.3;
/** Most the line may advance in one frame while it catches up with the scroll (px). */
const MAX_GLIDE = 90;
const SVG_NS = "http://www.w3.org/2000/svg";

type Strand = {
    path: SVGPathElement;
    samples: Sample[];
    /** Scroll "time" at each sample, see SIDEWAYS_COST. */
    times: number[];
    total: number;
    /** The head positions (wrapper y) over which this strand draws from empty to full. */
    from: number;
    to: number;
    rings: { element: SVGCircleElement; at: number }[];
    lights: { el: HTMLElement; at: number }[];
    branches: Branch[];
    target: number;
    shown: number;
};

/**
 * A side branch off a strand (a git branch in the capabilities graph). It draws while the
 * strand's own line runs from the branch's fork to its merge, keeping level with it: the
 * branch's tip is always at the same height as the strand's.
 */
type Branch = {
    path: SVGPathElement;
    samples: Sample[];
    total: number;
    /** Lengths along the strand at the fork and the merge. */
    forkAt: number;
    mergeAt: number;
};

/**
 * The page thread, after the reference site's: one line made of a route per section. Each
 * section names its route with `data-thread-route` (see thread-routes.ts) and marks what the
 * route travels around with `data-thread-anchor`. A route starts exactly where the previous
 * one stopped and draws while its own section scrolls past, so the line is always busy in the
 * part of the page being read. Sections without a named route get a plain one through their
 * `[data-thread-node]` elements. Decorative only; render it as the first child of a `relative`
 * wrapper whose direct children are the page sections.
 */
export function PageThread() {
    const svgRef = useRef<SVGSVGElement>(null);
    const strandsRef = useRef<SVGGElement>(null);
    const headRef = useRef<SVGCircleElement>(null);
    const idleRef = useRef<SVGGElement>(null);
    const endRef = useRef<SVGGElement>(null);

    useEffect(() => {
        const svg = svgRef.current;
        const group = strandsRef.current;
        const head = headRef.current;
        const idle = idleRef.current;
        const end = endRef.current;
        const wrapper = svg?.parentElement;
        if (!svg || !group || !head || !idle || !end || !wrapper) {
            return;
        }

        const reduced = prefersReducedMotion();
        // A rebuild queued by fonts loading can land after unmount; it must not touch the DOM.
        let disposed = false;
        let strands: Strand[] = [];
        let lastSignature = "";
        // While the page is still, a ring pulses at the tip of the line; scrolling hides it.
        let idleTimer = 0;
        const markScrolling = () => {
            svg.classList.remove("is-idle");
            window.clearTimeout(idleTimer);
            idleTimer = window.setTimeout(() => svg.classList.add("is-idle"), 320);
        };

        /** Layout read: where the head of the line should be, in wrapper coordinates. */
        const readHead = () => {
            const top = wrapper.getBoundingClientRect().top + window.scrollY;
            return window.scrollY + window.innerHeight * HEAD_AT - top;
        };

        /** Style write: draws every strand to its shown length and places the head. */
        const render = () => {
            let front: { strand: Strand; drawn: number } | null = null;
            let reached: Strand | null = null;
            // An element can have several lights (a drawing with two ports); it is lit once the
            // line has reached any of them.
            const lit = new Map<HTMLElement, boolean>();
            strands.forEach((strand) => {
                const drawn = strand.shown;
                strand.path.style.strokeDashoffset = String(strand.total - drawn);
                strand.path.style.visibility = drawn > 0.5 ? "visible" : "hidden";
                strand.rings.forEach((ring) => {
                    ring.element.style.opacity = drawn >= ring.at - 2 ? "1" : "0";
                });
                strand.branches.forEach((branch) => {
                    const span = branch.mergeAt - branch.forkAt;
                    const progress = span > 0 ? (drawn - branch.forkAt) / span : 1;
                    const length = branchLength(branch, Math.max(0, Math.min(1, progress)));
                    branch.path.style.strokeDashoffset = String(branch.total - length);
                    branch.path.style.visibility = length > 0.5 ? "visible" : "hidden";
                });
                strand.lights.forEach((light) => {
                    lit.set(light.el, (lit.get(light.el) ?? false) || drawn >= light.at - 2);
                });
                if (drawn > 0.5 && drawn < strand.total - 0.5) {
                    front = { strand, drawn };
                }
                if (drawn > 0.5) {
                    reached = strand;
                }
            });
            lit.forEach((on, element) => {
                if (on !== (element.dataset.threaded === "true")) {
                    element.dataset.threaded = String(on);
                }
                // One-off stories (a drawing's animation) play once and then stay finished,
                // so scrolling back up never rewinds them.
                if (on && !element.dataset.played) {
                    element.dataset.played = "true";
                }
            });
            const last = strands[strands.length - 1];
            const finished = Boolean(last && last.shown >= last.total - 0.5);
            // The tip: inside the strand being drawn, or at the end of the last one reached
            // when the line has stopped exactly on a section edge.
            const current = front as { strand: Strand; drawn: number } | null;
            const lastReached = reached as Strand | null;
            const tip = current
                ? pointAt(current.strand.samples, current.drawn)
                : lastReached
                  ? lastReached.samples[lastReached.samples.length - 1]!
                  : null;
            if (tip && !finished) {
                const cx = tip.x.toFixed(1);
                const cy = tip.y.toFixed(1);
                head.setAttribute("cx", cx);
                head.setAttribute("cy", cy);
                idle.setAttribute("transform", `translate(${cx} ${cy})`);
                head.style.opacity = "1";
                idle.dataset.on = "true";
            } else {
                head.style.opacity = "0";
                idle.dataset.on = "false";
            }
            end.style.opacity = finished ? "1" : "0";
        };

        /**
         * How much of a branch is drawn when its strand is `progress` of the way from the fork
         * to the merge: the length at which the branch reaches the same height, since a branch
         * only ever runs downward.
         */
        const branchLength = (branch: Branch, progress: number) => {
            const first = branch.samples[0]!;
            const last = branch.samples[branch.samples.length - 1]!;
            const goal = first.y + (last.y - first.y) * progress;
            let low = 0;
            let high = branch.samples.length - 1;
            while (low < high) {
                const middle = (low + high) >> 1;
                if (branch.samples[middle]!.y < goal) {
                    low = middle + 1;
                } else {
                    high = middle;
                }
            }
            return progress >= 1 ? branch.total : branch.samples[low]!.length;
        };

        /**
         * Each strand's length follows the scroll position, but not in jumps: every frame it
         * moves a fraction of the way there, so a wheel notch becomes a glide.
         */
        let gliding = false;
        let glideFrame = 0;
        const glide = () => {
            let moving = false;
            strands.forEach((strand) => {
                const gap = strand.target - strand.shown;
                if (Math.abs(gap) < 0.6) {
                    strand.shown = strand.target;
                    return;
                }
                moving = true;
                strand.shown += Math.max(-MAX_GLIDE, Math.min(MAX_GLIDE, gap * 0.16));
            });
            render();
            if (moving) {
                glideFrame = requestAnimationFrame(glide);
            } else {
                gliding = false;
            }
        };

        /** The length of a strand drawn when its section has scrolled `progress` (0-1) of the way. */
        const lengthAt = (strand: Strand, progress: number) => {
            const goal = progress * strand.times[strand.times.length - 1]!;
            let low = 0;
            let high = strand.times.length - 1;
            while (low < high) {
                const middle = (low + high) >> 1;
                if (strand.times[middle]! < goal) {
                    low = middle + 1;
                } else {
                    high = middle;
                }
            }
            const after = strand.samples[low]!;
            const before = strand.samples[Math.max(0, low - 1)]!;
            const t1 = strand.times[low]!;
            const t0 = strand.times[Math.max(0, low - 1)]!;
            const ratio = t1 > t0 ? (goal - t0) / (t1 - t0) : 1;
            return before.length + (after.length - before.length) * Math.max(0, Math.min(1, ratio));
        };

        const apply = (headY: number) => {
            markScrolling();
            if (strands.length === 0) {
                return;
            }
            strands.forEach((strand) => {
                const progress = reduced
                    ? 1
                    : Math.max(0, Math.min(1, (headY - strand.from) / (strand.to - strand.from)));
                strand.target = progress >= 1 ? strand.total : lengthAt(strand, progress);
            });
            if (reduced) {
                strands.forEach((strand) => {
                    strand.shown = strand.target;
                });
                render();
                return;
            }
            if (!gliding) {
                gliding = true;
                glideFrame = requestAnimationFrame(glide);
            }
        };

        const update = () => apply(readHead());

        const build = () => {
            if (disposed) {
                return;
            }
            const box = wrapper.getBoundingClientRect();
            // Every threaded page marks where its thread starts, in its hero.
            const start = wrapper.querySelector<Element>("[data-thread-start]");
            const sections = Array.from(wrapper.querySelectorAll<HTMLElement>(":scope > section"));
            if (!start || sections.length < 2) {
                return;
            }

            const width = box.width;
            const height = box.height;
            const n = (value: number) => value.toFixed(1);

            /**
             * An element's box from layout offsets. Unlike getBoundingClientRect this ignores
             * transforms, so an anchor inside a reveal that is still sliding in is measured
             * where it will settle.
             */
            const layoutRect = (element: Element): Rect => {
                if (!(element instanceof HTMLElement)) {
                    const rect = element.getBoundingClientRect();
                    const left = rect.left - box.left;
                    const top = rect.top - box.top;
                    return {
                        left,
                        top,
                        right: left + rect.width,
                        bottom: top + rect.height,
                        cx: left + rect.width / 2,
                        cy: top + rect.height / 2,
                    };
                }
                let left = 0;
                let top = 0;
                let walker: HTMLElement | null = element;
                while (walker && walker !== wrapper) {
                    left += walker.offsetLeft;
                    top += walker.offsetTop;
                    walker = walker.offsetParent as HTMLElement | null;
                }
                const w = element.offsetWidth;
                const h = element.offsetHeight;
                return {
                    left,
                    top,
                    right: left + w,
                    bottom: top + h,
                    cx: left + w / 2,
                    cy: top + h / 2,
                    el: element,
                };
            };
            // Rendered at all (not display: none); route points are deliberately zero-sized.
            const visible = (element: HTMLElement) => element.getClientRects().length > 0;

            // The margins either side of the content are clear lanes for long vertical runs.
            const container = wrapper.querySelector<HTMLElement>(".container-page");
            const margin = container ? layoutRect(container).left : 20;
            const lane = Math.max(10, margin / 2);
            const wide = width >= 1024;

            // The furthest the head can reach, at the bottom of the page.
            const maxHead =
                document.documentElement.scrollHeight -
                window.innerHeight +
                window.innerHeight * HEAD_AT -
                (box.top + window.scrollY);

            const startRect = layoutRect(start);
            let entry = { x: startRect.cx, y: startRect.cy };
            const built: {
                d: string;
                rings: { x: number; y: number }[];
                ringRadius: number;
                lights: Light[];
                branches: string[];
                from: number;
                to: number;
            }[] = [];

            sections.forEach((section, index) => {
                const sectionRect = layoutRect(section);
                const last = index === sections.length - 1;
                const anchorCache = new Map<string, Rect[]>();
                const context: RouteContext = {
                    entry,
                    top: index === 0 ? entry.y : sectionRect.top,
                    bottom: sectionRect.bottom,
                    laneLeft: lane,
                    laneRight: width - lane,
                    wide,
                    last,
                    nodes: Array.from(section.querySelectorAll<HTMLElement>("[data-thread-node]"))
                        .filter(visible)
                        .map(layoutRect),
                    anchors: (name) => {
                        let found = anchorCache.get(name);
                        if (!found) {
                            found = Array.from(
                                section.querySelectorAll<HTMLElement>(
                                    `[data-thread-anchor="${name}"]`,
                                ),
                            )
                                .filter(visible)
                                .map(layoutRect);
                            anchorCache.set(name, found);
                        }
                        return found;
                    },
                    query: (selector) =>
                        Array.from(section.querySelectorAll<HTMLElement>(selector))
                            .filter(visible)
                            .map(layoutRect),
                };
                const builder = routes[section.dataset.threadRoute ?? ""] ?? genericRoute;
                const route = builder(context) ?? genericRoute(context)!;
                const pen = route.pen;
                let to = last ? Math.min(sectionRect.bottom, maxHead - 24) : sectionRect.bottom;
                if (last) {
                    // The final route ends inside its section: finish it once its end is in view.
                    to = Math.min(to, pen.y + window.innerHeight * 0.22);
                }
                // The first route carries on from the hero the moment the page first scrolls,
                // rather than waiting for the head of the line to come down to it.
                const firstHead = window.innerHeight * HEAD_AT - (box.top + window.scrollY);
                const from = Math.min(
                    index === 0 ? Math.max(context.top, firstHead) : context.top,
                    to - 120,
                );
                built.push({
                    d: pen.d,
                    rings: route.rings ?? [],
                    ringRadius: route.ringRadius ?? 9,
                    lights: route.lights ?? [],
                    branches: route.branches ?? [],
                    from,
                    to,
                });
                entry = { x: pen.x, y: pen.y };
            });

            // Resize and image-load observers fire often; rebuilding is only worth it when the
            // measured geometry actually changed.
            const signature = `${n(width)}x${n(height)}|${n(maxHead)}|${built.map((route) => route.d + route.branches.join("")).join("|")}`;
            if (signature === lastSignature) {
                return;
            }
            lastSignature = signature;

            svg.setAttribute("viewBox", `0 0 ${n(width)} ${n(height)}`);
            svg.setAttribute("width", n(width));
            svg.setAttribute("height", n(height));

            const previous = strands;
            group.replaceChildren();
            strands = built.map((route, index) => {
                const path = document.createElementNS(SVG_NS, "path");
                path.setAttribute("class", "page-thread-line");
                path.setAttribute("d", route.d);
                group.appendChild(path);
                // One native measurement per rebuild; the sampled polyline is scaled to match it.
                const total = path.getTotalLength();
                path.style.strokeDasharray = `${total} ${total}`;

                const polyline = samplePath(route.d);
                const polylineTotal = polyline[polyline.length - 1]?.length ?? 0;
                const scale = polylineTotal > 0 ? total / polylineTotal : 1;
                const samples = polyline.map((sample) => ({
                    ...sample,
                    length: sample.length * scale,
                }));
                const times: number[] = [];
                let time = 0;
                samples.forEach((sample, sampleIndex) => {
                    const before = samples[sampleIndex - 1];
                    if (before) {
                        const travel = sample.length - before.length;
                        const down = Math.max(0, Math.min(travel, sample.y - before.y));
                        time += down + SIDEWAYS_COST * (travel - down);
                    }
                    times.push(time);
                });

                // A ring lights on each of the route's ring points as the line reaches it.
                let cursor = 0;
                const rings = route.rings.map((point) => {
                    let best = cursor;
                    let bestDistance = Infinity;
                    for (let sampleIndex = cursor; sampleIndex < samples.length; sampleIndex += 1) {
                        const sample = samples[sampleIndex]!;
                        const distance = Math.hypot(sample.x - point.x, sample.y - point.y);
                        if (distance < bestDistance) {
                            bestDistance = distance;
                            best = sampleIndex;
                        }
                    }
                    cursor = best;
                    const element = document.createElementNS(SVG_NS, "circle");
                    element.setAttribute("cx", n(point.x));
                    element.setAttribute("cy", n(point.y));
                    element.setAttribute("r", String(route.ringRadius));
                    element.setAttribute(
                        "class",
                        route.ringRadius < 8 ? "page-thread-via" : "page-thread-node",
                    );
                    element.style.opacity = "0";
                    group.appendChild(element);
                    return { element, at: samples[best]!.length };
                });

                // Lights switch on where the line first reaches their point. A route can pass a
                // point more than once (the capabilities dial goes round more than a full turn),
                // so the earliest pass that comes as close as any wins, not the closest of all.
                const lights = route.lights.map((light) => {
                    const distances = samples.map((sample) =>
                        Math.hypot(sample.x - light.point.x, sample.y - light.point.y),
                    );
                    const closest = Math.min(...distances);
                    const first = distances.findIndex((distance) => distance <= closest + 3);
                    return { el: light.el, at: samples[Math.max(0, first)]!.length };
                });

                // Side branches, measured the same way, each tied to where the strand passes its
                // fork and its merge.
                const nearest = (x: number, y: number) => {
                    let best = 0;
                    let bestDistance = Infinity;
                    samples.forEach((sample, sampleIndex) => {
                        const distance = Math.hypot(sample.x - x, sample.y - y);
                        if (distance < bestDistance) {
                            bestDistance = distance;
                            best = sampleIndex;
                        }
                    });
                    return samples[best]!.length;
                };
                const branches = route.branches.map((d) => {
                    const branchPath = document.createElementNS(SVG_NS, "path");
                    branchPath.setAttribute("class", "page-thread-line");
                    branchPath.setAttribute("d", d);
                    group.insertBefore(branchPath, path);
                    const branchTotal = branchPath.getTotalLength();
                    branchPath.style.strokeDasharray = `${branchTotal} ${branchTotal}`;
                    const branchPoly = samplePath(d);
                    const branchPolyTotal = branchPoly[branchPoly.length - 1]?.length ?? 0;
                    const branchScale = branchPolyTotal > 0 ? branchTotal / branchPolyTotal : 1;
                    const branchSamples = branchPoly.map((sample) => ({
                        ...sample,
                        length: sample.length * branchScale,
                    }));
                    const head = branchSamples[0]!;
                    const tail = branchSamples[branchSamples.length - 1]!;
                    return {
                        path: branchPath,
                        samples: branchSamples,
                        total: branchTotal,
                        forkAt: nearest(head.x, head.y),
                        mergeAt: nearest(tail.x, tail.y),
                    };
                });

                const shown = Math.min(previous[index]?.shown ?? 0, total);
                return {
                    path,
                    samples,
                    times,
                    total,
                    from: route.from,
                    to: route.to,
                    rings,
                    lights,
                    branches,
                    target: shown,
                    shown,
                };
            });

            const finalStrand = strands[strands.length - 1]!;
            const endPoint = finalStrand.samples[finalStrand.samples.length - 1]!;
            end.setAttribute("transform", `translate(${n(endPoint.x)} ${n(endPoint.y)})`);
            render();
            update();
        };

        let buildFrame = 0;
        const rebuild = () => {
            cancelAnimationFrame(buildFrame);
            buildFrame = requestAnimationFrame(build);
        };

        // Content that waits for the line is only dimmed while the line can actually reach it.
        if (!reduced) {
            wrapper.classList.add("thread-live");
        }
        build();
        const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(rebuild);
        observer?.observe(wrapper);
        window.addEventListener("resize", rebuild, { passive: true });
        // The hero thread measures its headline and moves the hand-off point once fonts load.
        window.addEventListener("thread:layout", rebuild);
        const unsubscribe = subscribeToScroll(readHead, apply);
        void document.fonts?.ready.then(rebuild);

        return () => {
            disposed = true;
            wrapper.classList.remove("thread-live");
            observer?.disconnect();
            window.removeEventListener("resize", rebuild);
            window.removeEventListener("thread:layout", rebuild);
            unsubscribe();
            cancelAnimationFrame(buildFrame);
            cancelAnimationFrame(glideFrame);
            window.clearTimeout(idleTimer);
        };
    }, []);

    return (
        <svg
            ref={svgRef}
            className="page-thread pointer-events-none absolute left-0 top-0 z-10"
            aria-hidden="true"
            focusable="false"
        >
            <g ref={strandsRef} />
            <g ref={idleRef} className="page-thread-idle" data-on="false">
                <circle className="page-thread-pulse" r="11" />
                <circle className="page-thread-ring" r="11" />
            </g>
            <circle ref={headRef} className="page-thread-head" r="5" style={{ opacity: 0 }} />
            <g ref={endRef} style={{ opacity: 0 }} className="page-thread-end">
                <circle r="13" className="page-thread-ring" />
                <circle r="5" className="page-thread-head" />
            </g>
        </svg>
    );
}
