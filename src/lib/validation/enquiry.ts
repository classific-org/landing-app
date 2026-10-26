import {
    custom,
    email,
    maxLength,
    minLength,
    oneOf,
    pipe,
    required,
    runValidators,
    type ValidationIssue,
    type Validator,
} from "@sometic/validation";
import { services } from "@/data/services";

export type EnquiryValues = {
    name: string;
    email: string;
    company: string;
    service: string;
    budget: string;
    message: string;
    privacy: boolean;
    /** Honeypot. Real users never fill this; it is removed before submission. */
    website: string;
};

export type EnquiryPayload = Omit<EnquiryValues, "website" | "privacy"> & {
    privacyAccepted: true;
    submittedAt: string;
};

export const SERVICE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
    ...services.map((service) => ({ value: service.slug, label: service.title })),
    { value: "not-sure", label: "Not sure yet" },
];

export const BUDGET_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
    { value: "", label: "Prefer not to say" },
    { value: "under-25k", label: "Under 25,000" },
    { value: "25k-50k", label: "25,000 to 50,000" },
    { value: "50k-100k", label: "50,000 to 100,000" },
    { value: "100k-plus", label: "More than 100,000" },
];

export const MESSAGE_MIN_LENGTH = 30;
export const MESSAGE_MAX_LENGTH = 4000;

export const defaultEnquiryValues: EnquiryValues = {
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
    privacy: false,
    website: "",
};

const serviceValues = SERVICE_OPTIONS.map((option) => option.value);
const budgetValues = BUDGET_OPTIONS.map((option) => option.value);

export const enquiryValidators: Record<keyof Omit<EnquiryValues, "website">, readonly Validator[]> = {
    name: [pipe(required("Please enter your name."), maxLength(120, "Name is too long."))],
    email: [
        pipe(
            required("Please enter your business email."),
            email("Enter a valid email address, like name@company.com."),
            maxLength(254, "Email is too long."),
        ),
    ],
    company: [maxLength(160, "Company name is too long.")],
    service: [
        pipe(
            required("Choose the service you are interested in."),
            oneOf(serviceValues, "Choose one of the listed services."),
        ),
    ],
    budget: [oneOf(budgetValues, "Choose one of the listed budget ranges.")],
    message: [
        pipe(
            required("Tell us a little about the project."),
            minLength(
                MESSAGE_MIN_LENGTH,
                `Please add a few more details (at least ${MESSAGE_MIN_LENGTH} characters).`,
            ),
            maxLength(MESSAGE_MAX_LENGTH, "Please shorten the description."),
        ),
    ],
    privacy: [
        custom(
            (value) => value === true,
            "Please confirm you have read the privacy policy.",
            "privacy-required",
        ),
    ],
};

export function isHoneypotTriggered(values: Pick<EnquiryValues, "website">): boolean {
    return values.website.trim().length > 0;
}

export async function validateEnquiry(values: EnquiryValues): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    for (const [path, validators] of Object.entries(enquiryValidators)) {
        const result = await runValidators(validators, values[path as keyof EnquiryValues], {
            path,
            values,
        });
        issues.push(...result.issues.map((issue) => ({ ...issue, path: issue.path ?? path })));
    }
    return issues;
}

export function toEnquiryPayload(values: EnquiryValues, now: () => Date = () => new Date()): EnquiryPayload {
    return {
        name: values.name.trim(),
        email: values.email.trim(),
        company: values.company.trim(),
        service: values.service,
        budget: values.budget,
        message: values.message.trim(),
        privacyAccepted: true,
        submittedAt: now().toISOString(),
    };
}
