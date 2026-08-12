import {
  useId,
  type ChangeEvent,
  type ReactNode,
} from "react";

import "./RadioGroup.css";

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  value?: string;
  options: RadioOption[];
  onChange: (
    value: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

function RadioGroup({
  name,
  label,
  value,
  options,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = "",
}: RadioGroupProps) {
  const generatedId = useId();

  const groupLabelId = label
    ? `${generatedId}-label`
    : undefined;

  const helperId = helperText
    ? `${generatedId}-helper`
    : undefined;

  const errorId = error
    ? `${generatedId}-error`
    : undefined;

  const describedBy = [
    helperText && !error ? helperId : undefined,
    errorId,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <fieldset
      className={[
        "desrec-radio-group",
        error && "desrec-radio-group--error",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={groupLabelId}
      aria-describedby={
        describedBy || undefined
      }
      aria-invalid={Boolean(error)}
      disabled={disabled}
    >
      {label && (
        <legend
          id={groupLabelId}
          className="desrec-radio-group-label"
        >
          {label}

          {required && (
            <span
              className="desrec-radio-required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </legend>
      )}

      <div className="desrec-radio-options">
        {options.map((option, index) => {
          const optionId =
            `${generatedId}-${index}`;

          const descriptionId =
            option.description
              ? `${optionId}-description`
              : undefined;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={[
                "desrec-radio-option",
                value === option.value &&
                  "desrec-radio-option--selected",
                option.disabled &&
                  "desrec-radio-option--disabled",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                required={required}
                disabled={
                  disabled || option.disabled
                }
                aria-describedby={descriptionId}
                className="desrec-radio-input"
                onChange={(event) =>
                  onChange(
                    event.target.value,
                    event,
                  )
                }
              />

              <span className="desrec-radio-control">
                <span className="desrec-radio-dot" />
              </span>

              <span className="desrec-radio-text">
                <span className="desrec-radio-title">
                  {option.label}
                </span>

                {option.description && (
                  <span
                    id={descriptionId}
                    className="desrec-radio-description"
                  >
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {helperText && !error && (
        <p
          id={helperId}
          className="desrec-radio-helper"
        >
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="desrec-radio-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}

export default RadioGroup;

