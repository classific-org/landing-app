import { Alert } from "@sometic/react/overlay";
import { Link } from "react-router";
import type { SubmissionState } from "@/components/forms/EnquiryForm.hooks";

type FormStatusProps = {
    id: string;
    submission: SubmissionState;
    isConfigured: boolean;
    onReset: () => void;
};

export function FormStatus({ id, submission, isConfigured, onReset }: FormStatusProps) {
    if (submission.status === "sent") {
        return (
            <Alert
                id={id}
                tone="success"
                className="border border-rule bg-white px-5 py-4"
                data-testid="form-status-sent"
            >
                <p className="font-medium text-ink">Your enquiry has been received.</p>
                <p className="mt-1 text-small text-body">
                    The server confirmed delivery. We will reply to the email address you provided.
                </p>
                <button type="button" onClick={onReset} className="text-link mt-3 text-small">
                    Send another enquiry
                </button>
            </Alert>
        );
    }

    if (submission.status === "unavailable") {
        return (
            <Alert
                id={id}
                tone="warning"
                className="border border-rule bg-accent-tint px-5 py-4"
                data-testid="form-status-unavailable"
            >
                <p className="font-medium text-ink">The enquiry channel is not connected yet.</p>
                <p className="mt-1 text-small text-body">
                    Your details were validated but have not been sent anywhere, because no
                    submission endpoint is configured for this deployment. Please use the contact
                    details published on this site once available, or try again later.
                </p>
            </Alert>
        );
    }

    if (submission.status === "error") {
        return (
            <Alert
                id={id}
                tone="danger"
                className="border border-danger/40 bg-white px-5 py-4"
                data-testid="form-status-error"
            >
                <p className="font-medium text-ink">Something went wrong.</p>
                <p className="mt-1 text-small text-body">{submission.message}</p>
            </Alert>
        );
    }

    if (!isConfigured) {
        return (
            <p id={id} className="text-small text-body" data-testid="form-status-notice">
                Submissions are not connected in this environment. You can fill in the form to see
                validation, but nothing will be sent. See the{" "}
                <Link to="/privacy" className="text-link">
                    privacy policy
                </Link>{" "}
                for how enquiries are handled once live.
            </p>
        );
    }

    return <div id={id} aria-live="polite" className="sr-only" />;
}
