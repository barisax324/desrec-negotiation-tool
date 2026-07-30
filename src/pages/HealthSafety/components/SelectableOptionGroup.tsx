import type {
  SelectableOption,
  SelectedOptionResponse,
  SelectedOptionResponses,
} from "../types";

interface SelectableOptionGroupProps {
  options: SelectableOption[];
  responses: SelectedOptionResponses;
  notesLabel?: string;
  onChange: (
    optionId: string,
    response: SelectedOptionResponse,
  ) => void;
}

function SelectableOptionGroup({
  options,
  responses,
  notesLabel = "Additional information (optional)",
  onChange,
}: SelectableOptionGroupProps) {
  function toggleOption(optionId: string) {
    const currentResponse = responses[optionId];

    onChange(optionId, {
      selected: !currentResponse?.selected,
      notes: currentResponse?.notes ?? "",
    });
  }

  function updateNotes(
    optionId: string,
    notes: string,
  ) {
    onChange(optionId, {
      selected: true,
      notes,
    });
  }

  return (
    <div className="health-option-group">
      <div className="health-option-chips">
        {options.map((option) => {
          const response =
            responses[option.id];

          const isSelected =
            response?.selected ?? false;

          return (
            <button
              key={option.id}
              type="button"
              className={[
                "health-option-chip",
                isSelected
                  ? "health-option-chip--selected"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={isSelected}
              onClick={() =>
                toggleOption(option.id)
              }
            >
              <span
                className="health-option-chip-icon"
                aria-hidden="true"
              >
                {isSelected ? "✓" : "+"}
              </span>

              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      <div className="health-selected-options">
        {options
          .filter(
            (option) =>
              responses[option.id]?.selected,
          )
          .map((option) => (
            <div
              key={option.id}
              className="health-selected-option"
            >
              <div className="health-selected-option-header">
                <h4>{option.label}</h4>

                <button
                  type="button"
                  className="health-remove-option"
                  onClick={() =>
                    toggleOption(option.id)
                  }
                  aria-label={`Remove ${option.label}`}
                >
                  Remove
                </button>
              </div>

              <label
                htmlFor={`health-option-${option.id}`}
              >
                {notesLabel}
              </label>

              <textarea
                id={`health-option-${option.id}`}
                value={
                  responses[option.id]
                    ?.notes ?? ""
                }
                onChange={(event) =>
                  updateNotes(
                    option.id,
                    event.target.value,
                  )
                }
                placeholder="Add anything your partner should know."
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default SelectableOptionGroup;