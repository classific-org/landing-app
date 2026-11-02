import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/motion.hooks";
import { pointAt, samplePath, type Sample } from "@/lib/thread/geometry";
import { Pen, type Point } from "@/lib/thread/pen";
import { releaseHeroScrollLock, resetScrollToTop } from "@/lib/smooth-scroll";

/** How long the hero thread takes to draw, and how long it waits for the headline to settle. */
const DRAW_MS = 3000;
const SETTLE_MS = 1150;
/** How long the origin dot shows on its own before the line sets off from it. */
const DOT_LEAD_MS = 450;
const SVG_NS = "http://www.w3.org/2000/svg";

type Layer = "back" | "front";
type Segment = { d: string; layer: Layer };
type Box = { left: number; right: number; cx: number; top: number; bottom: number; cy: number };

/** Box of one character of a text node, relative to `frame`. */
function charBox(node: Text, index: number, frame: DOMRect): Box | null {
    const range = document.createRange();
    range.setStart(node, index);
    range.setEnd(node, index + 1);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0) {
        return null;
    }
    const left = rect.left - frame.left;
    const top = rect.top - frame.top;
    return {
        left,
        right: left + rect.width,
        cx: left + rect.width / 2,
        top,
        bottom: top + rect.height,
        cy: top + rect.height / 2,
    };
}

/** A glyph's ink, and the open spaces inside it (its counters), from its baseline origin. */
type Glyph = {
    left: number;
    right: number;
    /** Counters met going down the glyph's middle, top first: one for a D, two for an S. */
    counters: Point[];
    /** Width of the glyph's first stroke near the baseline: the stem of a P. */
    stem: number;
    /** Middle column and its first ink from the top: the inside of a U's cup. */
    middle: Point | null;
};

/**
 * Renders one glyph to a canvas and walks down its middle column: every run of background
 * with ink above and below it is a counter (the inside of a D, the two bowls of an S). Each is
 * then centred across its row. This places the thread exactly, whatever the letter or font.
 */
function measureGlyph(char: string, font: string, fs: number): Glyph | null {
    const pad = Math.ceil(fs * 0.3);
    const width = Math.ceil(fs * 1.4) + pad * 2;
    const height = Math.ceil(fs * 1.3) + pad * 2;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
        return null;
    }
    const baseline = pad + Math.ceil(fs);
    context.font = font;
    context.textBaseline = "alphabetic";
    context.fillText(char, pad, baseline);
    const pixels = context.getImageData(0, 0, width, height).data;
    const inked = (x: number, y: number) => pixels[(y * width + x) * 4 + 3]! > 110;
    let left = width;
    let right = -1;
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            if (inked(x, y)) {
                left = Math.min(left, x);
                right = Math.max(right, x);
            }
        }
    }
    if (right < 0) {
        return null;
    }
    const column = Math.round((left + right) / 2);
    const counters: Point[] = [];
    let inkAbove = false;
    let runStart = -1;
    for (let y = 0; y < height; y += 1) {
        if (inked(column, y)) {
            if (inkAbove && runStart >= 0) {
                const row = Math.round((runStart + y - 1) / 2);
                // Centre it across the row; an open side (the mouth of an S) is mirrored from
                // the closed one, so the point stays inside the bowl.
                let l = column;
                while (l > left && !inked(l - 1, row)) {
                    l -= 1;
                }
                let r = column;
                while (r < right && !inked(r + 1, row)) {
                    r += 1;
                }
                const reach = Math.min(column - l, r - column) || Math.max(column - l, r - column);
                const lo = Math.max(l, column - reach * 2);
                const hi = Math.min(r, column + reach * 2);
                counters.push({ x: (lo + hi) / 2 - pad, y: row - baseline });
            }
            inkAbove = true;
            runStart = -1;
        } else if (inkAbove && runStart < 0) {
            runStart = y;
        }
    }
    const footRow = baseline - Math.round(fs * 0.12);
    let stemEnd = left;
    while (stemEnd < right && inked(stemEnd + 1, footRow)) {
        stemEnd += 1;
    }
    let top = 0;
    while (top < height && !inked(column, top)) {
        top += 1;
    }
    const middle = top < height ? { x: column - pad, y: top - baseline } : null;
    return {
        left: left - pad,
        right: right + 1 - pad,
        counters,
        stem: stemEnd + 1 - left,
        middle,
    };
}

