import { useState } from "react";

import type { OnboardingData } from "../../Onboarding/types";
import type { SceneGoalsData } from "../../Questionnaire/SceneGoals/SceneGoals";
import type { ActivityResponses } from "../../Questionnaire/Activities/types";
import type { HealthSafetyResponses } from "../../HealthSafety/types";
import type { CommunicationFormData } from "../../Communication/CommunicationPage";
import type { AftercareResponses } from "../../../components/Aftercare/AftercarePage";

import {
  DEFAULT_SCENE_GOALS,
} from "../startTypes";

export function useQuestionnaireState() {
  const [
    onboardingData,
    setOnboardingData,
  ] = useState<OnboardingData | null>(
    null,
  );

  const [
    sceneGoals,
    setSceneGoals,
  ] = useState<SceneGoalsData>(
    DEFAULT_SCENE_GOALS,
  );

  const [
    activityResponses,
    setActivityResponses,
  ] = useState<ActivityResponses>({});

  const [
    healthSafetyResponses,
    setHealthSafetyResponses,
  ] = useState<HealthSafetyResponses | null>(
    null,
  );

  const [
    communicationResponses,
    setCommunicationResponses,
  ] = useState<CommunicationFormData | null>(
    null,
  );

  const [
    aftercareResponses,
    setAftercareResponses,
  ] = useState<AftercareResponses | null>(
    null,
  );

  function updateSceneGoals(
    updates: Partial<SceneGoalsData>,
  ) {
    setSceneGoals(
      (currentData) => ({
        ...currentData,
        ...updates,
      }),
    );
  }

  return {
    onboardingData,
    setOnboardingData,

    sceneGoals,
    setSceneGoals,
    updateSceneGoals,

    activityResponses,
    setActivityResponses,

    healthSafetyResponses,
    setHealthSafetyResponses,

    communicationResponses,
    setCommunicationResponses,

    aftercareResponses,
    setAftercareResponses,
  };
}