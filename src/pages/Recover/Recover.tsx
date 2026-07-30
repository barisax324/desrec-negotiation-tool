import { useState } from "react";
import type { FormEvent } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../../lib/supabase";

import "./recover.css";

type RecoverySessionResult = {
  recovery_token: string;
  public_id: string;
  participant_role: "a" | "b" | "A" | "B";
};

function Recover() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isOpening, setIsOpening] =
    useState(false);

  const [error, setError] =
    useState("");

  const passwordIsValid =
    /^[A-Za-z0-9]{6,12}$/.test(password);

  const canSubmit =
    identifier.trim().length > 0 &&
    passwordIsValid &&
    !isOpening;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    const cleanedIdentifier =
      identifier.trim();

    if (!cleanedIdentifier) {
      setError(
        "Enter your Personal Link or Reference ID.",
      );
      return;
    }

    if (!passwordIsValid) {
      setError(
        "Password must be 6–12 letters and numbers.",
      );
      return;
    }

    setIsOpening(true);

    try {
      const { data, error: rpcError } =
        await supabase.rpc(
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

        throw new Error(rpcError.message);
      }

      const result = Array.isArray(data)
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
          "The participant role could not be determined.",
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

      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while opening your negotiation.";

      setError(message);
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <main className="recover-page">
      <section
        className="recover-card"
        aria-labelledby="recover-title"
      >
        <Link
          className="recover-back-link"
          to="/"
        >
          ← Back
        </Link>

        <div className="recover-heading">
          <p className="recover-eyebrow">
            DesREC Negotiation Tool
          </p>

          <h1 id="recover-title">
            Open your negotiation
          </h1>

          <p>
            Enter your Personal Link or Reference ID
            and the password you created.
          </p>
        </div>

        <form
          className="recover-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="recovery-identifier">
            Personal Link or Reference ID
          </label>

          <input
            id="recovery-identifier"
            name="identifier"
            type="text"
            autoComplete="off"
            value={identifier}
            onChange={(event) => {
              setIdentifier(event.target.value);
              setError("");
            }}
            placeholder="Paste your link or enter your ID"
            disabled={isOpening}
          />

          <p className="recover-help">
            Your Reference ID was shown when the
            negotiation was created.
          </p>

          <label htmlFor="recovery-password">
            Password
          </label>

          <input
            id="recovery-password"
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

              setError("");
            }}
            placeholder="Enter your password"
            disabled={isOpening}
            aria-describedby={
              error
                ? "recovery-error"
                : "recovery-help"
            }
            aria-invalid={Boolean(error)}
          />

          <p
            id="recovery-help"
            className="recover-help"
          >
            Passwords contain 6–12 letters and
            numbers.
          </p>

          {error && (
            <div
              id="recovery-error"
              className="recover-error"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <button
            className="recover-submit"
            type="submit"
            disabled={!canSubmit}
          >
            {isOpening
              ? "Opening…"
              : "Open my negotiation"}
          </button>
        </form>

        <div className="recover-privacy-note">
          <h2>
            Your password protects your access
          </h2>

          <p>
            Your password is stored as a secure
            hash. DesREC and the site host cannot
            use it to view your negotiation
            responses.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Recover;