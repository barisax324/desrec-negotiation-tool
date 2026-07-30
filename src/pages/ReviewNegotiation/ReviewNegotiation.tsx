import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createNegotiation } from "../../services/negotiation/createNegotiation";

import "./ReviewNegotiation.css";

type RetentionPeriod = "24-hours" | "7-days" | "30-days";

interface Acknowledgements {
  temporary: boolean;
  saveOrScreenshot: boolean;
  doesNotCreateConsent: boolean;
}

function formatSceneDate(
  sceneDate: string,
  sceneDateUndecided: boolean,
) {
  if (sceneDateUndecided || !sceneDate) {
    return "Not decided yet";
  }

  const [year, month, day] = sceneDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatRetentionPeriod(value: string) {
  const labels: Record<RetentionPeriod, string> = {
    "24-hours": "24 hours",
    "7-days": "7 days",
    "30-days": "30 days",
  };

  if (
    value === "24-hours" ||
    value === "7-days" ||
    value === "30-days"
  ) {
    return labels[value];
  }

  return "7 days";
}

function isRetentionPeriod(
  value: string,
): value is RetentionPeriod {
  return (
    value === "24-hours" ||
    value === "7-days" ||
    value === "30-days"
  );
}

function ReviewNegotiation() {
  const navigate = useNavigate();

  const negotiationName =
    sessionStorage.getItem("desrec.negotiationName")?.trim() || "";

  const sceneDate =
    sessionStorage.getItem("desrec.sceneDate") ?? "";

  const sceneDateUndecided =
    sessionStorage.getItem("desrec.sceneDateUndecided") === "true";

  const storedRetentionPeriod =
    sessionStorage.getItem("desrec.retentionPeriod") ?? "7-days";

  const retentionPeriod: RetentionPeriod = isRetentionPeriod(
    storedRetentionPeriod,
  )
    ? storedRetentionPeriod
    : "7-days";

  const pendingPin =
    sessionStorage.getItem("desrec.pendingPin") ?? "";

  const [acknowledgements, setAcknowledgements] =
    useState<Acknowledgements>({
      temporary: false,
      saveOrScreenshot: false,
      doesNotCreateConsent: false,
    });

  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const allAcknowledged =
    acknowledgements.temporary &&
    acknowledgements.saveOrScreenshot &&
    acknowledgements.doesNotCreateConsent;

  function handleAcknowledgementChange(
    key: keyof Acknowledgements,
  ) {
    setAcknowledgements((current) => ({
      ...current,
      [key]: !current[key],
    }));

    setError("");
  }

  function handleCancel() {
    if (isCreating) {
      return;
    }

    navigate("/");
  }

  function handleBack() {
    if (isCreating) {
      return;
    }

    navigate("/deletion-preference");
  }

  function handleEditDetails() {
    if (isCreating) {
      return;
    }

    navigate("/negotiation-setup");
  }

  function handleEditRetention() {
    if (isCreating) {
      return;
    }

    navigate("/deletion-preference");
  }

  async function handleCreateNegotiation() {
    if (isCreating) {
      return;
    }

    if (!pendingPin) {
      setError(
        "Your recovery PIN could not be found. Please return to the first step and create a new PIN.",
      );
      return;
    }

    if (!sceneDateUndecided && !sceneDate) {
      setError(
        "Your planned scene date could not be found. Please return to the negotiation details step.",
      );
      return;
    }

    if (!allAcknowledged) {
      setError(
        "Please acknowledge all three statements before creating the negotiation.",
      );
      return;
    }

    setError("");
    setIsCreating(true);

    try {
      const result = await createNegotiation({
        name: negotiationName || "Untitled Negotiation",
        sceneDate: sceneDateUndecided
          ? null
          : sceneDate || null,
        sceneDateUnknown: sceneDateUndecided,
        retentionPeriod,
        creatorPin: pendingPin,
      });

      sessionStorage.setItem(
        "desrec.negotiationId",
        result.negotiationId,
      );

      sessionStorage.setItem(
        "desrec.publicId",
        result.publicId,
      );

      sessionStorage.setItem(
        "desrec.personalLink",
        result.personalLink,
      );

      sessionStorage.setItem(
        "desrec.invitationLink",
        result.invitationLink,
      );

      sessionStorage.setItem(
        "desrec.privacyAcknowledged",
        "true",
      );

      sessionStorage.setItem(
        "desrec.currentParticipantRole",
        "A",
      );

      navigate("/save-personal-link");
    } catch (caughtError) {
      console.error(
        "Negotiation creation failed:",
        caughtError,
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The negotiation could not be created. Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="review-page">
      <header className="review-topbar">
        <button
          type="button"
          className="review-brand"
          onClick={() => navigate("/")}
          aria-label="Return to the DesREC negotiation home page"
          disabled={isCreating}
        >
          <span className="review-brand-mark" aria-hidden="true">
            ◈
          </span>

          <span className="review-brand-text">
            <span className="review-brand-title">
              DESREC
              <span className="review-brand-label">
                Negotiation
              </span>
            </span>

            <span className="review-brand-subtitle">
              Desert Rope Education Collective
            </span>
          </span>
        </button>

        <span className="review-private-label">Private</span>
      </header>

      <section className="review-content">
        <div className="review-progress-row">
          <button
            type="button"
            className="review-cancel-button"
            onClick={handleCancel}
            disabled={isCreating}
          >
            <span aria-hidden="true">×</span>
            Cancel
          </button>

          <p className="review-step-label">
            <span aria-hidden="true">✣</span>
            Step 4 of 5
          </p>
        </div>

        <div
          className="review-progress-track"
          aria-label="Setup progress: step 4 of 5"
        >
          <div className="review-progress-fill" />
        </div>

        <div className="review-card">
          <p className="review-card-step">
            4. Review, Privacy &amp; Consent
          </p>

          <h1>Confirm &amp; Create</h1>

          <p className="review-description">
            Review the negotiation details and acknowledge the
            privacy and consent rules before creating your personal
            links.
          </p>

          <section className="review-summary">
            <div className="review-summary-heading">
              <div>
                <p className="review-section-label">
                  Negotiation details
                </p>

                <h2>Review your choices</h2>
              </div>

              <button
                type="button"
                className="review-edit-button"
                onClick={handleEditDetails}
                disabled={isCreating}
              >
                Edit details
              </button>
            </div>

            <dl className="review-detail-list">
              <div className="review-detail-row">
                <dt>Negotiation name</dt>
                <dd>
                  {negotiationName || "No name provided"}
                </dd>
              </div>

              <div className="review-detail-row">
                <dt>Planned scene date</dt>
                <dd>
                  {formatSceneDate(
                    sceneDate,
                    sceneDateUndecided,
                  )}
                </dd>
              </div>

              <div className="review-detail-row">
                <dt>Recovery PIN</dt>
                <dd>
                  {pendingPin
                    ? "Created and hidden"
                    : "Missing"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="review-summary">
            <div className="review-summary-heading">
              <div>
                <p className="review-section-label">
                  Availability
                </p>

                <h2>Temporary access period</h2>
              </div>

              <button
                type="button"
                className="review-edit-button"
                onClick={handleEditRetention}
                disabled={isCreating}
              >
                Edit
              </button>
            </div>

            <div className="review-retention-value">
              <strong>
                {formatRetentionPeriod(retentionPeriod)}
              </strong>

              <p>
                The countdown begins when your Scene Partner first
                opens their invitation link.
              </p>
            </div>
          </section>

          <fieldset
            className="review-acknowledgements"
            disabled={isCreating}
          >
            <legend>
              Privacy &amp; consent acknowledgements
            </legend>

            <p className="review-acknowledgement-intro">
              Please acknowledge all three statements before
              creating the negotiation.
            </p>

            <label className="review-checkbox-row">
              <input
                type="checkbox"
                checked={acknowledgements.temporary}
                onChange={() =>
                  handleAcknowledgementChange("temporary")
                }
              />

              <span className="review-custom-checkbox" />

              <span>
                I understand this is a temporary negotiation.
              </span>
            </label>

            <label className="review-checkbox-row">
              <input
                type="checkbox"
                checked={acknowledgements.saveOrScreenshot}
                onChange={() =>
                  handleAcknowledgementChange(
                    "saveOrScreenshot",
                  )
                }
              />

              <span className="review-custom-checkbox" />

              <span>
                I understand either participant may save or
                screenshot information.
              </span>
            </label>

            <label className="review-checkbox-row">
              <input
                type="checkbox"
                checked={
                  acknowledgements.doesNotCreateConsent
                }
                onChange={() =>
                  handleAcknowledgementChange(
                    "doesNotCreateConsent",
                  )
                }
              />

              <span className="review-custom-checkbox" />

              <span>
                I understand{" "}
                <strong>
                  this tool supports discussion but does not create
                  consent.
                </strong>
              </span>
            </label>
          </fieldset>

          <aside className="review-consent-note">
            <span aria-hidden="true">ⓘ</span>

            <p>
              Consent must remain informed, voluntary, specific,
              ongoing, and reversible. Either participant may change
              their mind at any time.
            </p>
          </aside>

          {error && (
            <div className="review-error" role="alert">
              {error}
            </div>
          )}

          <div className="review-actions">
            <button
              type="button"
              className="review-back-button"
              onClick={handleBack}
              disabled={isCreating}
            >
              <span aria-hidden="true">←</span>
              Back
            </button>

            <button
              type="button"
              className="review-create-button"
              disabled={!allAcknowledged || isCreating}
              onClick={handleCreateNegotiation}
              aria-busy={isCreating}
            >
              <span aria-hidden="true">
                {isCreating ? "…" : "✣"}
              </span>

              {isCreating
                ? "Creating Negotiation..."
                : "Create Temporary Negotiation"}
            </button>
          </div>

          {!allAcknowledged && !isCreating && (
            <p className="review-disabled-note">
              Check all three boxes to continue.
            </p>
          )}

          {isCreating && (
            <p
              className="review-disabled-note"
              aria-live="polite"
            >
              Creating your secure links. Do not close this page.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default ReviewNegotiation;