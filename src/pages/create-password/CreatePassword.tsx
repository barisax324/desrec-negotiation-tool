import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

import "./CreatePassword.css";

const PASSWORD_PATTERN =
  /^[A-Za-z0-9]{6,12}$/;

type PasswordSetupResult = {
  recovery_token: string;
  public_id: string;
  participant_role:
    | "a"
    | "b"
    | "A"
    | "B";
};

function CreatePassword() {
  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    acknowledged,
    setAcknowledged,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    copyMessage,
    setCopyMessage,
  ] = useState("");

  const referenceId =
    sessionStorage.getItem(
      "desrec.publicId",
    ) ?? "";

  const creatorToken =
    sessionStorage.getItem(
      "desrec.creatorToken",
    ) ?? "";

  const passwordIsValid =
    PASSWORD_PATTERN.test(password);

  const passwordsMatch =
    password.length > 0 &&
    password === confirmPassword;

  const canSubmit =
    passwordIsValid &&
    passwordsMatch &&
    acknowledged &&
    !isSubmitting &&
    Boolean(creatorToken) &&
    Boolean(referenceId);

  async function handleCopyReferenceId() {
    setCopyMessage("");
    setErrorMessage("");

    if (!referenceId) {
      setErrorMessage(
        "Your Reference ID is unavailable. Please return to the previous page.",
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(
        referenceId,
      );

      setCopyMessage(
        "Reference ID copied.",
      );
    } catch {
      setErrorMessage(
        "The Reference ID could not be copied automatically. Select it and copy it manually.",
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setCopyMessage("");

    if (!creatorToken) {
      setErrorMessage(
        "Your setup information is missing. Please return to the previous page and try again.",
      );
      return;
    }

    if (!referenceId) {
      setErrorMessage(
        "Your Reference ID is unavailable. Please return to the previous page and try again.",
      );
      return;
    }

    if (!passwordIsValid) {
      setErrorMessage(
        "Your password must be 6 to 12 characters and contain only letters and numbers.",
      );
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage(
        "The passwords do not match.",
      );
      return;
    }

    if (!acknowledged) {
      setErrorMessage(
        "Please confirm that you understand your password cannot be recovered.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data,
        error,
      } = await supabase.rpc(
        "set_participant_password",
        {
          p_access_token:
            creatorToken,
          p_password: password,
        },
      );

      if (error) {
        console.error(
          "set_participant_password RPC error:",
          error,
        );

        throw new Error(
          error.message,
        );
      }

      const result =
        Array.isArray(data)
          ? (data[0] as
              | PasswordSetupResult
              | undefined)
          : undefined;

      if (!result?.recovery_token) {
        throw new Error(
          "Your password was saved, but the negotiation could not be opened.",
        );
      }

      const participantRole =
        result.participant_role.toUpperCase();

      if (
        participantRole !== "A" &&
        participantRole !== "B"
      ) {
        throw new Error(
          "The participant role could not be determined.",
        );
      }

      sessionStorage.setItem(
        "desrec.passwordCreated",
        "true",
      );

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
        {
          replace: true,
        },
      );
    } catch (error) {
      console.error(
        "Unable to secure negotiation:",
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unknown database error.";

      setErrorMessage(
        `Unable to secure your negotiation: ${message}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="create-password-page">
      <section className="create-password-card">
        <button
          type="button"
          className="create-password-back-button"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          ← Back
        </button>

        <header className="create-password-header">
          <span aria-hidden="true">
            🔒
          </span>

          <div>
            <p className="create-password-eyebrow">
              Secure your negotiation
            </p>

            <h1>
              Create Your Password
            </h1>

            <p>
              Create a password before
              continuing to your questionnaire.
            </p>
          </div>
        </header>

        <aside className="create-password-reference">
          <h2>
            Your Reference ID
          </h2>

          <p>
            Save this ID. If you lose your
            Personal Link, you can use your
            Reference ID and password together
            to open your negotiation again.
          </p>

          <div className="create-password-reference-row">
            <input
              type="text"
              value={referenceId}
              placeholder="Reference ID unavailable"
              aria-label="Negotiation Reference ID"
              readOnly
              onFocus={(event) => {
                event.currentTarget.select();
              }}
            />

            <button
              type="button"
              onClick={() => {
                void handleCopyReferenceId();
              }}
              disabled={!referenceId}
            >
              Copy ID
            </button>
          </div>

          {copyMessage && (
            <p role="status">
              {copyMessage}
            </p>
          )}
        </aside>

        <form
          className="create-password-form"
          onSubmit={handleSubmit}
        >
          <div className="create-password-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              autoComplete="new-password"
              maxLength={12}
              required
              disabled={isSubmitting}
              onChange={(event) => {
                const cleanedPassword =
                  event.target.value.replace(
                    /[^A-Za-z0-9]/g,
                    "",
                  );

                setPassword(
                  cleanedPassword.slice(
                    0,
                    12,
                  ),
                );

                setErrorMessage("");
              }}
            />

            <p>
              Use 6 to 12 letters and
              numbers. Do not use spaces or
              symbols.
            </p>

            {password.length > 0 && (
              <p
                className={
                  passwordIsValid
                    ? "validation-success"
                    : "validation-error"
                }
              >
                {passwordIsValid
                  ? "✓"
                  : "✕"}{" "}
                6 to 12 letters and
                numbers
              </p>
            )}
          </div>

          <div className="create-password-field">
            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              value={confirmPassword}
              autoComplete="new-password"
              maxLength={12}
              required
              disabled={isSubmitting}
              onChange={(event) => {
                const cleanedPassword =
                  event.target.value.replace(
                    /[^A-Za-z0-9]/g,
                    "",
                  );

                setConfirmPassword(
                  cleanedPassword.slice(
                    0,
                    12,
                  ),
                );

                setErrorMessage("");
              }}
            />

            {confirmPassword.length >
              0 && (
              <p
                className={
                  passwordsMatch
                    ? "validation-success"
                    : "validation-error"
                }
              >
                {passwordsMatch
                  ? "✓ Passwords match"
                  : "✕ Passwords do not match"}
              </p>
            )}
          </div>

          <label className="create-password-acknowledgement">
            <input
              type="checkbox"
              checked={acknowledged}
              disabled={isSubmitting}
              onChange={(event) => {
                setAcknowledged(
                  event.target.checked,
                );

                setErrorMessage("");
              }}
            />

            <span>
              I understand that my
              password cannot be recovered
              or reset. I need my
              Reference ID and password
              together if I lose my
              Personal Link.
            </span>
          </label>

          {errorMessage && (
            <div
              className="create-password-error"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="create-password-submit-button"
            disabled={!canSubmit}
          >
            {isSubmitting
              ? "Securing Negotiation..."
              : "Secure My Negotiation"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default CreatePassword;