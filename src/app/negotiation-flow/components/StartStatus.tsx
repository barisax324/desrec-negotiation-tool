import { Link } from "react-router-dom";

interface StartLoadingProps {
  message?: string;
}

export function StartLoading({
  message = "Opening your negotiation...",
}: StartLoadingProps) {
  return (
    <main className="questionnaire-loading">
      <h1>{message}</h1>

      {message ===
        "Opening your negotiation..." && (
        <p>
          Please wait while your private
          access is verified.
        </p>
      )}
    </main>
  );
}

interface StartErrorProps {
  message: string;
}

export function StartError({
  message,
}: StartErrorProps) {
  return (
    <main className="questionnaire-error">
      <h1>
        This negotiation could not be opened
      </h1>

      <p>{message}</p>

      <p>
        Your login may be incomplete, invalid,
        or expired.
      </p>

      <p>
        <Link to="/open">
          Open My Negotiation
        </Link>
      </p>

      <p>
        <Link to="/">
          Return Home
        </Link>
      </p>
    </main>
  );
}

