import {
  BODY_REGION_STATUS_OPTIONS,
  type BodyRegionStatus,
} from "../../data/bodyMapOptions";

import "./BodyRegionStatusPicker.css";

interface BodyRegionStatusPickerProps {
  selectedStatus?: BodyRegionStatus;
  onSelect: (status?: BodyRegionStatus) => void;
}

const POSITIONS = [
  { top: "9%", left: "50%" },
  { top: "31%", left: "84%" },
  { top: "72%", left: "71%" },
  { top: "72%", left: "29%" },
  { top: "31%", left: "16%" },
];

export default function BodyRegionStatusPicker({
  selectedStatus,
  onSelect,
}: BodyRegionStatusPickerProps) {
  return (
    <div
      className="status-wheel"
      role="group"
      aria-label="Body-region status"
    >
      {BODY_REGION_STATUS_OPTIONS.map(
        (option, index) => {
          const position = POSITIONS[index];

          return (
            <button
              key={option.id}
              type="button"
              className={`status-dot ${
                selectedStatus === option.id
                  ? "status-dot--selected"
                  : ""
              }`}
              style={{
                top: position?.top ?? "50%",
                left: position?.left ?? "50%",
                backgroundColor: option.color,
              }}
              aria-label={option.label}
              aria-pressed={
                selectedStatus === option.id
              }
              title={option.label}
              onClick={() => onSelect(option.id)}
            />
          );
        },
      )}

      <button
        type="button"
        className="status-clear"
        aria-label="Clear body-region status"
        onClick={() => onSelect(undefined)}
      >
        <span
          className="status-clear-icon"
          aria-hidden="true"
        >
          ✕
        </span>

        <span className="status-clear-label">
          Clear
        </span>
      </button>
    </div>
  );
}

