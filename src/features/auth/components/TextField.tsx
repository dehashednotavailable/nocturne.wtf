import type { InputHTMLAttributes, ReactNode } from "react";
import { getInputClassName } from "../utils/input-class-name";

type TextFieldProps = {
  label: string;
  id: string;
  icon: ReactNode;
  error?: string;
  hint?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export default function TextField({
  label,
  id,
  icon,
  error,
  hint,
  className,
  ...inputProps
}: TextFieldProps) {
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="form-field">
      <div className="form-field-top">
        <label htmlFor={id} className="form-label">
          {label}
        </label>
        {hint && (
          <span id={`${id}-hint`} className="form-hint">
            {hint}
          </span>
        )}
      </div>

      <div className="input-wrapper">
        <span className="input-icon" aria-hidden="true">
          {icon}
        </span>
        <input
          id={id}
          className={getInputClassName(Boolean(error), className)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          {...inputProps}
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}
