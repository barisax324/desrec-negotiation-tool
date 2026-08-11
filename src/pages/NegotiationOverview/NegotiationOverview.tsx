import {
  useEffect,
  useState,
} from "react";

import "./NegotiationOverview.css";

interface NegotiationOverviewValues {
  negotiationName: string | null;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  plannedActivities: string;
}

interface NegotiationOverviewProps {
  negotiationName: string | null;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  plannedActivities: string | null;
  isSaving: boolean;
  saveError: string;
  initiallyEditing?: boolean;
  onEditComplete?: () => void;
  onBack: () => void;
  onContinue: () => void;
  onSave: (
    values: NegotiationOverviewValues,
  ) => Promise<boolean>;
}

function getTodayDate() {
  const today = new Date();
  const timezoneOffset =
    today.getTimezoneOffset() * 60_000;

  return new Date(
    today.getTime() - timezoneOffset,
  )
    .toISOString()
    .split("T")[0];
}

function formatSceneDate(
  sceneDate: string | null,
  undecided: boolean,
) {
  if (undecided || !sceneDate) {
    return "Not decided yet";
  }

  const [year, month, day] = sceneDate
    .split("-")
    .map(Number);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(
    new Date(year, month - 1, day),
  );
}

export default function NegotiationOverview({
  negotiationName,
  sceneDate,
  sceneDateUnknown,
plannedActivities,
isSaving,
saveError,
initiallyEditing = false,
onEditComplete,
onBack,
  onContinue,
  onSave,
}: NegotiationOverviewProps) {
const [isEditing, setIsEditing] =
  useState(initiallyEditing);

  const [draftName, setDraftName] =
    useState(negotiationName ?? "");

  const [draftSceneDate, setDraftSceneDate] =
    useState(sceneDate ?? "");

  const [
    draftSceneDateUnknown,
    setDraftSceneDateUnknown,
  ] = useState(sceneDateUnknown);

  const [
    draftPlannedActivities,
    setDraftPlannedActivities,
  ] = useState(plannedActivities ?? "");

  const [validationError, setValidationError] =
    useState("");

  const today = getTodayDate();

  useEffect(() => {
    setDraftName(negotiationName ?? "");
    setDraftSceneDate(sceneDate ?? "");
    setDraftSceneDateUnknown(
      sceneDateUnknown,
    );
    setDraftPlannedActivities(
      plannedActivities ?? "",
    );
  }, [
    negotiationName,
    sceneDate,
    sceneDateUnknown,
    plannedActivities,
  ]);

  function openEditor() {
    setDraftName(negotiationName ?? "");
    setDraftSceneDate(sceneDate ?? "");
    setDraftSceneDateUnknown(
      sceneDateUnknown,
    );
    setDraftPlannedActivities(
      plannedActivities ?? "",
    );
    setValidationError("");
    setIsEditing(true);
  }

function closeEditor() {
  if (isSaving) {
    return;
  }

  setValidationError("");
  setIsEditing(false);

  if (initiallyEditing) {
    onEditComplete?.();
  }
}

  function handleUndecidedChange(
    checked: boolean,
  ) {
    setDraftSceneDateUnknown(checked);
    setValidationError("");

    if (checked) {
      setDraftSceneDate("");
    }
  }

async function handleSave() {
  if (isSaving) {
    return;
  }

  const trimmedName = draftName.trim();
  const trimmedActivities =
    draftPlannedActivities.trim();

  if (
    !draftSceneDate &&
    !draftSceneDateUnknown
  ) {
    setValidationError(
      "Choose a planned scene date or select Not decided yet.",
    );
    return;
  }

  if (!trimmedActivities) {
    setValidationError(
      "Planned scene activities are required.",
    );
    return;
  }

  setValidationError("");

  try {
    const saved = await onSave({
      negotiationName:
        trimmedName || null,
      sceneDate:
        draftSceneDateUnknown
          ? null
          : draftSceneDate,
      sceneDateUnknown:
        draftSceneDateUnknown,
      plannedActivities:
        trimmedActivities,
    });

    if (!saved) {
      setValidationError(
        "The changes could not be saved. Please try again.",
      );
      return;
    }

setIsEditing(false);

if (initiallyEditing) {
  onEditComplete?.();
}
  } catch (error) {
    console.error(
      "Scene overview save error:",
      error,
    );

    setValidationError(
      error instanceof Error
        ? error.message
        : "The changes could not be saved.",
    );
  }
}

  return (
    <main className="overview-page">
      <div className="overview-card">
        <p className="overview-step">
          ✣ Review the scene
        </p>

<h1>Scene Details</h1>

        <p className="overview-description">
          Review the information your scene partner provided before
          beginning the questionnaire.
        </p>

        <section className="overview-section">
          <h2>Negotiation Name</h2>

          <p>
            {negotiationName ||
              "No negotiation name provided."}
          </p>
        </section>

        <section className="overview-section">
          <h2>Scene Date</h2>

          <p>
            {formatSceneDate(
              sceneDate,
              sceneDateUnknown,
            )}
          </p>
        </section>

        <section className="overview-section">
          <h2>Planned Activities</h2>

          <p>
            {plannedActivities ||
              "No planned activities were provided."}
          </p>
        </section>

        <button
          type="button"
          className="overview-edit-button"
          onClick={openEditor}
        >
          Edit details
        </button>

        <div className="overview-note">
          <strong>Remember:</strong> This information
          provides context for the discussion. Nothing
          listed here replaces ongoing communication or
          consent.
        </div>

        <div className="overview-actions">
          <button
            type="button"
            className="overview-back-button"
            onClick={onBack}
          >
            Back
          </button>

          <button
            type="button"
            className="overview-button"
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>

      {isEditing && (
        <div
          className="overview-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeEditor();
            }
          }}
        >
<div
  className="overview-modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="overview-modal-title"
>
                <div className="overview-modal-heading">
              <h2 id="overview-modal-title">
                Edit scene details
              </h2>

              <button
                type="button"
                className="overview-modal-close"
                onClick={closeEditor}
                disabled={isSaving}
                aria-label="Close edit details"
              >
                ×
              </button>
            </div>

            <label className="overview-field">
              <span>
                Negotiation Name
                <small>Optional</small>
              </span>

              <input
                type="text"
                value={draftName}
                maxLength={120}
                disabled={isSaving}
onChange={(event) => {
  setDraftName(event.target.value);
  setValidationError("");
}}
              />
            </label>

            <label className="overview-field">
              <span>Planned scene date</span>

              <input
                type="date"
                value={draftSceneDate}
                min={today}
disabled={isSaving}
onChange={(event) => {
  const newDate = event.target.value;

  setDraftSceneDate(newDate);

  if (newDate) {
    setDraftSceneDateUnknown(false);
  }

  setValidationError("");
}}
              />
            </label>

            <label className="overview-undecided-row">
              <input
                type="checkbox"
                checked={
                  draftSceneDateUnknown
                }
                disabled={isSaving}
                onChange={(event) =>
                  handleUndecidedChange(
                    event.target.checked,
                  )
                }
              />

              <span>Not decided yet</span>
            </label>

            <label className="overview-field">
              <span>Planned Activities</span>

              <textarea
                value={
                  draftPlannedActivities
                }
                maxLength={500}
                rows={4}
                disabled={isSaving}
                onChange={(event) => {
                  setDraftPlannedActivities(
                    event.target.value,
                  );
                  setValidationError("");
                }}
              />

              <small>
                {
                  draftPlannedActivities.length
                }
                /500 characters
              </small>
            </label>

            <p className="overview-shared-note">
              Changes are shared with both participants.
            </p>

            {(validationError ||
              saveError) && (
              <div
                className="overview-error"
                role="alert"
              >
                {validationError ||
                  saveError}
              </div>
            )}

            <div className="overview-modal-actions">
              <button
                type="button"
                className="overview-cancel-button"
                onClick={closeEditor}
                disabled={isSaving}
              >
                Cancel
              </button>

<button
  type="button"
  className="overview-save-button"
  disabled={isSaving}
  onClick={() => {
    void handleSave();
  }}
>
  {isSaving
    ? "Saving..."
    : "Save changes"}
</button>

          </div>
        </div>
      </div>
    )}
        </main>
  );
}