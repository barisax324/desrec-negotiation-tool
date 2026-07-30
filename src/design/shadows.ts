export const shadows = {
  none: "none",

  small:
    "0 1px 2px rgba(43, 38, 35, 0.05), 0 2px 6px rgba(43, 38, 35, 0.04)",

  medium:
    "0 4px 12px rgba(43, 38, 35, 0.08), 0 2px 4px rgba(43, 38, 35, 0.04)",

  large:
    "0 12px 32px rgba(43, 38, 35, 0.12), 0 4px 10px rgba(43, 38, 35, 0.06)",

  focus:
    "0 0 0 4px rgba(196, 102, 53, 0.22)",
} as const;

export type ShadowToken = keyof typeof shadows;