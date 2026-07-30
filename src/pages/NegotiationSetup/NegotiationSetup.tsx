import { useState } from "react";
import type { FormEvent } from "react";import { useNavigate } from "react-router-dom";

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
      sessionStorage.getItem("desrec.sceneDateUndecided") === "true",
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
    navigate("/create-pin");
  }

  function handleCancel() {
    sessionStorage.removeItem("desrec.negotiationName");
    sessionStorage.removeItem("desrec.sceneDate");
    sessionStorage.removeItem("desrec.sceneDateUndecided");

    navigate("/");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedName = negotiationName.trim();

    if (!sceneDate && !sceneDateUndecided) {
      setError(
        "Choose a planned scene date or select Not decided yet.",
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

        <span className="setup-private-label">Private</span>
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

          <p className="setup-step-label">
            <span aria-hidden="true">✣</span>
            Step 2 of 5
          </p>
        </div>

        <div
          className="setup-progress-track"
          aria-label="Setup progress: step 2 of 5"
        >
          <div className="setup-progress-fill" />
        </div>

        <form className="setup-card" onSubmit={handleSubmit}>
          <p className="setup-card-step">
            2. Negotiation details
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

          <fieldset className="setup-date-section">
            <legend>When is the scene planned?</legend>

            <p>
              Choose the expected date. You can update it later if
              plans change.
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
                  The date can be added after the negotiation is
                  created.
                </small>
              </span>
            </label>
          </fieldset>

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