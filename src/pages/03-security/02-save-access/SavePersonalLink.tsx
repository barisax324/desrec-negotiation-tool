import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import "./SavePersonalLink.css";

type CopyTarget =
  | "personal"
  | "invitation"
  | "reference";

interface StoredLinks {
  personalLink: string;
  invitationLink: string;
}

function SavePersonalLink() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const participantFromUrl =
    searchParams
      .get("participant")
      ?.toUpperCase();

  const storedParticipantRole =
    sessionStorage
      .getItem(
        "desrec.currentParticipantRole",
      )
      ?.toUpperCase();

  const participantRole =
    participantFromUrl === "B" ||
    storedParticipantRole === "B"
      ? "B"
      : "A";

  const isParticipantB =
    participantRole === "B";

  const [links] = useState<StoredLinks>(
    () => ({
      personalLink:
        sessionStorage.getItem(
          "desrec.personalLink",
        ) ?? "",

      invitationLink:
        sessionStorage.getItem(
          "desrec.invitationLink",
        ) ?? "",
    }),
  );

  const [copiedTarget, setCopiedTarget] =
    useState<CopyTarget | null>(null);

  const [
    confirmedSaved,
    setConfirmedSaved,
  ] = useState(false);

  const [copyError, setCopyError] =
    useState("");

  const negotiationName =
    sessionStorage
      .getItem(
        "desrec.negotiationName",
      )
      ?.trim() ?? "";

  const retentionPeriod =
    sessionStorage.getItem(
      "desrec.retentionPeriod",
    ) ?? "7-days";

  const publicId =
    sessionStorage.getItem(
      "desrec.publicId",
    ) ?? "";

  const recoveryToken =
    sessionStorage.getItem(
      "desrec.activeRecoveryToken",
    ) ?? "";

  /*
   * Participant A needs:
   * - Personal Link
   * - Invitation Link
   * - Reference ID
   *
   * Participant B needs:
   * - Personal Link
   * - Reference ID
   */
  const requiredInformationIsMissing =
    !links.personalLink ||
    !publicId ||
    (!isParticipantB &&
      !links.invitationLink);

  useEffect(() => {
    if (!copiedTarget) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        setCopiedTarget(null);
      }, 2500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [copiedTarget]);

  function formatRetentionPeriod() {
    if (
      retentionPeriod === "24-hours"
    ) {
      return "24 hours";
    }

    if (
      retentionPeriod === "30-days"
    ) {
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
        "This access information could not be found. Please return home and begin again.",
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(
        value,
      );

      setCopiedTarget(target);
    } catch {
      setCopyError(
        "This information could not be copied automatically. Select it and copy it manually.",
      );
    }
  }

  function handleContinue() {
    if (
      !confirmedSaved ||
      requiredInformationIsMissing
    ) {
      return;
    }

    if (!recoveryToken) {
      setCopyError(
        "Your secure login session is missing. Please open the negotiation again using your Personal Link or Reference ID and password.",
      );
      return;
    }

    sessionStorage.setItem(
      "desrec.linksConfirmedSaved",
      "true",
    );

    const destination =
      isParticipantB
        ? "/join"
        : "/start";

    navigate(
      `${destination}?r=${encodeURIComponent(
        recoveryToken,
      )}`,
      {
        replace: true,
      },
    );
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
              Desert Rope Education
              Collective
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
            <span aria-hidden="true">
              ×
            </span>
            Cancel
          </button>

          <p className="save-link-step-label">
            <span aria-hidden="true">
              ✣
            </span>
            Final setup step
          </p>
        </div>

        <div
          className="save-link-progress-track"
          aria-label="Final setup step"
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
            Save Your Access
          </p>

          <h1>
            Save Your Personal Link
          </h1>

          <p className="save-link-description">
            {negotiationName ? (
              <>
                <strong>
                  {negotiationName}
                </strong>{" "}
                is ready.
              </>
            ) : (
              <>
                Your negotiation is
                ready.
              </>
            )}{" "}
            {isParticipantB
              ? "Your invitation has been converted into your own private Personal Link. Save it and the Reference ID before continuing."
              : "Save your Personal Link and Reference ID before continuing. Send the separate Invitation Link to your scene partner."}
          </p>

          {requiredInformationIsMissing && (
            <div
              className="save-link-error"
              role="alert"
            >
              Some of your access
              information could not be
              found. Return home and begin
              again.
            </div>
          )}

          <section className="save-link-link-section save-link-personal-section">
            <div className="save-link-section-heading">
              <div>
                <p className="save-link-section-label">
                  You
                </p>

                <h2>
                  Your Personal Link
                </h2>
              </div>

              <span className="save-link-owner-badge">
                Keep this private
              </span>
            </div>

            <p className="save-link-section-description">
              Use this link with your
              password whenever you return
              to your questionnaire or
              completed comparison.
            </p>

            <div className="save-link-field-row">
              <input
                type="text"
                value={
                  links.personalLink
                }
                placeholder="Personal Link unavailable"
                readOnly
                aria-label="Your Personal Link"
                onFocus={(event) => {
                  event.currentTarget.select();
                }}
              />

              <button
                type="button"
                className="save-link-copy-button"
                disabled={
                  !links.personalLink
                }
                onClick={() => {
                  void handleCopy(
                    links.personalLink,
                    "personal",
                  );
                }}
              >
                {copiedTarget ===
                "personal"
                  ? "Copied!"
                  : "Copy Link"}
              </button>
            </div>

            <div className="save-link-warning">
              <span aria-hidden="true">
                !
              </span>

              <p>
                Do not share this link. It
                identifies your side of the
                negotiation, but your
                password is still required
                to open it.
              </p>
            </div>
          </section>

          {!isParticipantB && (
            <section className="save-link-link-section">
              <div className="save-link-section-heading">
                <div>
                  <p className="save-link-section-label">
                    Scene Partner
                  </p>

                  <h2>
                    Invitation Link
                  </h2>
                </div>

                <span className="save-link-invitation-badge">
                  Send this link
                </span>
              </div>

              <p className="save-link-section-description">
                Send this link to your
                scene partner. They will use
                it once to create their own
                password and receive their
                private Personal Link.
              </p>

              <div className="save-link-field-row">
                <input
                  type="text"
                  value={
                    links.invitationLink
                  }
                  placeholder="Invitation Link unavailable"
                  readOnly
                  aria-label="Scene Partner Invitation Link"
                  onFocus={(event) => {
                    event.currentTarget.select();
                  }}
                />

                <button
                  type="button"
                  className="save-link-copy-button"
                  disabled={
                    !links.invitationLink
                  }
                  onClick={() => {
                    void handleCopy(
                      links.invitationLink,
                      "invitation",
                    );
                  }}
                >
                  {copiedTarget ===
                  "invitation"
                    ? "Copied!"
                    : "Copy Invitation"}
                </button>
              </div>
            </section>
          )}

          {!isParticipantB && (
            <aside className="save-link-timer-notice">
              <span
                className="save-link-timer-icon"
                aria-hidden="true"
              >
                ⏱
              </span>

              <div>
                <h2>
                  The timer has not
                  started yet
                </h2>

                <p>
                  The{" "}
                  {formatRetentionPeriod()}{" "}
                  countdown begins when
                  your scene partner opens
                  the Invitation Link for
                  the first time.
                </p>

                <p>
                  Opening the negotiation
                  again later will not
                  restart or extend the
                  timer.
                </p>
              </div>
            </aside>
          )}

          <aside className="save-link-recovery-notice">
            <span aria-hidden="true">
              ⌁
            </span>

            <div>
              <h2>
                Your Reference ID
              </h2>

              <p>
                This ID is shared by both
                participants. Your own
                password determines which
                questionnaire it opens.
              </p>

              <div className="save-link-field-row">
                <input
                  type="text"
                  value={publicId}
                  placeholder="Reference ID unavailable"
                  readOnly
                  aria-label="Negotiation Reference ID"
                  onFocus={(event) => {
                    event.currentTarget.select();
                  }}
                />

                <button
                  type="button"
                  className="save-link-copy-button"
                  disabled={!publicId}
                  onClick={() => {
                    void handleCopy(
                      publicId,
                      "reference",
                    );
                  }}
                >
                  {copiedTarget ===
                  "reference"
                    ? "Copied!"
                    : "Copy ID"}
                </button>
              </div>

              <p>
                When returning, use either
                your Personal Link or this
                Reference ID together with
                your password.
              </p>

              <p>
                Neither the Personal Link
                nor Reference ID opens the
                negotiation without the
                correct password.
              </p>
            </div>
          </aside>

          {copyError && (
            <div
              className="save-link-error"
              role="alert"
            >
              {copyError}
            </div>
          )}

          <label className="save-link-confirmation">
            <input
              type="checkbox"
              checked={confirmedSaved}
              disabled={
                requiredInformationIsMissing
              }
              onChange={(event) => {
                setConfirmedSaved(
                  event.target.checked,
                );
              }}
            />

            <span className="save-link-custom-checkbox" />

            <span>
              {isParticipantB
                ? "I have saved my Personal Link and Reference ID."
                : "I have saved my Personal Link and Reference ID, and saved or shared my scene partner’s Invitation Link."}
            </span>
          </label>

          <div className="save-link-actions">
            <button
              type="button"
              className="save-link-back-button"
              onClick={handleCancel}
            >
              <span aria-hidden="true">
                ←
              </span>
              Return Home
            </button>

            <button
              type="button"
              className="save-link-open-button"
              disabled={
                !confirmedSaved ||
                requiredInformationIsMissing
              }
              onClick={handleContinue}
            >
              Continue to Questionnaire
              <span aria-hidden="true">
                →
              </span>
            </button>
          </div>

          {!confirmedSaved &&
            !requiredInformationIsMissing && (
              <p className="save-link-disabled-note">
                Confirm that you saved
                your access information
                before continuing.
              </p>
            )}

          {requiredInformationIsMissing && (
            <p className="save-link-disabled-note">
              Your access information
              must be available before
              you can continue.
            </p>
          )}
        </article>
      </section>
    </main>
  );
}

export default SavePersonalLink;

