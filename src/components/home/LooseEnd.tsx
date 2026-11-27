import { useEffect, useRef, type KeyboardEvent, type RefObject } from "react";
import { COIL_START, coilPoints, ropePath, type Point } from "@/lib/thread/coil";

export { COIL_START, type Point };

/*
 * The loose end of the page thread. The page thread runs on into this coil and draws it as
 * you scroll (thread-routes appends the same coil to its path and hands the drawing over to
 * this element at the coil's first point), so it is one continuous line. Once fully drawn the
 * coil comes alive: a verlet rope whose points are held to the coil by springs, swaying a
 * little, its free end leaning towards a nearby cursor. Grab the end (mouse, pen or finger)
 * and pull: the springs let go as the pull grows, so the loops unwind and the line goes
 * taut. Pull far enough and `onPull` gets the rope's points on screen, for the enquiry form
 * to fly into its frame (see EnquiryDialog). Let go short of that and it winds back up.
 * Scrolling back up while it is coiled draws it back into the page thread.
 */
/** How far the end has to be pulled from where it hangs (as a share of the box height). */
const PULL = 0.3;
/** How long a pull made for you (Start a Project, the keyboard) takes, in ms. */
const AUTO_MS = 1100;
/** Physics steps per frame, for a steady line. */
const SUBSTEPS = 2;

