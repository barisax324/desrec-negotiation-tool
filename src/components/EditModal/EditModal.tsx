import {
  useEffect,
  type ReactNode,
} from "react";

import "./EditModal.css";

interface EditModalProps {
  title: string;
  children: ReactNode;
  isSaving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onSave: () => void;
}

function EditModal({
  title,
  children,
  isSaving = false,
  saveLabel = "Save changes",
  cancelLabel = "Back to summary",
  onCancel,
  onSave,
}: EditModalProps) {
  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        !isSaving
      ) {
        onCancel();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [isSaving, onCancel]);

  return (
    <div
      className="edit-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isSaving
        ) {
          onCancel();
        }
      }}
    >
      <section
        className="edit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        <header className="edit-modal-header">
          <h2 id="edit-modal-title">
            {title}
          </h2>

          <button
            type="button"
            className="edit-modal-close"
            onClick={onCancel}
            disabled={isSaving}
            aria-label="Back to summary"
          >
            ×
          </button>
        </header>

        <div className="edit-modal-content">
          {children}
        </div>

        <footer className="edit-modal-actions">
          <button
            type="button"
            className="edit-modal-cancel"
            onClick={onCancel}
            disabled={isSaving}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className="edit-modal-save"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : saveLabel}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default EditModal;