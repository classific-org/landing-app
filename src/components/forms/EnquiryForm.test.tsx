import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { renderWithRouter } from "@/test/render";
import type { EnquiryClient } from "@/services/contact/submit-enquiry";

const validMessage = "We need a customer portal that replaces a set of shared spreadsheets.";

function mockClient(result: Awaited<ReturnType<EnquiryClient["submit"]>>): EnquiryClient {
    return {
        isConfigured: result.status !== "unavailable",
        submit: vi.fn().mockResolvedValue(result),
    };
}

async function fillValidEnquiry(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText(/^name/i), "Alex Rivera");
    await user.type(screen.getByLabelText(/business email/i), "alex@company.com");
    fireEvent.change(screen.getByLabelText(/service interest/i), {
        target: { value: "web-applications" },
    });
    await user.type(screen.getByLabelText(/project description/i), validMessage);
    await user.click(screen.getByLabelText(/privacy policy/i));
}

describe("enquiry form", () => {
    it("shows accessible errors for required fields and a bad email", async () => {
        const user = userEvent.setup();
        renderWithRouter(<EnquiryForm />);
        await user.click(screen.getByTestId("enquiry-submit"));
        expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
        await user.type(screen.getByLabelText(/business email/i), "not-an-email");
        await user.click(screen.getByTestId("enquiry-submit"));
        expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
        expect(screen.queryByTestId("form-status-sent")).not.toBeInTheDocument();
    });

    it("never claims success when the enquiry channel is unavailable", async () => {
        const user = userEvent.setup();
        const client = mockClient({ status: "unavailable" });
        renderWithRouter(<EnquiryForm client={client} />);
        await fillValidEnquiry(user);
        await user.click(screen.getByTestId("enquiry-submit"));
        await waitFor(() => {
            expect(screen.getByTestId("form-status-unavailable")).toBeInTheDocument();
        });
        expect(screen.queryByTestId("form-status-sent")).not.toBeInTheDocument();
        expect(client.submit).toHaveBeenCalledOnce();
    });

    it("shows success only after the client confirms delivery", async () => {
        const user = userEvent.setup();
        const client = mockClient({ status: "sent" });
        renderWithRouter(<EnquiryForm client={client} />);
        await fillValidEnquiry(user);
        await user.click(screen.getByTestId("enquiry-submit"));
        await waitFor(() => {
            expect(screen.getByTestId("form-status-sent")).toBeInTheDocument();
        });
    });

    it("shows an error when the endpoint fails", async () => {
        const user = userEvent.setup();
        const client = mockClient({ status: "error", message: "Please try again." });
        renderWithRouter(<EnquiryForm client={client} />);
        await fillValidEnquiry(user);
        await user.click(screen.getByTestId("enquiry-submit"));
        await waitFor(() => {
            expect(screen.getByTestId("form-status-error")).toHaveTextContent(/try again/i);
        });
        expect(screen.queryByTestId("form-status-sent")).not.toBeInTheDocument();
    });
});
