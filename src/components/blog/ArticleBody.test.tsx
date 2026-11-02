import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { ArticleBody } from "@/components/blog/ArticleBody";
import type { ArticleBlock } from "@/types/content";

const renderBody = (blocks: ArticleBlock[]) =>
    render(
        <MemoryRouter>
            <ArticleBody blocks={blocks} />
        </MemoryRouter>,
    );

describe("ArticleBody", () => {
    it("renders plain blocks exactly as before", () => {
        renderBody([
            { type: "heading", level: 2, text: "Intro" },
            { type: "paragraph", text: "Plain text." },
            { type: "list", items: ["One", "Two"] },
        ]);
        expect(screen.getByRole("heading", { level: 2, name: "Intro" })).toBeInTheDocument();
        expect(screen.getByText("Plain text.")).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });

    it("renders bold, italic and links from formatted runs", () => {
        renderBody([
            {
                type: "paragraph",
                text: "See bold and site",
                inline: [
                    { text: "See " },
                    { text: "bold", bold: true },
                    { text: " and " },
                    { text: "site", href: "https://example.com" },
                ],
            },
        ]);
        expect(screen.getByText("bold").tagName).toBe("STRONG");
        const link = screen.getByRole("link", { name: "site" });
        expect(link).toHaveAttribute("href", "https://example.com");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(link).toHaveAttribute("target", "_blank");
    });

    it("uses a router link for site paths", () => {
        renderBody([
            { type: "paragraph", text: "Contact", inline: [{ text: "Contact", href: "/contact" }] },
        ]);
        const link = screen.getByRole("link", { name: "Contact" });
        expect(link).toHaveAttribute("href", "/contact");
        expect(link).not.toHaveAttribute("target");
    });

    it("renders numbered lists, and falls back to plain text without runs", () => {
        const { container } = renderBody([
            {
                type: "list",
                ordered: true,
                items: ["First", "Second"],
                itemsInline: [[{ text: "First", bold: true }]],
            },
        ]);
        expect(container.querySelector("ol")).not.toBeNull();
        expect(screen.getByText("First").tagName).toBe("STRONG");
        expect(screen.getByText("Second")).toBeInTheDocument();
    });

    it("renders an image with its caption", () => {
        renderBody([
            {
                type: "image",
                src: "https://cdn.example/a.png",
                alt: "A chart",
                caption: "Figure 1",
            },
        ]);
        expect(screen.getByRole("img", { name: "A chart" })).toHaveAttribute(
            "src",
            "https://cdn.example/a.png",
        );
        expect(screen.getByText("Figure 1")).toBeInTheDocument();
    });
});
