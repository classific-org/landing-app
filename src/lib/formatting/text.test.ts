import { describe, expect, it } from "vitest";
import {
    articleBlocksToText,
    countWords,
    estimateReadingMinutes,
    formatDate,
    formatReadingTime,
    padStep,
} from "@/lib/formatting/text";

describe("formatting helpers", () => {
    it("counts words and estimates reading time", () => {
        expect(countWords("")).toBe(0);
        expect(countWords("  one   two three ")).toBe(3);
        const blocks = [
            { type: "heading" as const, level: 2 as const, text: "Hello" },
            { type: "paragraph" as const, text: "A short paragraph." },
            { type: "list" as const, items: ["one", "two"] },
        ];
        expect(articleBlocksToText(blocks)).toContain("Hello");
        expect(articleBlocksToText(blocks)).toContain("one two");
        expect(estimateReadingMinutes(blocks)).toBe(1);
        expect(formatReadingTime(blocks)).toBe("1 min read");
    });

    it("formats dates and step numbers", () => {
        expect(formatDate("2026-02-10")).toBe("10 February 2026");
        expect(formatDate("not-a-date")).toBe("not-a-date");
        expect(padStep(1)).toBe("01");
        expect(padStep(12)).toBe("12");
    });
});
