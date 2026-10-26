import { describe, expect, it } from "vitest";
import { buildOgSvg } from "./og-svg.mjs";

describe("buildOgSvg", () => {
    it("embeds the title and default brand line", () => {
        const svg = buildOgSvg({ title: "Web Applications", eyebrow: "SERVICE" });
        expect(svg).toContain("Web Applications");
        expect(svg).toContain("SERVICE");
        expect(svg).toContain("Software for what's next.");
        expect(svg).toContain('width="1200"');
        expect(svg).toContain('height="630"');
    });

    it("escapes XML in titles", () => {
        const svg = buildOgSvg({ title: `A & B <C> "D"`, eyebrow: "X&Y" });
        expect(svg).toContain("A &amp; B &lt;C&gt; &quot;D&quot;");
        expect(svg).toContain("X&amp;Y");
        expect(svg).not.toContain("A & B <C>");
    });
});
