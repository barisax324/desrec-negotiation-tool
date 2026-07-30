import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SavePersonalLink.css";

type CopyTarget = "personal" | "invitation";

interface StoredLinks {
  personalLink: string;
  invitationLink: string;
}

function SavePersonalLink() {
  const navigate = useNavigate();

  const [links] = useState<StoredLinks>(() => ({
    personalLink:
      sessionStorage.getItem("desrec.personalLink") ?? "",
    invitationLink:
      sessionStorage.getItem("desrec.invitationLink") ?? "",
  }));

  const [copiedTarget, setCopiedTarget] =
    useState<CopyTarget | null>(null);

  const [confirmedSaved, setConfirmedSaved] =
    useState(false);

  const [copyError, setCopyError] = useState("");

  const negotiationName =
    sessionStorage.getItem("desrec.negotiationName")?.trim() ??
    "";

  const retentionPeriod =
    sessionStorage.getItem("desrec.retentionPeriod") ??
    "7-days";

  const linksAreMissing =
    !links.personalLink || !links.invitationLink;

  useEffect(() => {
    if (!copiedTarget) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setCopiedTarget(null);
    }, 2500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [copiedTarget]);

  function formatRetentionPeriod() {
    if (retentionPeriod === "24-hours") {
      return "24 hours";
    }

    if (retentionPeriod === "30-days") {
      return "30 days";
    }

    return "7 days";
  }

  async function handleCopy(
    value: string,
    target: CopyTarget,
  ) {
    setCopyError("");

    if (!value) {
      setCopyError(
        "This link could not be found. Please return to the review step and create the negotiation again.",
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
    } catch {
      setCopyError(
        "The link could not be copied automatically. Select the link and copy it manually.",
      );
    }
  }

 function handleOpenNegotiation() {
  if (!confirmedSaved || linksAreMissing) {
    return;
  }

  sessionStorage.setItem(
    "desrec.linksConfirmedSaved",
    "true",
  );

  sessionStorage.setItem(
    "desrec.currentParticipantRole",
    "A",
  );

  sessionStorage.setItem(
    "desrec.requiresOnboarding",
    "true",
  );

  try {
    const personalUrl = new URL(links.personalLink);

    navigate(
      `${personalUrl.pathname}${personalUrl.search}`,
      {
        state: {
          beginWithOnboarding: true,
        },
      },
    );
  } catch {
    setCopyError(
      "Your personal link is invalid. Please return to the review step and create the negotiation again.",
    );
  }
}

  function handleBack() {
    navigate("/review-negotiation");
  }

  function handleCancel() {
    navigate("/");
  }

  return (
    <main className="save-link-page">
      <header className="save-link-topbar">
        <button
          type="button"
          className="save-link-brand"
          onClick={() => navigate("/")}
          aria-label="Return to the DesREC negotiation home page"
        >
          <span
            className="save-link-brand-mark"
            aria-hidden="true"
          >
            ◈
          </span>

          <span className="save-link-brand-text">
            <span className="save-link-brand-title">
              DESREC
              <span className="save-link-brand-label">
                Negotiation
              </span>
            </span>

            <span className="save-link-brand-subtitle">
              Desert Rope Education Collective
            </span>
          </span>
        </button>

        <span className="save-link-private-label">
          Private
        </span>
      </header>

      <section className="save-link-content">
        <div className="save-link-progress-row">
          <button
            type="button"
            className="save-link-cancel-button"
            onClick={handleCancel}
          >
            <span aria-hidden="true">×</span>
            Cancel
          </button>

          <p className="save-link-step-label">
            <span aria-hidden="true">✣</span>
            Step 5 of 5
          </p>
        </div>

        <div
          className="save-link-progress-track"
          aria-label="Setup progress: step 5 of 5"
        >
          <div className="save-link-progress-fill" />
        </div>

        <article className="save-link-card">
          <div
            className="save-link-success-icon"
            aria-hidden="true"
          >
            ✓
          </div>

          <p className="save-link-card-step">
            5. Save Your Links
          </p>

          <h1>Negotiation created</h1>

          <p className="save-link-description">
            {negotiationName ? (
              <>
                <strong>{negotiationName}</strong> is ready.
              </>
            ) : (
              <>Your negotiation is ready.</>
            )}{" "}
            Save your personal link before continuing and send
            the separate invitation link to your Scene Partner.
          </p>

          {linksAreMissing && (
            <div className="save-link-error" role="alert">
              Your negotiation links could not be found. Return to
              the review step and create the negotiation again.
            </div>
          )}

          <section className="save-link-link-section save-link-personal-section">
            <div className="save-link-section-heading">
              <div>
                <p className="save-link-section-label">
                  You
                </p>

                <h2>Your personal link</h2>
              </div>

              <span className="save-link-owner-badge">
                This one is yours
              </span>
            </div>

            <p className="save-link-section-description">
              Use this link whenever you need to return to your
              questionnaire or view the completed comparison.
            </p>

            <div className="save-link-field-row">
              <input
                type="text"
                value={links.personalLink}
                placeholder={
                  linksAreMissing
                    ? "Personal link unavailable"
                    : undefined
                }
                readOnly
                aria-label="Your personal negotiation link"
                onFocus={(event) => {
                  event.currentTarget.select();
                }}
              />

              <button
                type="button"
                className="save-link-copy-button"
                disabled={!links.personalLink}
                onClick={() =>
                  handleCopy(
                    links.personalLink,
                    "personal",
                  )
                }
              >
                {copiedTarget === "personal"
                  ? "Copied!"
                  : "Copy Link"}
              </button>
            </div>

            <div className="save-link-warning">
              <span aria-hidden="true">!</span>

              <p>
                Do not send this link to your Scene Partner.
                It opens your side of the negotiation.
              </p>
            </div>
          </section>

          <section className="save-link-link-section">
            <div className="save-link-section-heading">
              <div>
                <p className="save-link-section-label">
                  Scene Partner
                </p>

                <h2>Scene Partner invitation link</h2>
              </div>

              <span className="save-link-invitation-badge">
                Send this link
              </span>
            </div>

            <p className="save-link-section-description">
              Send this separate invitation link to your Scene
              Partner so they can complete their side of the
              negotiation.
            </p>

            <div className="save-link-field-row">
              <input
                type="text"
                value={links.invitationLink}
                placeholder={
                  linksAreMissing
                    ? "Invitation link unavailable"
                    : undefined
                }
                readOnly
                aria-label="Scene Partner invitation link"
                onFocus={(event) => {
                  event.currentTarget.select();
                }}
              />

              <button
                type="button"
                className="save-link-copy-button"
                disabled={!links.invitationLink}
                onClick={() =>
                  handleCopy(
                    links.invitationLink,
                    "invitation",
                  )
                }
              >
                {copiedTarget === "invitation"
                  ? "Copied!"
                  : "Copy Invitation"}
              </button>
            </div>
          </section>

          <aside className="save-link-timer-notice">
            <span
              className="save-link-timer-icon"
              aria-hidden="true"
            >
              ⏱
            </span>

            <div>
              <h2>The timer has not started yet</h2>

              <p>
                The {formatRetentionPeriod()} countdown begins
                when your Scene Partner opens their invitation
                link for the first time.
              </p>

              <p>
                Opening the link again later will not restart or
                extend the timer.
              </p>
            </div>
          </aside>

          <aside className="save-link-recovery-notice">
            <span aria-hidden="true">⌁</span>

            <div>
              <h2>Recovery PIN</h2>

              <p>
                Your personal link can be recovered using the
                recovery PIN you created during setup. The PIN
                itself is not displayed on this page.
              </p>
            </div>
          </aside>

          {copyError && (
            <div className="save-link-error" role="alert">
              {copyError}
            </div>
          )}

          <label className="save-link-confirmation">
            <input
              type="checkbox"
              checked={confirmedSaved}
              disabled={linksAreMissing}
              onChange={(event) =>
                setConfirmedSaved(event.target.checked)
              }
            />

            <span className="save-link-custom-checkbox" />

            <span>
              I have saved my personal link and saved or shared
              my Scene Partner&apos;s invitation link.
            </span>
          </label>

          <div className="save-link-actions">
            <button
              type="button"
              className="save-link-back-button"
              onClick={handleBack}
            >
              <span aria-hidden="true">←</span>
              Back
            </button>

            <button
              type="button"
              className="save-link-open-button"
              disabled={
                !confirmedSaved || linksAreMissing
              }
              onClick={handleOpenNegotiation}
            >
              Open My Negotiation
              <span aria-hidden="true">→</span>
            </button>
          </div>

          {!confirmedSaved && !linksAreMissing && (
            <p className="save-link-disabled-note">
              Confirm that you saved both links before continuing.
            </p>
          )}

          {linksAreMissing && (
            <p className="save-link-disabled-note">
              The links must be created before you can continue.
            </p>
          )}
        </article>
      </section>
    </main>
  );
}

export default SavePersonalLink;