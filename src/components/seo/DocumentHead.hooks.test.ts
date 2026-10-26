import { describe, expect, it } from "vitest";
import { resolveHeadPatchForPath } from "@/components/seo/DocumentHead.hooks";

const ORIGIN = "https://www.classific.example";

describe("document head resolution", () => {
    it("uses route metadata for public pages and noindex for unknown paths", () => {
        const about = resolveHeadPatchForPath("/about", ORIGIN);
        expect(about.title).toBe("About");
        const missing = resolveHeadPatchForPath("/does-not-exist", ORIGIN);
        expect(missing.title).toBe("Page not found");
        expect(missing.meta?.some((item) => item.content?.includes("noindex"))).toBe(true);
    });
});
