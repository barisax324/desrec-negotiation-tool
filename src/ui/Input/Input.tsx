import {
  useId,
  type InputHTMLAttributes,
} from "react";

import "./Input.css";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

function Input({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const helperId = helperText
    ? `${inputId}-helper`
    : undefined;

  const errorId = error
    ? `${inputId}-error`
    : undefined;

  const describedBy = error
    ? errorId
    : helperId;

  return (
    <div className="desrec-input-group">
      {label && (
        <label
          htmlFor={inputId}
          className="desrec-input-label"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={[
          "desrec-input",
          error && "desrec-input--error",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      />

      {helperText && !error && (
        <div
          id={helperId}
          className="desrec-input-helper"
        >
          {helperText}
        </div>
      )}

      {error && (
        <div
          id={errorId}
          className="desrec-input-error"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default Input;