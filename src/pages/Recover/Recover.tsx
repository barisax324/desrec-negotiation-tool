import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { supabase } from "../../lib/supabase";
import { joinNegotiation } from "../../services/negotiation/joinNegotiation";

import "./Recover.css";

const PASSWORD_PATTERN =
  /^[A-Za-z0-9]{6,12}$/;

type RecoverySessionResult = {
  recovery_token: string;
  public_id: string;
  participant_role:
    | "a"
    | "b"
    | "A"
    | "B";
};

function extractInvitationToken(
  enteredValue: string,
): string {
  const trimmedValue = enteredValue.trim();

  if (!trimmedValue) {
    return "";
  }

  try {
    const invitationUrl = new URL(
      trimmedValue,
      window.location.origin,
    );

    return (
      invitationUrl.searchParams
        .get("t")
        ?.trim() ?? ""
    );
  } catch {
    return trimmedValue;
  }
}

function Recover() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [invitationLink, setInvitationLink] =
    useState("");

  const [returnIdentifier, setReturnIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    isJoiningFirstTime,
    setIsJoiningFirstTime,
  ] = useState(false);

  const [
    isOpeningExisting,
    setIsOpeningExisting,
  ] = useState(false);

  const [invitationError, setInvitationError] =
    useState("");

  const [returnError, setReturnError] =
    useState("");

  const passwordIsValid =
    PASSWORD_PATTERN.test(password);

  const canJoinFirstTime =
    invitationLink.trim().length > 0 &&
    !isJoiningFirstTime &&
    !isOpeningExisting;

  const canOpenExisting =
    returnIdentifier.trim().length > 0 &&
    passwordIsValid &&
    !isOpeningExisting &&
    !isJoiningFirstTime;

  useEffect(() => {
    const invitationFromUrl =
      searchParams.get("invite")?.trim() ?? "";

    if (invitationFromUrl) {
      setInvitationLink(invitationFromUrl);
    }
  }, [searchParams]);

  async function handleFirstTimeJoin(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setInvitationError("");
    setReturnError("");

    const invitationToken =
      extractInvitationToken(invitationLink);

    if (!invitationToken) {
      setInvitationError(
        "Enter the complete invitation link you were sent.",
      );
      return;
    }

    setIsJoiningFirstTime(true);

    try {
      const result =
        await joinNegotiation(invitationToken);

      if (result.participantRole !== "B") {
        throw new Error(
          "This is not a Participant B invitation link.",
        );
      }

      /*
       * The invitation token identifies Participant B
       * during first-time password setup.
       */
      sessionStorage.setItem(
        "desrec.pendingAccessToken",
        invitationToken,
      );

      sessionStorage.setItem(
        "desrec.currentParticipantRole",
        "B",
      );

      sessionStorage.setItem(
        "desrec.passwordCreated",
        "false",
      );

      sessionStorage.setItem(
        "desrec.firstTimeParticipant",
        "B",
      );

      if (result.negotiationName) {
        sessionStorage.setItem(
          "desrec.negotiationName",
          result.negotiationName,
        );
      }

      sessionStorage.setItem(
        "desrec.negotiationStatus",
        result.negotiationStatus,
      );

      if (result.expiresAt) {
        sessionStorage.setItem(
          "desrec.expiresAt",
          result.expiresAt,
        );
      }

      /*
       * We will update joinNegotiation next so it also
       * returns and saves the shared Reference ID.
       */
sessionStorage.setItem(
  "desrec.publicId",
  result.publicId,
);

      navigate(
        "/create-password?participant=B",
      );
    } catch (caughtError) {
      console.error(
        "Unable to join negotiation:",
        caughtError,
      );

      setInvitationError(
        caughtError instanceof Error
          ? caughtError.message
          : "The invitation could not be opened.",
      );
    } finally {
      setIsJoiningFirstTime(false);
    }
  }

  async function handleReturningLogin(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setInvitationError("");
    setReturnError("");

    const cleanedIdentifier =
      returnIdentifier.trim();

    if (!cleanedIdentifier) {
      setReturnError(
        "Enter your Personal Link or Reference ID.",
      );
      return;
    }

    if (!passwordIsValid) {
      setReturnError(
        "Password must be 6 to 12 letters and numbers.",
      );
      return;
    }

    setIsOpeningExisting(true);

    try {
      const {
        data,
        error: rpcError,
      } = await supabase.rpc(
        "create_recovery_session",
        {
          p_identifier: cleanedIdentifier,
          p_password: password,
        },
      );

if (rpcError) {
  console.error(
    "create_recovery_session error:",
    rpcError,
  );

  throw new Error(
    "The Personal Link, Reference ID, or password is incorrect or the negotiation has expired. Please verify your information or create a new negotiation.",
    );
}

      const result =
        Array.isArray(data)
          ? (data[0] as
              | RecoverySessionResult
              | undefined)
          : undefined;

      if (!result?.recovery_token) {
        throw new Error(
          "The negotiation could not be opened.",
        );
      }

      const participantRole =
        result.participant_role.toUpperCase();

      if (
        participantRole !== "A" &&
        participantRole !== "B"
      ) {
        throw new Error(
          "The participant could not be identified.",
        );
      }

      sessionStorage.setItem(
        "desrec.publicId",
        result.public_id,
      );

      sessionStorage.setItem(
        "desrec.currentParticipantRole",
        participantRole,
      );

      sessionStorage.setItem(
        "desrec.activeRecoveryToken",
        result.recovery_token,
      );

      const destination =
        participantRole === "B"
          ? "/join"
          : "/start";

      navigate(
        `${destination}?r=${encodeURIComponent(
          result.recovery_token,
        )}`,
      );
    } catch (caughtError) {
      console.error(
        "Unable to open negotiation:",
        caughtError,
      );

      setReturnError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while opening your negotiation.",
      );
    } finally {
      setIsOpeningExisting(false);
    }
  }

  return (
    <main className="recover-page">
      <section
        className="recover-card"
        aria-labelledby="open-negotiation-title"
      >
        <Link
          className="recover-back-link"
          to="/"
        >
          ← Back
        </Link>

        <header className="recover-heading">
          <p className="recover-eyebrow">
            DesREC Negotiation Tool
          </p>

          <h1 id="open-negotiation-title">
            Open Negotiation
          </h1>

          <p>
            Join a negotiation for the first time
            or return to one you already started.
          </p>
        </header>

        <section className="recover-section">
          <div className="recover-section-heading">
            <span
              className="recover-section-number"
              aria-hidden="true"
            >
              1
            </span>

            <div>
              <h2>First Time Joining?</h2>

              <p>
                Paste the invitation link you
                received to create your password
                and begin your questionnaire.
              </p>
            </div>
          </div>

          <form
            className="recover-form"
            onSubmit={handleFirstTimeJoin}
          >
            <label htmlFor="invitation-link">
              Invitation Link
            </label>

            <input
              id="invitation-link"
              name="invitationLink"
              type="text"
              autoComplete="off"
              value={invitationLink}
              onChange={(event) => {
                setInvitationLink(
                  event.target.value,
                );

                setInvitationError("");
              }}
              placeholder="Paste your invitation link"
              disabled={
                isJoiningFirstTime ||
                isOpeningExisting
              }
              aria-invalid={Boolean(
                invitationError,
              )}
            />

            <p className="recover-help">
              This section is only for
              Participant B using an invitation
              for the first time.
            </p>

            {invitationError && (
              <div
                className="recover-error"
                role="alert"
              >
                {invitationError}
              </div>
            )}

            <button
              className="recover-submit"
              type="submit"
              disabled={!canJoinFirstTime}
            >
              {isJoiningFirstTime
                ? "Opening Invitation..."
                : "Join Negotiation"}
            </button>
          </form>
        </section>

        <div
          className="recover-divider"
          aria-hidden="true"
        >
          <span>OR</span>
        </div>

        <section className="recover-section">
          <div className="recover-section-heading">
            <span
              className="recover-section-number"
              aria-hidden="true"
            >
              2
            </span>

            <div>
              <h2>
                Returning to Your Negotiation?
              </h2>

              <p>
                Use your Personal Link or shared
                Reference ID together with your
                password.
              </p>
            </div>
          </div>

          <form
            className="recover-form"
            onSubmit={handleReturningLogin}
          >
            <label htmlFor="return-identifier">
              Personal Link or Reference ID
            </label>

            <input
              id="return-identifier"
              name="identifier"
              type="text"
              autoComplete="off"
              value={returnIdentifier}
              onChange={(event) => {
                setReturnIdentifier(
                  event.target.value,
                );

                setReturnError("");
              }}
              placeholder="Paste your link or enter your ID"
              disabled={
                isOpeningExisting ||
                isJoiningFirstTime
              }
              aria-invalid={Boolean(returnError)}
            />

            <label htmlFor="return-password">
              Password
            </label>

            <input
              id="return-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                const cleanedPassword =
                  event.target.value.replace(
                    /[^A-Za-z0-9]/g,
                    "",
                  );

                setPassword(
                  cleanedPassword.slice(0, 12),
                );

                setReturnError("");
              }}
              placeholder="Enter your password"
              disabled={
                isOpeningExisting ||
                isJoiningFirstTime
              }
              aria-invalid={Boolean(returnError)}
            />

            <p className="recover-help">
              Passwords contain 6 to 12 letters
              and numbers.
            </p>

            {returnError && (
              <div
                className="recover-error"
                role="alert"
              >
                {returnError}
              </div>
            )}

            <button
              className="recover-submit"
              type="submit"
              disabled={!canOpenExisting}
            >
              {isOpeningExisting
                ? "Opening Negotiation..."
                : "Open My Negotiation"}
            </button>
          </form>
        </section>

        <aside className="recover-privacy-note">
          <h2>Your password protects your access</h2>

          <p>
            Your Personal Link or Reference ID
            identifies the negotiation. Your
            password identifies which
            participant’s questionnaire to open.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default Recover;