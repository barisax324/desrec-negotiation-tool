import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import "./Card.css";

type CardVariant =
  | "default"
  | "muted"
  | "outlined"
  | "success"
  | "warning"
  | "danger";

type CardPadding =
  | "none"
  | "small"
  | "medium"
  | "large";

interface CardProps
  extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  elevated?: boolean;
  as?: "article" | "section" | "div" | "aside";
  children: ReactNode;
}

function Card({
  variant = "default",
  padding = "large",
  elevated = false,
  as: Component = "article",
  className = "",
  children,
  ...props
}: CardProps) {
  const classes = [
    "desrec-card",
    `desrec-card--${variant}`,
    `desrec-card--padding-${padding}`,
    elevated && "desrec-card--elevated",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

export default Card;

