import { Pen, type Point } from "@/lib/thread/pen";

export type Rect = {
    left: number;
    top: number;
    right: number;
    bottom: number;
    cx: number;
    cy: number;
    /** The measured element, so a route can ask for it to light up when the line arrives. */
    el?: HTMLElement;
};

/** An element that lights up (gets `data-threaded`) once the line reaches `point`. */
export type Light = { point: Point; el: HTMLElement };

/** What a route knows about its section, all in the page wrapper's coordinates. */
export type RouteContext = {
    /** Where the previous route stopped. Every route begins exactly here. */
    entry: Point;
    /** The section's top and bottom edges. A route ends on `bottom` unless it is the last. */
    top: number;
    bottom: number;
    /** Clear margins either side of the content column, used for long vertical runs. */
    laneLeft: number;
    laneRight: number;
    /** True from the large breakpoint up, where the designed routes fit their layouts. */
    wide: boolean;
    /** Rects of `[data-thread-anchor="name"]` elements in this section, in document order. */
    anchors: (name: string) => Rect[];
    /** Rects of any elements in this section matching a CSS selector, in document order. */
    query: (selector: string) => Rect[];
    /** Rects of `[data-thread-node]` elements in this section, in document order. */
    nodes: Rect[];
    /** True for the page's final section: its route ends inside it instead of at the bottom. */
    last: boolean;
};

export type Route = {
    pen: Pen;
    /** Points that light a ring as the line reaches them. */
    rings?: Point[];
    /** Ring radius for this route's rings. */
    ringRadius?: number;
    /** Elements that light up as the line reaches them. */
    lights?: Light[];
    /**
     * Side branches off the route (path data). Each starts and ends on the route and draws
     * between those two points as the route's own line passes them.
     */
    branches?: string[];
};

/** A light for an anchor at a point on the route (by default its centre). */
export function lightFor(rect: Rect | undefined, point?: Point): Light[] {
    return rect?.el ? [{ el: rect.el, point: point ?? { x: rect.cx, y: rect.cy } }] : [];
}

export type RouteBuilder = (context: RouteContext) => Route | null;

/** The lane nearer to x. */
function nearestLane(context: RouteContext, x: number) {
    return Math.abs(x - context.laneLeft) < Math.abs(x - context.laneRight)
        ? context.laneLeft
        : context.laneRight;
}

/**
 * Any section without a designed route: the line moves into the nearest margin lane, passes
 * through the section's thread nodes and drops to the next fold.
 */
export const genericRoute: RouteBuilder = (context) => {
    const { entry, bottom, nodes } = context;
    const pen = new Pen(entry.x, entry.y);
    if (nodes.length > 0) {
        nodes.forEach((node, index) => {
            const previous =
                index === 0 ? entry : { x: nodes[index - 1]!.cx, y: nodes[index - 1]!.cy };
            if (Math.abs(node.cy - previous.y) < 60) {
                pen.sweep(node.cx, node.cy);
            } else {
                pen.drop(node.cx, node.cy);
            }
        });
        const lastNode = nodes[nodes.length - 1]!;
        if (!context.last) {
            const lane = nearestLane(context, lastNode.cx);
            pen.bend(lane, Math.min(bottom - 80, lastNode.cy + 60), false).drop(lane, bottom);
        }
        return { pen, rings: nodes.map((node) => ({ x: node.cx, y: node.cy })) };
    }
    const lane = nearestLane(context, entry.x);
    const end = context.last ? Math.min(bottom - 60, entry.y + 320) : bottom;
    if (Math.abs(lane - entry.x) > 4) {
        pen.drop(lane, Math.min(end, entry.y + 160));
    }
    pen.drop(lane, end);
    return { pen };
};

/**
 * Hero: the hero draws its own thread through the headline (HeroThread) and hands over at the
 * right margin, above the scroll hint; from there the page thread runs straight down the
 * margin, past the commitments strip, into the first fold.
 */
