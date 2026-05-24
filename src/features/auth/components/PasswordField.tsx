import { Eye, EyeSlash, Lock } from "@phosphor-icons/react";
import { useState, type InputHTMLAttributes } from "react";
import { getInputClassName } from "../utils/input-class-name";

type PasswordFieldProps = {
  label: string;
  id: string;
  error?: string;
  hint?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type">;

export default function PasswordField({
  label,
  id,
  error,
  hint,
  className,
  ...inputProps
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
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
          <Lock size={18} />
        </span>
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          className={getInputClassName(
            Boolean(error),
            `form-input-password ${className ?? ""}`,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          {...inputProps}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setIsVisible((currentValue) => !currentValue)}
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}
