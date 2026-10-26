import { describe, expect, it } from "vitest";
import { processStages } from "@/data/process";

describe("process stages", () => {
    it("defines five named stages without guaranteed timelines", () => {
        expect(processStages.map((stage) => stage.title)).toEqual([
            "Discover",
            "Plan",
            "Design",
            "Develop",
            "Launch",
        ]);
        expect(processStages.every((stage) => stage.clientProvides.length > 0)).toBe(true);
        expect(JSON.stringify(processStages)).not.toMatch(/guaranteed delivery/i);
    });
});
