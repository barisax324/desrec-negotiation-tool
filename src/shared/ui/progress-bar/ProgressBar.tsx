import "./ProgressBar.css";

interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

function clampProgress(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

function ProgressBar({
  value,
  label = "Questionnaire progress",
  className = "",
}: ProgressBarProps) {
  const progress = clampProgress(value);
  const roundedProgress = Math.round(progress);

  return (
    <div
      className={[
        "desrec-progress",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="desrec-progress-header">
        <span>{label}</span>

        <span aria-hidden="true">
          {roundedProgress}%
        </span>
      </div>

      <div
        className="desrec-progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={roundedProgress}
        aria-valuetext={`${roundedProgress}% complete`}
      >
        <div
          className="desrec-progress-value"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;