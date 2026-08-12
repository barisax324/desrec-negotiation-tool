import {
  BODY_REGION_STATUS_OPTIONS,
  type BodyRegionStatus,
} from "../../data/bodyMapOptions";

import "./BodyMapLegend.css";

const STATUS_DESCRIPTIONS: Record<
  BodyRegionStatus,
  string
> = {
  fine: "No special considerations.",
  "ask-first":
    "Check in before interacting with this area.",
  sensitive:
    "Use additional care or lighter touch.",
  avoid:
    "Do not touch or use this area.",
  "medical-consideration":
    "A medical consideration exists. Read the notes.",
};

export default function BodyMapLegend() {
  return (
    <div
      className="body-map-legend"
      aria-label="Body-map status legend"
    >
      {BODY_REGION_STATUS_OPTIONS.map((option) => (
        <div
          key={option.id}
          className="body-map-legend-item"
        >
          <span
            className="body-map-legend-dot"
            style={{
              backgroundColor: option.color,
            }}
            aria-hidden="true"
          />

          <div>
            <strong>{option.label}</strong>

            <p>
              {STATUS_DESCRIPTIONS[option.id]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

