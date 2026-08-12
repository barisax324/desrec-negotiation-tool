export type CommunicationSectionId =
  | "check-ins"
  | "communication-style"
  | "something-wrong"
  | "safewords"
  | "communication-habits"
  | "anything-else";

export interface CommunicationOption {
  id: string;
  label: string;
  discussionFlag?: boolean;
}

export const CHECK_IN_OPTIONS: CommunicationOption[] = [
  {
    id: "traffic-light",
    label: "Traffic Light System",
  },
  {
    id: "numeric-scale",
    label: "Numeric Scale (1–10)",
  },
  {
    id: "casual-verbal",
    label: "Casual Verbal Check-ins",
  },
  {
    id: "nonverbal",
    label: "Nonverbal Signals / Hand Squeezes",
  },
  {
    id: "self-initiated",
    label: "I Prefer to Initiate Check-ins",
  },
  {
    id: "other",
    label: "Other",
    discussionFlag: true,
  },
];

export const COMMUNICATION_STYLE_OPTIONS: CommunicationOption[] = [
  {
    id: "frequent",
    label: "Frequent Check-ins",
  },
  {
    id: "minimal",
    label: "Minimal Check-ins",
  },
  {
    id: "direct",
    label: "Direct & Explicit",
  },
  {
    id: "gentle",
    label: "Gentle & Indirect",
  },
];

export const SOMETHING_WRONG_OPTIONS: CommunicationOption[] = [
  {
    id: "pause",
    label: "Pause Immediately",
  },
  {
    id: "safeword",
    label: "Use Safeword",
  },
  {
    id: "lower-intensity",
    label: "Lower Intensity",
  },
  {
    id: "brief-check-in",
    label: "Brief Check-in",
  },
  {
    id: "change-activity",
    label: "Change Activity",
  },
  {
    id: "take-break",
    label: "Take a Break",
  },
  {
    id: "switch-position",
    label: "Switch Positions",
  },
  {
    id: "other",
    label: "Other",
    discussionFlag: true,
  },
];

export const SAFEWORD_OPTIONS: CommunicationOption[] = [
  {
    id: "traffic-light",
    label: "Traffic Light System",
  },
  {
    id: "custom",
    label: "Custom Safeword",
  },
  {
    id: "plain-language",
    label: "Plain Language",
  },
  {
    id: "nonverbal",
    label: "Nonverbal Signal",
  },
];

export const COMMUNICATION_HABIT_OPTIONS: CommunicationOption[] = [
  {
    id: "quiet",
    label: "I tend to go quiet when overwhelmed.",
  },
  {
    id: "laugh",
    label: "I laugh or smile when nervous.",
  },
  {
    id: "hesitant-yes",
    label: "I may say yes even when hesitant.",
  },
  {
    id: "reassurance",
    label: "I need reassurance before trying new things.",
  },
  {
    id: "internal-processing",
    label: "I process internally before responding.",
  },
  {
    id: "physical-first",
    label: "I express discomfort physically before verbally.",
  },
  {
    id: "other",
    label: "Other",
    discussionFlag: true,
  },
];