export const heroRoute: RouteBuilder = (context) => {
    const { entry, bottom, wide, laneRight } = context;
    const pen = new Pen(entry.x, entry.y);
    if (!wide) {
        // Narrow screens: the hero's line stops above the copy, so turn out to the right
        // margin and run down past the copy and buttons there.
        // The turn is finished before the copy starts, so it never crosses a line of text.
        const copy = context.query("[data-hero-copy]")[0];
        const turn = Math.min(bottom, entry.y + 110, (copy?.top ?? bottom) - 12);
        const run = turn - entry.y;
        pen.curve(entry.x, entry.y + run * 0.6, laneRight, turn - run * 0.6, laneRight, turn);
    }
    pen.line(pen.x, bottom);
    return { pen };
};

/**
 * Closing call to action: the line winds into a loose spiral beside the headline, as if
 * thinking, then sweeps down and circles the "Start a Project" button, where the thread ends.
 */
export const closingRoute: RouteBuilder = (context) => {
    const { entry, wide, laneRight } = context;
    const cta = context.anchors("cta")[0];
    if (!cta) {
        return genericRoute(context);
    }
    const pen = new Pen(entry.x, entry.y);
    const space = context.anchors("thread-space")[0];
    if (wide && space) {
        const cx = space.cx;
        const cy = space.cy;
        const r = Math.min(space.right - space.left, space.bottom - space.top) * 0.36;
        if (Math.abs(entry.x - laneRight) > 4) {
            pen.drop(laneRight, entry.y + 120);
        }
        pen.drop(laneRight, cy - r * 1.6);
        pen.through([{ x: cx + r, y: cy }], 0.9);
        // A spiral that tightens over a turn and a half, as if thinking, then lets go.
        const spiral: Point[] = [];
        const turns = Math.PI * 3.2;
        for (let angle = 0.25; angle <= turns; angle += 0.25) {
            const radius = r * (1 - 0.55 * (angle / turns));
            spiral.push({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
        }
        pen.through(spiral, 1);
        // Down the empty gap between the copy and the list, then beneath the buttons, so it
        // never runs through text or the second button.
        const gap = space.left - (space.right - space.left) * 0.8;
        pen.through(
            [
                { x: gap, y: cta.top - 20 },
                { x: gap - 60, y: cta.bottom + 60 },
                { x: cta.cx + 40, y: cta.bottom + 34 },
            ],
            1,
        );
    } else {
        pen.drop(cta.cx + 40, cta.bottom + 34);
    }
    // A hand-drawn ellipse round the button, from its underside, overshooting where it began.
    const rx = (cta.right - cta.left) / 2 + 12;
    const ry = (cta.bottom - cta.top) / 2 + 18;
    pen.through([{ x: cta.cx, y: cta.cy + ry }], 1);
    const steps = 48;
    const points: Point[] = [];
    for (let index = 1; index <= steps; index += 1) {
        const angle = Math.PI / 2 + (index / steps) * Math.PI * 2.12;
        const wobble = 1 + 0.035 * Math.sin(index * 0.6);
        points.push({
            x: cta.cx + rx * wobble * Math.cos(angle),
            y: cta.cy + ry * wobble * Math.sin(angle) - index * 0.15,
        });
    }
    pen.through(points, 1);
    return { pen, lights: lightFor(cta, points[points.length - 1]) };
};

/**
 * A service world (see World.tsx): one long, unhurried curve through the world's ports in
 * order, leaving at the bottom where the world says. Ports inside an object light it as the
 * line passes; the title sharpens when the line goes behind it.
 */
export const worldRoute: RouteBuilder = (context) => {
    const { entry, bottom, wide, top, laneLeft, laneRight } = context;
    const ports = [...context.anchors("port")].sort(
        (a, b) => Number(a.el?.dataset.order ?? 0) - Number(b.el?.dataset.order ?? 0),
    );
    if (!wide) {
        return narrowWorldRoute(context);
    }
    if (ports.length < 2) {
        return genericRoute(context);
    }
    const section = ports[0]!.el?.closest<HTMLElement>("section");
    const ends = section?.dataset.threadEnd === "true";
    const exitX = section?.dataset.threadExit === "left" ? laneLeft : laneRight;
    const points = ports.map((port) => ({ x: port.cx, y: port.cy }));
    const first = points[0]!;
    const last = points[points.length - 1]!;
    // Section edges are crossed only where there is no text: the line is held vertical where
    // it came in until it is below the kicker row, and leaves by a side margin, reaching it
    // before the bottom link, so it never runs through either.
    const holdIn = [{ x: entry.x, y: Math.min(top + 190, first.y - 90) }];
    const holdOut = ends
        ? []
        : [
              { x: exitX, y: Math.max(last.y + 60, bottom - 220) },
              { x: exitX, y: bottom },
          ];
    // Straight down past the kicker row, then one curve that leaves vertically and turns into
    // the first point. (Smoothing straight through the hold point would overshoot sideways
    // first, an S-wobble.) From there on, one smooth curve through the rest.
    const hold = holdIn[0]!;
    const pen = new Pen(entry.x, entry.y);
    pen.line(hold.x, hold.y);
    // Arrive at the first point already heading the way the smooth curve leaves it (from the
    // hold point towards the second point), so the hand-over has no kink.
    const second = points[1] ?? last;
    const heading = { x: second.x - hold.x, y: second.y - hold.y };
    const reach =
        (0.4 * Math.hypot(first.x - hold.x, first.y - hold.y)) /
        Math.max(1, Math.hypot(heading.x, heading.y));
    pen.curve(
        hold.x,
        hold.y + (first.y - hold.y) * 0.55,
        first.x - heading.x * reach,
        first.y - heading.y * reach,
        first.x,
        first.y,
    );
    pen.through([...points.slice(1), ...holdOut], 1, hold);
    const lights: Light[] = [];
    ports.forEach((port) => {
        const target = port.el?.dataset.threadLight;
        const object = target
            ? document.getElementById(target)
            : port.el?.closest<HTMLElement>("[data-thread-object]");
        if (object) {
            lights.push({ el: object, point: { x: port.cx, y: port.cy } });
        }
        const also = port.el?.dataset.threadLightAlso;
        const other = also ? document.getElementById(also) : null;
        if (other) {
            lights.push({ el: other, point: { x: port.cx, y: port.cy } });
        }
    });
    const title = context.anchors("world-title")[0];
    if (title?.el) {
        lights.push({ el: title.el, point: { x: title.cx, y: title.cy } });
    }
    return { pen, lights };
};

/**
 * A service world on phones and tablets, where the drawing and its cards stack: the line runs
 * down the right margin, past the title and the main drawing (which light and play), and
 * swings in behind each card in
 * turn, lighting it, then back out to the margin, as if stitching them on.
 */
function narrowWorldRoute(context: RouteContext): Route {
    const { entry, bottom, laneRight: lane } = context;
    const pen = new Pen(entry.x, entry.y);
    const cards = context.query(".world-card:not(.world-still)").sort((a, b) => a.top - b.top);
    const lights: Light[] = [];
    const title = context.anchors("world-title")[0];
    if (Math.abs(entry.x - lane) > 4) {
        pen.drop(lane, entry.y + 120);
    }
    if (title?.el) {
        lights.push({ el: title.el, point: { x: lane, y: Math.max(pen.y, title.cy) } });
    }
    // The main drawing plays as the line passes its upper part.
    context.query(".world-flat").forEach((flat) => {
        if (flat.el) {
            const y = flat.top + (flat.bottom - flat.top) * 0.2;
            lights.push({ el: flat.el, point: { x: lane, y: Math.max(pen.y, y) } });
        }
    });
    cards.forEach((card) => {
        const h = card.bottom - card.top;
        // How far in behind the card the line reaches: past its edge, well clear of the lane.
        const deep = card.right - Math.min(70, (card.right - card.left) * 0.25);
        const swing = Math.max(36, lane - deep);
        const a = card.top - 16;
        const y1 = card.top + h * 0.34;
        const y2 = card.top + h * 0.66;
        const b = card.bottom + 16;
        if (a > pen.y) {
            pen.line(lane, a);
        }
        pen.curve(lane, a + (y1 - a) * 0.55, deep + swing * 0.55, y1, deep, y1);
        // The turn is hidden behind the card.
        pen.curve(deep - swing * 0.5, y1, deep - swing * 0.5, y2, deep, y2);
        pen.curve(deep + swing * 0.55, y2, lane, b - (b - y2) * 0.55, lane, b);
        if (card.el) {
            lights.push({ el: card.el, point: { x: deep, y: y1 } });
        }
    });
    if (!context.last) {
        pen.line(lane, bottom);
    } else {
        // The last section ends in its drawing: the line turns in to where the drawing's own
        // line starts on its right edge (Closing's plug cord, 28% of the way down).
        const flat = context.query(".world-flat").pop();
        if (flat) {
            const join = { x: flat.right, y: flat.top + (flat.bottom - flat.top) * 0.28 };
            pen.line(lane, Math.max(pen.y, join.y - 60));
            pen.curve(lane, join.y - 20, join.x + 18, join.y, join.x, join.y);
        }
    }
    return { pen, lights };
}

/**
 * Capabilities dial: drawn with true arcs, measured from the dial itself (see
 * CapabilitiesScene). The line falls onto the ring on its tangent at the upper left, goes once
 * round anticlockwise lighting each discipline as it passes and then the seal at its centre,
 * carries on to the bottom of the ring and leaves along its tangent, turning straight down.
 */
export const dialRoute: RouteBuilder = (context) => {
    const { entry, bottom, wide, laneRight } = context;
    const dial = context.anchors("dial")[0];
    const markers = context.anchors("dial-node");
    if (!dial || markers.length === 0) {
        return genericRoute(context);
    }
    const cx = dial.cx;
    const cy = dial.cy;
    const r = (dial.right - dial.left) * 0.42;
    const rad = (degrees: number) => (degrees * Math.PI) / 180;
    const on = (degrees: number) => ({
        x: cx + r * Math.cos(rad(degrees)),
        y: cy + r * Math.sin(rad(degrees)),
    });
    const START = -150;
    const start = on(START);
    const pen = new Pen(entry.x, entry.y);
    // Fall onto the ring: arrive along its anticlockwise tangent at START, heading down-left.
    const tangent = { x: Math.sin(rad(START)), y: -Math.cos(rad(START)) };
    if (!wide) {
        // Narrow screens: down the right margin past the headline and copy, then over the
        // top of the dial onto the ring.
        const above = { x: entry.x, y: start.y - r * 0.95 };
        pen.line(above.x, above.y);
        pen.curve(
            above.x,
            above.y + r * 0.4,
            start.x - tangent.x * r * 0.7,
            start.y - tangent.y * r * 0.7,
            start.x,
            start.y,
        );
    } else {
        const fall = start.y - entry.y;
        pen.curve(
            entry.x,
            entry.y + fall * 0.5,
            start.x - tangent.x * fall * 0.3,
            start.y - tangent.y * fall * 0.3,
            start.x,
            start.y,
        );
    }
    // Once round, and on a third of a turn to the bottom of the ring.
    pen.orbit(cx, cy, r, rad(START), -rad(480));
    // Off the bottom along its tangent (heading right) and round in one J into a straight
    // drop: clear of the Desktop label to its right, the bottom link, and the next fold's
    // kicker row.
    const drop = cx + r * 0.5;
    if (!wide) {
        // Narrow screens: the list of disciplines sits under the dial, so the line leaves for
        // the right margin and runs down past it there.
        pen.curve(cx + r * 0.3, cy + r, laneRight, cy + r * 1.05, laneRight, cy + r * 1.6);
        pen.line(laneRight, bottom);
    } else {
        pen.curve(cx + r * 0.3, cy + r, drop, cy + r * 1.12, drop, cy + r * 1.5);
        pen.line(drop, bottom);
    }

    const lights: Light[] = [];
    markers.forEach((marker) => {
        const node = marker.el?.closest<HTMLElement>("[data-thread-object]");
        const degrees = Number(marker.el?.dataset.angle ?? NaN);
        if (node && Number.isFinite(degrees)) {
            lights.push({ el: node, point: on(degrees) });
            // On narrow screens each dot also lights its discipline in the list below.
            const also = marker.el?.dataset.lightAlso;
            const item = also ? document.getElementById(also) : null;
            if (item) {
                lights.push({ el: item, point: on(degrees) });
            }
        }
    });
    // The seal lights as the turn completes: shortly before the line returns to where it
    // began, at a point it passes only once (far enough round that the line falling onto the
    // ring never comes near it).
    const seal = [
        document.getElementById("dial-seal"),
        document.getElementById("dial-seal-small"),
    ].find((element) => element && element.getClientRects().length > 0);
    if (seal) {
        lights.push({ el: seal, point: on(START + 30) });
    }
    return { pen, lights };
};

/**
 * Why Classific's suspension bridge (see WhyScene). The line is the whole cable, drawn from the
 * bridge's own geometry so it rests exactly on its towers: down the left margin to the
 * TECHNOLOGY end, round in a small hook (the anchorage) and straight up the backstay to the
 * left tower top, over it in a tight rounded crest, along the main span's true curve, over the
 * right tower top, straight down the backstay to the BUSINESS end and round into the margin.
 */
export const bridgeRoute: RouteBuilder = (context) => {
    const { entry, bottom, wide, laneLeft, laneRight } = context;
    const bridge = context.anchors("bridge")[0];
    const data = bridge?.el?.dataset;
    if (!wide || !bridge || !data) {
        return narrowWorldRoute(context);
    }
    const width = bridge.right - bridge.left;
    const height = bridge.bottom - bridge.top;
    const at = (x: number, y: number) => ({
        x: bridge.left + (x / 100) * width,
        y: bridge.top + (y / 100) * height,
    });
    const [leftX, rightX] = (data.towers ?? "18,82").split(",").map(Number) as [number, number];
    const towerTop = Number(data.towerTop);
    const sag = Number(data.sag);
    const deck = Number(data.deck);
    const unit = (from: Point, to: Point) => {
        const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;
        return { x: (to.x - from.x) / length, y: (to.y - from.y) / length };
    };
    const along = (point: Point, direction: Point, distance: number) => ({
        x: point.x + direction.x * distance,
        y: point.y + direction.y * distance,
    });

    // The main span is a parabola: exactly a quadratic from tower top to tower top whose
    // control point sits at twice the sag.
    const q0 = at(leftX, towerTop);
    const q1 = at((leftX + rightX) / 2, towerTop + 2 * sag);
    const q2 = at(rightX, towerTop);
    const span = (t: number) => ({
        x: (1 - t) ** 2 * q0.x + 2 * t * (1 - t) * q1.x + t ** 2 * q2.x,
        y: (1 - t) ** 2 * q0.y + 2 * t * (1 - t) * q1.y + t ** 2 * q2.y,
    });

    const hook = 26;
    // The hooks' lowest point touches down on the road's ends. The line comes down the margin,
    // or, on very wide screens where the stage stops growing, just inside the road's end.
    const anchorY = at(0, deck).y - 0.25 * hook;
    const downX = Math.max(laneLeft, at(2.5, 0).x);
    const outX = Math.min(laneRight, at(97.5, 0).x);
    const pen = new Pen(entry.x, entry.y);
    if (Math.abs(entry.x - downX) > 4) {
        pen.curve(entry.x, entry.y + 60, downX, entry.y + 60, downX, entry.y + 120);
    }

    // Down the margin and round the anchorage hook, leaving along the backstay.
    const leftAnchor = { x: downX + 2 * hook, y: anchorY - 0.2 * hook };
    const leftStay = unit(leftAnchor, q0);
    pen.line(downX, anchorY - hook);
    pen.curve(
        downX,
        anchorY + 0.5 * hook,
        leftAnchor.x - leftStay.x * 1.5 * hook,
        leftAnchor.y - leftStay.y * 1.5 * hook,
        leftAnchor.x,
        leftAnchor.y,
    );

    // A tight rounded crest over a tower top, from one straight approach to the next curve.
    const crest = (from: Point, fromDirection: Point, to: Point, toDirection: Point) => {
        const reach = Math.hypot(to.x - from.x, to.y - from.y) * 0.5;
        pen.curve(
            from.x + fromDirection.x * reach,
            from.y + fromDirection.y * reach,
            to.x - toDirection.x * reach,
            to.y - toDirection.y * reach,
            to.x,
            to.y,
        );
    };
    const round = 16;
    const start = 0.025;
    const end = 0.975;

    // Up the backstay and over the left tower onto the main span.
    const beforeLeft = along(q0, leftStay, -round);
    pen.line(beforeLeft.x, beforeLeft.y);
    crest(beforeLeft, leftStay, span(start), unit(span(start - 0.01), span(start + 0.01)));

    // The main span between the crests, exactly (the quadratic from `start` to `end`).
    const blossom = (a: number, b: number) => ({
        x: (1 - a) * (1 - b) * q0.x + ((1 - a) * b + a * (1 - b)) * q1.x + a * b * q2.x,
        y: (1 - a) * (1 - b) * q0.y + ((1 - a) * b + a * (1 - b)) * q1.y + a * b * q2.y,
    });
    const s0 = span(start);
    const s1 = blossom(start, end);
    const s2 = span(end);
    pen.curve(
        s0.x + (2 / 3) * (s1.x - s0.x),
        s0.y + (2 / 3) * (s1.y - s0.y),
        s2.x + (2 / 3) * (s1.x - s2.x),
        s2.y + (2 / 3) * (s1.y - s2.y),
        s2.x,
        s2.y,
    );

    // Over the right tower and down the backstay to the BUSINESS end.
    const rightAnchor = { x: outX - 2 * hook, y: anchorY - 0.2 * hook };
    const rightStay = unit(q2, rightAnchor);
    const afterRight = along(q2, rightStay, round);
    crest(s2, unit(span(end - 0.01), span(end + 0.01)), afterRight, rightStay);
    pen.line(rightAnchor.x, rightAnchor.y);

    // Round into the margin and on down to the next section.
    pen.curve(
        rightAnchor.x + rightStay.x * 1.2 * hook,
        rightAnchor.y + rightStay.y * 1.2 * hook,
        outX,
        rightAnchor.y + 0.8 * hook,
        outX,
        rightAnchor.y + 2 * hook,
    );
    pen.line(outX, bottom);

    // A ring on the cable for each principle; its label lights as the line reaches it.
    const rings: Point[] = [];
    const lights: Light[] = [];
    (data.nodes ?? "").split(",").forEach((value, index) => {
        if (!value) {
            return;
        }
        const point = span((Number(value) - leftX) / (rightX - leftX));
        rings.push(point);
        const label = document.getElementById(`principle-label-${index + 1}`);
        if (label) {
            lights.push({ el: label, point });
        }
    });
    const road = document.getElementById("why-deck");
    if (road) {
        lights.push({ el: road, point: rightAnchor });
    }
    return { pen, rings, ringRadius: 6, lights };
};

export const routes: Record<string, RouteBuilder> = {
    bridge: bridgeRoute,
    hero: heroRoute,
    closing: closingRoute,
    world: worldRoute,
    dial: dialRoute,
};
