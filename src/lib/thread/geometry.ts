/** Points per cubic segment when sampling a path. */
const CUBIC_STEPS = 20;

export type Sample = { x: number; y: number; length: number };

/**
 * Samples an "M/L/C" path into a polyline with cumulative lengths. The page thread builds its
 * own path, so this is exact enough, and it replaces SVG.getPointAtLength: on a path that long
 * the native call cost seconds of main-thread time during a scroll.
 */
export function samplePath(d: string): Sample[] {
    const samples: Sample[] = [];
    let x = 0;
    let y = 0;
    let length = 0;
    const push = (nextX: number, nextY: number) => {
        length += Math.hypot(nextX - x, nextY - y);
        x = nextX;
        y = nextY;
        samples.push({ x, y, length });
    };

    for (const [, command, rest] of d.matchAll(/([MLC])([^MLC]*)/g)) {
        const numbers = rest!
            .trim()
            .split(/[\s,]+/)
            .map(Number);
        if (command === "M") {
            x = numbers[0]!;
            y = numbers[1]!;
            samples.push({ x, y, length });
        } else if (command === "L") {
            for (let i = 0; i + 1 < numbers.length; i += 2) {
                push(numbers[i]!, numbers[i + 1]!);
            }
        } else {
            for (let i = 0; i + 5 < numbers.length; i += 6) {
                const [x1, y1, x2, y2, x3, y3] = numbers.slice(i, i + 6) as [
                    number,
                    number,
                    number,
                    number,
                    number,
                    number,
                ];
                const x0 = x;
                const y0 = y;
                for (let step = 1; step <= CUBIC_STEPS; step += 1) {
                    const t = step / CUBIC_STEPS;
                    const u = 1 - t;
                    push(
                        u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
                        u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
                    );
                }
            }
        }
    }
    return samples;
}

/** Point at a given length along the sampled polyline (binary search, then interpolate). */
export function pointAt(samples: Sample[], target: number): { x: number; y: number } {
    let low = 0;
    let high = samples.length - 1;
    while (low < high) {
        const middle = (low + high) >> 1;
        if (samples[middle]!.length < target) {
            low = middle + 1;
        } else {
            high = middle;
        }
    }
    const after = samples[low]!;
    const before = samples[Math.max(0, low - 1)]!;
    const span = after.length - before.length;
    const ratio = span > 0 ? Math.max(0, Math.min(1, (target - before.length) / span)) : 0;
    return {
        x: before.x + (after.x - before.x) * ratio,
        y: before.y + (after.y - before.y) * ratio,
    };
}
