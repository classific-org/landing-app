export type Point = { x: number; y: number };

const n = (value: number) => value.toFixed(1);

/**
 * Builds a thread path out of M, L and C commands only, so `samplePath` can measure it. Every
 * move continues from the pen's current point, which is what keeps one section's route joined
 * to the next.
 */
export class Pen {
    private parts: string[];
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.parts = [`M${n(x)} ${n(y)}`];
    }

    get d() {
        return this.parts.join(" ");
    }

    line(x: number, y: number) {
        this.parts.push(`L${n(x)} ${n(y)}`);
        this.x = x;
        this.y = y;
        return this;
    }

    curve(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number) {
        this.parts.push(`C${n(c1x)} ${n(c1y)} ${n(c2x)} ${n(c2y)} ${n(x)} ${n(y)}`);
        this.x = x;
        this.y = y;
        return this;
    }

    /** Leaves and arrives vertically, as a thread falling from one point to another. */
    drop(x: number, y: number, pull = 0.5) {
        const span = (y - this.y) * pull;
        return this.curve(this.x, this.y + span, x, y - span, x, y);
    }

    /** Leaves and arrives horizontally. */
    sweep(x: number, y: number, pull = 0.5) {
        const span = (x - this.x) * pull;
        return this.curve(this.x + span, this.y, x - span, y, x, y);
    }

    /** Leaves vertically and arrives horizontally (or the reverse): a quarter turn. */
    bend(x: number, y: number, verticalFirst = true) {
        const k = 0.552;
        return verticalFirst
            ? this.curve(this.x, this.y + (y - this.y) * k, x - (x - this.x) * k, y, x, y)
            : this.curve(this.x + (x - this.x) * k, this.y, x, y - (y - this.y) * k, x, y);
    }

    /**
     * A straight run along one axis to (x, y) after turning a rounded corner, like a trace on a
     * circuit board. The pen must already be level with one of the two coordinates' axes.
     */
    trace(points: Point[], radius = 18) {
        let previous = { x: this.x, y: this.y };
        points.forEach((point, index) => {
            const next = points[index + 1];
            if (!next) {
                this.line(point.x, point.y);
                return;
            }
            const inLength = Math.hypot(point.x - previous.x, point.y - previous.y);
            const outLength = Math.hypot(next.x - point.x, next.y - point.y);
            const r = Math.min(radius, inLength / 2, outLength / 2);
            const inX = inLength ? (point.x - previous.x) / inLength : 0;
            const inY = inLength ? (point.y - previous.y) / inLength : 0;
            const outX = outLength ? (next.x - point.x) / outLength : 0;
            const outY = outLength ? (next.y - point.y) / outLength : 0;
            this.line(point.x - inX * r, point.y - inY * r);
            const k = 0.552 * r;
            this.curve(
                point.x - inX * (r - k),
                point.y - inY * (r - k),
                point.x + outX * (r - k),
                point.y + outY * (r - k),
                point.x + outX * r,
                point.y + outY * r,
            );
            previous = point;
        });
        return this;
    }

    /**
     * A smooth line through every point (Catmull-Rom turned into cubic segments). `before` is
     * the point the line came from, so the first segment leaves along the same tangent as the
     * curve that led into the pen's position, without a kink.
     */
    through(points: Point[], tension = 1, before?: Point) {
        const all = [{ x: this.x, y: this.y }, ...points];
        for (let index = 1; index < all.length; index += 1) {
            const p0 = all[index - 2] ?? before ?? all[index - 1]!;
            const p1 = all[index - 1]!;
            const p2 = all[index]!;
            const p3 = all[index + 1] ?? p2;
            const t = tension / 6;
            this.curve(
                p1.x + (p2.x - p0.x) * t,
                p1.y + (p2.y - p0.y) * t,
                p2.x - (p3.x - p1.x) * t,
                p2.y - (p3.y - p1.y) * t,
                p2.x,
                p2.y,
            );
        }
        return this;
    }

    /**
     * Travels along a circle around (cx, cy) from angle `from` by `sweep` radians (negative is
     * anticlockwise on screen); pass `ry` for an ellipse. The pen should already sit on the
     * curve at `from`.
     */
    orbit(cx: number, cy: number, r: number, from: number, sweep: number, ry = r) {
        const steps = Math.max(1, Math.ceil(Math.abs(sweep) / (Math.PI / 2)));
        const step = sweep / steps;
        const k = (4 / 3) * Math.tan(step / 4);
        let angle = from;
        for (let index = 0; index < steps; index += 1) {
            const next = angle + step;
            const x0 = cx + r * Math.cos(angle);
            const y0 = cy + ry * Math.sin(angle);
            const x1 = cx + r * Math.cos(next);
            const y1 = cy + ry * Math.sin(next);
            this.curve(
                x0 - k * r * Math.sin(angle),
                y0 + k * ry * Math.cos(angle),
                x1 + k * r * Math.sin(next),
                y1 - k * ry * Math.cos(next),
                x1,
                y1,
            );
            angle = next;
        }
        return this;
    }

    /**
     * Loops once around (cx, cy) the way a pen circles a word: it arrives at the circle, goes
     * all the way round with a little overshoot and leaves where it came in.
     */
    circle(cx: number, cy: number, r: number, clockwise = true) {
        const from = Math.atan2(this.y - cy, this.x - cx);
        const start = { x: cx + r * Math.cos(from), y: cy + r * Math.sin(from) };
        if (Math.hypot(start.x - this.x, start.y - this.y) > 0.5) {
            this.line(start.x, start.y);
        }
        return this.orbit(cx, cy, r, from, (clockwise ? 1 : -1) * Math.PI * 2.08);
    }
}
