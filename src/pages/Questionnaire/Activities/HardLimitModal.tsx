interface HardLimitModalProps {
  activityLabel: string;
  isRemoving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function HardLimitModal({
  activityLabel,
  isRemoving,
  onCancel,
  onConfirm,
}: HardLimitModalProps) {
  const title = isRemoving
    ? "Remove Hard Limit?"
    : "Mark as Hard Limit?";

  return (
    <div
      className="activity-modal-backdrop"
      role="presentation"
      onMouseDown={onCancel}
    >
      <div
        className="activity-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hard-limit-modal-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <h2 id="hard-limit-modal-title">
          {title}
        </h2>

        {isRemoving ? (
          <p>
            <strong>{activityLabel}</strong> will no
            longer be marked as a hard limit. You will
            be able to select an interest level again.
          </p>
        ) : (
          <p>
            A Hard Limit means{" "}
            <strong>{activityLabel}</strong> is
            completely off the table for this
            negotiation.
          </p>
        )}

        <div className="activity-modal-actions">
          <button
            type="button"
            className="activity-modal-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className={`activity-modal-button${
              isRemoving
                ? ""
                : " activity-modal-button--confirm"
            }`}
            onClick={onConfirm}
          >
            {isRemoving
              ? "Remove Hard Limit"
              : "Mark Hard Limit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HardLimitModal;