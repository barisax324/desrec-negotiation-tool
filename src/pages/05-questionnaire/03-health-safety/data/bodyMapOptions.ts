export type BodyRegionStatus =
  | "fine"
  | "ask-first"
  | "sensitive"
  | "avoid"
  | "medical-consideration";

export interface BodyRegionStatusOption {
  id: BodyRegionStatus;
  label: string;
  shortLabel: string;
  color: string;
}

export const BODY_REGION_STATUS_OPTIONS: BodyRegionStatusOption[] = [
  {
    id: "fine",
    label: "Fine",
    shortLabel: "Fine",
    color: "#4CAF50",
  },
  {
    id: "ask-first",
    label: "Ask First",
    shortLabel: "Ask",
    color: "#FDD835",
  },
  {
    id: "sensitive",
    label: "Sensitive",
    shortLabel: "Sensitive",
    color: "#1d0ef0",
  },
  {
    id: "avoid",
    label: "Avoid",
    shortLabel: "Avoid",
    color: "#E53935",
  },
  {
    id: "medical-consideration",
    label: "Medical Consideration",
    shortLabel: "Medical",
    color: "#e205f6",
  },
];

