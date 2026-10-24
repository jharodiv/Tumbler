import type { ReactNode } from "react";

interface FieldProps {
    label: string;
    htmlFor: string;
    required?: boolean;
    hint?: string;
    children: ReactNode;
    className?: string;
}

// Label + control + hint wrapper; the control itself is passed as children
export default function Field({ label, htmlFor, required, hint, children, className }: FieldProps) {
    return (
        <div className={`field ${className ?? ""}`}>
            <label className="field-label" htmlFor={htmlFor}>
                {label}
                {required && <span className="required" aria-hidden="true">*</span>}
            </label>
            {children}
            {hint && <span className="field-hint">{hint}</span>}
        </div>
    );
}
