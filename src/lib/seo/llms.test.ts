import { describe, expect, it } from "vitest";
import { buildLlmsFullTxt, buildLlmsTxt } from "@/lib/seo/llms";

const ORIGIN = "https://www.classific.example";

describe("llms files", () => {
    it("lists public routes with absolute URLs", () => {
        const text = buildLlmsTxt(ORIGIN);
        expect(text).toContain("# Classific");
        expect(text).toContain(`${ORIGIN}/services/web-applications`);
        expect(text).toContain(`${ORIGIN}/insights/what-discovery-actually-decides`);
        expect(text).not.toContain("draft-measuring-engineering-outcomes");
        expect(text).not.toContain("localhost");
    });

    it("includes service, process, article and FAQ copy in the full file", () => {
        const text = buildLlmsFullTxt(ORIGIN);
        expect(text).toContain("Web Applications");
        expect(text).toContain("Discover");
        expect(text).toContain("No published case studies are available yet.");
        expect(text).toContain("What discovery actually decides");
        expect(text).toContain("How does a project with Classific start?");
        expect(text).not.toContain("Draft content. Not for publication.");
    });
});
