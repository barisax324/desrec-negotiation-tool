import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import "./Badge.css";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

type BadgeSize =
  | "small"
  | "medium";

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
}

function Badge({
  variant = "neutral",
  size = "medium",
  icon,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "desrec-badge",
        `desrec-badge--${variant}`,
        `desrec-badge--${size}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon && (
        <span className="desrec-badge-icon">
          {icon}
        </span>
      )}

      <span>{children}</span>
    </span>
  );
}

export default Badge;