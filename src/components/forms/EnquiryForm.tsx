import { Link } from "react-router";
import { Input } from "@sometic/react/input";
import { Checkbox, Select } from "@sometic/react/selection";
import { Button } from "@sometic/react/button";
import { FormField } from "@/components/forms/FormField";
import { FormStatus } from "@/components/forms/FormStatus";
import { useEnquiryForm } from "@/components/forms/EnquiryForm.hooks";
import { MESSAGE_MIN_LENGTH } from "@/lib/validation/enquiry";
import type { EnquiryClient } from "@/services/contact/submit-enquiry";

type EnquiryFormProps = {
    client?: EnquiryClient;
};

export function EnquiryForm({ client }: EnquiryFormProps = {}) {
    const {
        fields,
        honeypot,
        serviceOptions,
        budgetOptions,
        submission,
        isConfigured,
        isSubmitting,
        statusId,
        handleSubmit,
        reset,
    } = useEnquiryForm(client);

    const sent = submission.status === "sent";

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            aria-describedby={statusId}
            className="grid gap-8"
            data-testid="enquiry-form"
        >
            {!sent ? (
                <>
                    <div className="grid gap-8 sm:grid-cols-2">
                        <FormField
                            ids={fields.name.ids}
                            label="Name"
                            required
                            error={fields.name.error}
                        >
                            <Input
                                fieldIds={fields.name.ids}
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                invalid={Boolean(fields.name.error)}
                                describedBy={fields.name.describedBy}
                                value={fields.name.value}
                                onValueChange={fields.name.setValue}
                                onBlur={fields.name.onBlur}
                                classes={{ root: "field-control" }}
                            />
                        </FormField>

                        <FormField
                            ids={fields.email.ids}
                            label="Business email"
                            required
                            error={fields.email.error}
                        >
                            <Input
                                fieldIds={fields.email.ids}
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                invalid={Boolean(fields.email.error)}
                                describedBy={fields.email.describedBy}
                                value={fields.email.value}
                                onValueChange={fields.email.setValue}
                                onBlur={fields.email.onBlur}
                                classes={{ root: "field-control" }}
                            />
                        </FormField>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2">
                        <FormField
                            ids={fields.company.ids}
                            label="Company"
                            description="Where you work or the business the project is for."
                            error={fields.company.error}
                        >
                            <Input
                                fieldIds={fields.company.ids}
                                name="company"
                                type="text"
                                autoComplete="organization"
                                invalid={Boolean(fields.company.error)}
                                describedBy={fields.company.describedBy}
                                value={fields.company.value}
                                onValueChange={fields.company.setValue}
                                onBlur={fields.company.onBlur}
                                classes={{ root: "field-control" }}
                            />
                        </FormField>

                        <FormField
                            ids={fields.service.ids}
                            label="Service interest"
                            required
                            error={fields.service.error}
                        >
                            <Select
                                id={fields.service.ids.id}
                                name="service"
                                required
                                invalid={Boolean(fields.service.error)}
                                aria-describedby={fields.service.describedBy}
                                aria-invalid={fields.service.error ? true : undefined}
                                value={fields.service.value}
                                options={[
                                    { value: "", label: "Select a service", disabled: true },
                                    ...serviceOptions,
                                ]}
                                onValueChange={(value) => fields.service.setValue(value ?? "")}
                                onBlur={fields.service.onBlur}
                                className="field-control"
                            />
                        </FormField>
                    </div>

                    <FormField
                        ids={fields.budget.ids}
                        label="Estimated budget"
                        description="A range helps us suggest a suitable scope."
                        error={fields.budget.error}
                    >
                        <Select
                            id={fields.budget.ids.id}
                            name="budget"
                            aria-describedby={fields.budget.describedBy}
                            value={fields.budget.value}
                            options={budgetOptions}
                            onValueChange={(value) => fields.budget.setValue(value ?? "")}
                            onBlur={fields.budget.onBlur}
                            className="field-control sm:max-w-sm"
                        />
                    </FormField>

                    <FormField
                        ids={fields.message.ids}
                        label="Project description"
                        description={`What are you trying to achieve, who is it for, and which systems are involved? At least ${MESSAGE_MIN_LENGTH} characters.`}
                        required
                        error={fields.message.error}
                    >
                        <textarea
                            id={fields.message.ids.id}
                            name="message"
                            required
                            aria-required="true"
                            aria-describedby={fields.message.describedBy}
                            aria-invalid={fields.message.error ? true : undefined}
                            value={fields.message.value}
                            onChange={(event) => fields.message.setValue(event.target.value)}
                            onBlur={fields.message.onBlur}
                            rows={7}
                            className="field-control"
                        />
                    </FormField>

                    <div>
                        <div className="flex items-start gap-3">
                            <Checkbox
                                id={fields.privacy.ids.id}
                                name="privacy"
                                required
                                invalid={Boolean(fields.privacy.error)}
                                aria-describedby={fields.privacy.describedBy}
                                aria-invalid={fields.privacy.error ? true : undefined}
                                checked={fields.privacy.value}
                                onCheckedChange={fields.privacy.setValue}
                                onBlur={fields.privacy.onBlur}
                                className="checkbox-control"
                            />
                            <label htmlFor={fields.privacy.ids.id} className="text-small text-body">
                                I have read the{" "}
                                <Link to="/privacy" className="text-link">
                                    privacy policy
                                </Link>{" "}
                                and agree to Classific storing these details to respond to my
                                enquiry.
                                <span className="ml-1 text-body" aria-hidden="true">
                                    *
                                </span>
                            </label>
                        </div>
                        {fields.privacy.error ? (
                            <p id={fields.privacy.ids.errorId} className="field-error" role="alert">
                                {fields.privacy.error}
                            </p>
                        ) : null}
                    </div>

                    <div className="hidden" aria-hidden="true">
                        <label htmlFor={honeypot.id}>Website</label>
                        <input
                            id={honeypot.id}
                            name={honeypot.name}
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                            value={honeypot.value}
                            onChange={(event) => honeypot.setValue(event.target.value)}
                        />
                    </div>
                </>
            ) : null}

            <FormStatus
                id={statusId}
                submission={submission}
                isConfigured={isConfigured}
                onReset={reset}
            />

            {!sent ? (
                <div className="flex flex-wrap items-center gap-4">
                    <Button
                        type="submit"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        classes={{ root: "btn btn-primary", loader: "sr-only" }}
                        data-testid="enquiry-submit"
                    >
                        {isSubmitting ? "Sending…" : "Send enquiry"}
                    </Button>
                    <p className="text-small text-body">
                        We reply by email. No newsletter, no automated follow-ups.
                    </p>
                </div>
            ) : null}
        </form>
    );
}
