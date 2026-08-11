import { useState } from "react";
import type {
  OnboardingData,
} from "@/pages/04-onboarding/shared";

import type {
  SceneGoalsData,
} from "@/pages/05-questionnaire/01-scene-goals";
import type {
  ActivityResponses,
} from "@/pages/05-questionnaire/02-activities";
import type {
  HealthSafetyResponses,
} from "@/pages/05-questionnaire/03-health-safety";
import type {
  CommunicationFormData,
} from "@/pages/05-questionnaire/04-communication-boundaries";
import type {
  AftercareResponses,
} from "@/pages/05-questionnaire/05-aftercare";

import {
  DEFAULT_SCENE_GOALS,
} from "../types";

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