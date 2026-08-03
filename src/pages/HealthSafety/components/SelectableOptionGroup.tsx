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

  function renderNoteField(
    option: SelectableOption,
    mobile: boolean,
  ) {
    return (
      <div
        className={[
          "health-selected-option",
          mobile
            ? "health-selected-option--mobile"
            : "health-selected-option--desktop",
        ].join(" ")}
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
          htmlFor={
            mobile
              ? `health-option-mobile-${option.id}`
              : `health-option-${option.id}`
          }
        >
          {notesLabel}
        </label>

        <textarea
          id={
            mobile
              ? `health-option-mobile-${option.id}`
              : `health-option-${option.id}`
          }
          value={
            responses[option.id]?.notes ?? ""
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
    );
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
            <div
              key={option.id}
              className="health-option-chip-wrapper"
            >
              <button
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

              {isSelected &&
                renderNoteField(
                  option,
                  true,
                )}
            </div>
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
            <div key={option.id}>
              {renderNoteField(
                option,
                false,
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default SelectableOptionGroup;