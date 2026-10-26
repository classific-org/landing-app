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
 * Label plus Sometic Field (description, control and error slots). The label is rendered
 * here with React's htmlFor so the association is explicit and free of DOM warnings.
 */
export function FormField({ ids, label, required, description, error, children, className }: FormFieldProps) {
    return (
        <div className={className}>
            <label id={ids.labelId} htmlFor={ids.id} className="field-label">
                {label}
                {required ? (
                    <span className="ml-1 text-body" aria-hidden="true">
                        *
                    </span>
                ) : (
                    <span className="ml-2 text-small font-normal text-body">Optional</span>
                )}
            </label>
            <Field
                ids={ids}
                required={required}
                invalid={Boolean(error)}
                description={description}
                classes={{ description: "field-description", control: "block" }}
            >
                {children}
            </Field>
            {error ? (
                <p id={ids.errorId} className="field-error" role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
