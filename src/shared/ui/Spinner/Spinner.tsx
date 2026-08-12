import "./Spinner.css";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  label?: string;
  className?: string;
}

function Spinner({
  size = "medium",
  label = "Loading...",
  className = "",
}: SpinnerProps) {
  return (
    <div
      className={[
        "desrec-spinner-wrapper",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
    >
      <div
        className={[
          "desrec-spinner",
          `desrec-spinner--${size}`,
        ].join(" ")}
        aria-hidden="true"
      />

      <span className="desrec-spinner-label">
        {label}
      </span>
    </div>
  );
}

export default Spinner;

