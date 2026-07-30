import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import "./Notice.css";

type NoticeVariant =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

interface NoticeProps
  extends HTMLAttributes<HTMLDivElement> {
  variant?: NoticeVariant;
  title?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

function Notice({
  variant = "info",
  title,
  icon,
  actions,
  className = "",
  children,
  ...props
}: NoticeProps) {
  const classes = [
    "desrec-notice",
    `desrec-notice--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      role={
        variant === "danger"
          ? "alert"
          : "status"
      }
      {...props}
    >
      {icon && (
        <div
          className="desrec-notice-icon"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <div className="desrec-notice-content">
        {title && (
          <h2 className="desrec-notice-title">
            {title}
          </h2>
        )}

        <div className="desrec-notice-message">
          {children}
        </div>

        {actions && (
          <div className="desrec-notice-actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notice;