/**
 * Lays the hero thread through the headline, measured from the glyphs themselves. The route
 * is the reference site's own (dakshgajjar.com), curve for curve, re-anchored to the letters
 * of this headline: an arc from the dot behind the first line, a hook round its B, a diagonal
 * down behind to the second line, a cross over its S and a loop round it, one run along the
 * top of the last line, a loop round the foot of its P and down behind the P's stem, then a
 * wiggle down to the end, where the page thread takes over. It is cut into segments that sit
 * alternately behind and in front of the letters, so it reads as a thread woven through them.
 */
function layout(section: HTMLElement) {
    const frame = section.getBoundingClientRect();
    const title = section.querySelector<HTMLElement>(".hero-title");
    const origin = section.querySelector<HTMLElement>("[data-hero-origin]");
    const lines = title ? Array.from(title.querySelectorAll<HTMLElement>(".split-inner")) : [];
    if (!title || !origin || lines.length < 3) {
        return null;
    }
    const style = getComputedStyle(title);
    const fs = parseFloat(style.fontSize);
    const font = `${style.fontWeight} ${fs}px ${style.fontFamily}`;
    const context = document.createElement("canvas").getContext("2d");
    if (!context) {
        return null;
    }
    context.font = font;
    const metrics = context.measureText("H");
    const ascent = metrics.fontBoundingBoxAscent || fs * 0.97;
    const capHeight = metrics.actualBoundingBoxAscent || fs * 0.73;

    type Char = Box & { char: string };
    const chars = (line: HTMLElement) => {
        const node = line.firstChild;
        if (!(node instanceof Text)) {
            return [];
        }
        const boxes: Char[] = [];
        for (let index = 0; index < node.length; index += 1) {
            if (node.data[index] !== " ") {
                const box = charBox(node, index, frame);
                if (box) {
                    boxes.push({ ...box, char: node.data[index]!.toUpperCase() });
                }
            }
        }
        return boxes;
    };
    const [c1, c2, c3] = lines.map(chars) as [Char[], Char[], Char[]];
    if (c1.length < 2 || c2.length < 2 || c3.length < 2) {
        return null;
    }
    const base = (box: Box) => box.top + ascent;
    const base1 = base(c1[0]!);
    const base2 = base(c2[0]!);
    const base3 = base(c3[0]!);

    const glyphOf = (box: Char) => measureGlyph(box.char, font, fs);
    const cap1 = base1 - capHeight;
    const cap2 = base2 - capHeight;
    const cap3 = base3 - capHeight;
    const H = capHeight;

    // The letters the route is anchored to, matched to where the reference's route meets its
    // own headline: the hook letter of the first line (the B, where the reference hooks its
    // S), the first two letters of the second line, and the last letter of the last line that
    // has a straight stem (the P, where the reference circles its K).
    const hookBox = c1.find((box) => box.char === "B") ?? c1[Math.min(2, c1.length - 1)]!;
    const [first2, second2] = c2 as [Char, Char];
    const stemBox =
        [...c3].reverse().find((box) => "BDEFHIKLMNPR".includes(box.char)) ?? c3[c3.length - 2]!;
    const stemGlyph = glyphOf(stemBox);
    const stemX = stemBox.left + (stemGlyph ? stemGlyph.left + stemGlyph.stem / 2 : fs * 0.17);
    const hl = hookBox.left;
    const hw = hookBox.right - hookBox.left;
    const k = stemBox.left;

    // The origin dot sits under the logo, a little in from the headline's left edge.
    const parent = origin.parentElement?.getBoundingClientRect();
    const size = origin.getBoundingClientRect().width;
    if (parent) {
        const x = c1[0]!.left + fs * 0.357;
        origin.style.marginLeft = `${(x - (parent.left - frame.left) - size / 2).toFixed(1)}px`;
    }
    const o = origin.getBoundingClientRect();
    const start = { x: o.left + o.width / 2 - frame.left, y: o.top + o.height / 2 - frame.top };

    const segments: Segment[] = [];
    let pen = new Pen(start.x, start.y);
    const cut = (layer: Layer) => {
        segments.push({ d: pen.d, layer });
        pen = new Pen(pen.x, pen.y);
    };
    const to = (c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number) =>
        pen.curve(c1x, c1y, c2x, c2y, x, y);

    // The reference's own route, curve for curve, with each point re-anchored to the matching
    // letters of this headline (in units of the font size and cap height), and the same
    // alternation of behind and in front.
    //
    // Behind: one long arc from the dot to the top of the hook letter.
    const a = { x: hl + hw * 0.661, y: cap1 + H * 0.308 };
    to(
        start.x + (a.x - start.x) * 0.095,
        start.y + (a.y - start.y) * 0.33,
        a.x - (a.x - start.x) * 0.67,
        a.y - (a.y - start.y) * 0.286,
        a.x,
        a.y,
    );
    cut("back");
    // In front: a small round hook over the letter's top right and back across its middle.
    const hookTip = { x: hl + hw * 0.761, y: cap1 + H * 0.489 };
    const hookOut = { x: hl + hw * 0.458, y: cap1 + H * 0.664 };
    to(hl + hw * 0.744, cap1 + H * 0.32, hl + hw * 0.921, cap1 + H * 0.358, hookTip.x, hookTip.y);
    to(hl + hw * 0.69, cap1 + H * 0.546, hl + hw * 0.588, cap1 + H * 0.605, hookOut.x, hookOut.y);
    cut("front");
    // Behind: one long diagonal down to the second line.
    const g = { x: second2.left + fs * 0.062, y: cap2 + H * 0.171 };
    to(
        hookOut.x - fs * 0.263,
        hookOut.y + fs * 0.137,
        g.x + fs * 0.526,
        g.y - fs * 0.159,
        g.x,
        g.y,
    );
    cut("back");
    // In front: a short cross over the first letter of the second line.
    const j = { x: first2.left + fs * 0.345, y: cap2 + H * 0.316 };
    to(g.x - fs * 0.108, g.y + fs * 0.033, j.x + fs * 0.114, j.y - fs * 0.034, j.x, j.y);
    cut("front");
    // Behind: out round the letter's left side.
    const side = { x: first2.left + fs * 0.026, y: cap2 + H * 0.781 };
    to(j.x - fs * 0.203, j.y + fs * 0.06, side.x, side.y - fs * 0.122, side.x, side.y);
    cut("back");
    // In front: round the bottom of the loop and one straight run along the top of the last
    // line.
    const run = cap3 - H * 0.07;
    const runEnd = k - fs * 0.502;
    to(side.x, side.y + fs * 0.122, first2.left + fs * 0.142, run, first2.left + fs * 0.402, run);
    pen.line(runEnd, run);
    cut("front");
    // Behind: off the end of the run and down onto the right side of a loop round the foot of
    // the stem letter.
    // Low enough to sit in the open space under the P's bowl, as the reference's sits in its K.
    const right = { x: k + fs * 0.5, y: cap3 + H * 0.66 };
    to(runEnd + fs * 0.884, run, k + fs * 0.6, cap3 + H * 0.05, right.x, right.y);
    cut("back");
    // In front: the bottom half of the loop.
    const left = { x: k - fs * 0.179, y: cap3 + H * 0.68 };
    to(
        right.x - fs * 0.04,
        right.y + fs * 0.26,
        left.x - fs * 0.08,
        left.y + fs * 0.25,
        left.x,
        left.y,
    );
    cut("front");
    // Behind: over the top of the loop, straight down behind the stem, and a little wiggle
    // down to the end.
    to(left.x, left.y - fs * 0.09, stemX, cap3 + H * 0.5, stemX, cap3 + H * 0.68);
    const foot = base3 + fs * 0.012;
    pen.line(stemX, foot);
    // The wiggle shrinks where the copy sits close below (short screens), so the end stays
    // clear of it.
    const copy = section.querySelector<HTMLElement>("[data-hero-copy]");
    const copyTop = copy ? copy.getBoundingClientRect().top - frame.top : frame.height;
    const fit = Math.max(0.35, Math.min(1, (copyTop - 40 - foot) / (fs * 0.352)));
    const w = (dx: number, dy: number) => ({
        x: stemX + fs * dx * fit,
        y: foot + fs * dy * fit,
    });
    const s1 = [w(-0.0276, 0.0552), w(0.0552, 0.069), w(-0.0276, 0.1104)];
    const s2 = [w(-0.1104, 0.1518), w(0.0069, 0.1863), w(-0.0897, 0.2208)];
    const s3 = [w(-0.1863, 0.2553), w(-0.0828, 0.2967), w(-0.1587, 0.3519)];
    for (const [c1p, c2p, p] of [s1, s2, s3] as [Point, Point, Point][]) {
        to(c1p.x, c1p.y, c2p.x, c2p.y, p.x, p.y);
    }
    cut("back");

    return {
        segments,
        start,
        end: { x: pen.x, y: pen.y },
        width: frame.width,
        height: frame.height,
    };
}

