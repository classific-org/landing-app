import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { publishedWebProject } from "@/test/fixtures/projects";
import { renderWithRouter } from "@/test/render";

describe("project grid", () => {
    it("renders the honest empty state when nothing is published", () => {
        renderWithRouter(<ProjectGrid projects={[]} />);
        expect(screen.getByTestId("projects-empty")).toHaveTextContent(
            /no published projects yet/i,
        );
        expect(screen.queryByRole("link", { name: /operations portal/i })).not.toBeInTheDocument();
    });

    it("renders published project cards from fixtures", () => {
        renderWithRouter(<ProjectGrid projects={[publishedWebProject]} />);
        expect(screen.getByRole("link", { name: "Operations portal" })).toHaveAttribute(
            "href",
            "/work/operations-portal",
        );
    });
});
