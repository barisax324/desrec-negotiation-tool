import {
  useId,
  type InputHTMLAttributes,
} from "react";

import "./Checkbox.css";

interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
  > {
  label: string;
  description?: string;
  error?: string;
}

function Checkbox({
  label,
  description,
  error,
  id,
  className = "",
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  const descriptionId = description
    ? `${checkboxId}-description`
    : undefined;

  const errorId = error
    ? `${checkboxId}-error`
    : undefined;

  const describedBy = [
    descriptionId,
    errorId,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="desrec-checkbox-group">
      <label
        htmlFor={checkboxId}
        className="desrec-checkbox-label"
      >
        <input
          id={checkboxId}
          type="checkbox"
          className={[
            "desrec-checkbox",
            error && "desrec-checkbox--error",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={Boolean(error)}
          aria-describedby={
            describedBy || undefined
          }
          {...props}
        />

        <div className="desrec-checkbox-text">
          <span className="desrec-checkbox-title">
            {label}
          </span>

          {description && (
            <span
              id={descriptionId}
              className="desrec-checkbox-description"
            >
              {description}
            </span>
          )}
        </div>
      </label>

      {error && (
        <div
          id={errorId}
          className="desrec-checkbox-error"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default Checkbox;