export function LooseEnd({
    onPull,
    pullRef,
    away = false,
}: {
    /** The thread has gone to frame the enquiry form: hide the coil until it comes back. */
    away?: boolean;
    /** Called once the end is pulled far enough, with the rope's points in viewport px. */
    onPull: (points: Point[]) => void;
    /** Lets the page pull the end itself (Start a Project, the keyboard). */
    pullRef?: RefObject<(() => void) | null>;
}) {
    const boxRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const gripRef = useRef<HTMLButtonElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const headRef = useRef<SVGCircleElement>(null);

    useEffect(() => {
        const box = boxRef.current;
        const path = pathRef.current;
        const grip = gripRef.current;
        const svg = svgRef.current;
        const head = headRef.current;
        if (!box || !path || !grip || !svg || !head) {
            return;
        }
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const unit = coilPoints();
        let width = 0;
        let height = 0;
        let rest: Point[] = [];
        let lengths: number[] = [];
        let points: Point[] = [];
        let previous: Point[] = [];
        let restLength = 1;

        const toRest = () => {
            points = rest.map((point) => ({ ...point }));
            previous = rest.map((point) => ({ ...point }));
        };
        const layout = () => {
            const rect = box.getBoundingClientRect();
            if (rect.width === 0) {
                return;
            }
            width = rect.width;
            height = rect.height;
            svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
            rest = unit.map((point) => ({ x: point.x * width, y: point.y * height }));
            lengths = rest
                .slice(1)
                .map((point, index) =>
                    Math.hypot(point.x - rest[index]!.x, point.y - rest[index]!.y),
                );
            toRest();
            path.setAttribute("d", ropePath(rest));
            restLength = path.getTotalLength() || 1;
            // The page thread scrubs this element over about half the coil's length, so the
            // coil is drawn and its grip up well before the page runs out of scroll.
            box.dataset.threadSpan = String(Math.round(restLength * 0.55));
        };
        layout();

        let pointer: Point | null = null;
        let downAt: Point | null = null;
        let dragging = false;
        let auto: { from: Point; to: Point; start: number } | null = null;
        let done = false;
        let live = false;
        let frame = 0;
        let visible = false;
        let time = 0;

        const drawRope = () => {
            path.setAttribute("d", ropePath(points));
            const end = points[points.length - 1];
            if (end) {
                grip.style.transform = `translate(${end.x}px, ${end.y}px)`;
            }
        };

        const release = () => {
            done = true;
            dragging = false;
            auto = null;
            box.dataset.dragging = "false";
            const rect = svg.getBoundingClientRect();
            const scale = rect.width / width;
            onPull(
                points.map((point) => ({
                    x: rect.left + point.x * scale,
                    y: rect.top + point.y * scale,
                })),
            );
            // Wind back up behind the form, ready for next time.
            window.setTimeout(() => {
                done = false;
            }, 900);
        };

        const integrate = (pull: number) => {
            const end = points.length - 1;
            // The springs that hold the coil let go as the pull grows: the loops unwind.
            const hold = (0.07 * (1 - pull) ** 3 + 0.0015) / SUBSTEPS;
            const calm = dragging || auto ? 0 : 1;
            for (let index = 1; index < points.length; index += 1) {
                const point = points[index]!;
                const last = previous[index]!;
                const vx = (point.x - last.x) * 0.93;
                const vy = (point.y - last.y) * 0.93;
                previous[index] = { ...point };
                const sway = calm * Math.sin(time * 1.1 + index * 0.06) * 1.4 * (index / end);
                point.x += vx + (rest[index]!.x + sway - point.x) * hold;
                point.y += vy + (rest[index]!.y - point.y) * hold;
            }
            const tip = points[end]!;
            if (auto) {
                const t = Math.min(1, (performance.now() - auto.start) / AUTO_MS);
                const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
                tip.x = auto.from.x + (auto.to.x - auto.from.x) * eased;
                tip.y = auto.from.y + (auto.to.y - auto.from.y) * eased;
            } else if (dragging && pointer) {
                // Follow the pointer closely but not rigidly, so a fast flick stays smooth.
                tip.x += (pointer.x - tip.x) * 0.5;
                tip.y += (pointer.y - tip.y) * 0.5;
            } else if (pointer) {
                // The free end leans towards a cursor close by.
                const dx = pointer.x - tip.x;
                const dy = pointer.y - tip.y;
                const distance = Math.hypot(dx, dy);
                if (distance < 150) {
                    tip.x += dx * 0.02 * (1 - distance / 150);
                    tip.y += dy * 0.02 * (1 - distance / 150);
                }
            }
            const pinned = dragging || auto !== null;
            for (let pass = 0; pass < 10; pass += 1) {
                for (let index = 0; index < end; index += 1) {
                    const a = points[index]!;
                    const b = points[index + 1]!;
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const distance = Math.hypot(dx, dy) || 0.0001;
                    const diff = (distance - lengths[index]!) / distance;
                    const fixA = index === 0;
                    const fixB = pinned && index + 1 === end;
                    if (fixA && fixB) {
                        continue;
                    }
                    const share = fixA || fixB ? 1 : 0.5;
                    if (!fixA) {
                        a.x += dx * diff * share;
                        a.y += dy * diff * share;
                    }
                    if (!fixB) {
                        b.x -= dx * diff * share;
                        b.y -= dy * diff * share;
                    }
                }
            }
            points[0] = { ...rest[0]! };
        };

        const step = () => {
            time += 1 / 60;
            const end = points.length - 1;
            const restEnd = rest[end]!;
            const pull = Math.min(
                1,
                Math.hypot(points[end]!.x - restEnd.x, points[end]!.y - restEnd.y) /
                    (height * PULL),
            );
            box.dataset.pull = pull.toFixed(2);
            for (let index = 0; index < SUBSTEPS; index += 1) {
                integrate(pull);
            }
            drawRope();
            // A drag lets go once pulled far enough; a pull made for you runs its full course,
            // so the coil has unwound before the line flies off.
            if (!done && dragging && pull >= 1) {
                release();
            }
            if (!done && auto && performance.now() - auto.start > AUTO_MS + 60) {
                release();
            }
        };

        const loop = () => {
            frame = 0;
            if (!visible || !live || reduced) {
                return;
            }
            step();
            frame = requestAnimationFrame(loop);
        };
        const start = () => {
            if (!frame && visible && live && !reduced) {
                frame = requestAnimationFrame(loop);
            }
        };

        // While the page thread is still drawing the coil, show just as much of it as the
        // thread has reached; once it has reached the end, the rope is live.
        const sync = () => {
            const threaded = box.closest(".thread-live") !== null;
            const raw = box.dataset.threadProgress;
            const progress = !threaded || raw === undefined || reduced ? 1 : Number(raw);
            const nowLive = progress >= 0.985;
            // Always written: the markup starts out live (finished), whatever the rope thinks.
            box.dataset.live = String(nowLive);
            if (nowLive !== live) {
                live = nowLive;
                if (!live) {
                    dragging = false;
                    auto = null;
                    toRest();
                    drawRope();
                }
            }
            if (live) {
                path.style.strokeDasharray = "";
                path.style.strokeDashoffset = "";
                head.style.opacity = "0";
                start();
            } else {
                path.setAttribute("d", ropePath(rest));
                path.style.strokeDasharray = `${restLength} ${restLength}`;
                path.style.strokeDashoffset = String(restLength * (1 - progress));
                // The thread's head carries on along the coil as it draws.
                const tip = path.getPointAtLength(restLength * progress);
                head.setAttribute("cx", tip.x.toFixed(1));
                head.setAttribute("cy", tip.y.toFixed(1));
                head.style.opacity = progress > 0.002 ? "1" : "0";
            }
        };

        const local = (event: PointerEvent) => {
            const rect = svg.getBoundingClientRect();
            const scale = width / rect.width;
            return {
                x: (event.clientX - rect.left) * scale,
                y: (event.clientY - rect.top) * scale,
            };
        };

        // Pulled for you (Start a Project, a tap, the keyboard): the end is drawn out and away.
        const pullNow = () => {
            if (done) {
                return;
            }
            if (reduced || !live || width === 0) {
                const rect = svg.getBoundingClientRect();
                const scale = rect.width / (width || 1);
                onPull(
                    points.map((point) => ({
                        x: rect.left + point.x * scale,
                        y: rect.top + point.y * scale,
                    })),
                );
                return;
            }
            const tip = points[points.length - 1]!;
            auto = {
                from: { ...tip },
                to: { x: tip.x - width * 0.3, y: tip.y + height * PULL * 1.1 },
                start: performance.now(),
            };
            start();
        };
        if (pullRef) {
            pullRef.current = pullNow;
        }

        const onMove = (event: PointerEvent) => {
            pointer = local(event);
        };
        const onLeave = () => {
            if (!dragging) {
                pointer = null;
            }
        };
        const onDown = (event: PointerEvent) => {
            if (done || !live) {
                return;
            }
            try {
                grip.setPointerCapture(event.pointerId);
            } catch {
                // Not an active pointer (a synthetic event); the drag still works on the box.
            }
            pointer = local(event);
            downAt = pointer;
            dragging = true;
            box.dataset.dragging = "true";
        };
        const onUp = () => {
            const tapped =
                downAt && pointer && Math.hypot(pointer.x - downAt.x, pointer.y - downAt.y) < 6;
            dragging = false;
            downAt = null;
            box.dataset.dragging = "false";
            if (tapped) {
                pullNow();
            }
        };
        box.addEventListener("pointermove", onMove);
        box.addEventListener("pointerleave", onLeave);
        grip.addEventListener("pointerdown", onDown);
        grip.addEventListener("pointermove", onMove);
        grip.addEventListener("pointerup", onUp);
        grip.addEventListener("pointercancel", onUp);

        // Follow the page thread's progress over the coil, and the page coming alive.
        const watcher = typeof MutationObserver === "undefined" ? null : new MutationObserver(sync);
        watcher?.observe(box, { attributes: true, attributeFilter: ["data-thread-progress"] });
        for (let node = box.parentElement; node; node = node.parentElement) {
            watcher?.observe(node, { attributes: true, attributeFilter: ["class"] });
        }
        const observer =
            typeof IntersectionObserver === "undefined"
                ? null
                : new IntersectionObserver(([entry]) => {
                      visible = Boolean(entry?.isIntersecting);
                      start();
                  });
        observer?.observe(box);
        const resize =
            typeof ResizeObserver === "undefined"
                ? null
                : new ResizeObserver(() => {
                      layout();
                      drawRope();
                      sync();
                  });
        resize?.observe(box);
        drawRope();
        sync();

        return () => {
            cancelAnimationFrame(frame);
            watcher?.disconnect();
            observer?.disconnect();
            resize?.disconnect();
            box.removeEventListener("pointermove", onMove);
            box.removeEventListener("pointerleave", onLeave);
            grip.removeEventListener("pointerdown", onDown);
            grip.removeEventListener("pointermove", onMove);
            grip.removeEventListener("pointerup", onUp);
            grip.removeEventListener("pointercancel", onUp);
            if (pullRef) {
                pullRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            pullRef?.current?.();
        }
    };

    return (
        <div
            ref={boxRef}
            className="loose-end"
            data-pull="0"
            data-live="true"
            data-away={away ? "true" : "false"}
        >
            <svg ref={svgRef} className="loose-end-art" aria-hidden="true" focusable="false">
                <path ref={pathRef} className="loose-end-line" />
                <circle ref={headRef} className="page-thread-head" r="5" style={{ opacity: 0 }} />
            </svg>
            <button
                ref={gripRef}
                type="button"
                className="loose-end-grip"
                data-cursor="PULL"
                aria-label="Pull the thread to start a project"
                onKeyDown={onKey}
            >
                <span className="loose-end-ring" aria-hidden="true" />
                <span className="loose-end-label" aria-hidden="true">
                    Pull to start
                </span>
            </button>
        </div>
    );
}
