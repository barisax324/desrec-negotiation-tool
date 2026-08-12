export const zIndex = {
  base: 0,
  content: 1,
  sticky: 100,
  dropdown: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
  tooltip: 600,
} as const;

export type ZIndexToken = keyof typeof zIndex;

