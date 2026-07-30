import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Pin.css";

type PinMode = "create" | "join";

interface PinProps {
  mode: PinMode;
}

function Pin({ mode }: PinProps) {
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [confirmedPin, setConfirmedPin] = useState("");
  const [understood, setUnderstood] = useState(false);
  const [error, setError] = useState("");

  const isJoining = mode === "join";

  function handleCancel() {
    navigate("/");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedPin = pin.trim();

    if (trimmedPin.length < 6) {
      setError("Your PIN must be at least 6 characters long.");
      return;
    }

    if (trimmedPin.length > 12) {
      setError("Your PIN cannot be longer than 12 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(trimmedPin)) {
      setError("Use only letters and numbers in your PIN.");
      return;
    }

    if (trimmedPin !== confirmedPin.trim()) {
      setError("The PINs do not match.");
      return;
    }

    if (!understood) {
      setError(
        "Please confirm that you understand your PIN cannot be recovered.",
      );
      return;
    }

    sessionStorage.setItem("desrec.pendingPin", trimmedPin);
    sessionStorage.setItem("desrec.pendingMode", mode);

    if (isJoining) {
  navigate("/join");
} else {
  navigate("/negotiation-setup");
}
  }

  return (
    <main className="pin-page">
      <header className="pin-topbar">
        <button
          type="button"
          className="pin-brand"
          onClick={() => navigate("/")}
          aria-label="Return to the DesREC negotiation home page"
        >
          <span className="pin-brand-mark" aria-hidden="true">
            ◈
          </span>

          <span className="pin-brand-text">
            <span className="pin-brand-title">
              DESREC
              <span className="pin-brand-label">Negotiation</span>
            </span>

            <span className="pin-brand-subtitle">
              Desert Rope Education Collective
            </span>
          </span>
        </button>

        <span className="pin-private-label">Private</span>
      </header>

      <section className="pin-content">
        <div className="pin-progress-row">
          <button
            type="button"
            className="pin-cancel-button"
            onClick={handleCancel}
          >
            <span aria-hidden="true">×</span>
            Cancel
          </button>

          <p className="pin-step-label">
            <span aria-hidden="true">✣</span>
            Step 1 of 4
          </p>
        </div>

        <div className="pin-progress-track" aria-hidden="true">
          <div className="pin-progress-fill" />
        </div>

        <form className="pin-card" onSubmit={handleSubmit}>
          <p className="pin-card-step">1. Recovery access</p>

          <h1>
            {isJoining
              ? "Create your personal access PIN"
              : "Create a recovery PIN"}
          </h1>

          <p className="pin-description">
            {isJoining
              ? "This PIN belongs only to you. It will help you recover your side of the negotiation if you lose your personal access link."
              : "This PIN will help you recover your side of the negotiation if you lose your personal access link."}
          </p>

          <div className="pin-notice">
            <span className="pin-notice-icon" aria-hidden="true">
              ⓘ
            </span>

            <p>
              DesREC cannot see or recover your PIN. Choose something
              memorable that another person would not easily guess.
            </p>
          </div>

          <label className="pin-field">
            <span>Create PIN</span>

            <input
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              minLength={6}
              maxLength={12}
              autoComplete="new-password"
              inputMode="text"
              placeholder="6 to 12 letters or numbers"
            />

            <small>Letters and numbers only.</small>
          </label>

          <label className="pin-field">
            <span>Confirm PIN</span>

            <input
              type="password"
              value={confirmedPin}
              onChange={(event) =>
                setConfirmedPin(event.target.value)
              }
              minLength={6}
              maxLength={12}
              autoComplete="new-password"
              inputMode="text"
              placeholder="Enter the same PIN again"
            />
          </label>

          <label className="pin-checkbox-row">
            <input
              type="checkbox"
              checked={understood}
              onChange={(event) =>
                setUnderstood(event.target.checked)
              }
            />

            <span>
              I understand that DesREC cannot recover this PIN if I
              forget it.
            </span>
          </label>

          {error && (
            <div className="pin-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="pin-continue-button">
            Continue
            <span aria-hidden="true">→</span>
          </button>

          <p className="pin-security-note">
            Your PIN will be connected only to your personal access,
            not to the other participant’s access.
          </p>
        </form>
      </section>
    </main>
  );
}

export default Pin;