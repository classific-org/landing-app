import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/motion.hooks";
import { subscribeToScroll } from "@/components/motion/scroll-driver";
import { pointAt, samplePath, type Sample } from "@/lib/thread/geometry";

/** The swoop between two folds happens in this window around the boundary (px). */
const SWOOP_ABOVE = 40;
const SWOOP_BELOW = 72;
/** Share of the viewport height at which the drawn line's head sits while scrolling. */
const HEAD_AT = 0.68;
/** Most the line may advance in one frame while it catches up with the scroll (px). */
const MAX_GLIDE = 110;
const SVG_NS = "http://www.w3.org/2000/svg";

type Stop = { x: number; y: number; section: number };

type Ring = { element: SVGCircleElement; at: number };

/**
 * The page thread. One blue line continues from the hero's end node and passes through every
 * `[data-thread-node]` placed in the folds below it, in document order. Between folds it swoops
 * across the boundary with a curl; if a `[data-thread-tangle]` element is present the line ends
 * in a scribble inside it. The path is measured from the real layout (so it follows resizes and
 * late-loading content) and draws itself as the reader scrolls. Decorative only; render it as
 * the first child of a `relative` wrapper whose direct children are the page sections.
 */
export function PageThread() {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const headRef = useRef<SVGCircleElement>(null);
    const haloRef = useRef<SVGCircleElement>(null);
    const endRef = useRef<SVGGElement>(null);
    const ringsRef = useRef<SVGGElement>(null);

    useEffect(() => {
        const svg = svgRef.current;
        const path = pathRef.current;
        const head = headRef.current;
        const halo = haloRef.current;
        const end = endRef.current;
        const rings = ringsRef.current;
        const wrapper = svg?.parentElement;
        if (!svg || !path || !head || !halo || !end || !rings || !wrapper) {
            return;
        }

        const reduced = prefersReducedMotion();
        let samples: Sample[] = [];
        let lastSignature = "";
        let ringList: Ring[] = [];
        /**
         * The tangle packs a lot of line into very little height, so mapping the head's y to a
         * length would reveal it in one jump. Instead its length is drawn in step with the scroll
         * distance travelled once the head reaches it.
         */
        let tangleInfo: { startLength: number; top: number; span: number } | null = null;
        let total = 0;

        /** Layout read: where the head of the line should be, in wrapper coordinates. */
        const readHead = () => {
            const top = wrapper.getBoundingClientRect().top + window.scrollY;
            return window.scrollY + window.innerHeight * HEAD_AT - top;
        };

        /** Style write: draws `drawn` units of the line and lights the rings it has reached. */
        const render = (drawn: number) => {
            path.style.strokeDashoffset = String(total - drawn);
            if (drawn <= 0 || drawn >= total) {
                head.style.opacity = "0";
                halo.style.opacity = "0";
            } else {
                const point = pointAt(samples, drawn);
                const cx = point.x.toFixed(1);
                const cy = point.y.toFixed(1);
                head.setAttribute("cx", cx);
                head.setAttribute("cy", cy);
                halo.setAttribute("cx", cx);
                halo.setAttribute("cy", cy);
                head.style.opacity = "1";
                halo.style.opacity = "1";
            }
            ringList.forEach((ring) => {
                ring.element.style.opacity = drawn >= ring.at - 2 ? "1" : "0";
            });
            end.style.opacity = drawn >= total - 2 ? "1" : "0";
        };

        /**
         * The length the scroll position asks for. The line does not jump to it: each frame it
         * moves a fraction of the way there, so a wheel notch becomes a glide and the tip is
         * always seen travelling.
         */
        let target = 0;
        let shown = 0;
        let gliding = false;
        let glideFrame = 0;
        const glide = () => {
            const gap = target - shown;
            if (Math.abs(gap) < 0.6) {
                shown = target;
                gliding = false;
                render(shown);
                return;
            }
            shown += Math.max(-MAX_GLIDE, Math.min(MAX_GLIDE, gap * 0.14));
            render(shown);
            glideFrame = requestAnimationFrame(glide);
        };

        const apply = (headY: number) => {
            if (total === 0) {
                return;
            }
            if (reduced) {
                shown = total;
                render(total);
                return;
            }
            const reached = samples.find((sample) => sample.y > headY);
            let drawn = reached ? reached.length : total;
            if (tangleInfo) {
                if (headY < tangleInfo.top) {
                    drawn = Math.min(drawn, tangleInfo.startLength);
                } else {
                    const progress = Math.min(1, (headY - tangleInfo.top) / tangleInfo.span);
                    drawn = tangleInfo.startLength + progress * (total - tangleInfo.startLength);
                }
            }
            target = drawn;
            if (!gliding) {
                gliding = true;
                glideFrame = requestAnimationFrame(glide);
            }
        };

        const update = () => apply(readHead());

        const build = () => {
            const box = wrapper.getBoundingClientRect();
            // The home hero draws its own end node; inner pages mark a start point in their hero.
            const heroNode = wrapper.querySelector<Element>(
                ".hero-thread-node, [data-thread-start]",
            );
            const sections = Array.from(wrapper.querySelectorAll<HTMLElement>(":scope > section"));
            const nodeElements = Array.from(
                wrapper.querySelectorAll<HTMLElement>("[data-thread-node]"),
            );
            const tangle = wrapper.querySelector<HTMLElement>("[data-thread-tangle]");
            if (!heroNode || sections.length < 2 || nodeElements.length === 0) {
                return;
            }

            const width = box.width;
            const height = box.height;
            const n = (value: number) => value.toFixed(1);
            const rel = (rect: DOMRect) => ({
                x: rect.left + rect.width / 2 - box.left,
                y: rect.top + rect.height / 2 - box.top,
            });
            const sectionOf = (element: Element) =>
                sections.findIndex((section) => section.contains(element));
            const sectionTop = (index: number) =>
                sections[index]!.getBoundingClientRect().top - box.top;

            // The margins on either side of the content are clear lanes for long vertical runs.
            const container = wrapper.querySelector<HTMLElement>(".container-page");
            const lane = Math.max(
                10,
                container ? (container.getBoundingClientRect().left - box.left) / 2 : 10,
            );
            const laneLeft = lane;
            const laneRight = width - lane;

            /**
             * Centre of an element from layout offsets. Unlike getBoundingClientRect this ignores
             * transforms, so a node inside a reveal that is still translated is measured where
             * it will end up.
             */
            const layoutCenter = (element: HTMLElement) => {
                let x = element.offsetWidth / 2;
                let y = element.offsetHeight / 2;
                let walker: HTMLElement | null = element;
                while (walker && walker !== wrapper) {
                    x += walker.offsetLeft;
                    y += walker.offsetTop;
                    walker = walker.offsetParent as HTMLElement | null;
                }
                return { x, y };
            };

            const heroPoint =
                heroNode instanceof HTMLElement
                    ? layoutCenter(heroNode)
                    : rel(heroNode.getBoundingClientRect());
            const stops: Stop[] = [{ ...heroPoint, section: 0 }];
            nodeElements.forEach((element) => {
                const section = sectionOf(element);
                if (section >= 0) {
                    stops.push({ ...layoutCenter(element), section });
                }
            });

            let d = `M${n(stops[0]!.x)} ${n(stops[0]!.y)}`;
            let current = { x: stops[0]!.x, y: stops[0]!.y, section: 0 };
            let waveSign = 1;

            /**
             * A small loop in the margin, travelling downward from (x, centre - 50) to
             * (x, centre + 50). It is the boundary curl turned on its side and scaled to fit
             * the gutter, so long runs read as a thread being drawn rather than a ruled line.
             */
            const curlDown = (x: number, centre: number, scale: number) => {
                const p = (along: number, across: number) =>
                    `${n(x + across * scale)} ${n(centre + along)}`;
                return (
                    ` C${n(x)} ${n(centre - 42)} ${p(-40, -7)} ${p(-35, -7)}` +
                    ` C${p(-10, -17)} ${p(5, -15)} ${p(7, -2)}` +
                    ` C${p(8, 11)} ${p(-12, 13)} ${p(-11, 1)}` +
                    ` C${p(-10, -11)} ${p(15, -8)} ${p(35, 7)}` +
                    ` C${p(42, 5)} ${n(x)} ${n(centre + 42)} ${n(x)} ${n(centre + 50)}`
                );
            };

            /**
             * A run straight down one lane from y0 to y1. Long ones alternate flowing S-waves
             * with a curl, when the gutter is wide enough; returns where it stopped.
             */
            const wander = (x: number, y0: number, y1: number) => {
                let y = y0;
                const curlScale = Math.min(1, (lane - 4) / 21);
                if (lane >= 16 && y1 - y0 > 460) {
                    const step = 300;
                    while (y1 - y > step + 180) {
                        const amplitude = Math.min(lane - 6, 16) * waveSign;
                        waveSign = -waveSign;
                        d +=
                            ` C${n(x + amplitude)} ${n(y + step * 0.33)}` +
                            ` ${n(x - amplitude)} ${n(y + step * 0.66)} ${n(x)} ${n(y + step)}`;
                        y += step;
                        d += curlDown(x, y + 50, curlScale);
                        y += 100;
                    }
                }
                return y;
            };

            const vertical = (to: { x: number; y: number }) => {
                if (to.y - current.y < 4) {
                    d += ` L${n(to.x)} ${n(to.y)}`;
                    return;
                }
                const sway = 6 * waveSign;
                waveSign = -waveSign;
                if (Math.abs(to.x - current.x) > 8 && to.y - current.y > 140) {
                    // Hold the lane, then ease over to the node just above it.
                    const hold = to.y - 70;
                    const y = wander(current.x, current.y, hold);
                    const span = hold - y;
                    d +=
                        ` C${n(current.x + sway)} ${n(y + span / 3)}` +
                        ` ${n(current.x - sway)} ${n(y + (2 * span) / 3)}` +
                        ` ${n(current.x)} ${n(hold)}` +
                        ` C${n(current.x)} ${n(hold + 35)} ${n(to.x)} ${n(hold + 35)} ${n(to.x)} ${n(to.y)}`;
                    return;
                }
                const y = wander(current.x, current.y, to.y);
                const run = to.y - y;
                d +=
                    ` C${n(current.x + sway)} ${n(y + run / 3)}` +
                    ` ${n(to.x - sway)} ${n(y + (2 * run) / 3)} ${n(to.x)} ${n(to.y)}`;
            };

            /** Swoop across a fold boundary, curling in the middle when there is room. */
            const cross = (to: Stop) => {
                const boundary = sectionTop(to.section) + 16;
                const from = boundary - SWOOP_ABOVE;
                const landing = boundary + SWOOP_BELOW;

                // Leave the node sideways into the nearest margin lane, so the long run down
                // to the boundary never crosses the text beneath it.
                const toLeft = Math.abs(current.x - laneLeft) < Math.abs(current.x - laneRight);
                const exitLane = toLeft ? laneLeft : laneRight;
                if (Math.abs(current.x - exitLane) > 24 && current.y + 70 < from) {
                    // Leave level with the node (above its label), then drop into the lane.
                    const reach = (exitLane - current.x) * 0.55;
                    d +=
                        ` C${n(current.x + reach)} ${n(current.y)} ${n(exitLane)} ${n(current.y)}` +
                        ` ${n(exitLane)} ${n(current.y + 70)}`;
                    current = { ...current, x: exitLane, y: current.y + 70 };
                }
                if (from > current.y + 8) {
                    vertical({ x: current.x, y: from });
                    current = { ...current, y: from };
                }
                const startY = Math.max(current.y, from);
                const landX = Math.abs(to.x - laneLeft) < 80 ? laneLeft : to.x;
                const dx = landX - current.x;
                if (Math.abs(dx) >= 240) {
                    const dir = dx > 0 ? 1 : -1;
                    const mid = (current.x + to.x) / 2;
                    const at = (offset: number) => n(mid + offset * dir);
                    const reach = Math.min(150, Math.abs(dx) * 0.4);
                    d +=
                        ` C${n(current.x)} ${n(startY + 34)} ${at(-reach)} ${n(boundary - 34)} ${at(-70)} ${n(boundary - 14)}` +
                        ` C${at(-20)} ${n(boundary - 34)} ${at(10)} ${n(boundary - 30)} ${at(14)} ${n(boundary - 4)}` +
                        ` C${at(16)} ${n(boundary + 22)} ${at(-24)} ${n(boundary + 26)} ${at(-22)} ${n(boundary + 2)}` +
                        ` C${at(-20)} ${n(boundary - 22)} ${at(30)} ${n(boundary - 16)} ${at(70)} ${n(boundary + 14)}` +
                        ` C${at(reach)} ${n(boundary + 34)} ${n(landX)} ${n(landing - 34)} ${n(landX)} ${n(landing)}`;
                } else {
                    const run = landing - startY;
                    d +=
                        ` C${n(current.x)} ${n(startY + run * 0.6)} ${n(landX)} ${n(landing - run * 0.6)}` +
                        ` ${n(landX)} ${n(landing)}`;
                }
                current = { x: landX, y: landing, section: to.section };
            };

            const connect = (to: Stop) => {
                if (to.section !== current.section) {
                    cross(to);
                }
                const dy = to.y - current.y;
                const dx = to.x - current.x;
                if (Math.abs(dy) < 60 && Math.abs(dx) > 40) {
                    // Nodes on one row: a gentle wave from node to node.
                    const wave = 22 * waveSign;
                    waveSign = -waveSign;
                    d +=
                        ` C${n(current.x + dx / 3)} ${n(current.y + wave)}` +
                        ` ${n(to.x - dx / 3)} ${n(to.y - wave)} ${n(to.x)} ${n(to.y)}`;
                } else if (Math.abs(dx) < 90) {
                    vertical(to);
                } else {
                    d +=
                        ` C${n(current.x)} ${n(current.y + dy * 0.5)}` +
                        ` ${n(to.x)} ${n(to.y - dy * 0.5)} ${n(to.x)} ${n(to.y)}`;
                }
                current = { ...to };
            };

            stops.slice(1).forEach(connect);

            let endPoint = { x: current.x, y: current.y };
            let tangleEntry: { x: number; y: number } | null = null;
            let tangleHeight = 0;
            tangleInfo = null;
            if (tangle && tangle.offsetWidth > 40) {
                const center = layoutCenter(tangle);
                const rx = tangle.offsetWidth * 0.46;
                const ry = tangle.offsetHeight * 0.44;
                const section = sectionOf(tangle);
                const curve = (t: number) => ({
                    x: center.x + (rx * (Math.sin(t) + 0.45 * Math.sin(2.7 * t))) / 1.45,
                    y: center.y + (ry * (Math.cos(1.3 * t) + 0.45 * Math.cos(3.1 * t))) / 1.45,
                });
                const t0 = 2.42;
                const first = curve(t0);
                connect({ ...first, section });
                tangleEntry = first;
                tangleHeight = tangle.offsetHeight;
                for (let t = t0 + 0.07; t <= t0 + Math.PI * 6; t += 0.07) {
                    const point = curve(t);
                    d += ` L${n(point.x)} ${n(point.y)}`;
                    endPoint = point;
                }
            } else {
                // Narrow screens: no room for a tangle, so end in the closing fold's margin.
                const last = sections.length - 1;
                const finalStop: Stop = {
                    x: laneLeft,
                    y: Math.min(height - 40, sectionTop(last) + SWOOP_BELOW + 140),
                    section: last,
                };
                connect(finalStop);
                endPoint = { x: finalStop.x, y: finalStop.y };
            }

            // Resize and image-load observers fire often; rebuilding is only worth it when the
            // measured geometry actually changed.
            const signature = `${n(width)}x${n(height)}|${d}`;
            if (signature === lastSignature) {
                return;
            }
            lastSignature = signature;

            svg.setAttribute("viewBox", `0 0 ${n(width)} ${n(height)}`);
            svg.setAttribute("width", n(width));
            svg.setAttribute("height", n(height));
            path.setAttribute("d", d);
            // One native measurement per rebuild; our polyline is scaled to match it.
            total = path.getTotalLength();
            shown = Math.min(shown, total);
            path.style.strokeDasharray = String(total);
            end.setAttribute("transform", `translate(${n(endPoint.x)} ${n(endPoint.y)})`);

            const polyline = samplePath(d);
            const polylineTotal = polyline[polyline.length - 1]?.length ?? 0;
            const scale = polylineTotal > 0 ? total / polylineTotal : 1;
            samples = polyline.map((sample) => ({ ...sample, length: sample.length * scale }));

            // A ring appears on each node as the line reaches it.
            rings.replaceChildren();
            ringList = [];
            if (heroNode.hasAttribute("data-thread-start")) {
                const first = document.createElementNS(SVG_NS, "circle");
                first.setAttribute("cx", n(stops[0]!.x));
                first.setAttribute("cy", n(stops[0]!.y));
                first.setAttribute("r", "9");
                first.setAttribute("class", "page-thread-node");
                rings.appendChild(first);
                ringList.push({ element: first, at: 0 });
            }
            let cursor = 0;
            stops.slice(1).forEach((stop) => {
                let best = cursor;
                let bestDistance = Infinity;
                for (let index = cursor; index < samples.length; index += 1) {
                    const point = samples[index]!;
                    const distance = Math.hypot(point.x - stop.x, point.y - stop.y);
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        best = index;
                    }
                    if (distance > bestDistance + 120) {
                        break;
                    }
                }
                cursor = best;
                const ring = document.createElementNS(SVG_NS, "circle");
                ring.setAttribute("cx", n(stop.x));
                ring.setAttribute("cy", n(stop.y));
                ring.setAttribute("r", "9");
                ring.setAttribute("class", "page-thread-node");
                rings.appendChild(ring);
                ringList.push({ element: ring, at: samples[best]!.length });
            });
            if (tangleEntry) {
                let best = cursor;
                let bestDistance = Infinity;
                for (let index = cursor; index < samples.length; index += 1) {
                    const point = samples[index]!;
                    const distance = Math.hypot(point.x - tangleEntry.x, point.y - tangleEntry.y);
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        best = index;
                    }
                    if (distance > bestDistance + 120) {
                        break;
                    }
                }
                tangleInfo = {
                    startLength: samples[best]!.length,
                    top: tangleEntry.y,
                    span: Math.max(tangleHeight * 1.2, 380),
                };
            }
            update();
        };

        let buildFrame = 0;
        const rebuild = () => {
            cancelAnimationFrame(buildFrame);
            buildFrame = requestAnimationFrame(build);
        };

        build();
        const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(rebuild);
        observer?.observe(wrapper);
        window.addEventListener("resize", rebuild, { passive: true });
        const unsubscribe = subscribeToScroll(readHead, apply);
        void document.fonts?.ready.then(rebuild);

        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", rebuild);
            unsubscribe();
            cancelAnimationFrame(buildFrame);
            cancelAnimationFrame(glideFrame);
        };
    }, []);

    return (
        <svg
            ref={svgRef}
            className="page-thread pointer-events-none absolute left-0 top-0 z-10"
            aria-hidden="true"
            focusable="false"
        >
            <path ref={pathRef} className="page-thread-line" />
            <g ref={ringsRef} />
            <circle ref={haloRef} className="page-thread-halo" r="15" style={{ opacity: 0 }} />
            <circle ref={headRef} className="page-thread-head" r="5" style={{ opacity: 0 }} />
            <g ref={endRef} style={{ opacity: 0 }} className="page-thread-end">
                <circle r="13" className="page-thread-ring" />
                <circle r="5" className="page-thread-head" />
            </g>
        </svg>
    );
}
