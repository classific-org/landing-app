import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { renderWithRouter } from "@/test/render";

describe("site header", () => {
    it("opens the mobile menu and closes it on Escape", async () => {
        const user = userEvent.setup();
        renderWithRouter(<SiteHeader />);
        expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "Open menu" }));
        expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
        await user.keyboard("{Escape}");
        expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
    });
});
