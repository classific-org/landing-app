import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useForm, useFormField, useFormState } from "@sometic/react/form";
import type { FieldIds } from "@sometic/dom/field";
import type { FieldMeta, FormController } from "@sometic/forms";
import {
    BUDGET_OPTIONS,
    SERVICE_OPTIONS,
    defaultEnquiryValues,
    enquiryValidators,
    type EnquiryValues,
} from "@/lib/validation/enquiry";
import { getEnquiryClient } from "@/services/contact/enquiry-client";
import type { EnquiryClient, SubmitEnquiryResult } from "@/services/contact/submit-enquiry";

export type SubmissionState =
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "sent" }
    | { status: "unavailable" }
    | { status: "error"; message: string };

export type EnquiryFieldName = keyof Omit<EnquiryValues, "website">;

export type EnquiryFieldModel<TValue> = {
    name: EnquiryFieldName;
    ids: FieldIds;
    value: TValue;
    meta: FieldMeta;
    error: string | undefined;
    describedBy: string | undefined;
    setValue: (value: TValue) => void;
    onBlur: () => void;
};

export type EnquiryFormViewModel = {
    fields: {
        name: EnquiryFieldModel<string>;
        email: EnquiryFieldModel<string>;
        company: EnquiryFieldModel<string>;
        service: EnquiryFieldModel<string>;
        budget: EnquiryFieldModel<string>;
        message: EnquiryFieldModel<string>;
        privacy: EnquiryFieldModel<boolean>;
    };
    honeypot: { name: "website"; id: string; value: string; setValue: (value: string) => void };
    serviceOptions: typeof SERVICE_OPTIONS;
    budgetOptions: typeof BUDGET_OPTIONS;
    submission: SubmissionState;
    isConfigured: boolean;
    isSubmitting: boolean;
    submitCount: number;
    statusId: string;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    reset: () => void;
};

export function mapResultToSubmission(result: SubmitEnquiryResult): SubmissionState {
    switch (result.status) {
        case "sent":
            return { status: "sent" };
        case "unavailable":
            return { status: "unavailable" };
        case "error":
            return { status: "error", message: result.message };
        case "invalid":
            return {
                status: "error",
                message: "Please correct the highlighted fields and try again.",
            };
    }
}

type GenericForm = FormController<Record<string, unknown>>;

/**
 * Sometic's React field hooks are typed against FormController<Record<string, unknown>>,
 * which is invariant in its value type. The enquiry controller is created with the
 * concrete EnquiryValues type, so it is widened here once instead of at every call site.
 */
function asGenericForm(form: FormController<EnquiryValues>): GenericForm {
    return form as unknown as GenericForm;
}

function buildIds(prefix: string, name: string): FieldIds {
    const base = `${prefix}${name}`;
    return {
        id: `${base}-input`,
        labelId: `${base}-label`,
        descriptionId: `${base}-description`,
        errorId: `${base}-error`,
    };
}

function useEnquiryField<TValue>(
    name: EnquiryFieldName,
    prefix: string,
    form: GenericForm,
    submitCount: number,
    options: { hasDescription?: boolean; validateOn?: "onBlur" | "onChange" } = {},
): EnquiryFieldModel<TValue> {
    const ids = useMemo(() => buildIds(prefix, name), [prefix, name]);
    const field = useFormField(
        name,
        { validators: enquiryValidators[name], validateOn: options.validateOn ?? "onBlur" },
        form,
    );
    const showError = field.meta.touched || submitCount > 0;
    const error = showError ? field.meta.error : undefined;
    const describedBy =
        [options.hasDescription ? ids.descriptionId : undefined, error ? ids.errorId : undefined]
            .filter(Boolean)
            .join(" ") || undefined;

    return {
        name,
        ids,
        value: field.value as TValue,
        meta: field.meta,
        error,
        describedBy,
        setValue: (value: TValue) => field.setValue(value),
        onBlur: field.onBlur,
    };
}

export function useEnquiryForm(client: EnquiryClient = getEnquiryClient()): EnquiryFormViewModel {
    const prefix = useId();
    const statusId = `${prefix}status`;
    const form = useForm<EnquiryValues>({
        defaultValues: defaultEnquiryValues,
        validationMode: "onSubmit",
    });
    const genericForm = asGenericForm(form);
    const { meta } = useFormState(genericForm);
    const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });
    const abortRef = useRef<AbortController | null>(null);
    const submitCount = meta.submitCount;

    const name = useEnquiryField<string>("name", prefix, genericForm, submitCount);
    const email = useEnquiryField<string>("email", prefix, genericForm, submitCount);
    const company = useEnquiryField<string>("company", prefix, genericForm, submitCount, {
        hasDescription: true,
    });
    const service = useEnquiryField<string>("service", prefix, genericForm, submitCount, {
        validateOn: "onChange",
    });
    const budget = useEnquiryField<string>("budget", prefix, genericForm, submitCount, {
        hasDescription: true,
        validateOn: "onChange",
    });
    const message = useEnquiryField<string>("message", prefix, genericForm, submitCount, {
        hasDescription: true,
    });
    const privacy = useEnquiryField<boolean>("privacy", prefix, genericForm, submitCount, {
        validateOn: "onChange",
    });

    const honeypotField = useFormField("website", {}, genericForm);

    useEffect(() => {
        return () => {
            abortRef.current?.abort();
        };
    }, []);

    const submit = useMemo(
        () =>
            form.handleSubmit({
                onValid: async (values) => {
                    abortRef.current?.abort();
                    const controller = new AbortController();
                    abortRef.current = controller;
                    setSubmission({ status: "submitting" });
                    const result = await client.submit(values, controller.signal);
                    if (controller.signal.aborted) {
                        return;
                    }
                    setSubmission(mapResultToSubmission(result));
                    if (result.status === "sent") {
                        form.reset();
                    }
                },
                onInvalid: () => {
                    setSubmission({ status: "idle" });
                },
            }),
        [client, form],
    );

    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            void submit();
        },
        [submit],
    );

    const reset = useCallback(() => {
        form.reset();
        setSubmission({ status: "idle" });
    }, [form]);

    return {
        fields: { name, email, company, service, budget, message, privacy },
        honeypot: {
            name: "website",
            id: `${prefix}website`,
            value: String(honeypotField.value ?? ""),
            setValue: (value: string) => honeypotField.setValue(value),
        },
        serviceOptions: SERVICE_OPTIONS,
        budgetOptions: BUDGET_OPTIONS,
        submission,
        isConfigured: client.isConfigured,
        isSubmitting: submission.status === "submitting" || meta.submitting,
        submitCount: meta.submitCount,
        statusId,
        handleSubmit,
        reset,
    };
}
