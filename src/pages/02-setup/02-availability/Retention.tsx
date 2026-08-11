import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import "./Retention.css";

type RetentionPeriod = "24-hours" | "7-days" | "30-days";

interface RetentionOption {
  value: RetentionPeriod;
  title: string;
  description: string;
  recommended?: boolean;
}

const retentionOptions: RetentionOption[] = [
  {
    value: "24-hours",
    title: "24 Hours",
    description:
      "Best for same-day scenes or negotiations that only need a short review window.",
  },
  {
    value: "7-days",
    title: "7 Days",
    description:
      "Gives both participants time to complete, compare, and discuss their responses.",
    recommended: true,
  },
  {
    value: "30-days",
    title: "30 Days",
    description:
      "Best for longer planning periods, recurring scenes, or ongoing discussions.",
  },
];

function Retention() {
  const navigate = useNavigate();

  const [retentionPeriod, setRetentionPeriod] =
    useState<RetentionPeriod>(() => {
      const savedValue = sessionStorage.getItem(
        "desrec.retentionPeriod",
      );

      if (
        savedValue === "24-hours" ||
        savedValue === "7-days" ||
        savedValue === "30-days"
      ) {
        return savedValue;
      }

      return "7-days";
    });

  const [error, setError] = useState("");

  function handleCancel() {
    sessionStorage.removeItem("desrec.retentionPeriod");
    navigate("/");
  }

  function handleBack() {
    navigate("/negotiation-setup");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!retentionPeriod) {
      setError("Choose how long the negotiation should remain available.");
      return;
    }

    sessionStorage.setItem(
      "desrec.retentionPeriod",
      retentionPeriod,
    );

    navigate("/review-negotiation");
  }

  return (
    <main className="retention-page">
      <header className="retention-topbar">
        <button
          type="button"
          className="retention-brand"
          onClick={() => navigate("/")}
          aria-label="Return to the DesREC negotiation home page"
        >
          <span className="retention-brand-mark" aria-hidden="true">
            ◈
          </span>

          <span className="retention-brand-text">
            <span className="retention-brand-title">
              DESREC
              <span className="retention-brand-label">
                Negotiation
              </span>
            </span>

            <span className="retention-brand-subtitle">
              Desert Rope Education Collective
            </span>
          </span>
        </button>

        <span className="retention-private-label">Private</span>
      </header>

      <section className="retention-content">
        <div className="retention-progress-row">
          <button
            type="button"
            className="retention-cancel-button"
            onClick={handleCancel}
          >
            <span aria-hidden="true">×</span>
            Cancel
          </button>

          <p className="retention-step-label">
            <span aria-hidden="true">✣</span>
            Step 3 of 5
          </p>
        </div>

        <div
          className="retention-progress-track"
          aria-label="Setup progress: step 3 of 5"
        >
          <div className="retention-progress-fill" />
        </div>

        <form className="retention-card" onSubmit={handleSubmit}>
          <p className="retention-card-step">
            3. Availability
          </p>

          <h1>
            How long should this negotiation remain available?
          </h1>

          <p className="retention-description">
            Choose how long both participants will be able to access
            the negotiation after the second participant first opens
            their personal invitation link.
          </p>

          <fieldset className="retention-options">
            <legend className="retention-visually-hidden">
              Select a retention period
            </legend>

            {retentionOptions.map((option) => {
              const isSelected =
                retentionPeriod === option.value;

              return (
                <label
                  key={option.value}
                  className={`retention-option-card ${
                    isSelected
                      ? "retention-option-card-selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="retention-period"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => {
                      setRetentionPeriod(option.value);
                      setError("");
                    }}
                  />

                  <span className="retention-radio">
                    {isSelected ? "●" : ""}
                  </span>

                  <span className="retention-option-content">
                    <span className="retention-option-heading">
                      <strong>{option.title}</strong>

                      {option.recommended && (
                        <span className="retention-recommended">
                          Recommended
                        </span>
                      )}
                    </span>

                    <span className="retention-option-description">
                      {option.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </fieldset>

          <aside className="retention-notice">
            <span className="retention-notice-icon" aria-hidden="true">
              ⏱
            </span>

            <div>
              <h2>When does the timer start?</h2>

              <p>
                The countdown begins the first time the second
                participant opens their personal invitation link.
              </p>

              <p>
                Opening the link again later will not restart or
                extend the timer.
              </p>
            </div>
          </aside>

          {error && (
            <div className="retention-error" role="alert">
              {error}
            </div>
          )}

          <div className="retention-actions">
            <button
              type="button"
              className="retention-back-button"
              onClick={handleBack}
            >
              <span aria-hidden="true">←</span>
              Back
            </button>

            <button
              type="submit"
              className="retention-continue-button"
            >
              Continue
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <p className="retention-save-note">
            Your selection will be included in the review before the
            negotiation is created.
          </p>
        </form>
      </section>
    </main>
  );
}

export default Retention;