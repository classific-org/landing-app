import { describe, expect, it } from "vitest";
import { pointAt, samplePath } from "@/lib/thread/geometry";

describe("samplePath", () => {
    it("measures straight lines exactly, reading space-separated and decimal numbers", () => {
        const samples = samplePath("M10.5 20 L10.5 120.5 L110.5 120.5");
        expect(samples[0]).toEqual({ x: 10.5, y: 20, length: 0 });
        expect(samples.at(-1)!.length).toBeCloseTo(200.5, 5);
        // The regression this guards: coordinates must never parse to NaN.
        expect(samples.every((s) => Number.isFinite(s.x + s.y + s.length))).toBe(true);
    });

    it("handles negative coordinates and comma-separated numbers", () => {
        const samples = samplePath("M-5,-5 L-5,95");
        expect(samples.at(-1)).toEqual({ x: -5, y: 95, length: 100 });
    });

    it("samples cubic curves with monotonically increasing length", () => {
        const samples = samplePath("M0 0 C0 100 100 100 100 0");
        expect(samples.length).toBeGreaterThan(10);
        for (let i = 1; i < samples.length; i += 1) {
            expect(samples[i]!.length).toBeGreaterThanOrEqual(samples[i - 1]!.length);
        }
        const total = samples.at(-1)!.length;
        // A U-shaped cubic is longer than its chord (100) and shorter than its control polygon (300).
        expect(total).toBeGreaterThan(100);
        expect(total).toBeLessThan(300);
        expect(samples.at(-1)!.x).toBeCloseTo(100, 5);
        expect(samples.at(-1)!.y).toBeCloseTo(0, 5);
    });

    it("lets the scroll position find the head by y, as the thread does", () => {
        const samples = samplePath("M0 0 L0 500 L0 1000");
        const reached = samples.find((sample) => sample.y > 612);
        expect(reached).toBeDefined();
        expect(reached!.length).toBeCloseTo(1000, 0);
    });
});

describe("pointAt", () => {
    const samples = samplePath("M0 0 L0 100 L100 100");

    it("interpolates along the polyline", () => {
        expect(pointAt(samples, 50)).toEqual({ x: 0, y: 50 });
        expect(pointAt(samples, 150)).toEqual({ x: 50, y: 100 });
    });

    it("clamps to the ends", () => {
        expect(pointAt(samples, -10)).toEqual({ x: 0, y: 0 });
        expect(pointAt(samples, 1e6)).toEqual({ x: 100, y: 100 });
    });
});
