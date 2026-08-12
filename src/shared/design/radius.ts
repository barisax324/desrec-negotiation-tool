export const radius = {
  none: "0",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  round: "999px",
} as const;

export type RadiusToken = keyof typeof radius;