/**
 * The hero's thread. It waits for the intro curtain to lift and the headline to settle, then
 * draws itself once while the page is held at the top, and hands over to the page thread at
 * the right margin. Render it inside the hero section, beside the headline.
 */
export function HeroThread() {
    const backRef = useRef<SVGSVGElement>(null);
    const frontRef = useRef<SVGSVGElement>(null);
    const handoffRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const back = backRef.current;
        const front = frontRef.current;
        const handoff = handoffRef.current;
        const section = back?.parentElement;
        if (!back || !front || !handoff || !section) {
            return;
        }

        const reduced = prefersReducedMotion();
        const root = document.documentElement;
        // The router restores the old scroll position on a reload; the hero always plays from
        // the top, so undo that (this effect runs after the router's layout effect).
        if (root.classList.contains("hero-playing")) {
            resetScrollToTop();
        }
        const showOrigin = () => {
            const origin = section.querySelector<HTMLElement>("[data-hero-origin]");
            if (origin) {
                origin.dataset.shown = "true";
            }
        };
        let pieces: { path: SVGPathElement; samples: Sample[]; from: number; length: number }[] =
            [];
        let total = 0;
        let progress = reduced ? 1 : 0;
        let frame = 0;
        let disposed = false;
        const head = document.createElementNS(SVG_NS, "circle");
        head.setAttribute("r", "5");
        head.setAttribute("class", "hero-pen");
        // Where the hero's line ends and the page's begins: a ring that pulses while the page
        // is still at the top, inviting the first scroll that carries the line on.
        const node = document.createElementNS(SVG_NS, "g");
        node.setAttribute("class", "hero-node");
        [
            ["hero-node-pulse", "11"],
            ["hero-node-ring", "11"],
            ["hero-pen", "4.5"],
        ].forEach(([className, radius]) => {
            const circle = document.createElementNS(SVG_NS, "circle");
            circle.setAttribute("class", className!);
            circle.setAttribute("r", radius!);
            node.appendChild(circle);
        });
        // Once the page moves, the page thread's own idle ring takes over at the line's tip.
        const onScroll = () => {
            node.classList.toggle("is-waiting", window.scrollY < 4);
        };

        const render = () => {
            const drawn = progress * total;
            let tip: { x: number; y: number } | null = null;
            pieces.forEach((piece) => {
                const local = Math.max(0, Math.min(piece.length, drawn - piece.from));
                piece.path.style.strokeDashoffset = String(piece.length - local);
                piece.path.style.visibility = local > 0 ? "visible" : "hidden";
                if (local > 0 && local < piece.length) {
                    tip = pointAt(piece.samples, local);
                }
            });
            const point = tip as { x: number; y: number } | null;
            if (point && progress < 1) {
                head.setAttribute("cx", point.x.toFixed(1));
                head.setAttribute("cy", point.y.toFixed(1));
                head.style.opacity = "1";
            } else {
                head.style.opacity = "0";
            }
            node.classList.toggle("is-on", progress >= 1);
        };

        const build = () => {
            if (disposed) {
                return;
            }
            const result = layout(section);
            if (!result) {
                return;
            }
            [back, front].forEach((svg) => {
                svg.setAttribute(
                    "viewBox",
                    `0 0 ${result.width.toFixed(1)} ${result.height.toFixed(1)}`,
                );
                svg.replaceChildren();
            });
            total = 0;
            pieces = result.segments.map((segment) => {
                const path = document.createElementNS(SVG_NS, "path");
                path.setAttribute("d", segment.d);
                path.setAttribute("class", "hero-line");
                (segment.layer === "front" ? front : back).appendChild(path);
                const length = path.getTotalLength();
                path.style.strokeDasharray = `${length} ${length}`;
                const polyline = samplePath(segment.d);
                const polyTotal = polyline[polyline.length - 1]?.length ?? 0;
                const scale = polyTotal > 0 ? length / polyTotal : 1;
                const piece = {
                    path,
                    samples: polyline.map((sample) => ({
                        ...sample,
                        length: sample.length * scale,
                    })),
                    from: total,
                    length,
                };
                total += length;
                return piece;
            });
            front.appendChild(head);
            node.setAttribute(
                "transform",
                `translate(${result.end.x.toFixed(1)} ${result.end.y.toFixed(1)})`,
            );
            front.appendChild(node);
            // Hand over to the page thread where this one ends.
            handoff.style.left = `${result.end.x}px`;
            handoff.style.top = `${result.end.y}px`;
            window.dispatchEvent(new Event("thread:layout"));
            render();
        };

        const play = async () => {
            // Measure only once the hero's entrance animations have come to rest; otherwise
            // the line would start where the headline was mid-rise.
            const entering = section
                .getAnimations({ subtree: true })
                .filter((animation) => animation.effect?.getComputedTiming().endTime !== Infinity);
            await Promise.all(entering.map((animation) => animation.finished.catch(() => null)));
            if (disposed) {
                return;
            }
            resetScrollToTop();
            build();
            // The dot appears first, then the line sets off from it.
            showOrigin();
            await new Promise((resolve) => window.setTimeout(resolve, DOT_LEAD_MS));
            if (disposed) {
                return;
            }
            const startedAt = performance.now();
            const tick = (now: number) => {
                const t = Math.min(1, (now - startedAt) / DRAW_MS);
                // Ease in and out, so the pen sets off and arrives gently.
                progress = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
                render();
                if (t < 1) {
                    frame = requestAnimationFrame(tick);
                } else {
                    releaseHeroScrollLock();
                }
            };
            frame = requestAnimationFrame(tick);
        };

        let timer = 0;
        let observer: MutationObserver | null = null;
        const begin = () => {
            resetScrollToTop();
            timer = window.setTimeout(() => void play(), SETTLE_MS);
        };
        void document.fonts?.ready.then(() => {
            if (disposed) {
                return;
            }
            build();
            if (reduced) {
                showOrigin();
                releaseHeroScrollLock();
                return;
            }
            // Start once the intro curtain has lifted (or straight away without one).
            if (root.classList.contains("intro-pending")) {
                observer = new MutationObserver(() => {
                    if (!root.classList.contains("intro-pending")) {
                        observer?.disconnect();
                        begin();
                    }
                });
                observer.observe(root, { attributes: true, attributeFilter: ["class"] });
            } else {
                begin();
            }
        });

        let resizeFrame = 0;
        const onResize = () => {
            cancelAnimationFrame(resizeFrame);
            resizeFrame = requestAnimationFrame(build);
        };
        window.addEventListener("resize", onResize, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        return () => {
            disposed = true;
            observer?.disconnect();
            window.clearTimeout(timer);
            cancelAnimationFrame(frame);
            cancelAnimationFrame(resizeFrame);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <>
            <svg
                ref={backRef}
                className="hero-layer hero-layer-back pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
                focusable="false"
            />
            <svg
                ref={frontRef}
                className="hero-layer hero-layer-front pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
                focusable="false"
            />
            <span ref={handoffRef} data-thread-start className="absolute" aria-hidden="true" />
        </>
    );
}
