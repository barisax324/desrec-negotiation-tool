import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import "./NegotiationSetup.css";

function getTodayDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;

  return new Date(today.getTime() - timezoneOffset)
    .toISOString()
    .split("T")[0];
}

function NegotiationSetup() {
  const navigate = useNavigate();

  const [negotiationName, setNegotiationName] = useState(
    () => sessionStorage.getItem("desrec.negotiationName") ?? "",
  );

  const [sceneDate, setSceneDate] = useState(
    () => sessionStorage.getItem("desrec.sceneDate") ?? "",
  );

  const [sceneDateUndecided, setSceneDateUndecided] = useState(
    () =>
      sessionStorage.getItem("desrec.sceneDateUndecided") ===
      "true",
  );

  const [plannedActivities, setPlannedActivities] = useState(
    () => sessionStorage.getItem("desrec.plannedActivities") ?? "",
  );

  const [error, setError] = useState("");

  const today = getTodayDate();

  function handleUndecidedChange(checked: boolean) {
    setSceneDateUndecided(checked);
    setError("");

    if (checked) {
      setSceneDate("");
    }
  }

  function handleBack() {
    navigate("/");
  }

  function handleCancel() {
    sessionStorage.removeItem("desrec.negotiationName");
    sessionStorage.removeItem("desrec.sceneDate");
    sessionStorage.removeItem("desrec.sceneDateUndecided");
    sessionStorage.removeItem("desrec.plannedActivities");

    navigate("/");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedName = negotiationName.trim();
    const trimmedActivities = plannedActivities.trim();

    if (!sceneDate && !sceneDateUndecided) {
      setError(
        "Choose a planned scene date or select Not decided yet.",
      );
      return;
    }

    if (!trimmedActivities) {
      setError(
        "Add a brief overview of the activities planned for this scene.",
      );
      return;
    }

    sessionStorage.setItem(
      "desrec.negotiationName",
      trimmedName,
    );

    sessionStorage.setItem(
      "desrec.sceneDate",
      sceneDateUndecided ? "" : sceneDate,
    );

    sessionStorage.setItem(
      "desrec.sceneDateUndecided",
      String(sceneDateUndecided),
    );

    sessionStorage.setItem(
      "desrec.plannedActivities",
      trimmedActivities,
    );

    navigate("/deletion-preference");
  }

  return (
    <main className="setup-page">
      <header className="setup-topbar">
        <button
          type="button"
          className="setup-brand"
          onClick={() => navigate("/")}
          aria-label="Return to the DesREC negotiation home page"
        >
          <span className="setup-brand-mark" aria-hidden="true">
            ◈
          </span>

          <span className="setup-brand-text">
            <span className="setup-brand-title">
              DESREC
              <span className="setup-brand-label">
                Negotiation
              </span>
            </span>

            <span className="setup-brand-subtitle">
              Desert Rope Education Collective
            </span>
          </span>
        </button>

      </header>

      <section className="setup-content">
        <div className="setup-progress-row">
          <button
            type="button"
            className="setup-cancel-button"
            onClick={handleCancel}
          >
            <span aria-hidden="true">×</span>
            Cancel
          </button>

        </div>

        <div
          className="setup-progress-track"
          aria-label="Setup progress: step 2 of 5"
        >
          <div className="setup-progress-fill" />
        </div>

        <form className="setup-card" onSubmit={handleSubmit}>
          <p className="setup-card-step">
            Negotiation details
          </p>

          <h1>Name your negotiation</h1>

          <p className="setup-description">
            Add a name that will help both participants recognize
            this negotiation, then choose when the scene is
            currently planned.
          </p>

          <label className="setup-field">
            <span>
              Negotiation name
              <small>Optional</small>
            </span>

            <input
              type="text"
              value={negotiationName}
              onChange={(event) =>
                setNegotiationName(event.target.value)
              }
              maxLength={80}
              autoComplete="off"
              placeholder="Example: Friday rope scene"
            />

            <small>
              This name will be visible to both participants.
            </small>
          </label>

<section className="setup-date-section">
  <h2>When is the scene planned?</h2>

  <p>
    Choose the expected date. You can update it later if plans
    change.
  </p>

  <label className="setup-field setup-date-field">
    <span>Planned scene date</span>

    <input
      type="date"
      value={sceneDate}
      min={today}
      disabled={sceneDateUndecided}
      onChange={(event) => {
        setSceneDate(event.target.value);
        setError("");
      }}
    />
  </label>

  <div className="setup-divider">
    <span>or</span>
  </div>

  <label
    className={`setup-undecided-card ${
      sceneDateUndecided
        ? "setup-undecided-card-selected"
        : ""
    }`}
  >
    <input
      type="checkbox"
      checked={sceneDateUndecided}
      onChange={(event) =>
        handleUndecidedChange(event.target.checked)
      }
    />

    <span className="setup-undecided-check">
      {sceneDateUndecided ? "✓" : ""}
    </span>

    <span>
      <strong>Not decided yet</strong>
      <small>
        The date can be added after the negotiation is created.
      </small>
    </span>
  </label>
</section>

<section className="setup-activities-section">
  <h2>
    What activities are you planning for this scene?
  </h2>

  <label className="setup-field">
    <textarea
      value={plannedActivities}
      onChange={(event) => {
        setPlannedActivities(event.target.value);
        setError("");
      }}
      maxLength={500}
      rows={5}
      placeholder="Provide a brief overview of what you hope to explore during this scene. This helps both participants start the negotiation with the same expectations."
    />

    <small>
      {plannedActivities.length}/500 characters
    </small>
  </label>
</section>

          {error && (
            <div className="setup-error" role="alert">
              {error}
            </div>
          )}

          <div className="setup-actions">
            <button
              type="button"
              className="setup-back-button"
              onClick={handleBack}
            >
              <span aria-hidden="true">←</span>
              Back
            </button>

            <button
              type="submit"
              className="setup-continue-button"
            >
              Continue
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <p className="setup-save-note">
            Your setup choices are saved on this device while you
            complete the creation process.
          </p>
        </form>
      </section>
    </main>
  );
}

export default NegotiationSetup;

