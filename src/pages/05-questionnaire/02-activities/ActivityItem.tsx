import { useState } from "react";
import HardLimitModal from "./HardLimitModal";
import type {
  ActivityDefinition,
  ActivityResponse,
  ActivityScaleLevel,
} from "./types";

interface ActivityItemProps {
  activity: ActivityDefinition;
  response: ActivityResponse;
  onChange: (
    response: ActivityResponse,
  ) => void;
}

const INTEREST_LABELS: Record<
  ActivityScaleLevel,
  string
> = {
  1: "No Interest",
  2: "Little Interest",
  3: "Some Interest",
  4: "Interested",
  5: "Very Interested",
};

const EXPERIENCE_LABELS: Record<
  ActivityScaleLevel,
  string
> = {
  1: "No Experience",
  2: "Little Experience",
  3: "Some Experience",
  4: "Experienced",
  5: "Very Experienced",
};

function ActivityItem({
  activity,
  response,
  onChange,
}: ActivityItemProps) {
  const [
    showHardLimitModal,
    setShowHardLimitModal,
  ] = useState(false);

  /*
   * The range input requires a numeric value.
   * Its thumb is hidden until an answer has
   * actually been selected.
   */
const interestSliderValue =
  response.interest ?? 1;

const experienceSliderValue =
  response.experience ?? 1;

const shouldShowNotes = true;

  function updateResponse(
    updates: Partial<ActivityResponse>,
  ) {
    onChange({
      ...response,
      ...updates,
    });
  }

function selectInterest(
  interest: ActivityScaleLevel,
) {
      if (response.hardLimit) {
      return;
    }

    updateResponse({
      interest,
    });
  }

function handleInterestSliderChange(
  value: number,
) {
  selectInterest(
    value as ActivityScaleLevel,
  );
}

function selectExperience(
  experience: ActivityScaleLevel,
) {
  if (response.hardLimit) {
    return;
  }

  updateResponse({
    experience,
  });
}

function handleExperienceSliderChange(
  value: number,
) {
  selectExperience(
    value as ActivityScaleLevel,
  );
}

  /*
   * This allows the first slider position to
   * be selected even while the hidden thumb is
   * already resting there.
   */
function handleInterestSliderPointerDown(
  event: React.PointerEvent<HTMLInputElement>,
) {
  if (
    response.hardLimit ||
    response.interest !== null
  ) {
    return;
  }

  const slider =
    event.currentTarget.getBoundingClientRect();

  const pointerPosition =
    event.clientX - slider.left;

  const percentage =
    pointerPosition / slider.width;

  const calculatedValue = Math.round(
    1 + percentage * 4,
  );

  const interest = Math.min(
    5,
    Math.max(1, calculatedValue),
  ) as ActivityScaleLevel;

  selectInterest(interest);
}

function handleExperienceSliderPointerDown(
  event: React.PointerEvent<HTMLInputElement>,
) {
  if (
    response.hardLimit ||
    response.experience !== null
  ) {
    return;
  }

  const slider =
    event.currentTarget.getBoundingClientRect();

  const pointerPosition =
    event.clientX - slider.left;

  const percentage =
    pointerPosition / slider.width;

  const calculatedValue = Math.round(
    1 + percentage * 4,
  );

  const experience = Math.min(
    5,
    Math.max(1, calculatedValue),
  ) as ActivityScaleLevel;

  selectExperience(experience);
}

  function handleHardLimitCheckbox() {
    setShowHardLimitModal(true);
  }

function confirmHardLimitChange() {
  updateResponse({
    hardLimit: !response.hardLimit,
  });

  setShowHardLimitModal(false);
}

  if (activity.id === "other-notes") {
    return (
      <article className="activity-item">
        <div className="activity-item-header">
          <h3 className="activity-item-title">
            Additional Notes
          </h3>
        </div>

        <div className="activity-notes">
          <label htmlFor="other-notes">
            Is there anything not covered above
            that you&apos;d like your partner to
            know or discuss?
          </label>

          <textarea
            id="other-notes"
            value={response.notes}
            placeholder="Add anything else you'd like your partner to know..."
            onChange={(event) =>
              updateResponse({
                notes: event.target.value,
              })
            }
          />
        </div>
      </article>
    );
  }

  return (
    <>
      <article
        className={`activity-item${
          response.hardLimit
            ? " activity-item--hard-limit"
            : ""
        }`}
      >
        <div className="activity-item-header">
          <h3 className="activity-item-title">
            {activity.label}
          </h3>

          {response.hardLimit && (
            <span className="activity-hard-limit-badge">
              ✕ Hard Limit
            </span>
          )}
        </div>

        <div
          className={`activity-slider-section${
            response.hardLimit
              ? " activity-slider-section--hard-limit"
              : ""
          }${
            response.interest === null
              ? " activity-slider-section--unselected"
              : ""
          }`}
        >
          <div className="activity-slider-heading">
            Interest
          </div>

          <div
            className="activity-slider-labels"
            aria-hidden="true"
          >
            {(Object.entries(
              INTEREST_LABELS,
            ) as [
              string,
              string,
            ][]).map(([value, label]) => (
              <span
                key={value}
                className={`activity-slider-label${
                  response.interest ===
                  Number(value)
                    ? " activity-slider-label--selected"
                    : ""
                }`}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="activity-slider-control">
            <input
              className="activity-slider"
              type="range"
              min="1"
              max="5"
              step="1"
              value={interestSliderValue}
              disabled={response.hardLimit}
              aria-label={`${activity.label} interest level`}
              aria-valuetext={
                response.interest === null
                  ? "Not selected"
                  : INTEREST_LABELS[
                      response.interest
                    ]
              }
              onPointerDown={
                handleInterestSliderPointerDown
              }
              onChange={(event) =>
                handleInterestSliderChange(
                  Number(
                    event.target.value,
                  ),
                )
              }
            />

            <div
              className="activity-slider-ticks"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            {response.hardLimit && (
              <span
                className="activity-slider-red-x"
                aria-hidden="true"
              >
                ✕
              </span>
            )}
          </div>

          <div
            className="activity-slider-value"
            aria-live="polite"
          >
            {response.hardLimit
              ? "Hard Limit"
              : response.interest === null
                ? "Not selected"
                : `Selected: ${
                    INTEREST_LABELS[
                      response.interest
                    ]
                  }`}
          </div>
        </div>

        <div
          className={`activity-slider-section${
            response.hardLimit
              ? " activity-slider-section--hard-limit"
              : ""
          }${
            response.experience === null
              ? " activity-slider-section--unselected"
              : ""
          }`}
        >
          <div className="activity-slider-heading">
            Experience
          </div>

          <div
            className="activity-slider-labels"
            aria-hidden="true"
          >
            {(Object.entries(
              EXPERIENCE_LABELS,
            ) as [
              string,
              string,
            ][]).map(([value, label]) => (
              <span
                key={value}
                className={`activity-slider-label${
                  response.experience ===
                  Number(value)
                    ? " activity-slider-label--selected"
                    : ""
                }`}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="activity-slider-control">
            <input
              className="activity-slider"
              type="range"
              min="1"
              max="5"
              step="1"
              value={experienceSliderValue}
              disabled={response.hardLimit}
              aria-label={`${activity.label} experience level`}
              aria-valuetext={
                response.experience === null
                  ? "Not selected"
                  : EXPERIENCE_LABELS[
                      response.experience
                    ]
              }
              onPointerDown={
                handleExperienceSliderPointerDown
              }
              onChange={(event) =>
                handleExperienceSliderChange(
                  Number(
                    event.target.value,
                  ),
                )
              }
            />

            <div
              className="activity-slider-ticks"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            {response.hardLimit && (
              <span
                className="activity-slider-red-x"
                aria-hidden="true"
              >
                ✕
              </span>
            )}
          </div>

          <div
            className="activity-slider-value"
            aria-live="polite"
          >
            {response.hardLimit
              ? "Hard Limit"
              : response.experience === null
                ? "Not selected"
                : `Selected: ${
                    EXPERIENCE_LABELS[
                      response.experience
                    ]
                  }`}
          </div>
        </div>

        <div className="activity-options">
          <label className="activity-option">
            <input
              type="checkbox"
              checked={
                response.hasLimitsOrBoundaries
              }
              disabled={response.hardLimit}
              onChange={(event) =>
                updateResponse({
                  hasLimitsOrBoundaries:
                    event.target.checked,
                })
              }
            />

            <span>
              Limits / Boundaries
            </span>
          </label>

          <label className="activity-option activity-option--hard-limit">
            <input
              type="checkbox"
              checked={response.hardLimit}
              onChange={
                handleHardLimitCheckbox
              }
            />

            <span>Hard Limit</span>
          </label>
        </div>

        {response.hasLimitsOrBoundaries &&
          !response.hardLimit && (
            <div className="activity-notes">
              <label
                htmlFor={`${activity.id}-limits`}
              >
                Limits / Boundaries
              </label>

              <p className="activity-notes-help">
                Add any limits, boundaries,
                conditions, or specific ways
                you are comfortable approaching
                this activity.
              </p>

              <textarea
                id={`${activity.id}-limits`}
                value={
                  response.limitsOrBoundariesNotes
                }
                placeholder="Optional details..."
                onChange={(event) =>
                  updateResponse({
                    limitsOrBoundariesNotes:
                      event.target.value,
                  })
                }
              />
            </div>
          )}

        {shouldShowNotes && (
          <div className="activity-notes">
            <label
              htmlFor={`${activity.id}-notes`}
            >
              Notes
            </label>

            <textarea
              id={`${activity.id}-notes`}
              value={response.notes}
              placeholder="Add anything you want your partner to know."
              onChange={(event) =>
                updateResponse({
                  notes: event.target.value,
                })
              }
            />
          </div>
        )}
      </article>

      {showHardLimitModal && (
        <HardLimitModal
          activityLabel={activity.label}
          isRemoving={response.hardLimit}
          onCancel={() =>
            setShowHardLimitModal(false)
          }
          onConfirm={
            confirmHardLimitChange
          }
        />
      )}
    </>
  );
}

export default ActivityItem;

