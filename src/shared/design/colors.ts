export const colors = {
  primary: "#C46635",
  primaryHover: "#B3582D",
  primaryActive: "#9F4C25",
  primaryLight: "#F6E8DF",

  secondary: "#7A5A49",
  secondaryLight: "#F1EBE7",

  success: "#2E7D55",
  successLight: "#EAF5EF",

  warning: "#B97816",
  warningLight: "#FFF4DF",

  danger: "#B64242",
  dangerLight: "#FCEAEA",

  info: "#3F6F8F",
  infoLight: "#EAF2F7",

  background: "#F7F4F1",
  backgroundAlt: "#F1ECE8",

  surface: "#FFFFFF",
  surfaceMuted: "#FCFAF8",

  border: "#E4DDD7",
  borderStrong: "#CFC3BA",

  text: "#2B2623",
  textSecondary: "#665E59",
  textMuted: "#8A817B",
  textInverse: "#FFFFFF",

  overlay: "rgba(43, 38, 35, 0.45)",
  focus: "rgba(196, 102, 53, 0.28)",
} as const;

export type ColorToken = keyof typeof colors;

