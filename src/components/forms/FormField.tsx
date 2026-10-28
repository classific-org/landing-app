import { Field } from "@sometic/react/field";
import type { FieldIds } from "@sometic/dom/field";

type FormFieldProps = {
    ids: FieldIds;
    label: string;
    required?: boolean;
    description?: string;
    error?: string;
    children: React.ReactNode;
    className?: string;
};

/**
 * Every field has the same anatomy: label, control, then a helper line and any error beneath.
 * Keeping helper text below the control (rather than above it) is what lets fields in one row
 * share a baseline, whatever text each carries. The label is rendered here with React's htmlFor
 * so the association is explicit and free of DOM warnings.
 */
export function FormField({
    ids,
    label,
    required,
    description,
    error,
    children,
    className,
}: FormFieldProps) {
    return (
        <div className={["form-field", className].filter(Boolean).join(" ")}>
            <label id={ids.labelId} htmlFor={ids.id} className="field-label">
                {label}
                {required ? (
                    <span className="field-required" aria-hidden="true">
                        *
                    </span>
                ) : (
                    <span className="field-optional">Optional</span>
                )}
            </label>
            <Field
                ids={ids}
                required={required}
                invalid={Boolean(error)}
                classes={{ control: "block" }}
            >
                {children}
            </Field>
            {error ? (
                <p id={ids.errorId} className="field-error" role="alert">
                    {error}
                </p>
            ) : null}
            {description ? (
                <p id={ids.descriptionId} className="field-description">
                    {description}
                </p>
            ) : null}
        </div>
    );
}
