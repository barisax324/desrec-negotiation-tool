import { useState } from "react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  OnboardingData,
  OnboardingPage,
} from "../../Onboarding/types";

import type {
  ProgressOverrides,
  QuestionnairePage,
} from "../startTypes";

interface UseOnboardingFlowInput {
  onboardingCompleted: boolean;

  setOnboardingCompleted: Dispatch<
    SetStateAction<boolean>
  >;

  setOnboardingData: Dispatch<
    SetStateAction<OnboardingData | null>
  >;

  saveAndMove: (
    nextPage: QuestionnairePage,
    overrides?: ProgressOverrides,
  ) => Promise<void>;
}

export function useOnboardingFlow({
  onboardingCompleted,
  setOnboardingCompleted,
  setOnboardingData,
  saveAndMove,
}: UseOnboardingFlowInput) {
  const hasStarted =
    onboardingCompleted;

  const setHasStarted =
    setOnboardingCompleted;
    
  const [
    hasSeenWelcome,
    setHasSeenWelcome,
  ] = useState(false);

  const [
    onboardingStartPage,
    setOnboardingStartPage,
  ] = useState<OnboardingPage>(
    "welcome",
  );

  const [
    hasReviewedScene,
    setHasReviewedScene,
  ] = useState(false);

  async function handleOnboardingComplete(
    completedOnboardingData: OnboardingData,
  ) {
    setOnboardingData(
      completedOnboardingData,
    );

    setHasStarted(true);

    await saveAndMove(
      "scene-goals",
      {
        onboardingCompleted: true,
        onboardingData:
          completedOnboardingData,
      },
    );
  }

  return {
    hasStarted,
    setHasStarted,

    hasSeenWelcome,
    setHasSeenWelcome,

    onboardingStartPage,
    setOnboardingStartPage,

    hasReviewedScene,
    setHasReviewedScene,

    handleOnboardingComplete,
  };
}