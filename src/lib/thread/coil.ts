/*
 * The loose end's coil (see LooseEnd and thread-routes): one shape shared by the page thread,
 * which draws it as you scroll, and the live rope that takes over once it is drawn, so the
 * hand-over is invisible. Points are in 0-1 units of the loose end's square box.
 */
export type Point = { x: number; y: number };

/** How many points make up the rope. */
export const COIL_POINTS = 140;

/** Where the coil hangs from: the page thread's last point, at the box's top right. */
export const COIL_START: Point = { x: 0.8, y: 0.06 };

/**
 * A short lead from the anchor, then a prolate cycloid: round loops that overlap as they drop,
 * like a sprung cord seen from the side, easing smaller towards the free end.
 */
export function coilPoints(count = COIL_POINTS): Point[] {
    const points: Point[] = [];
    const lead = 0.12;
    const turns = 3.25;
    const radius = 0.15;
    const top = 0.2;
    const fall = 0.52;
    const cx = 0.52;
    for (let index = 0; index < count; index += 1) {
        const s = index / (count - 1);
        if (s < lead) {
            // Ease from the anchor round into the top of the first loop.
            const t = s / lead;
            const start = COIL_START;
            const end = { x: cx, y: top - radius * 0.9 };
            // Leave the anchor heading left, the way the page thread arrives at it, so the
            // hand-over has no kink, then curve down into the first loop.
            const bend = { x: start.x - 0.2, y: start.y };
            points.push({
                x: (1 - t) ** 2 * start.x + 2 * t * (1 - t) * bend.x + t ** 2 * end.x,
                y: (1 - t) ** 2 * start.y + 2 * t * (1 - t) * bend.y + t ** 2 * end.y,
            });
            continue;
        }
        const u = (s - lead) / (1 - lead);
        const t = u * turns * Math.PI * 2;
        const taper = 1 - 0.25 * u;
        points.push({
            x: cx - radius * taper * Math.sin(t) * 1.15,
            y: top + fall * u - radius * taper * 0.9 * Math.cos(t),
        });
    }
    return points;
}

/** A smooth path through the points (each point a control point, through the midpoints). */
export function ropePath(points: Point[]) {
    if (points.length < 2) {
        return "";
    }
    let d = `M${points[0]!.x.toFixed(1)} ${points[0]!.y.toFixed(1)}`;
    for (let index = 1; index < points.length - 1; index += 1) {
        const point = points[index]!;
        const next = points[index + 1]!;
        d += ` Q${point.x.toFixed(1)} ${point.y.toFixed(1)} ${((point.x + next.x) / 2).toFixed(1)} ${((point.y + next.y) / 2).toFixed(1)}`;
    }
    const last = points[points.length - 1]!;
    return `${d} L${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
}
