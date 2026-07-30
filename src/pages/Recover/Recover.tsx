import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./recover.css";

type RecoveryResponse = {
  success: boolean;
  negotiationId?: string;
  participant?: "a" | "b";
  token?: string;
  message?: string;
};

function Recover() {
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  const [error, setError] = useState("");

  const handlePinChange = (value: string) => {
    const cleanedPin = value.replace(/\D/g, "").slice(0, 8);

    setPin(cleanedPin);
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (pin.length < 4) {
      setError("Enter the PIN you created when you started.");
      return;
    }

    setIsRecovering(true);

    try {
      const response = await fetch("/api/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });

      const data = (await response.json()) as RecoveryResponse;

      if (
        !response.ok ||
        !data.success ||
        !data.negotiationId ||
        !data.participant ||
        !data.token
      ) {
        throw new Error(
          data.message ??
            "We could not find a negotiation connected to that PIN."
        );
      }

      const recoveredLink =
        `/negotiation/${encodeURIComponent(data.negotiationId)}` +
        `?participant=${encodeURIComponent(data.participant)}` +
        `&token=${encodeURIComponent(data.token)}`;

      navigate(recoveredLink);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while recovering your link.";

      setError(message);
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <main className="recover-page">
      <section className="recover-card" aria-labelledby="recover-title">
        <Link className="recover-back-link" to="/">
          ← Back
        </Link>

        <div className="recover-heading">
          <p className="recover-eyebrow">DesREC Negotiation Tool</p>

          <h1 id="recover-title">Recover your negotiation</h1>

          <p>
            Enter the PIN you created when you started. We will use it to
            restore your private participant link.
          </p>
        </div>

        <form className="recover-form" onSubmit={handleSubmit}>
          <label htmlFor="recovery-pin">Recovery PIN</label>

          <input
            id="recovery-pin"
            name="pin"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(event) => handlePinChange(event.target.value)}
            placeholder="Enter your PIN"
            disabled={isRecovering}
            aria-describedby={error ? "recovery-error" : "recovery-help"}
            aria-invalid={Boolean(error)}
          />

          <p id="recovery-help" className="recover-help">
            This is the PIN you personally chose. Do not enter the other
            participant’s PIN.
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
            disabled={isRecovering || pin.length < 4}
          >
            {isRecovering ? "Recovering…" : "Recover my link"}
          </button>
        </form>

        <div className="recover-privacy-note">
          <h2>Your PIN does not reveal your answers</h2>

          <p>
            It is only used to locate your encrypted participant link. DesREC
            and the site host cannot view your negotiation responses.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Recover;