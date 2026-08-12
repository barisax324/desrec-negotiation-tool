import {
  useId,
  type TextareaHTMLAttributes,
} from "react";

import "./Textarea.css";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

function Textarea({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  const helperId = helperText
    ? `${textareaId}-helper`
    : undefined;

  const errorId = error
    ? `${textareaId}-error`
    : undefined;

  const describedBy = error
    ? errorId
    : helperId;

  return (
    <div className="desrec-textarea-group">
      {label && (
        <label
          htmlFor={textareaId}
          className="desrec-textarea-label"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        className={[
          "desrec-textarea",
          error && "desrec-textarea--error",
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
          className="desrec-textarea-helper"
        >
          {helperText}
        </div>
      )}

      {error && (
        <div
          id={errorId}
          className="desrec-textarea-error"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default Textarea;

