import { useEffect } from "react";
import type { ReactNode } from "react";

import "./EditDialog.css";

interface EditDialogProps {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
}

function EditDialog({
  isOpen,
  children,
  onClose,
}: EditDialogProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="edit-dialog-overlay"
      onClick={onClose}
    >
      <div
        className="edit-dialog"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {children}
      </div>
    </div>
  );
}

export default EditDialog;