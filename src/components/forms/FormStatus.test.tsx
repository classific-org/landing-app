import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { FormStatus } from "@/components/forms/FormStatus";
import { renderWithRouter } from "@/test/render";

describe("form status", () => {
    it("renders a confirmed delivery message", () => {
        renderWithRouter(
            <FormStatus id="status" submission={{ status: "sent" }} isConfigured onReset={vi.fn()} />,
        );
        expect(screen.getByTestId("form-status-sent")).toHaveTextContent(/received/i);
    });

    it("explains that an unconfigured channel has not sent the enquiry", () => {
        renderWithRouter(
            <FormStatus
                id="status"
                submission={{ status: "unavailable" }}
                isConfigured={false}
                onReset={vi.fn()}
            />,
        );
        expect(screen.getByTestId("form-status-unavailable")).toHaveTextContent(/not connected/i);
        expect(screen.getByTestId("form-status-unavailable")).not.toHaveTextContent(/has been sent/i);
    });

    it("renders a generic error without claiming success", () => {
        renderWithRouter(
            <FormStatus
                id="status"
                submission={{ status: "error", message: "Try again." }}
                isConfigured
                onReset={vi.fn()}
            />,
        );
        expect(screen.getByTestId("form-status-error")).toHaveTextContent("Try again.");
        expect(screen.queryByTestId("form-status-sent")).not.toBeInTheDocument();
    });

    it("warns on idle when no endpoint is configured", () => {
        renderWithRouter(
            <FormStatus id="status" submission={{ status: "idle" }} isConfigured={false} onReset={vi.fn()} />,
        );
        expect(screen.getByTestId("form-status-notice")).toHaveTextContent(/not connected/i);
    });
});
