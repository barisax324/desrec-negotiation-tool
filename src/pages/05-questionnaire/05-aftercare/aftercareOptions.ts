export interface AftercareOption {
  id: string;
  label: string;
}

export interface FollowUpOption {
  id: string;
  label: string;
}

export const AFTERCARE_HELP_OPTIONS: AftercareOption[] = [
  { id: "water", label: "Water" },
  { id: "food", label: "Food or a Snack" },
  { id: "blanket", label: "Blanket or Warmth" },
  { id: "quiet", label: "Quiet" },
  { id: "space", label: "Space" },
  { id: "physical-touch", label: "Physical Touch" },
  { id: "reassurance", label: "Reassurance" },
  { id: "shower", label: "Shower" },
  { id: "debrief", label: "Debrief" },
  { id: "rest", label: "Rest or Sleep" },
  { id: "distraction", label: "Distraction" },
  { id: "other", label: "+ Something Else" },
];

export const FOLLOW_UP_OPTIONS: FollowUpOption[] = [
  { id: "none", label: "No follow-up needed" },
  { id: "tonight", label: "Later that day or evening" },
  { id: "tomorrow", label: "The next day" },
  { id: "few-days", label: "In a few days" },
  {
    id: "self-initiate",
    label: "I will reach out if I need anything",
  },
];

