export type OnboardingRole =
  | "top"
  | "bottom"
  | "switch"
  | "observer"
  | "facilitator"
  | "unsure"
  | "other";

export type ExperienceLevel =
  | "first-time"
  | "learning"
  | "some-experience"
  | "comfortable"
  | "very-experienced"
  | "teaching-facilitating";

export interface OnboardingData {
  nickname: string;
  role: OnboardingRole | null;
  otherRole: string;
  experience: ExperienceLevel | null;
}

export type OnboardingPage =
  | "welcome"
  | "about-you"
  | "experience"
  | "ready";

export const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  nickname: "",
  role: null,
  otherRole: "",
  experience: null,
};

export const ONBOARDING_PROGRESS = {
  welcome: 2,
  aboutYou: 4,
  experience: 6,
  ready: 8,
} as const;